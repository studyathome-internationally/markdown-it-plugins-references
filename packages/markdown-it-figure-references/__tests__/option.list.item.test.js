const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("option: list item", () => {
  it("list item: null", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: { item: null } });
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

  it("list item: tag", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: { tag: "div", item: { tag: "span" } } });
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
      <div class="list">
        <span class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</span>
      </div>
    `);
  });

  it("list item: href", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: { item: { href: false } } });
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
        <li class="item"><a class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("list item: class", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: { item: { class: "figure" } } });
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
        <li class="figure"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("list item: label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: { item: { label: false } } });
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
        <li class="item">The Stormtroopocat</li>
      </ol>
    `);
  });

  it("list item: title", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: { item: { title: false } } });
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
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a></li>
      </ol>
    `);
  });
});
