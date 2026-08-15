---
name: site-change-review
description: Review APHR Briefings presentation-source changes from edit through deterministic rebuild and local visual, accessibility, and link checks. Use when changing templates, shared CSS or JavaScript, images, navigation, layout, typography, responsive behavior, or generated pages produced by those presentation changes. Do not use for product import, publication-only metadata, automated Git delivery, or an unchanged presentation bundle.
---

# Site Change Review

Review from the repository root and keep the distinction between source,
imported products, and generated pages explicit throughout the task.

## 1. Establish the edit boundary

- Read `AGENTS.md` and `README.md`.
- Run `git status --short` and preserve unrelated changes.
- Edit presentation source in `templates/`, shared `assets/`, or `tools/`.
- Do not directly edit generated `index.html` pages.
- Do not change an imported product's `content.html`, `manifest.json`, or
  bundled assets for a site-wide presentation request.
- Do not use `tools/publish_product.py` or `--force` for presentation work. A
  corrected published product requires a new product slug.

## 2. Make and rebuild the change

Implement the smallest coherent source change, then rebuild:

```bash
python tools/build_site.py
```

Check build messages for preserved legacy or standalone pages. Re-run the
builder after the final source edit; it must not introduce unexpected output.

## 3. Review the exact change

```bash
git diff --check
git status --short
git diff --stat
git diff
```

Confirm that the diff contains the intended source files and their generated
pages only. Reject changes to unrelated events, imported product bodies, or
immutable product assets. Review HTML semantics and source-generated
consistency rather than polishing generated markup directly.

## 4. Review locally

Serve the repository without adding dependencies:

```bash
python -m http.server 8000
```

Open the root page plus every affected event and product page. Check:

- desktop and narrow mobile layouts, including horizontal overflow;
- typography, spacing, hierarchy, alignment, and responsive navigation;
- keyboard traversal, visible focus, drawer open/close behavior, and Escape;
- heading order, landmarks, control names, image alt text, contrast, and 200%
  zoom behavior;
- internal links, assets, and fragment targets; and
- intentional external destinations with no placeholder or broken links.

Use browser tooling when available. If visual, mobile, keyboard, or
accessibility review cannot be performed, state that limitation instead of
claiming it passed.

## 5. Finish verification

```bash
python -m compileall -q tools
python tools/build_site.py
git diff --check
```

Report the exact source and generated files changed, checks run, pages and
viewport classes reviewed, and any remaining limitation. Do not deploy, push,
or publish as part of this skill.
