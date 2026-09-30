"""Configuration dataclasses for the HTJ2K transcoding pipeline."""

from dataclasses import dataclass


@dataclass
class TranscodeConfig:
    """HTJ2K transcoding via transcode_datasets_to_htj2k()."""
    enabled: bool = True
    num_resolutions: int = 6
    code_block_size: tuple = (64, 64)
    progression_order: str = "RPCL"       # RPCL -> TS 1.2.840.10008.1.2.4.202
    max_batch_size: int = 256             # frames per GPU encode/decode batch

    def to_dict(self) -> dict:
        """Serialize to a dict suitable for passing to Ray workers."""
        return {
            "enabled": self.enabled,
            "num_resolutions": self.num_resolutions,
            "code_block_size": list(self.code_block_size),
            "progression_order": self.progression_order,
            "max_batch_size": self.max_batch_size,
        }


@dataclass
class MergeConfig:
    """Multi-frame merge via convert_to_enhanced_dicom() (highdicom).
    Supports CT, MR, PT. Unsupported modalities returned unchanged."""
    enabled: bool = True

    def to_dict(self) -> dict:
        return {"enabled": self.enabled}


@dataclass
class InputConfig:
    """Input source."""
    source: str = "DIRECTORY"    # 'DIRECTORY' or 'DELTA'
    delta_table: str = ""        # e.g. 'ema_rina.pixels_solacc_tcia.object_catalog'
    filter_encoded: bool = True  # skip files already in HTJ2K (Delta source)
    extra_filter: str = ""       # additional SQL filter expression (Delta source)


@dataclass
class StreamingConfig:
    """Structured Streaming for incremental processing."""
    enabled: bool = True
    checkpoint_path: str = ""
    results_table: str = ""
    trigger: str = "availableNow"
    max_files_per_trigger: int = 10000
    use_managed_file_events: bool = False
