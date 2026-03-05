-- =====================================================================================
-- ENDPOINT_METRICS Table Definition
-- =====================================================================================
--
-- Purpose:
--   Stores time-series metrics snapshots from the DICOMweb serving endpoint
--   and the gateway application.  Each row is a 1-second snapshot of system
--   or request-level statistics stored as a JSONB blob.
--
-- Sources:
--   "serving"  — system metrics (CPU, RAM, caches, prefetcher) plus request
--                counters collected inside the MLflow Model Serving endpoint.
--   "gateway"  — request-level stats (request count, error count, latency)
--                collected by the DICOMweb Gateway Databricks App.
--
-- Retention:
--   Rows older than 24 hours are automatically purged on each INSERT to
--   keep the table compact without requiring an external scheduler.
--
-- Schema Alignment:
--   The schema name is derived from the UC table's schema portion so that
--   it lives alongside the existing dicom_frames / instance_paths tables.
--
-- Usage:  .format(schema_name=<uc_schema>)  before executing.
-- =====================================================================================

CREATE TABLE IF NOT EXISTS {schema_name}.endpoint_metrics (
    source      TEXT        NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metrics     JSONB       NOT NULL,
    PRIMARY KEY (source, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_endpoint_metrics_source_time
    ON {schema_name}.endpoint_metrics (source, recorded_at DESC);

-- =====================================================================================
-- PostgreSQL Native Comments
-- =====================================================================================

COMMENT ON TABLE {schema_name}.endpoint_metrics IS
'Time-series metrics snapshots from the DICOMweb serving endpoint and gateway. Each row captures a 1-second snapshot of system or request-level statistics.';

COMMENT ON COLUMN {schema_name}.endpoint_metrics.source IS
'Metrics source identifier: "serving" for the MLflow Model Serving endpoint, "gateway" for the DICOMweb Gateway Databricks App.';

COMMENT ON COLUMN {schema_name}.endpoint_metrics.recorded_at IS
'UTC timestamp when the metrics snapshot was captured.';

COMMENT ON COLUMN {schema_name}.endpoint_metrics.metrics IS
'Full metrics snapshot as a JSONB blob. Structure varies by source but is always JSON-serialisable.';
