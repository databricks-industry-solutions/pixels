git clone https://github.com/erinaldidb/MONAILabel_Pixels
pip install -q -r MONAILabel_Pixels/requirements.txt

HOST="https://${DATABRICKS_HOST}"

MONAILabel_Pixels/monailabel/scripts/monailabel apps --download --name radiology --output /tmp/monai/apps/
MONAILabel_Pixels/monailabel/scripts/monailabel start_server --port $MONAI_PORT --app /tmp/monai/apps/radiology --studies $HOST --conf models segmentation --table $DATABRICKS_PIXELS_TABLE