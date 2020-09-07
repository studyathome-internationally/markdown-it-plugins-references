const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("basic functionality", () => {
  it("automatic id insertion", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <div id="the-stormtroopocat" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat-img" />
          <figcaption>
            <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
          </figcaption>
        </figure>
      </div>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });
  it("manual id insertion", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.2.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <div id="trooper" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="trooper-img" />
          <figcaption>
            <a href="#trooper">Figure 1</a>: The Stormtroopocat
          </figcaption>
        </figure>
      </div>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#trooper">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });
  it("multiple images", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.3.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <div id="the-stormtroopocat" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat-img" />
          <figcaption>
            <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
          </figcaption>
        </figure>
      </div>
      </p>
      <p>
      <div id="minion" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/minion.png" alt="Minion" title="The Minion" id="minion-img" />
          <figcaption>
            <a href="#minion">Figure 2</a>: The Minion
          </figcaption>
        </figure>
      </div>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
        <li><a href="#minion">Figure 2</a>: The Minion</li>
      </ol>
    `);
  });
});
