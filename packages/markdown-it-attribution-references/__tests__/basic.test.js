const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributionReferences = require("./../index.js");

describe("basic functionality", function () {
  it("basic example", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
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
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("multiple usage of same attribution", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.2.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <div id="wiki_markdown__2" class="parent">
        <div class="child">
          <p>Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__2" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("multiple attributions", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.3.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
        {
          key: "wiki:asciidoc",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=AsciiDoc&action=history"],
          title: ["AsciiDoc", "https://en.wikipedia.org/w/index.php?title=AsciiDoc&oldid=966786456"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <h2>Markdown</h2>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2>AsciiDoc</h2>
      <div id="wiki_asciidoc__1" class="parent">
        <div class="child">
          <p>AsciiDoc is a human-readable document format, semantically equivalent to DocBook XML, but using plain-text mark-up conventions.
            AsciiDoc documents can be created using any text editor and read “as-is”, or rendered to HTML or any other format supported by a DocBook tool-chain, i.e. PDF, TeX, Unix manpages, e-books, slide presentations, etc.</p>
        </div>
        <p><a href="#wiki_asciidoc__1" class="anchor">§</a>[<a href="#wiki_asciidoc" class="label">2</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
        <li id="wiki_asciidoc" class="item"><span class="label">[2]</span>: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;oldid=966786456" class="title">AsciiDoc</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("nested attributions", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.4.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
        {
          key: "wiki:markdown-logo",
          author: ["Wikipedia Authors", "https://commons.wikimedia.org/wiki/File:Markdown.png"],
          title: ["Markdown Logo", "https://upload.wikimedia.org/wikipedia/commons/d/d9/Markdown.png"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <h2>Markdown</h2>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
          <div id="wiki_markdown_logo__1" class="parent">
            <div class="child">
              <p><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Markdown.png" alt="Markdown Logo" title="Markdown Logo" /></p>
            </div>
            <p><a href="#wiki_markdown_logo__1" class="anchor">§</a>[<a href="#wiki_markdown_logo" class="label">2</a>]</p>
          </div>
          <p>Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
        <li id="wiki_markdown_logo" class="item"><span class="label">[2]</span>: <a href="https://upload.wikimedia.org/wikipedia/commons/d/d9/Markdown.png" class="title">Markdown Logo</a> (By: <a href="https://commons.wikimedia.org/wiki/File:Markdown.png" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("multiple attributions for single segment", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.5.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
        {
          key: "wiki:asciidoc",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=AsciiDoc&action=history"],
          title: ["AsciiDoc", "https://en.wikipedia.org/w/index.php?title=AsciiDoc&oldid=966786456"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <div id="wiki_markdown_wiki_asciidoc__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
          <p>AsciiDoc is a human-readable document format, semantically equivalent to DocBook XML, but using plain-text mark-up conventions.
            AsciiDoc documents can be created using any text editor and read “as-is”, or rendered to HTML or any other format supported by a DocBook tool-chain, i.e. PDF, TeX, Unix manpages, e-books, slide presentations, etc.</p>
        </div>
        <p><a href="#wiki_markdown_wiki_asciidoc__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>, <a href="#wiki_asciidoc" class="label">2</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
        <li id="wiki_asciidoc" class="item"><span class="label">[2]</span>: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;oldid=966786456" class="title">AsciiDoc</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("key annotation", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.6.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1 (Page 1)</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("key annotation and same key without annotation", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.7.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1 (Page 1)</a>]</p>
      </div>
      <div id="wiki_markdown__2" class="parent">
        <div class="child">
          <p>Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__2" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("multiple attributions for single segment with key annotation", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.8.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
        {
          key: "wiki:asciidoc",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=AsciiDoc&action=history"],
          title: ["AsciiDoc", "https://en.wikipedia.org/w/index.php?title=AsciiDoc&oldid=966786456"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markup</h1>
      <div id="wiki_markdown_wiki_asciidoc__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
          <p>AsciiDoc is a human-readable document format, semantically equivalent to DocBook XML, but using plain-text mark-up conventions.
            AsciiDoc documents can be created using any text editor and read “as-is”, or rendered to HTML or any other format supported by a DocBook tool-chain, i.e. PDF, TeX, Unix manpages, e-books, slide presentations, etc.</p>
        </div>
        <p><a href="#wiki_markdown_wiki_asciidoc__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1 (Page 1)</a>, <a href="#wiki_asciidoc" class="label">2</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
        <li id="wiki_asciidoc" class="item"><span class="label">[2]</span>: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;oldid=966786456" class="title">AsciiDoc</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=AsciiDoc&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("basic example - two paragraphs", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.9.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
          <p>Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("basic example - two paragraphs", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.9.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "wiki:markdown",
          author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
          title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
          license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
          <p>Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });
});
