#!/bin/bash
# End-to-end inference smoke test for a deployed Pixels install.
#
# Picks an arbitrary series UID from object_catalog and submits a Vista3D
# segmentation request to the model serving endpoint.
#
# Usage:
#   tests/deployment/pixels_inference.sh \
#     --profile MY_WORKSPACE \
#     --catalog my_catalog \
#     --schema my_schema \
#     --warehouse-id <id> \
#     [--volume-name pixels_volume] \
#     [--endpoint pixels-monai-uc] \
#     [--label-prompt 20,23] \
#     [--timeout 300]

set -euo pipefail

PROFILE=""
CATALOG=""
SCHEMA=""
WAREHOUSE_ID=""
VOLUME_NAME="pixels_volume"
ENDPOINT="pixels-monai-uc"
LABEL_PROMPT="20,23"
TIMEOUT=300

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)       PROFILE="$2"; shift 2 ;;
    --catalog)       CATALOG="$2"; shift 2 ;;
    --schema)        SCHEMA="$2"; shift 2 ;;
    --warehouse-id)  WAREHOUSE_ID="$2"; shift 2 ;;
    --volume-name)   VOLUME_NAME="$2"; shift 2 ;;
    --endpoint)      ENDPOINT="$2"; shift 2 ;;
    --label-prompt)  LABEL_PROMPT="$2"; shift 2 ;;
    --timeout)       TIMEOUT="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,15p' "$0" | sed 's/^# \?//'
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

for required in PROFILE CATALOG SCHEMA WAREHOUSE_ID; do
  if [[ -z "${!required}" ]]; then
    echo "Missing required arg: --${required,,}" >&2
    exit 2
  fi
done

TABLE="${CATALOG}.${SCHEMA}.object_catalog"
VOLUME_PATH="/Volumes/${CATALOG}/${SCHEMA}/${VOLUME_NAME}/monai_serving/vista3d"
LABEL_JSON="[$(echo "$LABEL_PROMPT" | tr ',' ' ' | xargs -n1 | paste -sd, -)]"

TOKEN=$(databricks auth token -p "$PROFILE" --output json \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
HOST=$(databricks auth env --profile "$PROFILE" --output json \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['env']['DATABRICKS_HOST'])")

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

echo "=== Picking series for inference from $TABLE ==="
curl -fsS "$HOST/api/2.0/sql/statements" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{
    \"warehouse_id\": \"$WAREHOUSE_ID\",
    \"statement\": \"SELECT CAST(meta:[\\\"0020000E\\\"].Value[0] AS STRING) AS series_uid, COUNT(*) AS n FROM $TABLE WHERE meta:[\\\"0020000E\\\"].Value[0] IS NOT NULL GROUP BY 1 HAVING n > 10 ORDER BY n DESC LIMIT 1\",
    \"wait_timeout\": \"30s\"
  }" > "$WORK/series.json"

SERIES_UID=$(python3 -c "
import json, sys
d = json.load(open('$WORK/series.json'))
if d.get('status', {}).get('state') != 'SUCCEEDED':
    print('SQL failed:', d.get('status'), file=sys.stderr); sys.exit(1)
rows = d.get('result', {}).get('data_array', [])
if not rows:
    print('no rows', file=sys.stderr); sys.exit(1)
print(rows[0][0])
")
echo "Series UID: $SERIES_UID"

echo
echo "=== Inference on $ENDPOINT (label_prompt=$LABEL_JSON, timeout=${TIMEOUT}s) ==="
START=$(date +%s)
HTTP_STATUS=$(curl -sS -o "$WORK/inference.json" -w "%{http_code}" -m "$TIMEOUT" \
  "$HOST/serving-endpoints/$ENDPOINT/invocations" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{
    \"dataframe_records\": [{
      \"series_uid\": \"$SERIES_UID\",
      \"params\": {
        \"label_prompt\": $LABEL_JSON,
        \"export_metrics\": false,
        \"export_overlays\": false,
        \"dest_dir\": \"$VOLUME_PATH\",
        \"pixels_table\": \"$TABLE\",
        \"torch_device\": 0
      }
    }]
  }")
END=$(date +%s)
echo "HTTP $HTTP_STATUS, duration $((END-START))s"

python3 <<PY
import json, sys
try:
    d = json.load(open('$WORK/inference.json'))
except Exception as e:
    print('parse error:', e)
    print(open('$WORK/inference.json').read()[:500])
    sys.exit(1)
preds = d.get('predictions', d)
if isinstance(preds, str):
    try:
        preds = json.loads(preds)
    except Exception:
        pass
print(json.dumps(preds, indent=2)[:1500])
PY

if [[ "$HTTP_STATUS" != "200" ]]; then
  exit 1
fi
