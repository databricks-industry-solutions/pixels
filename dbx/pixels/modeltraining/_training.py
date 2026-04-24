"""Core training and MLflow logging for MONAILabel models.

Provides :class:`MonaiTrainer` (initialise once, call methods many times)
and a standalone :func:`log_model_weights` convenience function.

All public symbols are fully parameterised -- no notebook globals.
"""

from __future__ import annotations

import copy
import json
import os
import threading
import time
from typing import Any

import mlflow
from mlflow import MlflowClient

__all__ = ["MonaiTrainer", "log_model_weights"]


# ---------------------------------------------------------------------------
# Standalone helper -- usable without a trainer instance
# ---------------------------------------------------------------------------

def log_model_weights(
    experiment_name: str,
    run_id: str | None = None,
    model: str = "segmentation",
    train_name: str = "train_01",
    weights_path: str | None = None,
    app_dir: str = "/tmp/monai_apps/radiology",
) -> str | None:
    """Log a model checkpoint to the most recent (or specified) MLflow run.

    Standalone convenience function -- creates a temporary MlflowClient.
    For repeated calls prefer :meth:`MonaiTrainer.log_model_weights`.
    """
    weights_path = weights_path or os.path.join(
        app_dir, "model", model, train_name, "checkpoint_final.pt",
    )
    client = MlflowClient()
    if run_id is None:
        run_id = _latest_run_id(client, experiment_name)
    if run_id is None:
        return None
    if not os.path.exists(weights_path):
        print(f"[log_weights] Checkpoint not found at {weights_path}")
        return None
    client.log_artifact(run_id, weights_path)
    print(f"[log_weights] Logged {weights_path} to MLflow run {run_id}")
    return run_id


# ---------------------------------------------------------------------------
# MonaiTrainer
# ---------------------------------------------------------------------------


