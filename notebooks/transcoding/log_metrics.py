def log_metrics(run_name, input_path, output_path):
  # Log metrics
  input_files = sorted(glob.glob(os.path.join(input_path, "*.dcm")))
  output_files = sorted(glob.glob(os.path.join(output_path, "*.dcm")))
  
  for in_file, out_file in zip(input_files, output_files):
      with mlflow.start_run(run_name=f"{run_name}-{in_file}", nested=True) as runx:
          input_size = os.stat(in_file).st_size
          output_size = os.stat(out_file).st_size
          compression_ratio = round(input_size / output_size, 2) if output_size else 0
          savings_percent = round(100 * (input_size - output_size) / input_size, 2) if input_size else 0

          mlflow.log_param("input_file", in_file)
          mlflow.log_param("output_file", out_file)
          mlflow.log_metric(f"_in_size_bytes", input_size)
          mlflow.log_metric(f"_out_size_bytes", output_size)
          mlflow.log_metric(f"_compression_ratio", compression_ratio)
          mlflow.log_metric(f"_savings_percent", savings_percent)

          with open(in_file, "rb") as f:
              start = time.time()
              ds = pydicom.dcmread(f, stop_before_pixels=True)
              duration = time.time() - start
              mlflow.log_param(f"_in_decode_duration_no_pixels", duration)
              mlflow.log_param(f"_in_sop_instance_uid", ds.SOPInstanceUID)
              mlflow.log_param(f"_in_sop_class_uid", ds.SOPClassUID)
              mlflow.log_param(f"_in_transfer_syntax_uid", ds.file_meta.TransferSyntaxUID)
          
          with open(out_file, "rb") as f:
              start = time.time()
              ds = pydicom.dcmread(f, stop_before_pixels=True)
              duration = time.time() - start
              mlflow.log_param(f"_out_decode_duration_no_pixels", duration)
              mlflow.log_param(f"_out_sop_instance_uid", ds.SOPInstanceUID)
              mlflow.log_param(f"_out_sop_class_uid", ds.SOPClassUID)
              mlflow.log_param(f"_out_transfer_syntax_uid", ds.file_meta.TransferSyntaxUID)

        