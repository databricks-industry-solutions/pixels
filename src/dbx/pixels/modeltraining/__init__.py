"""dbx.pixels.modeltraining -- MONAILabel model training and MLflow logging.

Reusable across notebook cells, OHIF viewer sessions, and pipeline tasks.

Usage::

    from dbx.pixels.modeltraining import MonaiTrainer, log_model_weights

    # Initialise once, reuse for multiple training runs
    trainer = MonaiTrainer(
        app_dir="/tmp/monai_apps/radiology",
        studies_url="https://...",
        experiment_name="/Users/me/my_exp",
        pixels_table="catalog.schema.table",
        train_configs={...},
    )
    result = trainer.train(model="segmentation", max_epochs=50)
    trainer.log_model_weights(run_id=result["mlflow_run_id"])

    # Standalone: log weights without a full trainer
    log_model_weights(experiment_name="/Users/me/my_exp")
"""

from dbx.pixels.modeltraining._training import MonaiTrainer, log_model_weights

__all__ = ["MonaiTrainer", "log_model_weights"]
