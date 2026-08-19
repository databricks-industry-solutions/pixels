# Pixels Repository Reorganization

## Overall rules
1. dbx.pixels as a package namespace stays
2. We can't move images as they are used externally
3. make build should be run at the start of the deploy
4. Keep it in dist/ (the standard Python build output) and have the deploy notebook copy it into each app directory at deploy time.
5. Add a sub-branch to the `fix/install` branch called `reorg`
6. When we say move files or move folders we want to use `git mv`

## Proposed Structure

```
pixels/
├── databricks.yml
├── targets.yml
├── Makefile
├── setup.py
├── requirements.txt
├── requirements-ai.txt
├── conftest.py
│
├── resources/                    # DAB resource definitions (unchanged)
│   ├── install-job.yml
│   ├── dashboard.yml
│   └── unity-catalog.yml
│
├── install/                      # ALL install job notebooks in one place
│   ├── init-schema.ipynb         # from resources/dabs/ (was 00-init-schema.ipynb)
│   ├── dcm-demo.ipynb            # from root
│   ├── deploy-apps.ipynb         # from root
│   ├── register-model.py         # from resources/dabs/
│   ├── deploy-endpoint.py        # from resources/dabs/
│   ├── validate-model.py         # from resources/dabs/
│   ├── genie-space.ipynb         # from root (use git mv for tracking, was 08-GenieSpace.ipynb)
│   ├── stow-processor.ipynb      # from root (active install task, was 07b-STOW-Processor-Job.ipynb)
│   ├── post-install-update.py    # from resources/dabs/
│   ├── validate-install.py       # from resources/dabs/ (was 10-validate.py)
│   └── config/                   # widget init helpers (proxy_prep.py, setup.py, setup_ai.ipynb)
│
├── ai-bi/                        # Dashboard + Genie assets
│   ├── dashboards/
│   │   └── Pixels Object Catalog dashboard.lvdash.json
│   └── genie/
│       ├── CREATE_VS_FUNCTION.sql
│       └── serialized_space.json
│
├── apps/                         # Deployable Databricks Apps
│   ├── dicom-web/                # OHIF viewer app (from dbx/pixels/resources/dicom_web/)
│   │   ├── app.py
│   │   ├── app.yml
│   │   ├── app-config.yml
│   │   ├── requirements.txt      # App-specific deps (Databricks Apps requirement)
│   │   ├── pages/
│   │   │   ├── benchmark.html
│   │   │   └── dashboard.html
│   │   └── ohif/                 # Static OHIF build assets (from dbx/pixels/resources/ohif/)
│   ├── dicom-web-gateway/        # DICOMweb gateway (from dbx/pixels/resources/dicom_web_gateway/)
│   │   ├── app.py
│   │   ├── app.yml
│   │   ├── app-config.yml
│   │   ├── requirements.txt      # App-specific deps (Databricks Apps requirement)
│   │   ├── pages/
│   │   │   └── dashboard.html
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── cache.py
│   │       ├── cloud_direct_upload.py
│   │       ├── dicom_io.py
│   │       ├── dicom_tags.py
│   │       ├── metrics.py
│   │       ├── metrics_store.py
│   │       ├── multipart_stream.py
│   │       ├── queries.py
│   │       ├── sql_client.py
│   │       ├── wrapper.py
│   │       └── handlers/
│   │           ├── __init__.py
│   │           ├── _common.py
│   │           ├── _qido.py
│   │           ├── _stow.py
│   │           └── _wado.py
│   └── view-app/                 # Deprecated viewer app (from dbx/pixels/resources/lakehouse_app/)
│       ├── app.py
│       ├── app.yml
│       ├── app-config.yml
│       ├── requirements.txt      # App-specific deps (Databricks Apps requirement)
│       ├── redaction/
│       │   └── metadata_shortcuts.json
│       └── utils/
│           ├── pages.py
│           ├── partial_frames.py
│           └── redaction_utils.py
│
├── src/                          # Python library package
│   └── dbx/                      # keep dbx.pixels imports
│       └── pixels/
│           ├── __init__.py
│           ├── catalog.py
│           ├── databricks_file.py
│           ├── lakebase.py
│           ├── logging.py
│           ├── m2m.py
│           ├── objects.py
│           ├── path_extractor.py
│           ├── plot_result.py
│           ├── tag_extractor.py
│           ├── utils.py
│           ├── version.py
│           ├── dicom/
│           ├── czi/
│           ├── modelserving/     # Client-side inference library (see Design Decisions)
│           ├── prompt/
│           ├── common/           # Shared app code
│           │   ├── __init__.py
│           │   ├── config.py
│           │   ├── middleware.py
│           │   ├── pages.py
│           │   ├── redaction_utils.py
│           │   └── routes.py
│           └── resources/        # non-app assets that stay with the library
│               ├── databricks-logo.svg
│               ├── databricks-red-logo.svg
│               ├── PixelsLogo.jp2
│               ├── dicom_tags.ndjson
│               ├── plot.css
│               ├── plot.html
│               ├── plot.js
│               ├── UI_VERSION
│               ├── prompts/      # VLM/redactor system prompts
│               │   ├── ohif_redactor/system/metadata_redaction.txt
│               │   └── vlm_analyzer/
│               │       ├── system/vlm_ohif.txt
│               │       └── user/default_analysis.txt
│               └── sql/          # SQL sources (stay in package for runtime Path lookups)
│                   ├── __init__.py
│                   ├── CREATE_FUNCTIONS.sql
│                   ├── CREATE_OBJECT_CATALOG_AUTOSEG_RESULT.sql
│                   ├── CREATE_OBJECT_CATALOG_REDACTION.sql
│                   ├── CREATE_OBJECT_CATALOG_UNZIP.sql
│                   ├── CREATE_OBJECT_CATALOG.sql
│                   ├── CREATE_STOW_OPERATIONS.sql
│                   └── lakebase/
│                       ├── CREATE_INSTANCE_PATHS_VIEW.sql
│                       ├── CREATE_LAKEBASE_DICOM_FRAMES.sql
│                       ├── CREATE_LAKEBASE_METRICS.sql
│                       ├── CREATE_LAKEBASE_RLS.sql
│                       └── CREATE_LAKEBASE_SCHEMA.sql
│
├── models/                       # Vista3D model (renamed from monailabel_model/)
│   └── vista3d/
│       ├── conda_envs/
│       ├── ModelServing.py
│       └── VISTA3D.ipynb
│
├── notebooks/                    # Demo/tutorial notebooks
│   ├── 00-README.py              # moved from root
│   ├── 03-Metadata-DeIdentification.py
│   ├── 03b-Image-DeIdentification.ipynb
│   ├── 04-UC-Governance.py
│   ├── 05-MONAILabel.py
│   ├── 06-OHIF-Viewer.py
│   ├── VariantMigration.ipynb    # already in notebooks/
│   ├── data-downloaders/         # already in notebooks/
│   │   ├── TCIA Cancer Image Net downloader - Verifyer.ipynb
│   │   └── TCIA Cancer Image Net downloader Notebook.ipynb
│   ├── DE-ID/                    # already in notebooks/
│   │   ├── DICOM - Catalog Dataset.py
│   │   ├── DICOM - Easy OCR.ipynb
│   │   ├── DICOM - Presidio - Transformer.ipynb
│   │   ├── DICOM - Presidio.ipynb
│   │   ├── DICOM - VLMTransformer - v2.ipynb
│   │   ├── DICOM - VLMTransformer.ipynb
│   │   └── metatag_Presidio_rules.ipynb
│   └── lakebase/                 # already in notebooks/
│       └── Row-Level-Security-Sync.ipynb
│
├── workflow/                     # Operational workflow notebooks
│
├── tests/
│   ├── db_runner.py              # test runner helper
│   ├── dbx/                      # keep
│   └── perfs/
│
└── images/			  # Need to keep images at top level. Links outside of github rely on this location.
└── docs/                         # Consolidate documentation
    ├── INSTALL.md
    ├── DICOMWEB.md
```

