const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });
md.use(require("markdown-it-figure-references"), {
  list: false,
  wrapImage: false,
});

describe("markdown-it handling", () => {
  it("reload rule", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.figure.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginReferences);
    md.use(MarkdownItPluginReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>References</h1>
      <p><img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat" /></p>
      <p><a href="#the-stormtroopocat">Figure 1</a> shows an example.</p>
    `);
  });
});
