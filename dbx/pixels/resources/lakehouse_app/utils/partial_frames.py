import os
import pydicom
import struct
import fsspec
import requests

def get_file_part(request, file_path, frame=None):
    file_url = f"https://{os.environ['DATABRICKS_HOST']}/{file_path}"
    
    headers = {
        'Authorization': 'Bearer ' + request.headers.get("X-Forwarded-Access-Token"),
    }
    if frame is not None:
        headers['Range'] = f"bytes={frame['start_pos']}-{frame['end_pos']}"

    response = requests.get(file_url, headers=headers)
    if response.status_code != 206 and response.status_code != 200:
        raise Exception(f"Failed to retrieve frame {frame} from {file_path}")
    return response.content

def pixel_frames_from_dcm_metadata_file(request, f_path, frame_limit, last_indexed_frame, last_indexed_start_pos):
    pixel_data_delimiter = b'\xE0\x7F\x10\x00'
    frame_delimeter = b'\xFE\xFF\x00\xE0'
    frames = []

    client_kwargs = {
        "headers": {'Authorization': 'Bearer ' + request.headers.get("X-Forwarded-Access-Token")} 
    }

    with fsspec.open(f"https://{os.environ['DATABRICKS_HOST']}/{f_path}", "rb", client_kwargs=client_kwargs) as f:
        ds = pydicom.dcmread(f, stop_before_pixels=True)

        f.seek(0)

        if last_indexed_frame != 0 and last_indexed_start_pos != 0:
            start_pos = last_indexed_start_pos - 100
            frame_index = last_indexed_frame
        else:
            pixel_data_pos = f.read(1000000).find(pixel_data_delimiter)
            start_pos = pixel_data_pos
            frame_index = 0
        
        item_length = 100
        end_pos = 0

        f.seek(0)
        while frame_index <= int(ds.get('NumberOfFrames', 1)) and frame_index <= frame_limit:
            f.seek(start_pos)
            file_content = f.read(item_length+10)

            delimiter = file_content.find(frame_delimeter)

            if(delimiter == -1):
                break

            item_length = struct.unpack("<I", file_content[delimiter+4:delimiter+8])[0]

            start_pos = start_pos + delimiter + 8
            end_pos = start_pos + item_length

            frames.append({
                "frame_number": frame_index,
                "frame_size": item_length,
                "start_pos": start_pos,
                "end_pos": end_pos,
            })

            frame_index += 1
        frames.remove(frames[0])
        return {
                "frames": frames, 
                "rows": ds.get('Rows', 1), 
                "columns": ds.get('Columns', 1) 
        }
