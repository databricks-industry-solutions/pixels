---
name: create-pr
description: Pixels pull-request authoring — branch and scope checks, make style/make test, per-surface integration-test reporting, a PR body following the repo template (summary, changes by theme, breaking changes, testing, release-notes entry), and gh pr create. Use when asked to open, create, or prepare a PR, or to write a PR description.
license: Databricks License
---

# Create a Pixels Pull Request

Produces PRs that reviewers can scan quickly and that feed straight into the [Release Notes](../../../wiki/Release-Notes.md) via the `update-release-notes` skill.

Repo: `databricks-industry-solutions/pixels`. Base branch: `main`.

## 1. Preflight

```bash
git status --short
git branch --show-current
git fetch origin && git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
```

- **On `main`?** Create a branch first. Use a prefix that matches the change: `feature/<topic>`, `fix/<topic>`, `bugfix/<topic>`, `docs/<topic>`.
- **Uncommitted changes?** Show them to the user and ask what belongs in this PR. Don't sweep in unrelated files such as `.isaac/` or scratch notebooks.
- **Scope check.** If the diff mixes unrelated concerns, suggest splitting it into separate PRs before going further.

## 2. Quality gates

1. Run `make style` (black line length 100, isort, autoflake). Commit any formatting changes.
2. Run `make test` if library code under `src/` or `tests/` changed.
3. **Integration tests.** `CLAUDE.md` requires the full Post-Install Integration Test suite before every commit: Dashboard, Genie, Viewer (OHIF render), MONAI proxy, Gateway, NIfTI routes when enabled, Model serving info and inference, and log checks.
   - If you ran them, record pass/fail per surface.
   - If you didn't, **ask the user** for their results or whether to run them. Never mark a surface as passed without evidence. Docs-only or wiki-only PRs can state "N/A — documentation only".

## 3. Write the title

- Imperative mood, ≤ 70 characters, describing the outcome rather than the activity.
  - Good: `Liquid clustering by study_uid + cloud-aware GPU workload selection`
  - Bad: `Fix/license`, `updates`, `WIP`
- Use no type prefixes, to match the repo's existing history.

## 4. Write the body

Use the structure of `.github/pull_request_template.md`. Fill each section from the actual diff, not from memory:

```markdown
## Summary
<2–4 sentences: the problem, what this PR does, why it matters to users.>

## Changes
### <Theme 1>
- **`path/to/file.py`** — <what changed and why>
### <Theme 2>
- ...

## Breaking changes & upgrade notes
<"None" or: what breaks, who is affected, exact migration step (notebook / command / code).>

## Testing
| Surface | Result | Notes |
|---------|--------|-------|
| `make test` | ✅ / ❌ / N/A | |
| Dashboard | ✅ / ❌ / N/A | |
| Genie | ✅ / ❌ / N/A | |
| Viewer (OHIF render) | ✅ / ❌ / N/A | |
| Viewer MONAI proxy | ✅ / ❌ / N/A | |
| Gateway (QIDO/WADO) | ✅ / ❌ / N/A | |
| Gateway NIfTI routes | ✅ / ❌ / N/A | |
| Model serving (info + inference) | ✅ / ❌ / N/A | |
| Logs | ✅ / ❌ / N/A | |

## Release notes
<One or more ready-to-paste bullets in the Release Notes style, each with an area prefix, e.g.
- **Library:** `DicomMetaExtractor` now writes `study_uid` / `series_uid` columns.
Write "None" for changes with no user impact.>

This pull request and its description were written by Isaac.
```

Guidelines:

- **Group changes by theme** (Library, Install/DAB, Gateway, Viewer, Model serving, Docs) and **cite file paths**. Mention the files that matter, not every file changed.
- **Name the identifiers users touch**: parameters, env vars, bundle variables, routes, tables and columns.
- **Screenshots**: include a screenshot for viewer or UI changes, or ask the user to add one.
- **Keep the attribution line** as the last line, exactly as written.

Write the finished body to `/tmp/pr-body.md` with a quoted heredoc, so backticks and `$` are kept as written:

```bash
cat > /tmp/pr-body.md <<'EOF'
## Summary
...
EOF
```

## 5. Confirm, push, create

Opening a PR is public, so show the user the title and the contents of `/tmp/pr-body.md` and get their approval first. Then:

```bash
git push -u origin "$(git branch --show-current)"
gh pr create -R databricks-industry-solutions/pixels --base main \
  --title "<title>" --body-file /tmp/pr-body.md
```

Add `--draft` if any quality gate is failing or still pending. Report the PR URL.

## 6. After merge (optional)

Offer to run the `update-release-notes` skill so the PR's **Release notes** bullets land in `wiki/Release-Notes.md`.
