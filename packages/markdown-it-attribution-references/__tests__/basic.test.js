const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributeReferences = require("./../index.js");

describe("basic functionality", function () {
  it("automatic id", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, {
      db: [
        {
          key: "wiki:markdown",
          author: "Wikipedia Authors",
          authorUrl: "https://en.wikipedia.org/w/index.php?title=Markdown&action=history",
          title: "Markdown",
          titleUrl: "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292",
          license: "cc-by-sa"
        }
      ]
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("manual id", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.2.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki-markdown" class="anchor">§</a><a href="#wiki-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wiki-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("multiple attributions", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.3.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <h2>Markdown</h2>
      <div id="wikipedia-authors-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2>AsciiDoc</h2>
      <div id="wikipedia-authors-asciidoc" class="parent">
        <div class="child">
          <p>AsciiDoc is a human-readable document format, semantically equivalent to DocBook XML, but using plain-text mark-up conventions.
            AsciiDoc documents can be created using any text editor and read “as-is”, or rendered to HTML or any other format supported by a DocBook tool-chain, i.e. PDF, TeX, Unix manpages, e-books, slide presentations, etc.</p>
        </div>
        <p><a href="#wikipedia-authors-asciidoc" class="anchor">§</a><a href="#wikipedia-authors-asciidoc" class="label">Attribution 2</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;oldid=966786456">AsciiDoc</a> by <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
        <li class="item"><a href="#wikipedia-authors-asciidoc" class="label">Attribution 2</a>: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;oldid=966786456">AsciiDoc</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("nested attributions", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.4.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <h2>Markdown</h2>
      <div id="wikipedia-authors-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
          <div id="wikipedia-authors-markdown-logo" class="parent">
            <div class="child">
              <p><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Markdown.png" alt="Markdown Logo" title="Markdown Logo" /></p>
            </div>
            <p><a href="#wikipedia-authors-markdown-logo" class="anchor">§</a><a href="#wikipedia-authors-markdown-logo" class="label">Attribution 2</a><span>Based on: <a href="https://upload.wikimedia.org/wikipedia/commons/d/d9/Markdown.png">Markdown Logo</a> by <a href="https://commons.wikimedia.org/wiki/File:Markdown.png">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
          </div>
          <p>Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
        <li class="item"><a href="#wikipedia-authors-markdown-logo" class="label">Attribution 2</a>: <a href="https://upload.wikimedia.org/wikipedia/commons/d/d9/Markdown.png">Markdown Logo</a> (By: <a href="https://commons.wikimedia.org/wiki/File:Markdown.png">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("multiple usage of same attribution", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.5.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki-markdown" class="anchor">§</a><a href="#wiki-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <p>Small break.</p>
      <div id="wiki-markdown" class="parent">
        <div class="child">
          <p>Since the initial description of Markdown contained ambiguities and unanswered questions, the implementations that appeared over the years have subtle differences and many come with syntax extensions.</p>
        </div>
        <p><a href="#wiki-markdown" class="anchor">§</a><a href="#wiki-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wiki-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });
});
