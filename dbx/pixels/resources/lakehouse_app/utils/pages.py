import os


def config_page(pixels_table, seg_dest_dir):
    return f"""
    <html>
        <head>
            <title>Pixels Solution Accelerator</title>
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/vendor-jquery.5c80d7f6.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/70577.563792a4.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/59976.a356be26.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/62569.22f26a3b.chunk.css" crossorigin="anonymous">
            <script>document.cookie = "MONAILABEL_SERVER_URL="+window.location.origin+"/monai/; Path=/ohif; Expires=Session;"</script>
        </head>
        <body class="light-mode dark-mode-supported">
        <uses-legacy-bootstrap>
            <div id="login-page">
                <div>
                    <div id="login-container" class="container">
                    <img src="https://{os.environ['DATABRICKS_HOST']}/login/logo_2020/databricks.svg" class="login-logo" style="width: 200px;">
                        <div class="login-form" style="min-width:600px">
                            <h3 class="sub-header">Pixels Solution Accelerator</h3>
                            <div class="tab-child">
                            <p class="instructions">This form allows you to customize some configurations of the ohif viewer.</p>
                            <form action="/set_cookie" id="config" method="post">
                                <p class="instructions">Select your preferred pixels catalog table.</p>
                                <input type="text" id="pixels_table" name="pixels_table" value="{pixels_table}" style="width:100%" required>
                                <p class="instructions">Choose the destination directory for the ohif segmentation and measurements results.</p>
                                <input type="text" id="seg_dest_dir" name="seg_dest_dir" value="{seg_dest_dir}" style="width:100%" required>
                                <p class="instructions">Only Volumes are supported</p>
                                <button name="path" value="/ohif/" class="btn btn-primary btn-large" type="submit">Confirm</button>
                                <button name="path" value="/ohif/local?" class="btn btn-secondary btn-large" type="submit">Browse local files</button>

                                <div style="justify-content: center;display: flex; white-space: pre"><a href="https://{os.environ['DATABRICKS_HOST']}" target="_blank" rel="noopener noreferrer">Workspace</a> | <a href="https://{os.environ['DATABRICKS_HOST']}/apps/{os.environ['DATABRICKS_APP_NAME']}/logs" target="_blank" rel="noopener noreferrer">Logs</a></div>
                            </div>
                            </form>
                            </div>
                        </div>
                    <div class="terms-of-service-footer"><a href="https://databricks.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> | <a href="https://databricks.com/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a></div><div style="margin: 20px auto; text-align: center;">
                    </div>
                </div>
            </div>
        </uses-legacy-bootstrap>
        </body>
    </html>
    """
