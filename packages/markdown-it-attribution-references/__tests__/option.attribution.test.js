const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributeReferences = require("./../index.js");

describe("option: attribution", () => {
  it("null", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, { attribution: null });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
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
    `);
  });

  it("top", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, { attribution: { top: true } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="parent">
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></li>
      </ol>
    `);
  });

  it("terminator", () => {
    const text = readFileSync(join(__dirname, "__cases__", "option.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, {
      attribution: { terminator: "===" },
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
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
    `);
  });

  it("label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "option.2.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, {
      attribution: { label: "@" },
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
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
    `);
  });

  it("text", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, {
      attribution: {
        text: "Title: <title>, Author: <author>, License: <license>",
      },
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Title: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a>, Author: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></li>
      </ol>
    `);
  });

  it("text (empty)", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, { attribution: { text: "" } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></li>
      </ol>
    `);
  });

  it("licenses", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributeReferences, {
      attribution: {
        licenses: [
          {
            id: "cc-by-sa",
            short: "CC BY-SA",
            name: "Creative Commons: Attribution-ShareAlike",
            version: "3.0",
            url: {
              deeds: "https://creativecommons.org/licenses/by-sa/3.0/",
              legalCode: "https://creativecommons.org/licenses/by-sa/3.0/legalcode",
            },
          },
        ],
      },
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons: Attribution-ShareAlike 3.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons: Attribution-ShareAlike 3.0</a></li>
      </ol>
    `);
  });
});
