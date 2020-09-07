const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("options", () => {
  it("option: list", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { list: false });
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
    `);
  });

  it("option: listTitle", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { listTitle: "List of Images" });
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
      <h2 id="list-of-figures">List of Images</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: listTitle empty", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { listTitle: "" });
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
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: listTag", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { listTag: "ul" });
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
      <ul class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ul>
    `);
  });

  it("option: label", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { label: "Image" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <div id="the-stormtroopocat" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat-img" />
          <figcaption>
            <a href="#the-stormtroopocat">Image 1</a>: The Stormtroopocat
          </figcaption>
        </figure>
      </div>
      </p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Image 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: wrapImage", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { wrapImage: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p><img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat" /></p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: wrapTag", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { wrapTag: "span" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p><span id="the-stormtroopocat" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat-img" />
          <figcaption>
            <a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat
          </figcaption>
        </figure>
      </span></p>
      <h2 id="list-of-figures">List of Figures</h2>
      <ol class="list-of-figures-list">
        <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("option: injectLabel", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginFigureReferences, { injectLabel: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <div id="the-stormtroopocat" class="figure-wrapper">
        <figure>
          <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat-img" />
          <figcaption>
            The Stormtroopocat
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
});
