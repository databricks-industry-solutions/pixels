import pydicom
import numpy as np
from PIL import Image
import io
import base64

MAX_IMAGE_SIZE = 1568
IMAGE_QUALITY = 85

SYSTEM_PROMPT = """
You are an AI-powered medical assistant designed to help physicians in making a diagnosis based on the clinical image and the notes provided by the clinician. Think in a step-by-step manner with diagnostic reasoning at every step.

Step 1:

What is the image provided by the clinician ? Is this is a clinical image of the patient, is this a radiological image, is this an ECG etc

Step 2:

Identify the organ involved in the clinical image. For example if this is an MRI, is this the MRI of the brain ? If this is a clinical image- is this an image of the patient's skin ? And so on

Step 3:

Read the accompanying notes provided by the clinician.

Step 4:

Based on the above step, the image and the clinician's notes, list the top 3-5 potential diagnosis that align with the potential diagnosis. Use confidence scores to rank the likelihood of each disease. Example: "Given the image and the clinical notes the possible diagnoses are: Disease A (Confidence: 40%) Disease B (Confidence: 35%) Disease C (Confidence: 25%)

Step 5: Diagnostic reasoning

Explain the reasoning behind each diagnosis. Highlight why certain diagnosis are more likely based on the information provided
Example: "Diagnosis A is likely due to [reasoning], while Diagnosis B may also fit the profile due to [reasoning]."
Step 6: Final Diagnosis and Treatment Recommendation:

Provide the final diagnosis based on the highest confidence score and suggest a treatment plan in line with standard medical practice.
Return HTML formatted output.

Example output:

"The most likely diagnosis is Diagnosis A. It is recommended to proceed with [treatment plan]"


"""

def extract_middle_frame(dicom_data: pydicom.FileDataset) -> np.ndarray:
    """
    Extract the middle frame from a DICOM dataset.
    For single-frame images, returns the only frame.
    For multi-frame images, returns the middle frame.
    """
    pixel_array = dicom_data.pixel_array
    
    if len(pixel_array.shape) == 2:
        # Single frame image
        print("Single frame DICOM detected")
        return pixel_array
    elif len(pixel_array.shape) == 3:
        # Multi-frame image
        num_frames = pixel_array.shape[0]
        middle_frame_idx = num_frames // 2
        print(f"Multi-frame DICOM detected with {num_frames} frames")
        print(f"Extracting frame {middle_frame_idx} (middle frame)")
        return pixel_array[middle_frame_idx]
    else:
        raise ValueError(f"Unexpected pixel array shape: {pixel_array.shape}")

def normalize_image(image_array: np.ndarray) -> np.ndarray:
    """
    Normalize image array to 0-255 range for visualization and encoding.
    """
    # Handle different bit depths and value ranges
    if image_array.dtype != np.uint8:
        # Normalize to 0-255 range
        image_min = image_array.min()
        image_max = image_array.max()
        
        if image_max > image_min:
            normalized = ((image_array - image_min) / (image_max - image_min) * 255).astype(np.uint8)
        else:
            normalized = np.zeros_like(image_array, dtype=np.uint8)
    else:
        normalized = image_array
    
    return normalized

def convert_to_base64(image_array: np.ndarray, format: str = 'JPEG', quality: int = 85) -> str:
    """
    Convert numpy array to base64 string optimized for Claude 3.5 Sonnet.
    Uses JPEG format with compression for smaller file size and faster processing.
    """
    # Normalize the image
    normalized_image = normalize_image(image_array)
    
    # Resize for Claude compatibility
    resized_image = resize_image_for_claude(normalized_image)
    
    # Convert to PIL Image
    pil_image = Image.fromarray(resized_image)
    
    # Convert to base64 with optimization
    buffer = io.BytesIO()
    if format.upper() == 'JPEG':
        # Convert to RGB if grayscale for JPEG compatibility
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        pil_image.save(buffer, format=format, quality=quality, optimize=True)
    else:
        pil_image.save(buffer, format=format, optimize=True)
    
    buffer.seek(0)
    base64_string = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    print(f"Image converted to base64 ({format} format, quality={quality if format.upper()=='JPEG' else 'N/A'})")
    print(f"Final image dimensions: {resized_image.shape}")
    print(f"Base64 string length: {len(base64_string)} characters")
    print(f"Estimated file size: {len(base64_string) * 3 / 4 / 1024:.1f} KB")
    
    return base64_string

def resize_image_for_claude(image_array: np.ndarray, max_size: int = 1568) -> np.ndarray:
    """
    Resize image to be compatible with Claude 3.5 Sonnet while maintaining aspect ratio.
    Claude 3.5 Sonnet works best with images up to 1568x1568 pixels.
    """
    height, width = image_array.shape
    
    # Calculate scaling factor to fit within max_size while maintaining aspect ratio
    scale_factor = min(max_size / width, max_size / height)
    
    if scale_factor < 1.0:
        new_width = int(width * scale_factor)
        new_height = int(height * scale_factor)
        
        # Use PIL for high-quality resizing
        pil_image = Image.fromarray(image_array)
        resized_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        resized_array = np.array(resized_image)
        
        print(f"Image resized from {width}x{height} to {new_width}x{new_height}")
        return resized_array
    else:
        print(f"Image size {width}x{height} is already optimal for Claude")
        return image_array


def call_serving_endpoint(base64_image: str, endpoint_url = "databricks-claude-3-7-sonnet", system_prompt = SYSTEM_PROMPT) -> dict:
    """
    Call the serving endpoint with the base64 image for analysis.
    """
    from mlflow.deployments import get_deploy_client

    try:
        print("Calling serving endpoint...")

        result = get_deploy_client("databricks").predict(
            endpoint=endpoint_url,
            inputs={ "messages" :[
                    {"role": "system",
                     "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze it as a doctor"},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ]}
        )
        print("Successfully received response from serving endpoint")
        return result
        
    except Exception as e:
        raise Exception(f"Error calling serving endpoint: {str(e)}")