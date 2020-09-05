const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("options", function () {
  it("option: list", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { list: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div class="figure-wrapper"
             id="the-stormtroopocat"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat"
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
    `);
  });

  it("option: listTitle", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { listTitle: "List of Images" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div class="figure-wrapper"
             id="the-stormtroopocat"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat"
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
        <a href="#list-of-figures"
           class="header-anchor"
        >
          #
        </a>
        List of Images
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

  it("option: listTag", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { listTag: "ul" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div class="figure-wrapper"
             id="the-stormtroopocat"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat"
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
        <a href="#list-of-figures"
           class="header-anchor"
        >
          #
        </a>
        List of Figures
      </h2>
      <ul class="list-of-figures-list">
        <li>
          <a href="#the-stormtroopocat">
            Figure 1
          </a>
          : The Stormtroopocat
        </li>
      </ul>
    `);
  });

  it("option: label", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { label: "Image" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div class="figure-wrapper"
             id="the-stormtroopocat"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat"
            >
            <figcaption>
              <a href="#the-stormtroopocat">
                Image 1
              </a>
              : The Stormtroopocat
            </figcaption>
          </figure>
        </div>
      </p>
      <h2 id="list-of-figures">
        <a href="#list-of-figures"
           class="header-anchor"
        >
          #
        </a>
        List of Figures
      </h2>
      <ol class="list-of-figures-list">
        <li>
          <a href="#the-stormtroopocat">
            Image 1
          </a>
          : The Stormtroopocat
        </li>
      </ol>
    `);
  });

  it("option: wrapImage", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { wrapImage: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <img src="https://octodex.github.com/images/stormtroopocat.jpg"
             alt="Stormtroopocat"
             title="The Stormtroopocat"
             id="the-stormtroopocat"
        >
      </p>
      <h2 id="list-of-figures">
        <a href="#list-of-figures"
           class="header-anchor"
        >
          #
        </a>
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

  it("option: wrapTag", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { wrapTag: "span" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <span class="figure-wrapper"
              id="the-stormtroopocat"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat"
            >
            <figcaption>
              <a href="#the-stormtroopocat">
                Figure 1
              </a>
              : The Stormtroopocat
            </figcaption>
          </figure>
        </span>
      </p>
      <h2 id="list-of-figures">
        <a href="#list-of-figures"
           class="header-anchor"
        >
          #
        </a>
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

  it("option: injectLabel", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { injectLabel: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div class="figure-wrapper"
             id="the-stormtroopocat"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="the-stormtroopocat"
            >
            <figcaption>
              The Stormtroopocat
            </figcaption>
          </figure>
        </div>
      </p>
      <h2 id="list-of-figures">
        <a href="#list-of-figures"
           class="header-anchor"
        >
          #
        </a>
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
