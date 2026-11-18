# Release Notes

This page summarizes user-facing changes to Pixels. Each release has its full changelog on [GitHub Releases](https://github.com/databricks-industry-solutions/pixels/releases).

- **Unreleased** lists what is merged on `main` but not yet tagged.
- Versions follow `MAJOR.MINOR.PATCH`. The library version lives in `src/dbx/pixels/version.py`.
- This page is maintained with the `update-release-notes` Claude Code skill (`.claude/skills/update-release-notes/`). Keep the marker comments intact.

<!-- release-notes:last-synced-commit 347c349 -->

<!-- release-notes:unreleased:start -->
## Unreleased

Changes merged to `main` since [`3.0.0`](https://github.com/databricks-industry-solutions/pixels/releases/tag/3.0.0).

### Highlights

- **Liquid clustering on the object catalog.** `study_uid` and `series_uid` are now top-level columns, and the table is clustered by `study_uid`. DICOMweb gateway lookups no longer parse the `meta` VARIANT column. ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))
- **NIfTI support.** You can ingest `.nii` / `.nii.gz` files and overlay NIfTI segmentations in the OHIF viewer through the new gateway routes `GET /api/dicomweb/nifti/{related,fetch}`. See [`docs/NIFTI_OVERLAY.md`](https://github.com/databricks-industry-solutions/pixels/blob/main/docs/NIFTI_OVERLAY.md). ([#237](https://github.com/databricks-industry-solutions/pixels/pull/237))
- **Active learning on a Single-GPU Cluster.** The MONAILabel loop (annotate in OHIF, train on the cluster, track in MLflow, promote a checkpoint) runs through [`notebooks/training/AIRuntime-ActiveLearning.ipynb`](https://github.com/databricks-industry-solutions/pixels/blob/main/notebooks/training/AIRuntime-ActiveLearning.ipynb) and the new `dbx.pixels.modeltraining` package. ([#219](https://github.com/databricks-industry-solutions/pixels/pull/219))
- **OHIF 3.13.2 and an ECG viewer.** The viewer is upgraded 3.12.3 → 3.12.10 → 3.13.2 (`UI_VERSION` 1.4.0) and can now display DICOM Waveform / 12-lead ECG studies. ([#222](https://github.com/databricks-industry-solutions/pixels/pull/222), [#244](https://github.com/databricks-industry-solutions/pixels/pull/244))

### New features

- **Library:** `DicomMetaExtractor` writes `study_uid` / `series_uid` columns, and `Catalog.save()` clusters by `study_uid` in both batch and streaming. ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))
- **Install:** a new `serving_workload_type` bundle variable. Left empty, it picks `GPU_MEDIUM` on AWS/GCP and tries `GPU_LARGE` then `GPU_SMALL` on Azure. ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))
- **Gateway:** STOW processor job management. It creates and updates the job, grants `CAN_MANAGE` to the groups and users in `STOW_MANAGER_GROUPS`, and polls run status at `STOW_RUN_POLL_INTERVAL_S`. ([#234](https://github.com/databricks-industry-solutions/pixels/pull/234))
- **Gateway:** study-level WADO-RS metadata, and a QIDO-RS pagination cap configurable via `PIXELS_QIDO_MAX_LIMIT`. ([#219](https://github.com/databricks-industry-solutions/pixels/pull/219))
- **Gateway:** optional NIfTI overlay routes, enabled by the `nifti_segmentation_table` bundle variable. ([#237](https://github.com/databricks-industry-solutions/pixels/pull/237))
- **Viewer:** an ECG extension with calibrated display, lead labels, measurements, and PNG/JPG/PDF export. ([#222](https://github.com/databricks-industry-solutions/pixels/pull/222))

### Improvements

- **Viewer:** large OHIF assets (`*.wasm`, `app.bundle.*.js`) are stored gzip-compressed and served with `Content-Encoding: gzip`, which keeps them under the git and DAB sync size limits. ([#247](https://github.com/databricks-industry-solutions/pixels/pull/247))
- **Gateway:** metadata is sanitized for strict DICOMweb clients (MedDream, the OHIF segmentation plug-in), and the stream chunk size can now be tuned. ([#219](https://github.com/databricks-industry-solutions/pixels/pull/219))
- **Gateway:** the maximum request header size is raised for large STOW-RS payloads. ([#234](https://github.com/databricks-industry-solutions/pixels/pull/234))

### Fixes

- **Viewer:** a request for a missing static asset now returns `404` instead of the SPA `index.html`, which used to break JS/WASM loading. ([#247](https://github.com/databricks-industry-solutions/pixels/pull/247))
- **Model serving:** endpoint deployment no longer fails on Azure, where `GPU_MEDIUM` isn't offered. ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))
- **Apps:** the preferences cookie that shares `pixels_table` between apps is restored. ([#221](https://github.com/databricks-industry-solutions/pixels/pull/221))

### Security & dependencies

- `mlflow` is replaced by `mlflow-skinny` everywhere except the MONAI model code, which resolves security alerts in the `mlflow` server package (≤ 3.10.1). ([#213](https://github.com/databricks-industry-solutions/pixels/pull/213))
- The Databricks license file is updated. ([#225](https://github.com/databricks-industry-solutions/pixels/pull/225))

### Breaking changes & upgrade notes

- **`Catalog.save()` requires a `study_uid` column.** Run `DicomMetaExtractor` before saving. Saving the raw `catalog()` output now fails. ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))
- **Existing object catalog tables must be migrated** before new writes. Run [`notebooks/UPGRADE_TO_LIQUID.ipynb`](https://github.com/databricks-industry-solutions/pixels/blob/main/notebooks/UPGRADE_TO_LIQUID.ipynb) with the `table` widget set to your catalog table. It adds and backfills `study_uid` / `series_uid` from `meta`, enables the required Delta features, applies `CLUSTER BY (study_uid)`, and runs `OPTIMIZE`. ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))
- **Recommended extractor settings changed** to `DicomMetaExtractor(catalog, permissive=True, remove_un_tags=True)`. See [Metadata Extraction](Metadata-Extraction). ([#249](https://github.com/databricks-industry-solutions/pixels/pull/249))

### Merged pull requests

| PR | Title | Merged |
|----|-------|--------|
| [#249](https://github.com/databricks-industry-solutions/pixels/pull/249) | Liquid clustering by study_uid + cloud-aware GPU workload selection | 2026-09-30 |
| [#247](https://github.com/databricks-industry-solutions/pixels/pull/247) | Serve pre-compressed OHIF static assets (*.wasm.gz, *.js.gz) | 2026-09-14 |
| [#244](https://github.com/databricks-industry-solutions/pixels/pull/244) | Upgrade to OHIF 3.13.2 and UI version | 2026-09-11 |
| [#237](https://github.com/databricks-industry-solutions/pixels/pull/237) | Integrate NIfTI overlay support | 2026-08-18 |
| [#234](https://github.com/databricks-industry-solutions/pixels/pull/234) | Add STOW job management with group permissions and run monitoring | 2026-07-01 |
| [#219](https://github.com/databricks-industry-solutions/pixels/pull/219) | Enable SGC Active Learning | 2026-06-11 |
| [#225](https://github.com/databricks-industry-solutions/pixels/pull/225) | Fix/license | 2026-06-05 |
| [#222](https://github.com/databricks-industry-solutions/pixels/pull/222) | Upgrade OHIF to 3.12.3, added ECG viewer | 2026-06-05 |
| [#213](https://github.com/databricks-industry-solutions/pixels/pull/213) | Fix/mlflow update | 2026-06-03 |
| [#221](https://github.com/databricks-industry-solutions/pixels/pull/221) | Reverted cookie skip | 2026-06-02 |
<!-- release-notes:unreleased:end -->

## 3.0.0 (2026-05-22)

The GA release of the next-generation accelerator. [Full changelog](https://github.com/databricks-industry-solutions/pixels/releases/tag/3.0.0)

- **Repository reorganization:** the library moved to `src/dbx/pixels/`, apps to `apps/`, model assets to `models/monai/`, install tasks to `install/`, and docs to `docs/`. ([#211](https://github.com/databricks-industry-solutions/pixels/pull/211))
- **One-command DAB installer:** `make deploy` plus `databricks bundle run pixels_install` provisions UC objects, Lakebase, the DICOMweb gateway and OHIF viewer apps, Vista3D serving, Genie, the dashboard, and the STOW processor. A final `validate_install` task checks every surface.
- **Idempotent deployment:** every install task can be re-run safely.
- **Performance:** parallel unzip based on `mapInPandas`, and concurrent I/O in `DicomMetaExtractor`.
- **Breaking:** the new repository layout, apps deployed through the SDK instead of DAB `apps:` sections, default catalog `main`, `Catalog.init()` no longer creates tables, and `models/vista3d/` → `models/monai/`.

## Older releases

| Version | Date | Notes |
|---------|------|-------|
| 3.0.0-rc.1 … rc.9 | 2026-03-05 … 2026-05-22 | [Releases](https://github.com/databricks-industry-solutions/pixels/releases?q=3.0.0-rc&expanded=true). rc.1 introduced the DICOMweb gateway, Lakebase, the VARIANT metadata type, the DICOM Redactor, Genie automation, OHIF 3.11.1 and MONAI 1.5.2 |
| 2.2.0 | 2025-08-25 | [Release](https://github.com/databricks-industry-solutions/pixels/releases/tag/2.2.0) |
| 2.0.0 | 2024-11-27 | [Release](https://github.com/databricks-industry-solutions/pixels/releases/tag/2.0.0) |
| 0.0.6 | 2023-11-02 | Initial public release: [Release](https://github.com/databricks-industry-solutions/pixels/releases/tag/0.0.6) |
