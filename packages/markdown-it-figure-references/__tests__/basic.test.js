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
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
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
      <figure id="trooper">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#trooper" class="anchor">§</a><a href="#trooper" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#trooper" class="label">Figure 1</a>: The Stormtroopocat</li>
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
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <p>
      <figure id="minion">
        <img src="https://octodex.github.com/images/minion.png" alt="Minion" title="The Minion" />
        <figcaption>
          <a href="#minion" class="anchor">§</a><a href="#minion" class="label">Figure 2</a>: The Minion
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
        <li class="item"><a href="#minion" class="label">Figure 2</a>: The Minion</li>
      </ol>
    `);
  });
  it("no title", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.4.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p><img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" /></p>
    `);
  });
});
