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
            <script>document.cookie = "MONAILABEL_SERVER_URL="+window.location.origin+"/api/monai/; Path=/ohif; Expires=Session;"</script>
            <style>
                /* ── reset ── */
                *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f5f5f5; color: #1b1f24; }}
                /* ── page layout ── */
                #login-page {{ display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 24px; }}
                #login-container {{ background: #fff; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.1); max-width: 640px; width: 100%; padding: 48px 40px 32px; text-align: center; }}
                .login-logo {{ display: block; margin: 0 auto 28px; }}
                .login-form {{ text-align: left; }}
                .sub-header {{ font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center; }}
                .tab-child {{ margin-top: 8px; }}
                .instructions {{ font-size: 14px; color: #444; margin: 12px 0 6px; }}
                /* ── form inputs ── */
                input[type="text"] {{ width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; margin-bottom: 4px; }}
                input[type="text"]:focus {{ outline: none; border-color: #e03e2d; box-shadow: 0 0 0 2px rgba(224,62,45,.2); }}
                /* ── buttons ── */
                .btn {{ display: inline-block; padding: 10px 24px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid transparent; margin: 16px 8px 8px 0; text-decoration: none; }}
                .btn-primary {{ background: #e03e2d; color: #fff; border-color: #e03e2d; }}
                .btn-primary:hover {{ background: #c43425; }}
                .btn-secondary {{ background: #fff; color: #e03e2d; border-color: #e03e2d; }}
                .btn-secondary:hover {{ background: #fef2f1; }}
                /* ── footer ── */
                .terms-of-service-footer {{ font-size: 12px; color: #888; margin-top: 24px; text-align: center; }}
                .terms-of-service-footer a {{ color: #888; text-decoration: underline; }}
                /* ── version badge ── */
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
        <body>
            <div id="login-page">
                <div>
                    <div id="login-container" class="container">
                    <img src="https://{host}/login/logo_2020/databricks.svg" class="login-logo" style="width: 200px;">
                        <div class="login-form">
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
