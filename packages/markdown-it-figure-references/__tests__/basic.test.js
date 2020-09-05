const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("basic functionality", function () {
  it("automatic id insertion", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences);
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
  it("manual id insertion", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "trooper#The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <p>
        <div class="figure-wrapper"
             id="trooper"
        >
          <figure>
            <img src="https://octodex.github.com/images/stormtroopocat.jpg"
                 alt="Stormtroopocat"
                 title="The Stormtroopocat"
                 id="trooper"
            >
            <figcaption>
              <a href="#trooper">
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
      <ol class="list-of-figures-list">
        <li>
          <a href="#trooper">
            Figure 1
          </a>
          : The Stormtroopocat
        </li>
      </ol>
    `);
  });
  it("multiple images", () => {
    const text =
      `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n` +
      `![Minion](https://octodex.github.com/images/minion.png "minion#The Minion")`;
    md.use(MarkdownItPluginFigureReferences);
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
        <div class="figure-wrapper"
             id="minion"
        >
          <figure>
            <img src="https://octodex.github.com/images/minion.png"
                 alt="Minion"
                 title="The Minion"
                 id="minion"
            >
            <figcaption>
              <a href="#minion">
                Figure 2
              </a>
              : The Minion
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
        <li>
          <a href="#minion">
            Figure 2
          </a>
          : The Minion
        </li>
      </ol>
    `);
  });
});
