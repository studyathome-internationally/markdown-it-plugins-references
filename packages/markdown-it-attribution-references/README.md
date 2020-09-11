# `markdown-it-attribution-references`

> Attributions and attribution referencing for [markdown-it](https://github.com/markdown-it/markdown-it).

<div>
  <p align="center">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-attribution-references/coverage/badge-branches.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-attribution-references/coverage/badge-functions.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-attribution-references/coverage/badge-lines.svg">
    <img src="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-attribution-references/coverage/badge-statements.svg">
    <a href="https://raw.githubusercontent.com/studyathome-internationally/markdown-it-plugins/master/packages/markdown-it-attribution-references/LICENSE" target="_blank">
      <img src="https://badgen.net/github/license/studyathome-internationally/markdown-it-plugins">
    </a>
  </p>
</div>


## Installation

```sh
yarn add markdown-it-attribution-references
```

or

```sh
npm install markdown-it-attribution-references
```


## Usage

```js
const md = require("markdown-it")()
  .use(require("markdown-it-attribution-references"), opts);
```

<!-- See a [demo as JSFiddle](https://jsfiddle.net/ezg50hj7/1/). -->
<style>
table { width: 100%;} td:first-child {width: 15%;} td:last-child {width: 45%;}
</style>

The `opts` object can contain:

| Name          | Description                                           | Default          |
| ------------- | ----------------------------------------------------- | ---------------- |
| `ns`          | Namespace for saving registered attributions (`env`). | `"attributions"` |
| `wrap`        | Wrapper options.                                      | see below        |
| `anchor`      | Anchor options.                                       | see below        |
| `label`       | Label options.                                        | see below        |
| `list`        | List options.                                         | see below        |
| `attribution` | Attribution options.                                  | see below        |

<br/>

The `wrap` object can contain:

| Name     | Description             | Default   |
| -------- | ----------------------- | --------- |
| `parent` | Parent wrapper options. | see below |
| `child`  | Child wrapper options.  | see below |


<br/>

The `parent` object can contain:

| Name    | Description           | Default    |
| ------- | --------------------- | ---------- |
| `tag`   | HTML tag for parent.  | `"div"`    |
| `class` | Parent wrapper class. | `"parent"` |

<br/>

The `child` object can contain:

| Name     | Description              | Default   |
| -------- | ------------------------ | --------- |
| `enable` | Wrap attributed content. | `true`    |
| `tag`    | HTML tag for child.      | `"div"`   |
| `class`  | Child wrapper class.     | `"child"` |

<br/>

The `anchor` object can contain:

| Name      | Description                             | Default    |
| --------- | --------------------------------------- | ---------- |
| `enable`  | Insert anchor before attribution label. | `true`     |
| `content` | Anchor content.                         | `"§"`      |
| `class`   | Anchor class.                           | `"anchor"` |

<br/>

The `label` object can contain:

| Name          | Description                                     | Default           |
| ------------- | ----------------------------------------------- | ----------------- |
| `enable`      | Insert attribution label before figure caption. | `true`            |
| `text`        | Attribution label text.                         | `"Attribution #"` |
| `placeholder` | Attribution number placeholder.                 | `"#"`             |
| `class`       | Attribution label class.                        | `"label"`         |

<br/>

The `list` object can contain:

| Name     | Description                  | Default                  |
| -------- | ---------------------------- | ------------------------ |
| `enable` | Append list of attributions. | `true`                   |
| `class`  | List of attributions class.  | `"list"`                 |
| `title`  | List title.                  | `"List of Attributions"` |
| `tag`    | HTML tag for list.           | `"ol"`                   |
| `item`   | List item options            | see below                |

<br/>

The `item` object can contain:

| Name    | Description                       | Default                               |
| ------- | --------------------------------- | ------------------------------------- |
| `tag`   | HTML tag for list item.           | `"li"`                                |
| `href`  | Add target id to list item label. | `true`                                |
| `class` | List item class.                  | `"item"`                              |
| `label` | Insert attribution label.         | `true`                                |
| `text`  | List title pattern.               | `"<title> (By: <author>, <license>)"` |

<br/>

The `attribution` object can contain:

| Name         | Description                                                   | Default                                               |
| ------------ | ------------------------------------------------------------- | ----------------------------------------------------- |
| `top`        | Insert attribution at top, before child (attributed content). | `false`                                               |
| `terminator` | Terminator for attribution open/close.                        | `":::"`                                               |
| `label`      | Terminator followed by attribution open.                      | `"attribution"`                                       |
| `text`       | Attribution title pattern.                                    | `"Based on: <title> by <author>, License: <license>"` |
| `licenses`   | Array of licsense objects.                                    | `[ see below ]`                                       |

<br/>

Each license objects can contain:

| Name      | Description                       | Example                           |
| --------- | --------------------------------- | --------------------------------- |
| `id`      | Identifier used for attributions. | `"cc-by"`                         |
| `short`   | Short license name.               | `"CC BY"`                         |
| `name`    | Full license name.                | `"Creative Commons: Attribution"` |
| `version` | License Version.                  | `"4.0"`                           |
| `url`     | License related URLs.             | `{ deeds, legalCode }`            |

An extensive list of possible license agreements can be found at [Comparison of free and open-source software licences](https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licences).

## Example

```md
# Markdown

::: attribution cc-by-sa [Markdown](https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292) [Wikipedia Authors](https://en.wikipedia.org/w/index.php?title=Markdown&action=history)

Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

:::
```


```html
<h1>Markdown</h1>
<div id="wikipedia-authors-markdown" class="parent">
  <div class="child">
    <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
      Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
  </div>
  <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
</div>
<h2 id="list-of-attributions" class="list">List of Attributions</h2>
<ol class="list">
  <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></li>
</ol>
```