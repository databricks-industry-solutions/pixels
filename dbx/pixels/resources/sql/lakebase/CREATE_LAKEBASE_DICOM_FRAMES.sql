CREATE TABLE IF NOT EXISTS DICOM_FRAMES (
    filename TEXT NOT NULL,
    frame INTEGER NOT NULL,
    start_pos INTEGER NOT NULL,
    end_pos INTEGER NOT NULL,
    pixel_data_pos INTEGER NOT NULL,
    PRIMARY KEY (filename, frame)
);