## Design Decisions

### `modelserving/` stays under `src/dbx/pixels/`

The `modelserving` subpackage is a **client-side library**, not deployment code. It provides:

- `serving_endpoint_client.py` — `MONAILabelClient`, a retry-aware REST client for the serving endpoint
- `client.py` — `MONAILabelTransformer`, a Spark Transformer wrapping the endpoint via `pandas_udf`
- `bundles/servingendpoint.py` — `MonaiLabelBundlesTransformer` (Bundles model variant)
- `bundles/gpu.py` — `MonaiLabelBundlesGPUTransformer` (direct GPU inference, no endpoint)
- `vista3d/servingendpoint.py` — `Vista3DMONAITransformer` (Vista3D-specific endpoint transformer)
- `vista3d/gpu.py` — `Vista3DGPUTransformer` (Vista3D direct GPU transformer)

These are all Spark Transformers and API clients that users import to consume inference results — the same pattern as `dbx.pixels.dicom` (ingestion/metadata) or `dbx.pixels.catalog` (catalog ops). The only difference is the processing stage.

The **deployment** notebook (`monailabel_model/ModelServing.py`) — which handles model registration, endpoint creation, and auth setup — is correctly separate under `models/vista3d/` (renamed from `monailabel_model/`).

## Migration Steps

### Phase 1: Consolidate install tasks
1. Move `resources/dabs/*.ipynb` and `resources/dabs/*.py` → `install/`
2. Move root job notebooks (`01-dcm-demo.ipynb`, `07-OHIF-Lakehouse-App.ipynb`, `07b-STOW-Processor-Job.ipynb`, `08-GenieSpace.ipynb`) → `install/`
3. Move `config/` → `install/config/`
4. Update all `%run` paths in moved notebooks
4.8 Rename install notebooks, remove the leading numbers.
5. Update all `notebook_path` references in `resources/install-job.yml` Update task keys.
7. validate bundle, deploy, run install, test install, check logs
8. git rm `resources/dabs/` ONLY after the install and logs are validated.
9. git commit

