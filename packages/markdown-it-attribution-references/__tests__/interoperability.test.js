const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAnchor = require("markdown-it-anchor");
const MarkdownItPluginAttributionReferences = require("./../index.js");

describe("interoperability", () => {
  it("markdown-it-anchor", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginAttributionReferences);
    md.use(MarkdownItPluginAnchor, {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "#",
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1 id="markdown"><a class="header-anchor" href="#markdown">#</a> Markdown</h1>
      <div id="wikipedia-authors-markdown" class="parent">
        <div class="child">
          <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
            Markdown is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
        </div>
        <p><a href="#wikipedia-authors-markdown" class="anchor">§</a><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a><span>Based on: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> by <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, License: <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a></span></p>
      </div>
      <h2 id="list-of-attributions" class="list"><a class="header-anchor" href="#list-of-attributions">#</a> List of Attributions</h2>
      <ol class="list">
        <li class="item"><a href="#wikipedia-authors-markdown" class="label">Attribution 1</a>: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;oldid=975764292">Markdown</a> (By: <a href="https://en.wikipedia.org/w/index.php?title=Markdown&amp;action=history">Wikipedia Authors</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons: Attribution-ShareAlike 4.0</a>)</li>
      </ol>
    `);
  });
});
