# `markdown-it-attribution-references`

> Attributions and attribution referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

## Usage

```
const md = require("markdown-it")()
  .use(require("markdown-it-attribution-references"), opts);
```

<!-- See a [demo as JSFiddle](). -->

The `opts` object can contain:

| Name              | Description                                           | Default                                 |
| ----------------- | ----------------------------------------------------- | --------------------------------------- |
| `ns`              | Namespace for saving registered attributions (`env`). | `"attributions"`                        |
| `list`            | Render list of attributions.                          | `true`                                  |
| `listTitle`       | Title of list of attributions.                        | `"List of Attributions"`                |
| `listTag`         | HTML tag for used for list (of attributions).         | `"ol"`                                  |
| `label`           | Item label.                                           | `"Attribution"`                         |
| `wrapTag`         | HTML tag for attribution wrapper.                     | `"div"`                                 |
| `wrapClass`       | CSS class for attribution wrapper.                    | `"attribution-container"`               |
| `terminator`      | Terminator for attribution open/close.                | `":::"`                                 |
| `terminatorLabel` | Terminator followed by attribution open.              | `"attribution"`                         |
| `licenses`        | Array of licsense objects.                            | `[ { id, short, name, version, url } ]` |

The licsense objects can contain:

| Name      | Description                       | Example                           |
| --------- | --------------------------------- | --------------------------------- |
| `id`      | Identifier used for attributions. | `"cc-by"`                         |
| `short`   | Short license name.               | `"CC BY"`                         |
| `name`    | Full license name.                | `"Creative Commons: Attribution"` |
| `version` | License Version.                  | `"4.0"`                           |
| `url`     | License related URLs.             | `{ deeds, legalCode }`            |

An extensive list of possible license agreements can be found at [Comparison of free and open-source software licences](https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licences).
