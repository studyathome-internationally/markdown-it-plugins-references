const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginReferences = require("../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });
md.use(require("markdown-it-figure-references"), {
  ns: "images",
});
md.use(require("markdown-it-table-references"), {
  ns: "spreadsheets",
});
md.use(require("markdown-it-attribution-references"), {
  ns: "references",
});

describe("basic functionality", () => {
  it("figure label insertion", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.figure.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginReferences, {
      labels: [
        ["images", "Figure"],
        ["spreadsheets", "Table"],
        ["references", "Attribution"],
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p>
      <div id="the-stormtroopocat" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat-img" />
          <figcaption>
            <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
          </figcaption>
        </figure>
      </div>
      </p>
      <p><a href="#the-stormtroopocat">Figure 1</a> shows an example.</p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("table label insertion", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.table.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginReferences, {
      labels: [
        ["images", "Figure"],
        ["spreadsheets", "Table"],
        ["references", "Attribution"],
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            <a href="#client-overview">Table 1</a>: Client overview
          </figcaption>
        </figure>
      </div>
      <p><a href="#client-overview">Table 1</a> shows an example.</p>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("attribution label insertion", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.attribution.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginReferences, {
      labels: [
        ["images", "Figure"],
        ["spreadsheets", "Table"],
        ["references", "Attribution"],
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <div id="wikipedia-authors-markdown" class="attribution-container">
        <p>
          <a href="#wikipedia-authors-markdown" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
      </div>
      <p><a href="#wikipedia-authors-markdown">Attribution 1</a> shows an example.</p>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });
});
