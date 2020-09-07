const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("options", () => {
  it("option: ns", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { ns: "images" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { label: "Image" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Image 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Image 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: injectLabel", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { injectLabel: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: wrap", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { wrapImage: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: list", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { list: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
    `);
  });

  it("option: listTitle", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { listTitle: "List of Images" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures">List of Images</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: listTitle empty", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { listTitle: "" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: listTag", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    md.use(MarkdownItPluginFigureReferences, { listTag: "ul" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ul class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ul>
    `);
  });
});
