# `markdown-it-figure-references`

> Figure referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

## Usage

```
const md = require("markdown-it")()
  .use(require("markdown-it-figure-references"), opts);
```

See a [demo as JSFiddle](https://jsfiddle.net/fke71wm4/2/).

The `opts` object can contain:

| Name          | Description                                     | Default             |
| ------------- | ----------------------------------------------- | ------------------- |
| `ns`          | Namespace for saving registered images (`env`). | `"figures"`         |
| `label`       | Item label.                                     | `"Figure"`          |
| `injectLabel` | Inject label in image wrapper.                  | `true`              |
| `wrap`        | Wrap `<image>` in an `<figure>` element.        | `true`              |
| `list`        | Render list of figures.                         | `true`              |
| `listTitle`   | Title of list of figures.                       | `"List of Figures"` |
| `listTag`     | HTML tag for used for list (of figures).        | `"ol"`              |

