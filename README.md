# Statement Builder

A single-page, no-build browser tool for designing structured
FUJITSU/BS2000-style statement schemas (operands with typed values) and
interactively building the resulting terminal statement text from them.
Designed statements can be exported to DOCX and HTML.

## Running it

There is no build step, bundler, or dependency manager. Just open
`index.html` directly in a browser, or serve the folder with any static file
server. (JSZip is loaded from a CDN for DOCX export.)

## Layout

The window is split into two columns:

- **Left — schema builder.** Define the statement's operands, each with one
  or more typed values, plus optional descriptions.
- **Right — interactive form + generated output.** Pick values in the form
  and the terminal-ready statement text is generated live below it.

## Value kinds

Each value on an operand has one of four kinds:

- **keyword** — a fixed token (e.g. `*ANY`).
- **simple** — one of the predefined typed placeholders (`<filename ...>`,
  `<integer ...>`, `<vsn 1..6>`, ...).
- **nested** — a `(...)` group containing its own sub-operands, so the schema
  is a recursive tree.
- **list** — `list-poss(N)` of a simple type.

Any value can be marked as the **default** (rendered underlined in the
exports).

## Editing features

- **Drag and drop** to reorder operands and values (dropping a nested operand
  into its own subtree is prevented).
- **Duplicate** buttons for operands and values.
- **Undo / redo** of schema edits, including `Ctrl+Z` / `Ctrl+Y`
  (and `Ctrl+Shift+Z`). Rapid edits collapse into a single undo step.
- **Descriptions** for operands and values, edited through a modal.
- **Collapse / expand** of operands, tracked independently for the builder
  and the form.

## Output

The generated statement text updates live from the current schema and form
selections and can be copied with a one-click **Copy** button.

## Save / Load

`Save` downloads the whole app state (statement name, schema, and form
selections) as a `.json` file; `Load` restores it. A built-in
**RESTORE-FILES** example can be loaded at any time.

## Exports

Both exports render the designed statement followed by a **Parameter
Descriptions** section (only operands/values that have a description, or a
described descendant, are listed):

- **Export DOCX** — a Word document built as minimal OOXML (no external docx
  library), zipped with JSZip.
- **Export HTML** — a standalone HTML document with inline styling.

