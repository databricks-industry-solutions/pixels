"""
Uninstall Pixels assets — keep UC data (volume DICOM files, ingested tables).

Removes everything `databricks bundle destroy` does NOT remove (apps, serving
endpoint, jobs, synced-table pipelines, Lakebase instance, Genie space,
registered model, build artifacts on the Volume, install job, dashboard) so a
subsequent `databricks bundle deploy` produces a clean install while preserving
the UC schema, tables, and DICOM data already ingested.

Usage:
    python install/uninstall.py --profile MY_WORKSPACE \\
        --catalog main --schema pixels [--volume pixels_volume] [--yes]

Idempotent — every delete tolerates "not found".
"""

import argparse
import sys
import time

from databricks.sdk import WorkspaceClient
from databricks.sdk.errors import NotFound
from databricks.sdk.errors.base import DatabricksError

APPS = ["pixels-dicomweb", "pixels-dicomweb-gateway"]
SERVING_ENDPOINT = "pixels-monai-uc"
LAKEBASE_INSTANCE = "pixels-lakebase"
INSTALL_JOB_NAME = "pixels_install"
STOW_JOB_NAME = "pixels-dicomweb_stow_processor"
MODEL_NAME = "monai_pixels_model"
SYNCED_TABLE_NAME = "instance_paths"  # catalog.schema.instance_paths


def _safe(label, fn, *args, **kwargs):
    """Run `fn(*args, **kwargs)`; print outcome; never raise."""
    try:
        fn(*args, **kwargs)
        print(f"  ✓ {label}")
        return True
    except NotFound:
        print(f"  · {label} — not found (skip)")
        return False
    except DatabricksError as e:
        msg = str(e)
        if "RESOURCE_DOES_NOT_EXIST" in msg or "does not exist" in msg.lower():
            print(f"  · {label} — not found (skip)")
            return False
        print(f"  ✗ {label} — {msg[:200]}")
        return False
    except Exception as e:  # noqa: BLE001
        print(f"  ✗ {label} — {type(e).__name__}: {str(e)[:200]}")
        return False


def _wait_for_app_terminal(ws: WorkspaceClient, name: str, timeout_s: float = 180.0) -> None:
    """Poll an app until compute_status is STOPPED (terminal) or timeout."""
    deadline = time.monotonic() + timeout_s
    last_state = None
    while time.monotonic() < deadline:
        try:
            app = ws.apps.get(name)
            state = app.compute_status.state.value if (app.compute_status and app.compute_status.state) else "UNKNOWN"
        except (NotFound, DatabricksError):
            return  # already gone
        if state in ("STOPPED", "ERROR"):
            print(f"  · app {name} reached terminal state {state}")
            return
        if state != last_state:
            print(f"  · waiting for app {name} ({state})…")
            last_state = state
        time.sleep(5)
    print(f"  ✗ timed out waiting for app {name} to reach terminal state")


