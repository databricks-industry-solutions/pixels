#!/usr/bin/env bash
#
# Smoke-test the DICOMweb viewer app's /api/metrics endpoint.
#
# Usage:
#   APP_URL=https://<app-name>-<workspace-id>.<region>.databricksapps.com \
#   TOKEN=$(databricks auth token --profile <PROFILE> | jq -re '.access_token') \
#     ./tests/deployment/app-ping.sh
#
# Get APP_URL from:   databricks apps get pixels-dicomweb -p <PROFILE> --output json | jq -r '.url'
# Get TOKEN from:     databricks auth token --profile <PROFILE> | jq -re '.access_token'

set -euo pipefail

: "${APP_URL:?APP_URL not set — see usage in this file's header}"
: "${TOKEN:?TOKEN not set — see usage in this file's header}"

curl -i -X GET "${APP_URL%/}/api/metrics" \
  -H "Accept: */*" \
  -H "Authorization: Bearer ${TOKEN}"
