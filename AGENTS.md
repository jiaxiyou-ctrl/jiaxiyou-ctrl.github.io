# Maintained personal website

This repository is the canonical source for Jiaxi You's personal website.

- Edit the files in `site/` directly. This is a static website with no build dependency.
- Do not regenerate the site from historical portfolio previews or versioned migration scripts.
- Preserve the existing typography and visual style unless a change is requested.
- Research claims, numbers and publication status must remain supported by the project materials. Keep simulation results distinct from physical-robot validation.
- Keep clinical task illustrations explanatory; do not imply demonstrated treatment or tissue-safety outcomes.
- Keep introductory text concise. Prefer useful graphics and purposeful once-only animation over decorative motion or repeated microcopy.
- `site/projects/tangible-views/` is an imported distribution of https://github.com/jiaxiyou-ctrl/tangible-views. Make functional changes in that original project first, then run `scripts/sync-tangible.py` with its local checkout. The importer adds only a portfolio return link and website metadata.
- Validate with `python3 scripts/check.py` and check changed JavaScript with `node --check`. Check visible behavior in a browser when interactions or layouts change.
- Preview with `python3 scripts/preview.py`. Pushing `main` triggers validation and publication. Keep the live site unchanged while reviewing local edits unless publication is authorized.
- Publish only `site/`; never copy private notes, credentials, development logs or unrelated source documents into it.
