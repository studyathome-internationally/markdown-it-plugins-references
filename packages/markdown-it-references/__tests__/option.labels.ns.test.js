const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginReferences = require("../index.js");

describe("option: labels - ns", () => {
  it("figure namespace", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.figure.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"), { ns: "images" });
    md.use(require("markdown-it-table-references"), { ns: "spreadsheets" });
    md.use(require("markdown-it-attribution-references"), { ns: "references" });
    md.use(MarkdownItPluginReferences, {
      labels: [
        { ns: "images", text: "Figure #", placeholder: "#", class: "figure-reference" },
        { ns: "spreadsheets", text: "Table #", placeholder: "#", class: "table-reference" },
        { ns: "references", text: "Attribution #", placeholder: "#", class: "attribution-reference" },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <p><a href="#the-stormtroopocat" class="figure-reference">Figure 1</a> shows an example.</p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("table namespace", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.table.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"), { ns: "images" });
    md.use(require("markdown-it-table-references"), { ns: "spreadsheets" });
    md.use(require("markdown-it-attribution-references"), { ns: "references" });
    md.use(MarkdownItPluginReferences, {
      labels: [
        { ns: "images", text: "Figure #", placeholder: "#", class: "figure-reference" },
        { ns: "spreadsheets", text: "Table #", placeholder: "#", class: "table-reference" },
        { ns: "references", text: "Attribution #", placeholder: "#", class: "attribution-reference" },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
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
      <p><a href="#client-overview" class="table-reference">Table 1</a> shows an example.</p>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("attribution namespace", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.attribution.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"), { ns: "images" });
    md.use(require("markdown-it-table-references"), { ns: "spreadsheets" });
    md.use(require("markdown-it-attribution-references"), {
      ns: "references",
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
        { ns: "images", text: "Figure #", placeholder: "#", class: "figure-reference" },
        { ns: "spreadsheets", text: "Table #", placeholder: "#", class: "table-reference" },
        { ns: "references", text: "#", placeholder: "#", class: "attribution-reference" },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <p>[<a href="#wiki_markdown" class="attribution-reference">1</a>] shows an example.</p>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });
});
