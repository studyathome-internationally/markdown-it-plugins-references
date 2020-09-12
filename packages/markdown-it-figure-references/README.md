# `markdown-it-figure-references`

> Figure referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

<div>
  <p align="center">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-figure-references/coverage/badge-branches.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-figure-references/coverage/badge-functions.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-figure-references/coverage/badge-lines.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-figure-references/coverage/badge-statements.svg">
    <a href="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-figure-references/LICENSE" target="_blank">
      <img src="https://badgen.net/github/license/studyathome-internationally/markdown-it-plugins">
    </a>
  </p>
</div>

## Installation

```sh
yarn add markdown-it-figure-references
```

or

```sh
npm install markdown-it-figure-references
```

## Usage

```js
const md = require("markdown-it")()
  .use(require("markdown-it-figure-references"), opts);
```

<!-- See a [demo as JSFiddle](https://jsfiddle.net/fke71wm4/2/). -->

The `opts` object can contain:

| Name     | Description                                     | Default     |
| -------- | ----------------------------------------------- | ----------- |
| `ns`     | Namespace for saving registered images (`env`). | `"figures"` |
| `wrap`   | Wrap `<image>` in a `<figure>` element.         | `true`      |
| `anchor` | Anchor options.                                 | see below   |
| `label`  | Label options.                                  | see below   |
| `list`   | List options.                                   | see below   |

<br/>

The `anchor` object can contain:

| Name      | Description                        | Default    |
| --------- | ---------------------------------- | ---------- |
| `enable`  | Insert anchor before figure label. | `true`     |
| `content` | Anchor content.                    | `"§"`      |
| `class`   | Anchor class.                      | `"anchor"` |

<br/>

The `label` object can contain:

| Name          | Description                                | Default      |
| ------------- | ------------------------------------------ | ------------ |
| `enable`      | Insert figure label before figure caption. | `true`       |
| `text`        | Figure label text.                         | `"Figure #"` |
| `placeholder` | Figure number placeholder.                 | `"#"`        |
| `class`       | Figure label class.                        | `"label"`    |

<br/>

The `list` object can contain:

| Name     | Description             | Default             |
| -------- | ----------------------- | ------------------- |
| `enable` | Append list of figures. | `true`              |
| `class`  | List of figures class.  | `"list"`            |
| `title`  | List title.             | `"List of Figures"` |
| `tag`    | HTML tag for list.      | `"ol"`              |
| `item`   | List item options       | see below           |

<br/>

The `item` object can contain:

| Name    | Description                       | Default  |
| ------- | --------------------------------- | -------- |
| `tag`   | HTML tag for list item.           | `"li"`   |
| `href`  | Add target id to list item label. | `true`   |
| `class` | List item class.                  | `"item"` |
| `label` | Insert figure label.              | `true`   |
| `title` | Insert figure title.              | `true`   |

<br/>

## Example

```md
# Hello World

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")
```

```html
<h1>Hello World</h1>
<p>
  <figure id="the-stormtroopocat">
    <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
    <figcaption>
      <a href="#the-stormtroopocat" class="anchor">§</a>
      <a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
    </figcaption>
  </figure>
</p>
<h2 id="list-of-figures" class="list">List of Figures</h2>
<ol class="list">
  <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
</ol>
```

## License

[GPL-3.0](https://github.com/studyathome-internationally/vuepress-plugins/blob/master/LICENSE) &copy; [StudyATHome Internationally](https://github.com/studyathome-internationally/)
