# codelabs Specification

## Purpose

Local Jupyter notebook study companion: upload `.ipynb` files and read their markdown, code, and text outputs next to the study guides, entirely in memory.

## Requirements

### Requirement: Local notebook upload with clear errors

The system SHALL accept a local `.ipynb` file, parse it as notebook JSON entirely in memory without any backend, show the file name with its cell count, and surface dismissible errors WHEN the file lacks a `cells` array or cannot be parsed as notebook JSON.

#### Scenario: Successful notebook load

- **WHEN** the user uploads a valid `.ipynb` file containing a `cells` array
- **THEN** the system SHALL render its cells and show the file name with the cell count.

#### Scenario: Invalid notebook file

- **WHEN** the uploaded file has no `cells` array or is not parseable as notebook JSON
- **THEN** the system SHALL show a dismissible error explaining the problem and SHALL NOT render partial cells.

#### Scenario: Empty state before upload

- **WHEN** no notebook is loaded and no error is present
- **THEN** the system SHALL show an informational message describing the supported cell types and the rich-output limitation.

### Requirement: Markdown, code, and text-output rendering

The system SHALL render markdown cells (headings, inline code/bold/italic/links, fenced code blocks, bullet and numbered lists, paragraphs), code cells as preformatted blocks, and outputs of type stream (as preformatted text), error (as `ename: evalue`), and `execute_result`/`display_data` carrying `text/plain`.

#### Scenario: Cell types render

- **WHEN** a notebook contains markdown and code cells with stream, error, and `text/plain` outputs
- **THEN** markdown SHALL render as formatted text, code SHALL render as preformatted blocks, and each supported output SHALL render beneath its cell in matching format.

### Requirement: Rich-output notice instead of rendering

The system SHALL NOT attempt to render rich outputs (images, HTML, or other non-`text/plain` MIME data); it SHALL instead show a notice that rich output is not supported in the view.

#### Scenario: Rich output acknowledged without rendering

- **WHEN** a cell output carries only non-`text/plain` data (e.g. images or HTML)
- **THEN** the system SHALL display the rich-output notice in place of the output.

### Requirement: Skills Boost template link

The system SHALL expose an outbound link to the Skills Boost course template (878) alongside the upload control as the external hands-on lab entry point.

#### Scenario: External lab entry point

- **WHEN** the codelabs view renders
- **THEN** it SHALL show the Skills Boost link next to the upload control, opening the template in a new tab.
