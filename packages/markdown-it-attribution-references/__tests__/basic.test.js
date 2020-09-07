const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributeReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("basic functionality", function () {
  it("automatic id", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="attribution-container">
        <p>
          <a href="#wikipedia-authors-markdown" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
      </div>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("manual id", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.2.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki-markdown" class="attribution-container">
        <p>
          <a href="#wiki-markdown" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
      </div>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wiki-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("multiple attributions", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.3.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <h2>Markdown</h2>
      <div id="wikipedia-authors-markdown" class="attribution-container">
        <p>
          <a href="#wikipedia-authors-markdown" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
      </div>
      <h2>AsciiDoc</h2>
      <div id="wikipedia-authors-asciidoc" class="attribution-container">
        <p>
          <a href="#wikipedia-authors-asciidoc" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&oldid=966786456">AsciiDoc</a> by <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
        <div>
          <p>AsciiDoc is a human-readable document format, semantically equivalent to DocBook XML, but using plain-text mark-up conventions.
            AsciiDoc documents can be created using any text editor and read “as-is”, or rendered to HTML or any other format supported by a DocBook tool-chain, i.e. PDF, TeX, Unix manpages, e-books, slide presentations, etc.</p>
        </div>
      </div>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
        <li><a href="#wikipedia-authors-asciidoc">Attribution 2</a>: AsciiDoc</li>
      </ol>
    `);
  });
});
