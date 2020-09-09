const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAnchor = require("markdown-it-anchor");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("interoperability", () => {
  it("markdown-it-anchor", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginAnchor, {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "#",
    });
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1 id="hello-world"><a class="header-anchor" href="#hello-world">#</a> Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures"><a class="header-anchor" href="#list-of-figures">#</a> List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });
});
