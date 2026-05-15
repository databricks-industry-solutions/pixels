"""
Config landing page for the Pixels OHIF viewer.

Renders a branded Databricks HTML form that lets the user set
the active pixels table and the segmentation destination directory.
Also displays the current UI version and alerts when a newer version
is available on the main branch.
"""

import os
from pathlib import Path

_UI_VERSION_FILE = Path(__file__).resolve().parent.parent / "UI_VERSION"
_GITHUB_RAW_URL = (
    "https://raw.githubusercontent.com/"
    "databricks-industry-solutions/pixels/main/"
    "dbx/pixels/resources/UI_VERSION"
)


def _read_ui_version() -> str:
    """Read the local UI version from the UI_VERSION file."""
    try:
        return _UI_VERSION_FILE.read_text().strip()
    except FileNotFoundError:
        return "unknown"


def config_page(pixels_table: str, seg_dest_dir: str) -> str:
    """Return the HTML config page with pre-filled form values."""
    host = os.environ.get("DATABRICKS_HOST", "")
    app_name = os.environ.get("DATABRICKS_APP_NAME", "pixels")
    ui_version = _read_ui_version()

    return f"""
    <html>
        <head>
            <title>Pixels Solution Accelerator</title>
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/vendor-jquery.5c80d7f6.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/70577.563792a4.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/59976.a356be26.chunk.css" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="https://ui-assets.cloud.databricks.com/login/62569.22f26a3b.chunk.css" crossorigin="anonymous">
            <script>document.cookie = "MONAILABEL_SERVER_URL="+window.location.origin+"/api/monai/; Path=/ohif; Expires=Session;"</script>
            <style>
                .version-badge {{
                    display: block;
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 12px;
                    text-align: center;
                }}
                /* ── update banner ── */
                .update-banner {{
                    display: none;
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    border-radius: 6px;
                    padding: 12px 16px;
                    margin: 12px 0;
                    font-size: 13px;
                    color: #856404;
                    align-items: center;
                    gap: 8px;
                }}
                .update-banner.visible {{
                    display: flex;
                }}
                .update-banner .close-btn {{
                    margin-left: auto;
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #856404;
                    padding: 0 4px;
                }}
            </style>
        </head>
        <body class="light-mode dark-mode-supported">
        <uses-legacy-bootstrap>
            <div id="login-page">
                <div>
                    <div id="login-container" class="container">
                    <img src="https://{host}/login/logo_2020/databricks.svg" class="login-logo" style="width: 200px;">
                        <div class="login-form" style="min-width:600px">
                            <h3 class="sub-header">Pixels Solution Accelerator</h3>

                            <div id="update-banner" class="update-banner">
                                <span>&#9888;</span>
                                <span id="update-message"></span>
                                <button class="close-btn" onclick="this.parentElement.classList.remove('visible')">&times;</button>
                            </div>

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

                                <div style="justify-content: center;display: flex; white-space: pre"><a href="https://{host}" target="_blank" rel="noopener noreferrer">Workspace</a> | <a href="https://{host}/apps/{app_name}/logs" target="_blank" rel="noopener noreferrer">Logs</a></div>
                                <span class="version-badge">v{ui_version}</span>
                            </div>
                            </form>
                            </div>
                        </div>
                    <div class="terms-of-service-footer"><a href="https://databricks.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> | <a href="https://databricks.com/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a></div><div style="margin: 20px auto; text-align: center;">
                    </div>
                </div>
            </div>
        </uses-legacy-bootstrap>

        <script>
        (function() {{
            var localVersion = "{ui_version}";
            var remoteUrl = "{_GITHUB_RAW_URL}";

            fetch(remoteUrl, {{ cache: "no-store" }})
                .then(function(resp) {{ return resp.ok ? resp.text() : null; }})
                .then(function(text) {{
                    if (!text) return;
                    var remoteVersion = text.trim();
                    if (remoteVersion !== localVersion) {{
                        var msg = document.getElementById("update-message");
                        msg.textContent = "A new version is available: v" + remoteVersion +
                                          " (current: v" + localVersion + "). " +
                                          "Please update your deployment.";
                        document.getElementById("update-banner").classList.add("visible");
                    }}
                }})
                .catch(function() {{ /* silently ignore network errors */ }});
        }})();
        </script>
        </body>
    </html>
    """
