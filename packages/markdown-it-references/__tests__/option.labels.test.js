const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginReferences = require("./../index.js");

describe("option: labels", () => {
  it("text", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.multi.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"), {
      label: { text: "Image #" },
      list: { title: "List of Images" },
    });
    md.use(require("markdown-it-table-references"), {
      label: { text: "Spreadsheet #" },
      list: { title: "List of Spreadsheets" },
    });
    md.use(require("markdown-it-attribution-references"), {
      list: { title: "List of References" },
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    md.use(MarkdownItPluginReferences, {
      labels: [
        { ns: "figures", text: "Image #", placeholder: "#", class: "figure-reference" },
        { ns: "tables", text: "Spreadsheet #", placeholder: "#", class: "table-reference" },
        { ns: "attributions", text: "Reference #", placeholder: "#", class: "attribution-reference" },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Image 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
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
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Spreadsheet 1</a>: Client overview
        </figcaption>
      </figure>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <p>The example contains following references: <a href="#the-stormtroopocat" class="figure-reference">Image 1</a>, <a href="#client-overview" class="table-reference">Spreadsheet 1</a>, [<a href="#wiki_markdown" class="attribution-reference">Reference 1</a>].</p>
      <h2 id="list-of-figures" class="list">List of Images</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Image 1</a>: The Stormtroopocat</li>
      </ol>
      <h2 id="list-of-tables" class="list">List of Spreadsheets</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Spreadsheet 1</a>: Client overview</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of References</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("class", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.multi.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"), {
      label: { text: "Image #" },
      list: { title: "List of Images" },
    });
    md.use(require("markdown-it-table-references"), {
      label: { text: "Spreadsheet #" },
      list: { title: "List of Spreadsheets" },
    });
    md.use(require("markdown-it-attribution-references"), {
      list: { title: "List of References" },
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    md.use(MarkdownItPluginReferences, {
      labels: [
        { ns: "figures", text: "Figure #", placeholder: "#", class: "reference" },
        { ns: "tables", text: "Table #", placeholder: "#", class: "reference" },
        { ns: "attributions", text: "#", placeholder: "#", class: "reference" },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Image 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
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
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Spreadsheet 1</a>: Client overview
        </figcaption>
      </figure>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <p>The example contains following references: <a href="#the-stormtroopocat" class="reference">Figure 1</a>, <a href="#client-overview" class="reference">Table 1</a>, [<a href="#wiki_markdown" class="reference">1</a>].</p>
      <h2 id="list-of-figures" class="list">List of Images</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Image 1</a>: The Stormtroopocat</li>
      </ol>
      <h2 id="list-of-tables" class="list">List of Spreadsheets</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Spreadsheet 1</a>: Client overview</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of References</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("renderer", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.multi.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"), {
      label: { text: "Image #" },
      list: { title: "List of Images" },
    });
    md.use(require("markdown-it-table-references"), {
      label: { text: "Spreadsheet #" },
      list: { title: "List of Spreadsheets" },
    });
    md.use(require("markdown-it-attribution-references"), {
      list: { title: "List of References" },
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    md.use(MarkdownItPluginReferences, {
      labels: [
        {
          ns: "figures",
          text: "Figure #",
          placeholder: "#",
          class: "figure-reference",
          renderer: (id, className, text, placeholder, index) => `[<a ${id ? `href="#${id}"` : ""}>${index}</a>]`,
        },
        {
          ns: "tables",
          text: "Table #",
          placeholder: "#",
          class: "table-reference",
          renderer: (id, className, text, placeholder, index) => `[<a ${id ? `href="#${id}"` : ""}>${index}</a>]`,
        },
        {
          ns: "attributions",
          text: "Attribution #",
          placeholder: "#",
          class: "attribution-reference",
          renderer: (id, className, text, placeholder, index) => `<a ${id ? `href="#${id}"` : ""}>${index}</a>`,
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Image 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
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
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Spreadsheet 1</a>: Client overview
        </figcaption>
      </figure>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <p>The example contains following references: [<a href="#the-stormtroopocat">1</a>], [<a href="#client-overview">1</a>], [<a href="#wiki_markdown">1</a>].</p>
      <h2 id="list-of-figures" class="list">List of Images</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Image 1</a>: The Stormtroopocat</li>
      </ol>
      <h2 id="list-of-tables" class="list">List of Spreadsheets</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Spreadsheet 1</a>: Client overview</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of References</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });
});