class MonaiTrainer:
    """MONAILabel model trainer with integrated MLflow logging.

    Initialise once with your environment configuration, then call
    :meth:`train` and :meth:`log_model_weights` as many times as needed.
    The MLflow client is created once and reused across calls.

    Example::

        trainer = MonaiTrainer(
            app_dir="/tmp/monai_apps/radiology",
            studies_url="https://...",
            experiment_name="/Users/me/my_experiment",
            pixels_table="catalog.schema.table",
            train_configs=MONAI_TRAIN_DEFAULTS,
        )
        result = trainer.train(model="segmentation", max_epochs=50)
        trainer.log_model_weights()            # logs to latest run
        trainer.log_model_weights(run_id=result["mlflow_run_id"])
    """

    def __init__(
        self,
        app_dir: str,
        studies_url: str,
        experiment_name: str,
        pixels_table: str,
        train_configs: dict,
        user_email: str | None = None,
    ) -> None:
        self.app_dir = app_dir
        self.studies_url = studies_url
        self.experiment_name = experiment_name
        self.pixels_table = pixels_table
        self.train_configs = train_configs
        self.user_email = user_email
        self.mlflow_client = MlflowClient()

        # MLflow env -- set once at init
        os.environ.setdefault("MLFLOW_TRACKING_URI", "databricks")
        os.environ["MONAI_LABEL_TRACKING_ENABLED"] = "true"
        os.environ.setdefault("MONAI_LABEL_TRACKING_URI", "databricks")
        print("[MonaiTrainer] Initialised")

    # ------------------------------------------------------------------ #
    # log_model_weights                                                    #
    # ------------------------------------------------------------------ #

    def log_model_weights(
        self,
        run_id: str | None = None,
        model: str = "segmentation",
        train_name: str | None = None,
        weights_path: str | None = None,
        experiment_name: str | None = None,
    ) -> str | None:
        """Log a model checkpoint to the most recent (or specified) run.

        Args:
            run_id:          Explicit run ID.  *None* -> latest run.
            model:           Model sub-directory under ``<app>/model/``.
            train_name:      Training-run sub-directory (default from
                             ``train_configs["name"]``).
            weights_path:    Full checkpoint path (derived when *None*).
            experiment_name: Override (defaults to ``self.experiment_name``).

        Returns:
            ``run_id`` the artifact was logged to, or *None*.
        """
        experiment_name = experiment_name or self.experiment_name
        train_name = train_name or self.train_configs.get("name", "train_01")
        weights_path = weights_path or os.path.join(
            self.app_dir, "model", model, train_name, "checkpoint_final.pt",
        )
        if run_id is None:
            run_id = _latest_run_id(self.mlflow_client, experiment_name)
        if run_id is None:
            return None
        if not os.path.exists(weights_path):
            print(f"[log_weights] Checkpoint not found at {weights_path}")
            return None
        self.mlflow_client.log_artifact(run_id, weights_path)
        print(f"[log_weights] Logged {weights_path} to MLflow run {run_id}")
        return run_id

    # ------------------------------------------------------------------ #
    # train                                                                #
    # ------------------------------------------------------------------ #

    def train(
        self,
        model: str = "segmentation",
        labels: str | None = None,
        use_pretrained: bool = True,
        **overrides: Any,
    ) -> dict:
        """Train a model and log everything to a single MLflow run.

        Bypasses the MONAILabel HTTP server -- the app is loaded in-process,
        training runs on the attached GPU(s), and metrics + system metrics +
        model checkpoint are written to **one** MLflow run.

        Args:
            model:          Trainer name (e.g. ``"segmentation"``).
            labels:         Comma-separated custom labels.  Setting this
                            automatically skips pre-trained weights.
            use_pretrained: Load pre-trained weights (ignored when
                            *labels* is provided).
            **overrides:    Override *train_configs* keys
                            (e.g. ``max_epochs=200``).

        Returns:
            ``dict`` with training stats; includes ``mlflow_run_id``.
        """
        from mlflow.system_metrics.system_metrics_monitor import SystemMetricsMonitor

        app = self._get_app(model, labels, use_pretrained)
        request = self._build_request(model, labels, overrides)

        print(f"[train] Model: {model}")
        print(f"[train] Labels: {labels or 'default (pre-trained)'}")
        print(f"[train] Experiment: {request['tracking_experiment_name']}")
        print(f"[train] Config: {json.dumps(request, indent=2, default=str)}")
        print()

        # -- system metrics monitor (background thread) -----------------
        monitor_state: dict[str, str | None] = {"run_id": None}
        stop_event = threading.Event()
        start_ms = int(time.time() * 1000)

        def _attach() -> None:
            for _ in range(120):
                if stop_event.is_set():
                    return
                exp = self.mlflow_client.get_experiment_by_name(
                    request["tracking_experiment_name"],
                )
                if exp:
                    runs = self.mlflow_client.search_runs(
                        experiment_ids=[exp.experiment_id],
                        filter_string=(
                            f"status = 'RUNNING' AND start_time >= {start_ms}"
                        ),
                        order_by=["start_time DESC"],
                        max_results=1,
                    )
                    if runs:
                        monitor_state["run_id"] = runs[0].info.run_id
                        break
                time.sleep(1)

            rid = monitor_state["run_id"]
            if not rid:
                print(
                    "[train] WARNING: could not discover training run "
                    "for system metrics"
                )
                return

            monitor = SystemMetricsMonitor(run_id=rid, sampling_interval=5)
            monitor.start()
            print(f"[train] System metrics monitor attached to run {rid}")
            stop_event.wait()
            monitor.finish()

        thr = threading.Thread(target=_attach, daemon=True, name="sys-metrics")
        thr.start()

        # -- run training -----------------------------------------------
        try:
            result = app.train(request)
        finally:
            stop_event.set()
            thr.join(timeout=10)
            print("[train] System metrics monitor stopped")

        print("[train] Training complete!")
        print(f"[train] Result: {json.dumps(result, indent=2, default=str)}")

        # -- log checkpoint to the same run -----------------------------
        run_id = monitor_state.get("run_id")
        logged_run = self.log_model_weights(
            run_id=run_id,
            model=model,
            train_name=request.get("name"),
            experiment_name=request["tracking_experiment_name"],
        )
        if logged_run:
            result["mlflow_run_id"] = logged_run
        return result

    # ------------------------------------------------------------------ #
    # private helpers                                                      #
    # ------------------------------------------------------------------ #

    def _get_app(self, model: str, labels: str | None, use_pretrained: bool):
        """Return a MONAILabel app instance."""
        from monailabel.interfaces.utils.app import app_instance

        conf: dict[str, str] = {"models": model, "table": self.pixels_table}
        if labels:
            conf["labels"] = labels
        if not use_pretrained or labels:
            conf["use_pretrained_model"] = "false"

        print(f"[train] Loading app from {self.app_dir} ...")
        return app_instance(
            app_dir=self.app_dir, studies=self.studies_url, conf=conf,
        )

    def _build_request(
        self, model: str, labels: str | None, overrides: dict,
    ) -> dict:
        """Assemble the training request dict."""
        request = copy.deepcopy(self.train_configs)
        request["model"] = model
        request["pixels_table"] = self.pixels_table

        if not request.get("tracking_experiment_name"):
            request["tracking_experiment_name"] = self.experiment_name
        elif not request["tracking_experiment_name"].startswith("/"):
            pfx = f"/Users/{self.user_email}/" if self.user_email else "/"
            request["tracking_experiment_name"] = (
                pfx + request["tracking_experiment_name"]
            )

        request.update(overrides)
        return request


# ---------------------------------------------------------------------------
# module-private helpers
# ---------------------------------------------------------------------------

def _latest_run_id(client: MlflowClient, experiment_name: str) -> str | None:
    """Return the run_id of the most recent run in *experiment_name*."""
    exp = client.get_experiment_by_name(experiment_name)
    if exp is None:
        print(f"[log_weights] Experiment '{experiment_name}' not found")
        return None
    runs = client.search_runs(
        experiment_ids=[exp.experiment_id],
        order_by=["start_time DESC"],
        max_results=1,
    )
    if not runs:
        print(f"[log_weights] No runs found in '{experiment_name}'")
        return None
    return runs[0].info.run_id
