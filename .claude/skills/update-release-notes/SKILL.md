---
name: update-release-notes
description: Update the Pixels wiki Release Notes page (wiki/Release-Notes.md) from PRs merged to main since the last sync, and cut a new version section when a release tag appears. Use when asked to update, refresh, or generate release notes or a changelog, or to prepare the notes for a new release.
---

# Update Release Notes

Keeps `wiki/Release-Notes.md` in sync with what's merged on `main`. The page is the source of truth in the repo. It gets reviewed in a PR like any other change, then published to the GitHub wiki.

Repo: `databricks-industry-solutions/pixels`.

## Page contract

The page relies on these markers. Never remove or rename them:

| Marker | Meaning |
|--------|---------|
| `<!-- release-notes:last-synced-commit <sha> -->` | Last `main` commit already reflected on the page |
| `<!-- release-notes:unreleased:start -->` … `<!-- release-notes:unreleased:end -->` | The `## Unreleased` block. Only this block is rewritten during a normal sync |

Sections inside Unreleased, in this order. Omit a section when it's empty, except **Merged pull requests**, which is always present:

1. `### Highlights`: 2–5 headline changes, one bold lead-in per bullet
2. `### New features`
3. `### Improvements`: performance, UX, docs a user would notice
4. `### Fixes`
5. `### Security & dependencies`
6. `### Breaking changes & upgrade notes`: anything that requires user action, with the exact migration step
7. `### Merged pull requests`: a table `| PR | Title | Merged |`, newest first

## Workflow

### 1. Gather

```bash
git fetch origin --tags
LAST=$(grep -o 'release-notes:last-synced-commit [0-9a-f]*' wiki/Release-Notes.md | awk '{print $2}')
git log "$LAST"..origin/main --first-parent --format='%h %ad %s' --date=short
```

- **Merge commits** (`Merge pull request #N …`): fetch each PR with
  `gh pr view N -R databricks-industry-solutions/pixels --json number,title,mergedAt,body,labels,files`.
- **Squash merges**: the subject ends with `(#N)`. Treat these the same way.
- **Direct commits with no PR**: read the diff (`git show --stat <sha>`). Include only user-facing ones and cite them by short SHA instead of a PR link.

If `LAST` is missing or not an ancestor of `origin/main`, stop and ask the user which commit or tag to start from.

### 2. Detect a release

```bash
git tag --sort=-creatordate --merged origin/main | head -5
gh release list -R databricks-industry-solutions/pixels -L 5
```

If a tag newer than the most recent `## <version>` heading exists, **cut a release** before adding new entries:

1. Split the changes: commits up to the tag go into the release, and commits after it stay in Unreleased. Use `git merge-base --is-ancestor <sha> <tag>` per PR merge commit.
2. Insert `## <version> (<tag date>)` right after the `unreleased:end` marker. Give it a one-line summary, a `[Full changelog](…/releases/tag/<tag>)` link, and a condensed version of the released bullets (Highlights plus Breaking changes, max ~8 bullets).
3. Reset Unreleased to contain only post-tag changes, and update its "since `<tag>`" link.

### 3. Classify and write

For each PR, read its body and changed files, not only the title. PR titles are often terse, for example "Fix/license".

- **One bullet per user-visible change**, not per PR. A PR can produce several bullets across sections, and trivial PRs can be merged into one bullet.
- **Prefix with the area**: `**Library:**`, `**Install:**`, `**Gateway:**`, `**Viewer:**`, `**Model serving:**`, `**Apps:**`, `**Docs:**`.
- **Name concrete identifiers**: parameters, env vars, bundle variables, routes, table and column names, notebook paths, with backticks.
- **End every bullet with its source**: `([#N](https://github.com/databricks-industry-solutions/pixels/pull/N))`.
- **Breaking changes** must say what breaks and exactly how to migrate (the notebook, command, or code change).
- **Skip** pure CI, formatting, test-only, or internal refactors with no behavior change. They still appear in the Merged pull requests table.
- **Match the tone** of the existing entries: factual, present tense, no marketing language.

### 4. Update the page

1. Rewrite only the Unreleased block, plus a new version section if you cut a release.
2. Prepend the new rows to the Merged pull requests table.
3. Set `last-synced-commit` to `git rev-parse --short origin/main`.
4. If a change affects a documented page (Ingestion, Metadata Extraction, …), point it out to the user and offer to update that page too.

### 5. Verify

- Every PR number in the git range appears in the table exactly once.
- Every link has the form `https://github.com/databricks-industry-solutions/pixels/pull/<N>`.
- Both markers are still present exactly once.
- Show the user the diff: `git diff wiki/Release-Notes.md`.

### 6. Publish (only when the user confirms)

The wiki is a separate repo, and publishing to it is public. Ask first.

```bash
TMP=$(mktemp -d)
git clone https://github.com/databricks-industry-solutions/pixels.wiki.git "$TMP"
cp wiki/*.md "$TMP"/
git -C "$TMP" add -A && git -C "$TMP" commit -m "Update release notes through $(git rev-parse --short origin/main)"
git -C "$TMP" push
```

If the clone fails with "Repository not found", the wiki isn't initialized yet. Tell the user to create any page once in the GitHub UI (Wiki tab → Create the first page), then retry.

To land the change in the main repo, use the `create-pr` skill.
