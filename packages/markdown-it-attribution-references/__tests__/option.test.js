const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributeReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("options", () => {
  it("null", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginAttributeReferences, null);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">undefined</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list"></ol>
    `);
  });

  it("ns", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginAttributeReferences, { ns: "references" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Markdown</h1>
      <div id="wiki_markdown__1" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wiki_markdown__1" class="anchor">§</a>[<a href="#wiki_markdown" class="label">undefined</a>]</p>
      </div>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list"></ol>
    `);
  });
});
