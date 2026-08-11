# APHR Event Briefings GitHub Pages structure

Suggested repository structure:

```
index.html
/events/
  /philippines-kablalan-2026/
    index.html
  /california-redwood-valley-2026/
    index.html
  /venezuela-yumare-2026/
    index.html
  /japan-uto-kumamoto-2026/
    index.html
```

After uploading these files to the same GitHub Pages repository, the URLs will be:

- Main APHR event page: `https://k-mosalam.github.io/aphr-briefings/`
- Philippines event: `https://k-mosalam.github.io/aphr-briefings/events/philippines-kablalan-2026/`
- California event: `https://k-mosalam.github.io/aphr-briefings/events/california-redwood-valley-2026/`
- Venezuela event: `https://k-mosalam.github.io/aphr-briefings/events/venezuela-yumare-2026/`
- Japan Uto–Kumamoto event: `https://k-mosalam.github.io/aphr-briefings/events/japan-uto-kumamoto-2026/`

## Acknowledgments

This work is supported by the [StEER Network](https://www.steer.network/)
through the [National Science Foundation](https://www.nsf.gov/) under Grant No.
CMMI 2103550 and by the Taisei Chair of Civil Engineering at the University of
California, Berkeley.

<a href="https://www.newscatcherapi.com/">
  <img src="assets/images/newscatcher-black.png" width="280" alt="NewsCatcher">
</a>

APHR's textual evidence pipeline uses the NewsCatcher News API to discover and
retrieve timely, source-attributed news coverage following hazard events. We
gratefully acknowledge the NewsCatcher team for providing academic API access,
which has made this research on automated, evidence-grounded virtual
reconnaissance possible.

Recommended Git commands:

```bash
git pull
mkdir -p events/philippines-kablalan-2026 events/california-redwood-valley-2026 events/venezuela-yumare-2026
cp index.html ./index.html
cp events/philippines-kablalan-2026/index.html ./events/philippines-kablalan-2026/index.html
cp events/california-redwood-valley-2026/index.html ./events/california-redwood-valley-2026/index.html
cp events/venezuela-yumare-2026/index.html ./events/venezuela-yumare-2026/index.html
git add index.html events/
git commit -m "Add APHR event landing page and earthquake briefings"
git push
```