def discover(ws: WorkspaceClient, catalog: str, schema: str, volume: str) -> dict:
    """Return a plan describing what will be deleted."""
    plan = {
        "apps": [],
        "serving_endpoint": None,
        "stow_job": None,
        "install_job": None,
        "synced_pipelines": [],
        "lakebase_instance": None,
        "genie_spaces": [],
        "dashboards": [],
        "registered_model": None,
        "volume_files": [],
    }

    # Apps — skip ones already deleting (delete is async; app lingers in DELETING)
    for name in APPS:
        try:
            app = ws.apps.get(name)
            state = (
                app.compute_status.state.value
                if (app.compute_status and app.compute_status.state)
                else ""
            )
            if state != "DELETING":
                plan["apps"].append(name)
        except (NotFound, DatabricksError):
            pass

    # Serving endpoint
    try:
        ws.serving_endpoints.get(SERVING_ENDPOINT)
        plan["serving_endpoint"] = SERVING_ENDPOINT
    except (NotFound, DatabricksError):
        pass

    # Jobs (STOW + install) — match by suffix to catch dev-prefixed names
    # like "[dev <user>] pixels_install"
    for j in ws.jobs.list():
        name = j.settings.name if j.settings else ""
        if not name:
            continue
        if name == STOW_JOB_NAME or name.endswith(f"] {STOW_JOB_NAME}"):
            plan["stow_job"] = (j.job_id, name)
        elif name == INSTALL_JOB_NAME or name.endswith(f"] {INSTALL_JOB_NAME}"):
            plan["install_job"] = (j.job_id, name)

    # Synced-table pipelines (Lakeflow Declarative Pipelines named "Synced table: …")
    target_table = f"{catalog}.{schema}.{SYNCED_TABLE_NAME}"
    for p in ws.pipelines.list_pipelines():
        if not p.name:
            continue
        if p.name.startswith("Synced table:") and target_table in p.name:
            plan["synced_pipelines"].append((p.pipeline_id, p.name))

    # Lakebase instance
    try:
        inst = ws.database.get_database_instance(LAKEBASE_INSTANCE)
        plan["lakebase_instance"] = inst.name
    except (NotFound, DatabricksError):
        pass

    # Genie spaces — list via REST since SDK coverage varies
    try:
        resp = ws.api_client.do("GET", "/api/2.0/genie/spaces")
        spaces = resp.get("spaces", []) if isinstance(resp, dict) else []
        for s in spaces:
            title = s.get("title", "")
            if "Pixels" in title:
                plan["genie_spaces"].append((s.get("space_id"), title))
    except DatabricksError:
        pass

    # Lakeview dashboards (only ACTIVE — TRASHED ones return 404 on delete)
    try:
        resp = ws.api_client.do(
            "GET", "/api/2.0/lakeview/dashboards", query={"page_size": 100}
        )
        dashes = resp.get("dashboards", []) if isinstance(resp, dict) else []
        for d in dashes:
            if "Pixels" not in d.get("display_name", ""):
                continue
            full = ws.api_client.do("GET", f"/api/2.0/lakeview/dashboards/{d['dashboard_id']}")
            if isinstance(full, dict) and full.get("lifecycle_state") == "ACTIVE":
                plan["dashboards"].append((d["dashboard_id"], d["display_name"]))
    except DatabricksError:
        pass

    # Registered model
    full_model = f"{catalog}.{schema}.{MODEL_NAME}"
    try:
        ws.registered_models.get(full_model)
        plan["registered_model"] = full_model
    except (NotFound, DatabricksError):
        pass

    # Volume build artifacts (wheel + ohif tarball)
    vol_base = f"/Volumes/{catalog}/{schema}/{volume}"
    for path in [f"{vol_base}/ohif.tar.gz"]:
        try:
            ws.files.get_metadata(path)
            plan["volume_files"].append(path)
        except (NotFound, DatabricksError):
            pass
    try:
        for entry in ws.files.list_directory_contents(f"{vol_base}/dist"):
            if entry.path and entry.path.endswith(".whl"):
                plan["volume_files"].append(entry.path)
    except (NotFound, DatabricksError):
        pass

    return plan


def print_plan(plan: dict, catalog: str, schema: str, volume: str) -> bool:
    """Print plan; return True if there is anything to delete."""
    print(f"\nPixels uninstall plan (catalog={catalog}, schema={schema}, volume={volume})")
    print("=" * 72)
    print("KEEP: UC schema, tables (object_catalog, etc.), DICOM files in volume\n")
    print("DELETE:")
    any_work = False

    def line(label, items):
        nonlocal any_work
        if not items:
            print(f"  ·  {label}: none")
            return
        any_work = True
        if isinstance(items, list):
            print(f"  →  {label}:")
            for it in items:
                print(f"       - {it}")
        else:
            print(f"  →  {label}: {items}")

    line("Apps", plan["apps"])
    line("Serving endpoint", plan["serving_endpoint"])
    line("STOW processor job", plan["stow_job"])
    line("Install job", plan["install_job"])
    line("Synced-table pipelines", plan["synced_pipelines"])
    line("Lakebase instance", plan["lakebase_instance"])
    line("Genie spaces", plan["genie_spaces"])
    line("Dashboards (ACTIVE)", plan["dashboards"])
    line("Registered model", plan["registered_model"])
    line("Volume build artifacts", plan["volume_files"])
    print("=" * 72)
    return any_work


