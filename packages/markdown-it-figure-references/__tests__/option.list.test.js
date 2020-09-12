const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");

describe("option: list", () => {
  it("null", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { list: null });
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

  it("enable", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { list: { enable: false } });
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
    `);
  });

  it("class", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { list: { class: "list-of-figures" } });
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
      <h2 id="list-of-figures" class="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("title", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { list: { title: "List of Images" } });
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
      <h2 id="list-of-figures" class="list">List of Images</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("tag", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { list: { tag: "ul" } });
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
      <ul class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ul>
    `);
  });
});
