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
