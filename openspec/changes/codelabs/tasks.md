## 1. Upload and rendering

- [ ] 1.1 Verify a valid `.ipynb` upload renders all cells with the file-name/cell-count header, and that files without a `cells` array or with unparseable JSON show the correct dismissible error without partial rendering.
- [ ] 1.2 Verify markdown (headings, inline styles/links, fences, lists), code blocks, and stream/error/`text/plain` outputs render, while image/HTML-only outputs show the rich-output notice.
- [ ] 1.3 Verify the Skills Boost template link is present beside the upload control and opens the course template 878 URL in a new tab, and that reloading clears the notebook (in-memory only).
- [ ] 1.4 Run `openspec validate --specs` and confirm it passes after the sync.
