#!/usr/bin/env python3
"""Render the Pixels dashboard template with deploy-time values.

Resolves workspace ID and cloud suffix via the Databricks SDK, then
substitutes __CATALOG__, __SCHEMA__, and __VIEWER_HOST__ markers in the
.lvdash.json.tmpl source. The rendered file is written to --out for DAB
sync to upload during `bundle deploy`.
"""
import argparse
from pathlib import Path

from databricks.sdk import WorkspaceClient


def cloud_suffix(host: str) -> str:
    if ".azuredatabricks.net" in host:
        return "azure"
    if ".gcp.databricks.com" in host:
        return "gcp"
    return "aws"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--profile", required=True)
    p.add_argument("--catalog", required=True)
    p.add_argument("--schema", required=True)
    p.add_argument("--app-name", default="pixels-dicomweb")
    p.add_argument("--src", required=True)
    p.add_argument("--out", required=True)
    args = p.parse_args()

    w = WorkspaceClient(profile=args.profile)
    workspace_id = w.get_workspace_id()
    viewer_host = (
        f"https://{args.app_name}-{workspace_id}."
        f"{cloud_suffix(w.config.host)}.databricksapps.com"
    )

    rendered = (
        Path(args.src)
        .read_text()
        .replace("__CATALOG__", args.catalog)
        .replace("__SCHEMA__", args.schema)
        .replace("__VIEWER_HOST__", viewer_host)
    )
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(rendered)
    print(
        f"Rendered {out} | catalog={args.catalog} schema={args.schema} "
        f"viewer_host={viewer_host}"
    )


if __name__ == "__main__":
    main()
