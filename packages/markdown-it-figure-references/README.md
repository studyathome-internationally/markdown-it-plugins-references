# `markdown-it-figure-references`

> Figure referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

## Installation

```sh
yarn add markdown-it-figure-references
```

or

```sh
npm install markdown-it-figure-references
```

## Usage

```
const md = require("markdown-it")()
  .use(require("markdown-it-figure-references"), opts);
```

<!-- See a [demo as JSFiddle](https://jsfiddle.net/fke71wm4/2/). -->

The `opts` object can contain:

| Name     | Description                                     | Default     |
| -------- | ----------------------------------------------- | ----------- |
| `ns`     | Namespace for saving registered images (`env`). | `"figures"` |
| `wrap`   | Wrap `<image>` in an `<figure>` element.        | `true`      |
| `anchor` | Anchor options.                                 | see below   |
| `label`  | Label options.                                  | see below   |
| `list`   | List options.                                   | see below   |

The `anchor` object can contain:

| Name      | Description                        | Default    |
| --------- | ---------------------------------- | ---------- |
| `enable`  | Insert anchor before figure label. | `true`     |
| `content` | Anchor content.                    | `"§"`      |
| `class`   | Anchor class.                      | `"anchor"` |

The `label` object can contain:

| Name          | Description                                | Default      |
| ------------- | ------------------------------------------ | ------------ |
| `enable`      | Insert figure label before figure caption. | `true`       |
| `text`        | Figure label text.                         | `"Figure #"` |
| `placeholder` | Figure number placeholder.                 | `"#"`        |
| `class`       | Figure label class.                        | `"label"`    |

The `list` object can contain:

| Name     | Description             | Default             |
| -------- | ----------------------- | ------------------- |
| `enable` | Append list of figures. | `true`              |
| `class`  | List of figures class.  | `"list"`            |
| `title`  | List title.             | `"List of Figures"` |
| `tag`    | HTML tag for list.      | `"ol"`              |
| `item`   | List item options       | see below           |

The `item` object can contain:

| Name    | Description                       | Default  |
| ------- | --------------------------------- | -------- |
| `tag`   | HTML tag for list item.           | `"li"`   |
| `href`  | Add target id to list item label. | `true`   |
| `class` | List item class.                  | `"item"` |
| `label` | Insert figure label.              | `true`   |
| `title` | Insert figure title.              | `true`   |

## License

[GPL-3.0](https://github.com/studyathome-internationally/vuepress-plugins/blob/master/LICENSE) &copy; [StudyATHome Internationally](https://github.com/studyathome-internationally/)
