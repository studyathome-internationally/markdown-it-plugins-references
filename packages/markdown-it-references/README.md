# `markdown-it-references`

> Ordered reference injection for [markdown-it](https://github.com/markdown-it/markdown-it).

## Usage

Requires one of following packages (or similar) in conjunction:

- [markdown-it-figure-references](https://www.npmjs.com/package/markdown-it-figure-references)
- [markdown-it-table-references](https://www.npmjs.com/package/markdown-it-table-references)
- [markdown-it-attribution-references](https://www.npmjs.com/package/markdown-it-attribution-references).

```
// Figures
const md = require("markdown-it")()
  .use(require("markdown-it-figure-references), { ns: "figures" })
  .use(require("markdown-it-references"), opts);

// Tables
const md = require("markdown-it")()
  .use(require("markdown-it-table-references), { ns: "tables" })
  .use(require("markdown-it-references"), opts);

// Attributions
const md = require("markdown-it")()
  .use(require("markdown-it-attribution-references), { ns: "attributions" })
  .use(require("markdown-it-references"), opts);
```

See a [demo as JSFiddle](https://jsfiddle.net/w2r6gkoc/1/).

| Name     | Description                                        | Default                                                                           |
| -------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `labels` | Array of arrays of namespace (ns) and label pairs. | `[ ["figures", "Figure"], ["tables", "Table"], ["attributions", "Attribution"] ]` |

**NOTE**  
Label order resolves naming conflicts.
However, the same id shouldn't occur in the same document more than once.
