## Summary
<!-- 2–4 sentences: the problem, what this PR does, why it matters to users. -->

## Changes
<!-- Group by theme (Library, Install/DAB, Gateway, Viewer, Model serving, Docs) and cite key file paths. -->
### <Theme>
- **`path/to/file`** — what changed and why

## Breaking changes & upgrade notes
<!-- "None", or what breaks, who is affected, and the exact migration step. -->
None

## Testing
<!-- Per CLAUDE.md, run the full Post-Install Integration Test suite before merging. Use N/A only where the change cannot affect the surface. -->
| Surface | Result | Notes |
|---------|--------|-------|
| `make test` | | |
| Dashboard | | |
| Genie | | |
| Viewer (OHIF render) | | |
| Viewer MONAI proxy | | |
| Gateway (QIDO/WADO) | | |
| Gateway NIfTI routes | | |
| Model serving (info + inference) | | |
| Logs | | |

## Release notes
<!-- Ready-to-paste bullets for wiki/Release-Notes.md, each with an area prefix, e.g.
- **Library:** `DicomMetaExtractor` now writes `study_uid` / `series_uid` columns.
Write "None" if there is no user impact. -->
