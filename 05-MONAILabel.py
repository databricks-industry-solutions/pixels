# Databricks notebook source
# MAGIC %md
# MAGIC # Introduction
# MAGIC
# MAGIC This notebook is designed to install the MONAILabel_Pixels and databricks-sdk libraries. It provides the necessary instructions to install these libraries using the `%pip` command and restart the Python library using `dbutils.library.restartPython()`.
# MAGIC
# MAGIC # MONAILabel
# MAGIC
# MAGIC MONAILabel is a framework for creating interactive and customizable annotation workflows for medical imaging data. It provides a user-friendly interface for annotating medical images and supports various annotation tasks such as segmentation, classification, etc.
# MAGIC
# MAGIC # Integration with OHIF Viewer:
# MAGIC
# MAGIC MONAILabel can be integrated with the OHIF Viewer to provide a seamless annotation experience. The OHIF Viewer is a web-based medical image viewer that allows users to view, annotate, and analyze medical images. By integrating MONAILabel with the OHIF Viewer, users can leverage the advanced annotation capabilities of MONAILabel directly within the viewer interface. This integration enables efficient and accurate annotation of medical images, enhancing the overall workflow for medical image analysis and research.
# MAGIC
# MAGIC ## Requirements
# MAGIC - Dedicated (Personal Compute) GPU cluster with DBR 16.4 LTS ML runtime.

# COMMAND ----------

# DBTITLE 1,Install MONAILabel_Pixels and databricks-sdk
# MAGIC %pip install pydicom==2.4.4 git+https://github.com/erinaldidb/MONAILabel_Pixels databricks-sdk --upgrade -q
# MAGIC dbutils.library.restartPython()

# COMMAND ----------

# MAGIC %run ./config/proxy_prep

# COMMAND ----------

import os

init_widgets()
init_env()

#os.environ['DATABRICKS_HOST'] = "https://e2-demo-field-eng.cloud.databricks.com"

# COMMAND ----------

# DBTITLE 1,MONAILabel Server Address Generation in Databricks
import os
#print(f"{os.environ['DATABRICKS_HOST']}")
displayHTML(f"""<h1>Use the following link as MONAILabel server address</h1><br><h2>{get_proxy_url()}""")

# COMMAND ----------

# MAGIC %md
# MAGIC ###Download the radiology app in the cluster
# MAGIC
# MAGIC The following command will download the radiology app from the MONAILabel github and saves it in into the volume

# COMMAND ----------

import os
import subprocess

monailabel_apps_path = dbutils.widgets.get("assets") + "/monailabel/apps"
if not os.path.exists(monailabel_apps_path+"/radiology"):
    dbutils.fs.mkdirs(monailabel_apps_path)

    # download and cache
    print("Download monai radiology app")
    print(f"monailabel apps --download --name radiology --output /local_disk0/temp-monai-apps/")
    subprocess.run(
        f"monailabel apps --download --name radiology --output /local_disk0/temp-monai-apps/".split(' ')
    )

    print("\nCache monai radiology app")
    subprocess.run(["cp", "-r", "/local_disk0/temp-monai-apps/radiology", monailabel_apps_path])
    dbutils.fs.ls(monailabel_apps_path)
    print("Done")

# COMMAND ----------

# MAGIC %md
# MAGIC ### Starting the MONAILabel server
# MAGIC
# MAGIC The next command will start the monailabel server with the radiology app downloaded before. It will use the pre-trained autosegmentation model

# COMMAND ----------

# run the app
if not os.path.exists("/local_disk0/temp-monai-apps/radiology"):
    subprocess.run(["cp", "-r",  monailabel_apps_path, "/local_disk0/temp-monai-apps/radiology"])

command = f"monailabel start_server --app /local_disk0/temp-monai-apps/radiology --studies {os.environ['DATABRICKS_HOST']} --conf models segmentation --table {os.environ['DATABRICKS_PIXELS_TABLE']}"
print(command)
subprocess.run(command.split(' '))

# COMMAND ----------

# MAGIC %md
# MAGIC ### Create a segmentation model with user defined labels and start the MONAILabel server
# MAGIC
# MAGIC The next command will copy the segmentation model to the radiology app directory and start the MONAILabel server with the specified configuration, including custom labels and without using the pre-trained model.

# COMMAND ----------

# MAGIC %sh
# MAGIC monailabel start_server --app /local_disk0/monai/apps/radiology --studies $DATABRICKS_HOST --conf models segmentation --conf labels '{"lung_left":1,"lung_right":2}' --conf use_pretrained_model false --table $DATABRICKS_PIXELS_TABLE
