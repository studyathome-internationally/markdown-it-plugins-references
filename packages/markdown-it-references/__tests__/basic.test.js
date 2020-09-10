const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginReferences = require("../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });
md.use(require("markdown-it-figure-references"));
md.use(require("markdown-it-table-references"));
md.use(require("markdown-it-attribution-references"));

describe("basic functionality", () => {
  it("missing id", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p>&lt;&lt;icognito&gt;&gt; is not defined.</p>
    `);
  });

  it("figure label insertion", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.figure.1.md"), "utf8");
    md.use(MarkdownItPluginReferences);
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
      <p><a href="#the-stormtroopocat">Figure 1</a> shows an example.</p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("table label insertion", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.table.1.md"), "utf8");
    md.use(MarkdownItPluginReferences);
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
          <a href="#client-overview">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <p><a href="#client-overview">Table 1</a> shows an example.</p>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("attribution label insertion", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.attribution.1.md"), "utf8");
    md.use(MarkdownItPluginReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <div id="wikipedia-authors-markdown">
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p>
          <span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
      </div>
      <p><a href="#wikipedia-authors-markdown">Attribution 1</a> shows an example.</p>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("mutli label insertion", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.multi.1.md"), "utf8");
    md.use(MarkdownItPluginReferences);
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
          <a href="#client-overview">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <div id="wikipedia-authors-markdown">
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p>
          <span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
      </div>
      <p>The example contains following references: <a href="#the-stormtroopocat">Figure 1</a>, <a href="#client-overview">Table 1</a>, <a href="#wikipedia-authors-markdown">Attribution 1</a>.</p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });
});
