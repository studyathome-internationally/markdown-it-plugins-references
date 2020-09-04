# `markdown-it-figure-references`

> TODO: description

## Usage

```
const md = require("markdown-it")()
  .use(require("markdown-it-figure-references"), opts);
```

See a [demo as JSFiddle](https://jsfiddle.net/h3aocxry/8/).

The `opts` object can contain:

| Name          | Description                                                    | Default             |
| ------------- | -------------------------------------------------------------- | ------------------- |
| `list`        | Render list of figures.                                        | `true`              |
| `listTitle`   | Title of list of figures.                                      | `"List of Figures"` |
| `listTag`     | HTML tag for used for list (of figures).                       | `"ol"`              |
| `label`       | Item label.                                                    | `"Figure"`          |
| `wrapImage`   | Wrap image in container (incl. `<figure>` and `<figcaption>`). | `true`              |
| `wrapTag`     | HTML tag for image wrapper.                                    | `"div"`             |
| `injectLabel` | Inject label in image wrapper.                                 | `true`              |
