# `markdown-it-table-references`

> Table referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

## Usage

```
const md = require("markdown-it")()
  .use(require("markdown-it-table-references"), opts);
```

See a [demo as JSFiddle](https://jsfiddle.net/sbhfd0tg/3/).

The `opts` object can contain:

| Name          | Description                                                    | Default            |
| ------------- | -------------------------------------------------------------- | ------------------ |
| `ns`          | Namespace for saving registered tables (`env`).                | `"tables"`         |
| `list`        | Render list of tables.                                         | `true`             |
| `listTitle`   | Title of list of tables.                                       | `"List of Tables"` |
| `listTag`     | HTML tag for used for list (of tables).                        | `"ol"`             |
| `label`       | Item label.                                                    | `"Table"`          |
| `wrapTable`   | Wrap table in container (incl. `<figure>` and `<figcaption>`). | `true`             |
| `wrapTag`     | HTML tag for table wrapper.                                    | `"div"`            |
| `injectLabel` | Inject label in table wrapper.                                 | `true`             |
