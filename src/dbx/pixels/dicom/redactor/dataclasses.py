from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional

from datetime import datetime, timezone
def get_current_datetime():
# Get the current UTC time
    now_utc = datetime.now(timezone.utc)
    time_string = now_utc.isoformat(timespec='milliseconds').replace('+00:00', 'Z')
    return time_string


@dataclass
class ImagePixelCoordinates:
    bottomRight: List[int]
    height: int
    topLeft: List[int]
    width: int


@dataclass
class FrameRedaction:
    imagePixelCoordinates: ImagePixelCoordinates
    frameIndex: int
    timestamp: str = get_current_datetime()
    annotationUID: Optional[str] = None


@dataclass
class RedactionMetadata:
    filesToEdit: List[str]
    frameRedactions: Optional[Dict[str, List[FrameRedaction]]]
    globalRedactions: Optional[List[Dict]]
    modality: Optional[str] = None
    seriesInstanceUID: Optional[str] = None
    studyInstanceUID: Optional[str] = None
    enableFileOverwrite: bool = False
    exportTimestamp: str = field(default_factory=get_current_datetime)

    def __post_init__(self):
        self.totalFilesInSeries = len(self.filesToEdit)
        self.totalFrameSpecificRedactions = sum([len(redactions) for file, redactions in self.frameRedactions.items()])
        self.totalGlobalRedactions = len(self.globalRedactions)
        self.totalRedactionAreas = self.totalFrameSpecificRedactions + self.totalGlobalRedactions
