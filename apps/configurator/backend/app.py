from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from types import SimpleNamespace

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
#CORS(app) # Enable CORS for all routes (adjust as needed for production)

# Define the path to your React app's build directory
# This assumes your Flask app.py is in a folder, and your React 'build' folder
# is one level up and then inside the 'build' directory.
# Example:
#   my_project/
#   ├── backend/
#   │   └── app.py
#   └── frontend/
#       └── build/  <-- React build output goes here
# Or if Flask app is at root, and React build is at root:
# app = Flask(__name__, static_folder='./build', static_url_path='/')


def config_print(cfg: dict):
    print(f"Received payload for /config endpoint:")
    print(f"  PHI Detection Method: {cfg.phi_detection_method}")
    print(f"  Report PHI: {cfg.report_phi}")
    print(f"  Privacy Enhance Pixels: {cfg.privacy_enhance}")
    print(f"  Action Type: {cfg.action_type}")
    print(f"  Scope Type: {cfg.scope_type}")
    print(f"  Selected VLM Endpoint: {cfg.selected_vlm_endpoint}")
    print(f"  DICOM File Path: {cfg.dicom_file_path}")

def cfg_from_json(data):
    _config = {
        "phi_detection_method": data.get("phi_detection_method"),
        "report_phi": data.get("report_phi_found_in_image_pixels"),
        "privacy_enhance": data.get("privacy_enhance_image_pixels"),
        "action_type": data.get("action_type"),
        "scope_type": data.get("scope_type"),
        "selected_vlm_endpoint": data.get("selected_vlm_endpoint"),
        "dicom_file_path": data.get("dicom_file_path"),
    }
    cfg = SimpleNamespace(**_config)
    return cfg

# Route to serve the React app's index.html
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

# Route to handle API requests from the React frontend
@app.route('/run', methods=['POST'])
def run():
    print("run")
    if request.is_json:
        data = request.get_json()
        cfg = cfg_from_json(data)
        config_print(cfg=cfg)

        # --- Your 'run' specific logic would go here ---
        # This is where you'd trigger the actual image processing,
        # analysis, and file saving based on the received parameters.

        response_message = "Run action initiated based on your selections. (Details logged on backend)"

        return jsonify({"status": "success", "message": response_message, "received_data": data})
    else:
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400


@app.route('/config', methods=['POST'])
def config():
    print(f"config {request.__dict__}")
    if request.is_json:
        data = request.get_json()
        cfg = cfg_from_json(data)
        config_print(cfg=cfg)

        # --- Your 'config' specific logic would go here ---
        # This is where you'd trigger the actual image processing,
        # analysis, and file saving based on the received parameters.

        response_message = "Config action initiated based on your selections. (Details logged on backend)"

        return jsonify({"status": "success", "message": response_message, "received_data": data})
    else:
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400

# Route to serve other static files (JS, CSS, images) from the React build
@app.route('/<path:filename>')
def serve_static(filename):
    # This serves all other files from the 'build' directory
    # If the file is in a subdirectory (like static/css/main.css), this will handle it.
    return send_from_directory(app.static_folder, filename)

@app.errorhandler(404)
def not_found(e):
    # This is a fallback for when a route is not found,
    # ensuring React Router (if used) can handle routes
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    # You might change the port if needed. For local development, 5000 is common for Flask.
    app.run(debug=True, port=8000)

