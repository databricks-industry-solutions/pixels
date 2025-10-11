"""
conftest.py specifically for lakehouse_app frame tests.

This conftest provides only the minimal fixtures needed for frame processing tests
without any Databricks/Spark dependencies.
"""

import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture(autouse=True)
def mock_all_databricks_imports():
    """
    Automatically mock all Databricks-related imports to prevent connectivity requirements.
    This runs for all tests in this directory.
    """
    with patch('databricks.sdk.WorkspaceClient') as mock_workspace_client, \
         patch('databricks.connect.DatabricksSession') as mock_session, \
         patch('databricks.sdk.core.Config') as mock_config, \
         patch('databricks.sdk.runtime.dbutils') as mock_dbutils, \
         patch('dbx.pixels.lakebase.LakebaseUtils') as mock_lakebase, \
         patch('dbx.pixels.m2m.DatabricksM2MAuth') as mock_m2m:
        
        # Configure mocks to return sensible defaults
        mock_workspace_client.return_value = MagicMock()
        mock_session.return_value = MagicMock()
        mock_config.return_value = MagicMock()
        mock_dbutils.return_value = MagicMock()
        mock_lakebase.return_value = MagicMock()
        mock_m2m.return_value = MagicMock()
        
        yield {
            'workspace_client': mock_workspace_client,
            'session': mock_session,
            'config': mock_config,
            'dbutils': mock_dbutils,
            'lakebase': mock_lakebase,
            'm2m': mock_m2m
        }
