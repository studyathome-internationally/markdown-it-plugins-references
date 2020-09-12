# `markdown-it-table-references`

> Table referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

<div>
  <p align="center">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-table-references/coverage/badge-branches.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-table-references/coverage/badge-functions.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-table-references/coverage/badge-lines.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-table-references/coverage/badge-statements.svg">
    <a href="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-table-references/LICENSE" target="_blank">
      <img src="https://badgen.net/github/license/studyathome-internationally/markdown-it-plugins">
    </a>
  </p>
</div>

## Installation

```sh
yarn add markdown-it-table-references
```

or

```sh
npm install markdown-it-table-references
```

## Example

```md
# Hello World

| Name  | Client  |
| ----- | ------- |
| Alice | Mobile  |
| Bob   | Desktop |

.Client overview
```

```html
<h1>Hello World</h1>
<figure id="client-overview">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Client</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice</td>
        <td>Mobile</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>Desktop</td>
      </tr>
    </tbody>
  </table>
  <figcaption>
    <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
  </figcaption>
</figure>
<h2 id="list-of-tables" class="list">List of Tables</h2>
<ol class="list">
  <li class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
</ol>
```

Plain HTML figures and tables are supported too.

```md
# Hello World

<figure id="client-overview">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Client</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice</td>
        <td>Mobile</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>Desktop</td>
      </tr>
    </tbody>
  </table>
  <figcaption>Client overview</figcaption>
</figure>
```

```html
<h1>Hello World</h1>
<figure id="client-overview">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Client</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice</td>
        <td>Mobile</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>Desktop</td>
      </tr>
    </tbody>
  </table>
  <figcaption>
    <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
  </figcaption>
</figure>
<h2 id="list-of-tables" class="list">List of Tables</h2>
<ol class="list">
  <li class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
</ol>
```

## Usage

```js
const md = require("markdown-it")().use(require("markdown-it-table-references"), opts);
```

See a [demo as JSFiddle](https://jsfiddle.net/mx7c9bfq/).

<style>
table { width: 100%;} td:first-child {width: 15%;} td:last-child {width: 45%;}
</style>

The `opts` object can contain:

| Name     | Description                                     | Default    |
| -------- | ----------------------------------------------- | ---------- |
| `after`  | Rule name to insert new rules after.            | `false`    |
| `ns`     | Namespace for saving registered tables (`env`). | `"tables"` |
| `wrap`   | Wrap `<table>` in `<figure>` element.           | `true`     |
| `anchor` | Anchor options.                                 | see below  |
| `label`  | Label options.                                  | see below  |
| `list`   | List options.                                   | see below  |

<br/>

The `anchor` object can contain:

| Name      | Description                       | Default    |
| --------- | --------------------------------- | ---------- |
| `enable`  | Insert anchor before table label. | `true`     |
| `content` | Anchor content.                   | `"§"`      |
| `class`   | Anchor class.                     | `"anchor"` |

<br/>

The `label` object can contain:

| Name          | Description                               | Default     |
| ------------- | ----------------------------------------- | ----------- |
| `enable`      | Insert table label before figure caption. | `true`      |
| `text`        | Table label text.                         | `"Table #"` |
| `placeholder` | Table number placeholder.                 | `"#"`       |
| `class`       | Table label class.                        | `"label"`   |

<br/>

The `list` object can contain:

| Name     | Description            | Default            |
| -------- | ---------------------- | ------------------ |
| `enable` | Append list of tables. | `true`             |
| `class`  | List of tables class.  | `"list"`           |
| `title`  | List title.            | `"List of Tables"` |
| `tag`    | HTML tag for list.     | `"ol"`             |
| `item`   | List item options      | see below          |

<br/>

The `item` object can contain:

| Name    | Description                       | Default  |
| ------- | --------------------------------- | -------- |
| `tag`   | HTML tag for list item.           | `"li"`   |
| `href`  | Add target id to list item label. | `true`   |
| `class` | List item class.                  | `"item"` |
| `label` | Insert table label.               | `true`   |
| `title` | Insert table title.               | `true`   |

<br/>

## License

[GPL-3.0](https://github.com/studyathome-internationally/vuepress-plugins/blob/master/LICENSE) &copy; [StudyATHome Internationally](https://github.com/studyathome-internationally/)