def execute(ws: WorkspaceClient, plan: dict) -> None:
    print("\nExecuting uninstall...\n")

    # 1. Apps — stop, wait for terminal state, then delete
    if plan["apps"]:
        print("Apps:")
        for name in plan["apps"]:
            _safe(f"stop app {name}", ws.apps.stop, name)
        for name in plan["apps"]:
            _wait_for_app_terminal(ws, name)
            _safe(f"delete app {name}", ws.apps.delete, name)

    # 2. Serving endpoint
    if plan["serving_endpoint"]:
        print("Serving endpoint:")
        _safe(
            f"delete endpoint {plan['serving_endpoint']}",
            ws.serving_endpoints.delete,
            plan["serving_endpoint"],
        )

    # 3. Jobs
    if plan["stow_job"] or plan["install_job"]:
        print("Jobs:")
    if plan["stow_job"]:
        jid, jname = plan["stow_job"]
        _safe(f"delete job {jname} (id={jid})", ws.jobs.delete, jid)
    if plan["install_job"]:
        jid, jname = plan["install_job"]
        _safe(f"delete job {jname} (id={jid})", ws.jobs.delete, jid)

    # 4. Synced-table pipelines (must precede Lakebase delete)
    if plan["synced_pipelines"]:
        print("Synced-table pipelines:")
        for pid, pname in plan["synced_pipelines"]:
            _safe(f"delete pipeline {pname} (id={pid})", ws.pipelines.delete, pid)

    # 5. Lakebase instance
    if plan["lakebase_instance"]:
        print("Lakebase instance:")
        _safe(
            f"delete database instance {plan['lakebase_instance']}",
            ws.database.delete_database_instance,
            plan["lakebase_instance"],
        )

    # 6. Genie spaces
    if plan["genie_spaces"]:
        print("Genie spaces:")
        for sid, title in plan["genie_spaces"]:
            _safe(
                f"delete genie space '{title}' (id={sid})",
                ws.api_client.do,
                "DELETE",
                f"/api/2.0/genie/spaces/{sid}",
            )

    # 7. Dashboards
    if plan["dashboards"]:
        print("Dashboards:")
        for did, dname in plan["dashboards"]:
            _safe(
                f"trash dashboard '{dname}' (id={did})",
                ws.api_client.do,
                "DELETE",
                f"/api/2.0/lakeview/dashboards/{did}",
            )

    # 8. Registered model — purge versions first, then the model
    if plan["registered_model"]:
        print("Registered model:")
        full_name = plan["registered_model"]
        try:
            versions = list(ws.model_versions.list(full_name=full_name))
        except DatabricksError as e:
            versions = []
            print(f"  ✗ list versions {full_name} — {str(e)[:200]}")
        for v in versions:
            _safe(
                f"delete model version {full_name}/{v.version}",
                ws.model_versions.delete,
                full_name,
                v.version,
            )
        _safe(
            f"delete model {full_name}",
            ws.registered_models.delete,
            full_name,
        )

    # 9. Volume build artifacts
    if plan["volume_files"]:
        print("Volume build artifacts:")
        for path in plan["volume_files"]:
            _safe(f"delete {path}", ws.files.delete, path)

    print("\nDone.")


def main() -> int:
    parser = argparse.ArgumentParser(description=(__doc__ or "").strip().splitlines()[0])
    parser.add_argument("--profile", required=True, help="Databricks CLI profile")
    parser.add_argument("--catalog", default="main")
    parser.add_argument("--schema", default="pixels")
    parser.add_argument("--volume", default="pixels_volume", help="UC volume name")
    parser.add_argument("--yes", "-y", action="store_true", help="Skip confirmation prompt")
    args = parser.parse_args()

    ws = WorkspaceClient(profile=args.profile)
    print(f"Connected to {ws.config.host} (profile={args.profile})")

    plan = discover(ws, args.catalog, args.schema, args.volume)
    has_work = print_plan(plan, args.catalog, args.schema, args.volume)

    if not has_work:
        print("\nNothing to uninstall.")
        return 0

    if not args.yes:
        try:
            answer = input("\nProceed with deletion? [y/N]: ").strip().lower()
        except EOFError:
            answer = ""
        if answer not in ("y", "yes"):
            print("Aborted.")
            return 1

    execute(ws, plan)
    return 0


if __name__ == "__main__":
    sys.exit(main())
