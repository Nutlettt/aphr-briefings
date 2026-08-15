# APHR Briefings agent guide

Read `README.md` before changing this repository. This repository publishes
static APHR products; collection, evidence processing, report generation, and
automated Git delivery belong elsewhere.

## File ownership

- Edit `templates/`, shared `assets/`, and `tools/` as source.
- Treat `events/*/event.json` as publisher-owned metadata. Let
  `tools/publish_product.py` create or update product entries.
- Treat `events/*/products/*/{content.html,manifest.json,assets/}` as imported
  product bundles. A product slug in shared history is immutable.
- Treat root, event, and product `index.html` files as generated output. Change
  their source or metadata, then run `python tools/build_site.py`.
- Preserve legacy and standalone pages unless the task explicitly migrates
  them.

Never use `publish_product.py --force` for a presentation change or to correct
a published product. Publish a corrected result under a new slug.

## Working method

Keep source, documentation, and committed metadata in English. Never add
credentials, private research inputs, unpublished provider payloads, or
machine-specific paths to the public site.

1. Inspect `git status --short` and preserve unrelated work.
2. Classify every intended edit using the ownership rules above.
3. Make the smallest source-level change that satisfies the request.
4. Rebuild generated pages with `python tools/build_site.py`.
5. Inspect the exact diff and confirm that only expected source, metadata,
   imported-product, and generated paths changed.
6. For presentation work, use the `site-change-review` skill and review the
   affected pages locally at desktop and mobile widths.

Run the relevant checks before handoff:

```bash
python -m compileall -q tools
python tools/build_site.py
git diff --check
git status --short
git diff --stat
git diff
```

Do not deploy, push, force-push, publish a product, or call an external service
unless the user explicitly requests that action. Production changes go through
the reviewed release process documented in `README.md` and `aphr-ops`.

For a real producer-consumer contract change, follow the
[`aphr-ops` cross-repository workflow](https://github.com/Nutlettt/aphr-ops/blob/main/docs/ai-assisted-development.md).
Do not advance accepted integration baselines from this repository alone.