### Phase 2: Apps extraction
1. Move `dbx/pixels/resources/dicom_web/` → `apps/dicom-web/`
2. Move `dbx/pixels/resources/dicom_web_gateway/` → `apps/dicom-web-gateway/`
3. Move `dbx/pixels/resources/common/` → `dbx/pixels/common/`
4. Move `dbx/pixels/resources/lakehouse_app/` → `apps/view-app/` (deprecated — keep separate for now)
5. Move `dbx/pixels/resources/ohif/` → `apps/dicom-web/ohif/` (static OHIF build assets, served by dicom-web)
6. Move `dbx/pixels/resources/genie/` → `ai-bi/genie/`
7. Add `app.yaml` to each app directory
8. Update app deploy logic in task 02 to reference `apps/`
9. Update `ohif_path` in `common/config.py` to new location
10. Drop `package_data` for apps from `setup.py`
11. Update imports in the apps
12. validate bundle, deploy, run install, test install, check logs
13. git commit

### Phase 3: Library src layout
1. Move `dbx/pixels/` → `src/dbx/pixels/`
1.5 Update or use: sys.path.insert(0, "../src") in proxy_prep.py to address the move src folder
2. Remove extracted directories from `src/dbx/pixels/resources/` (apps, genie — already moved in Phase 1)
3. Keep `src/dbx/pixels/resources/` for non-app assets (logos, dicom_tags.ndjson, plot.*, prompts/, UI_VERSION, sql/)
4. Delete the now-empty root-level `dbx/` directory
5. Update `setup.py`: `package_dir={"": "src"}`, `packages=find_packages(where="src")`
6. Update `version.py` path in `setup.py`
7. Update `package_data` in `setup.py` to include `resources/` assets (prompts, plot files, SVGs, sql, etc.)
8. Update Makefile: add `make build` target using `python -m build`
9. Add sync include override in `databricks.yml`:
   ```yaml
   sync:
     include:
       - dist/*.whl
   ```
9.5 Update DAB sync rules for new structure
  The doc mentions updating sync.exclude for OHIF but doesn't address the broader sync impact. Today the sync root is . and      
  excludes images/*.gif and dbx/pixels/resources/ohif/**/*. After the reorg:
  - apps/dicom-web/ohif/ needs excluding (large WASM files)                                                                      
  - models/vista3d/ may need excluding (conda envs, model bundle assets are large)                                               
  - dist/*.whl needs including (mentioned in Phase 2, step 9, but as an include — note that DAB sync.include is additive to
  default patterns, verify it works with the direct engine)                                                                      
  - notebooks/ probably should be excluded (demo notebooks aren't install tasks)   


10. Build `dbx/pixels` into a wheel file. Include this dependency with each app that uses `dbx.pixels`
11. Run unit tests
12. validate bundle, deploy, run install, test install, check logs

### Phase 4: App deployment validation
1. Deploy dicom_web, test, check logs.
2. Deploy dicom_web_gateway, test, checklogs
3. Fix issues, commit

### Phase 5: Remaining moves
1. Move `monailabel_model/` → `models/vista3d/`
2. Move demo notebooks (`00-README.py`, `03-*.py`, `04-*.py`, `05-*.py`, `06-*.py`) → `notebooks/`
3. Move `INSTALL.md`, `README_DICOMWEB.md` → `docs/`
4. Update `databricks.yml` sync excludes (OHIF path change)
5. Keep `RUNME.py` and test.
6. Remove forward git+https dependencies
7. Update pydicom==3.0.2
8. Remove deprecated view-app/

### Phase 6: Validation
1. `make style` — confirm formatting still passes
2. `make test` — confirm unit tests pass with new import paths
3. `make build` — creates dist artifacts
4. `databricks bundle validate` — confirm DAB references resolve
5. Full install job run on a dev target

## Files That Stay at Root
- `databricks.yml`, `targets.yml` (DAB config)
- `Makefile`, `setup.py`, `setup.cfg` (build tooling)
- `requirements.txt`, `requirements-ai.txt` (deps)
- `conftest.py`, `pytest_databricks.py` (test config)
- `README.md`, `LICENSE`, `NOTICE`, `SECURITY.md`, `CONTRIBUTING.md` (repo standard files)
- `.github/` (CI/CD workflows, issue templates)
- `.gitignore`, `.pre-commit-config.yaml` (git/lint config)
- `CLAUDE.md` (AI assistant instructions)
- `typings/__builtins__.pyi` (type stubs)
- `commit_outputs` (review whether still needed — delete if not)


### Phase 7: Fix nits
1. Fix RUNME.py notebook, update links.
2. Fix README.md links
3. Update CLAUDE.md with accurate post-reorg project structure

### Phase 8: Pre-commit path fix
1. Update `.pre-commit-config.yaml` file patterns from `^(dbx/|tests/|setup.py)` to `^(src/dbx/|tests/|setup.py)` — hooks currently skip all library code under `src/`
2. Run `make style` to verify hooks match the new paths

### Run Validation again
1. Go
