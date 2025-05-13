import time
from base64 import b64decode
from typing import Any, Dict, Optional

import requests
from databricks.sdk import WorkspaceClient
from databricks.sdk.service import catalog

from dbx.pixels.logging import LoggerProvider


class DatabricksM2MAuth:
    """
    A class to handle Machine-to-Machine (M2M) authentication for Databricks
    using a service principal with OAuth.
    """

    @staticmethod
    def list_service_principal_secrets(workspace_url, client_id, account_api_token: str):

        url = f"{workspace_url}/api/2.0/accounts/servicePrincipals/{client_id}/credentials/secrets"
        headers = {"Authorization": f"Bearer {account_api_token}"}
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Error listing service principal secrets: {response.text}")

        return response.json()

    @staticmethod
    def delete_service_principal_secret(workspace_url, client_id, secret_id, account_api_token):

        url = f"{workspace_url}/api/2.0/accounts/servicePrincipals/{client_id}/credentials/secrets/{secret_id}"
        headers = {"Authorization": f"Bearer {account_api_token}"}
        response = requests.delete(url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Error deleting service principal secret: {response.text}")

        return response.json()

    def __init__(
        self,
        principal_name: Optional[str] = None,
        account_api_token: Optional[str] = None,
        client_id: Optional[str] = None,
        client_app_id: Optional[str] = None,
        client_secret: Optional[str] = None,
        secrets_scope_name: str = "pixels_scope",
        secrets_client_id_key: str = "pixels_sp_id",
        secrets_client_app_id_key: str = "pixels_sp_app_id",
        secrets_client_secret_key: str = "pixels_sp_secret",
        secrets_access_token_key: str = "pixels_token",
        workspace_url: Optional[str] = None,
        token_expiry_buffer: int = 300,
    ):
        """
        Initialize the authentication handler.

        Args:
            principal_name: The display name of the service principal
            account_api_token: The account API token for workspace-level authentication used only to generate new service principal secrets
            client_id: The client ID (application ID) of the service principal
            client_secret: The OAuth secret of the service principal
            secrets_scope_name: The name of the Databricks secret scope for storing credentials
            secrets_client_id_key: The key for storing the client ID in the secret scope
            secrets_client_app_id_key: The key for storing the client app ID in the secret scope
            secrets_client_secret_key: The key for storing the client secret in the secret scope
            secrets_access_token_key: The key for storing the access token in the secret scope
            workspace_url: Databricks workspace URL for workspace-level authentication
            token_expiry_buffer: Buffer time in seconds before token expiry to refresh
        """

        if not workspace_url:
            raise ValueError("workspace_url must be provided")

        self.principal_name = principal_name

        self.account_api_token = account_api_token

        self.client_id = client_id
        self.client_app_id = client_app_id
        self.client_secret = client_secret

        self.secrets_scope_name = secrets_scope_name
        self.secrets_client_id_key = secrets_client_id_key
        self.secrets_client_app_id_key = secrets_client_app_id_key
        self.secrets_client_secret_key = secrets_client_secret_key
        self.secrets_access_token_key = secrets_access_token_key

        self.workspace_url = workspace_url
        self.token_expiry_buffer = token_expiry_buffer

        self.workspace_client = WorkspaceClient(host=workspace_url)
        self.logger = LoggerProvider(name=__name__)

        self.create_scope_if_not_exists()

        if not principal_name:
            if client_id is None:
                try:
                    self.logger.info(
                        f"Getting client ID from secret scope '{self.secrets_scope_name}' using default secrets_client_id_key '{self.secrets_client_id_key}'"
                    )
                    client_id = b64decode(
                        self.workspace_client.secrets.get_secret(
                            scope=self.secrets_scope_name, key=self.secrets_client_id_key
                        ).value
                    ).decode("utf-8")
                    self._get_or_create_pixels_sp(client_id)
                except Exception as e:
                    self.logger.info(f"Error getting client ID from secret scope: {e}")

            if client_secret is None:
                try:
                    self.logger.info(
                        f"Getting client secret from secret scope '{self.secrets_scope_name}' using default secrets_client_secret_key '{self.secrets_client_secret_key}'"
                    )
                    self.client_secret = b64decode(
                        self.workspace_client.secrets.get_secret(
                            scope=self.secrets_scope_name, key=self.secrets_client_secret_key
                        ).value
                    ).decode("utf-8")
                except Exception as e:
                    self.logger.info(f"Error getting client secret from secret scope: {e}")

        if principal_name and not (client_id and client_secret):
            self._get_or_create_pixels_sp()

        self._access_token = None

        self._token_expiry = 0

        self.token_url = f"{workspace_url}/oidc/v1/token"

        self.refresh_token()

    def create_scope_if_not_exists(self):
        """
        Create a Databricks secret scope for Pixels if it does not exist.

        Args:
            scope_name: The name of the secret scope to create.
        """

        if self.secrets_scope_name not in [
            scope.name for scope in self.workspace_client.secrets.list_scopes()
        ]:
            self.workspace_client.secrets.create_scope(scope=self.secrets_scope_name)

    def _get_or_create_pixels_sp(self, client_id=None):
        """
        Create or retrieve an existing service principal for Pixels.

        Returns:
            The service principal object
        """

        service_principal = None

        if client_id:
            service_principal = self.workspace_client.service_principals.get(client_id)

        if not service_principal:
            for sp in self.workspace_client.service_principals.list(
                filter=f"(DisplayName eq '{self.principal_name}')"
            ):
                if sp.display_name == self.principal_name:
                    service_principal = sp
                    break

        if not service_principal:
            service_principal = self.workspace_client.service_principals.create(
                display_name=self.principal_name
            )

        self.service_principal = service_principal

        self.client_id = service_principal.id
        self.client_app_id = service_principal.application_id

        self.workspace_client.secrets.put_secret(
            scope=self.secrets_scope_name,
            key=self.secrets_client_id_key,
            string_value=self.client_id,
        )
        self.workspace_client.secrets.put_secret(
            scope=self.secrets_scope_name,
            key=self.secrets_client_app_id_key,
            string_value=self.client_app_id,
        )

        self.logger.info(
            f"Using service principal {service_principal.display_name} with ID {service_principal.id}"
        )

    def _create_service_principal_secret(self, account_api_token: str):

        url = f"{self.workspace_url}/api/2.0/accounts/servicePrincipals/{self.service_principal.id}/credentials/secrets"
        headers = {"Authorization": f"Bearer {account_api_token}"}
        response = requests.post(url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Error creating service principal secret: {response.text}")

        json_resp = response.json()
        self.client_secret = json_resp["secret"]

        self.workspace_client.secrets.put_secret(
            scope=self.secrets_scope_name,
            key=self.secrets_client_secret_key,
            string_value=self.client_secret,
        )

        self.logger.info(
            f"Created service principal secret for '{self.principal_name}' with ID {self.service_principal.id} and placed in '{self.secrets_client_secret_key}' db secret."
        )

    def _is_token_valid(self) -> bool:
        """
        Check if the current token is valid and not near expiration.

        Returns:
            True if token is valid and not near expiration, False otherwise
        """
        if not self._access_token:
            return False

        current_time = time.time()
        return current_time < (self._token_expiry - self.token_expiry_buffer)

    def _request_new_token(self) -> Dict[str, Any]:
        """
        Request a new OAuth token using client credentials grant.

        Returns:
            Dictionary containing the access token and expiration information
        """
        self.logger.debug("Requesting new OAuth token")

        data = "grant_type=client_credentials&scope=all-apis"
        header = {"Content-Type": "application/x-www-form-urlencoded"}
        auth = (self.client_app_id, self.client_secret)

        try:
            response = requests.post(self.token_url, headers=header, data=data, auth=auth)
            response.raise_for_status()

            token_data = response.json()
            self.logger.debug("Successfully obtained new OAuth token")
            return token_data

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to obtain token: {str(e)}"
            if hasattr(e, "response") and e.response is not None:
                error_msg += f" - Response: {e.response.text}"

            self.logger.error(error_msg)
            raise Exception(error_msg)

    def set_client_secret(self, client_secret):
        self.client_secret = client_secret
        self.workspace_client.secrets.put_secret(
            scope=self.secrets_scope_name,
            key=self.secrets_client_secret_key,
            string_value=self.client_secret,
        )
        self.logger.info(
            f"Saved service principal secret and placed in '{self.secrets_client_secret_key}' db secret."
        )

    def refresh_token(self) -> str:
        """
        Get a valid access token, refreshing if necessary.

        Returns:
            A valid OAuth access token
        """
        if not self.client_secret and not self.account_api_token:
            raise ValueError(
                "account_api_token must be provided to create a new service principal secret and generate m2m tokens."
            )

        if not self.client_secret and self.account_api_token:
            self.logger.debug("No client secret found, creating new service principal secret")
            self._create_service_principal_secret(self.account_api_token)

        if not self.client_id or not self.client_secret:
            raise ValueError(
                "client_id and client_secret must be provided, add principal_name to create a new service principal."
            )

        if not self._is_token_valid():
            self.logger.debug("Token invalid or expired, requesting new token")
            token_data = self._request_new_token()
            self._access_token = token_data["access_token"]
            self._token_expiry = time.time() + token_data["expires_in"]
            self.logger.debug(f"New token will expire in {token_data['expires_in']} seconds")

            self.workspace_client.secrets.put_secret(
                scope=self.secrets_scope_name,
                key=self.secrets_access_token_key,
                string_value=self._access_token,
            )
            self.logger.info(
                f"Saved service principal token and placed in '{self.secrets_access_token_key}' db secret."
            )

    def grant_permissions(self, table, volume):

        # Grant USE CATALOG permissions on CATALOG
        self.workspace_client.grants.update(
            full_name=table.split(".")[0],
            securable_type=catalog.SecurableType.CATALOG,
            changes=[
                catalog.PermissionsChange(
                    add=[catalog.Privilege.USE_CATALOG], principal=self.client_app_id
                )
            ],
        )

        # Grant USE SCHEMA permissions on SCHEMA
        self.workspace_client.grants.update(
            full_name=table.split(".")[0] + "." + table.split(".")[1],
            securable_type=catalog.SecurableType.SCHEMA,
            changes=[
                catalog.PermissionsChange(
                    add=[catalog.Privilege.USE_SCHEMA], principal=self.client_app_id
                )
            ],
        )

        # Grant All permissions on TABLE
        self.workspace_client.grants.update(
            full_name=table,
            securable_type=catalog.SecurableType.TABLE,
            changes=[
                catalog.PermissionsChange(
                    add=[catalog.Privilege.ALL_PRIVILEGES], principal=self.client_app_id
                )
            ],
        )

        # Grant All permissions on VOLUME
        self.workspace_client.grants.update(
            full_name=volume,
            securable_type=catalog.SecurableType.VOLUME,
            changes=[
                catalog.PermissionsChange(
                    add=[catalog.Privilege.ALL_PRIVILEGES], principal=self.client_app_id
                )
            ],
        )

        self.logger.info(
            "Successfully granted All privileges on table and volume to service principal"
        )
