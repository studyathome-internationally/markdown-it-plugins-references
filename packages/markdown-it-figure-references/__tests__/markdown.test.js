const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("markdown-it handling", () => {
  it("reload rule", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences);
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div id="the-stormtroopocat"
             class="figure-wrapper"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat-img"
            >
            <figcaption>
              <a href="#the-stormtroopocat">
                Figure 1
              </a>
              : The Stormtroopocat
            </figcaption>
          </figure>
        </div>
      </p>
      <h2 id="list-of-figures">
        List of Figures
      </h2>
      <ol class="list-of-figures-list">
        <li>
          <a href="#the-stormtroopocat">
            Figure 1
          </a>
          : The Stormtroopocat
        </li>
      </ol>
    `);
  });
});
