from __future__ import annotations

import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
TOOLS = REPOSITORY_ROOT / "tools"
sys.path.insert(0, str(TOOLS))

import build_site  # noqa: E402
import publish_product  # noqa: E402


class BuildSiteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)
        shutil.copytree(REPOSITORY_ROOT / "templates", self.root / "templates")
        self.original_root = build_site.ROOT
        build_site.ROOT = self.root

    def tearDown(self) -> None:
        build_site.ROOT = self.original_root
        self.temporary_directory.cleanup()

    def test_new_snapshot_only_event_builds_clean_pages(self) -> None:
        event_slug = "example-event-2026"
        product_slug = "snapshot-20260802"
        event_dir = self.root / "events" / event_slug
        product_dir = event_dir / "products" / product_slug
        product_dir.mkdir(parents=True)

        event = {
            "schema_version": "1.0",
            "slug": event_slug,
            "title": "Example Event",
            "event_type": "Earthquake",
            "event_date": "2026-08-02",
            "products": [
                {
                    "slug": product_slug,
                    "title": "Snapshot briefing",
                    "product_type": "snapshot_briefing",
                    "generated_at": "2026-08-02T08:00:00+01:00",
                    "counts": {"sources": 3},
                    "manifest_path": f"products/{product_slug}/manifest.json",
                }
            ],
            "latest_product_slug": product_slug,
        }
        (event_dir / "event.json").write_text(
            json.dumps(event), encoding="utf-8"
        )
        (product_dir / "content.html").write_text(
            '<section id="summary"><h2>Summary</h2></section>\n',
            encoding="utf-8",
        )
        (product_dir / "manifest.json").write_text(
            json.dumps(
                {
                    "product_type": "snapshot_briefing",
                    "generated_at": "2026-08-02T08:00:00+01:00",
                    "counts": {"sources": 3},
                    "sections": [{"id": "summary", "title": "Summary"}],
                }
            ),
            encoding="utf-8",
        )

        build_site.build_site()

        event_page = (event_dir / "index.html").read_text(encoding="utf-8")
        self.assertIn("Time<span>unavailable</span>", event_page)
        self.assertIn("Generated Aug 2, 2026 07:00 UTC", event_page)
        for page in self.root.rglob("index.html"):
            html = page.read_text(encoding="utf-8")
            self.assertNotRegex(html, r"{{\s*[a-z][a-z0-9_]*\s*}}")
            for line_number, line in enumerate(html.splitlines(), start=1):
                self.assertEqual(
                    line,
                    line.rstrip(),
                    f"trailing whitespace in {page}:{line_number}",
                )

    def test_template_rejects_missing_values(self) -> None:
        template = self.root / "templates" / "incomplete.html"
        template.write_text("{{ known }} {{ missing }}\n", encoding="utf-8")

        with self.assertRaisesRegex(ValueError, "missing"):
            build_site._template("incomplete.html", {"known": "value"})

    def test_aware_datetimes_are_displayed_in_utc(self) -> None:
        value = "2026-08-01T23:30:00-07:00"
        self.assertEqual(
            build_site._format_timeline_date(value),
            "Aug<span>2, 2026</span>",
        )
        self.assertEqual(
            build_site._format_generated(value),
            "Aug 2, 2026 06:30 UTC",
        )
        self.assertEqual(
            build_site._sort_datetime(value),
            "2026-08-02T06:30:00+00:00",
        )


class PublishProductTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name) / "site"
        (self.root / "events").mkdir(parents=True)
        self.original_root = publish_product.ROOT
        publish_product.ROOT = self.root

    def tearDown(self) -> None:
        publish_product.ROOT = self.original_root
        self.temporary_directory.cleanup()

    def test_product_destination_rejects_unsafe_slugs(self) -> None:
        for slug in ("../outside", "/tmp/outside", "Uppercase", "two--hyphens"):
            with self.subTest(slug=slug):
                with self.assertRaises(ValueError):
                    publish_product._product_destination(slug, "snapshot-20260802")
                with self.assertRaises(ValueError):
                    publish_product._product_destination("safe-event", slug)

    def test_product_destination_rejects_symlink_escape(self) -> None:
        outside = Path(self.temporary_directory.name) / "outside"
        outside.mkdir()
        (self.root / "events" / "escaped-event").symlink_to(
            outside, target_is_directory=True
        )

        with self.assertRaisesRegex(ValueError, "escapes"):
            publish_product._product_destination(
                "escaped-event", "snapshot-20260802"
            )

    def test_copy_bundle_never_replaces_existing_product(self) -> None:
        bundle = Path(self.temporary_directory.name) / "bundle"
        bundle.mkdir()
        (bundle / "content.html").write_text("new\n", encoding="utf-8")
        (bundle / "manifest.json").write_text("{}\n", encoding="utf-8")
        destination = self.root / "events" / "event" / "products" / "snapshot"
        destination.mkdir(parents=True)
        sentinel = destination / "content.html"
        sentinel.write_text("original\n", encoding="utf-8")

        with self.assertRaises(FileExistsError):
            publish_product._copy_bundle(bundle, destination)

        self.assertEqual(sentinel.read_text(encoding="utf-8"), "original\n")


if __name__ == "__main__":
    unittest.main()
