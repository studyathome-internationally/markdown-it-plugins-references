const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributeReferences = require("./../index.js");

describe("option: attribution wrap", () => {
  it("null", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences,
      {
        attribution: {
          wrap: null
        },
        sources: [
          {
            key: "wiki:markdown",
            author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
            title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
            license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
          }
        ]
      }
    );
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

  it("parent - tag", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences,
      {
        attribution: {
          wrap: { parent: { tag: "section" } }
        },
        sources: [
          {
            key: "wiki:markdown",
            author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
            title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
            license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
          }
        ]
      }
    );
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <section id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </section>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("parent - class", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences,
      {
        attribution: {
          wrap: { parent: { class: "root" } }
        },
        sources: [
          {
            key: "wiki:markdown",
            author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
            title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
            license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
          }
        ]
      }
    );
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="root">
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

  it("child - enable", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences,
      {
        attribution: {
          wrap: { child: { enable: false } }
        },
        sources: [
          {
            key: "wiki:markdown",
            author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
            title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
            license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
          }
        ]
      }
    );
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
          Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("child - tag", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences,
      {
        attribution: {
          wrap: { child: { tag: "section" } }
        },
        sources: [
          {
            key: "wiki:markdown",
            author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
            title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
            license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
          }
        ]
      }
    );
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <section class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </section>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">1</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="wiki_markdown" class="item"><span class="label">[1]</span>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292" class="title">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history" class="author">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" class="license">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });

  it("child - class", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences,
      {
        attribution: {
          wrap: { child: { class: "content" } }
        },
        sources: [
          {
            key: "wiki:markdown",
            author: ["Wikipedia Authors", "https://en.wikipedia.org/w/index.php?title=Markdown&action=history"],
            title: ["Markdown", "https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292"],
            license: ["Creative Commons: Attribution-ShareAlike 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"]
          }
        ]
      }
    );
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="content">
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
});
