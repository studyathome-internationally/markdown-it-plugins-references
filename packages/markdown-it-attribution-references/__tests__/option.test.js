const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributeReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("options", () => {
  it("option: list", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, { list: false });
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
    `);
  });

  it("option: listTitle", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, {
      listTitle: "List of References",
    });
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
      <h2 id="list-of-attributions">List of References</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("option: listTitle empty", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, {
      listTitle: "",
    });
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
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("option: listTag", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, { listTag: "ul" });
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
      <ul class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ul>
    `);
  });

  it("option: label", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, { label: "Reference" });
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
        <li><a href="#wikipedia-authors-markdown">Reference 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("option: wrapTag", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, { wrapTag: "section" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <section id="wikipedia-authors-markdown" class="attribution-container">
        <p>
          <a href="#wikipedia-authors-markdown" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span>
        </p>
        <div>
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
      </section>
      <h2 id="list-of-attributions">List of Attributions</h2>
      <ol class="list-of-attributions-list">
        <li><a href="#wikipedia-authors-markdown">Attribution 1</a>: Markdown</li>
      </ol>
    `);
  });

  it("option: terminator", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "option.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, { terminator: "===" });
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

  it("option: terminatorLabel", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "option.2.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, { terminatorLabel: "@" });
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

  it("option: class", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, {
      wrapClass: "reference-container",
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="reference-container">
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

  it("option: licenses", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginAttributeReferences, {
      licenses: [
        {
          id: "cc-by-sa",
          short: "CC BY-SA",
          name: "Creative Commons: Attribution-ShareAlike",
          version: "3.0",
          url: {
            deeds: "https://creativecommons.org/licenses/by-sa/3.0/",
            legalCode:
              "https://creativecommons.org/licenses/by-sa/3.0/legalcode",
          },
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wikipedia-authors-markdown" class="attribution-container">
        <p>
          <a href="#wikipedia-authors-markdown" class="attribution-anchor">#</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons: Attribution-ShareAlike 3.0</a></span>
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
});
