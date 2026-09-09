## Why

The Codelabs view lets users study local Jupyter notebooks alongside guides, but its contract (accepted input, what renders, what is explicitly not rendered, and the Skills Boost entry point) is unspecified. A `codelabs` capability spec pins that behavior so future notebook-handling changes stay predictable and backend-free.

## What Changes

- Specify `.ipynb` upload: local file parsing, cell-count header, and error states for non-notebook JSON and unreadable files.
- Specify rendering: markdown cells (headings, inline code/bold/italic/links, code fences, lists), code cells as preformatted blocks, and text outputs (stream, error, `text/plain`).
- Specify the rich-output notice: images/HTML outputs are acknowledged but not rendered.
- Specify the Skills Boost template link (course template 878) as the external lab entry point.

## Capabilities

### New Capabilities

- `codelabs`: local Jupyter notebook upload and markdown/code/text-output rendering with rich-output notice and Skills Boost link.

### Modified Capabilities

(none — greenfield spec capturing existing behavior)

## Impact

- Spec-only change; no code edits. Grounds: `src/presentation/components/CodelabsView.tsx`.
- Assumptions: all processing is in-memory client-side with no backend or persistence (reloading clears the notebook); error banner is dismissible; markdown support is the view's mini-renderer subset, not full CommonMark.
