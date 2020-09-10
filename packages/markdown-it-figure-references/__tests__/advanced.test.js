const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");

describe("advanced functionality", () => {
  it("plain html figure", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("plain html figure without anchor or label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { anchor: { enable: false }, label: { enable: false } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>The Stormtroopocat</figcaption>
      </figure>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("plain html figure w/o label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { label: { enable: false } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a>The Stormtroopocat
        </figcaption>
      </figure>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("plain html image", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.2.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { wrap: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat" />
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("plain html image w/o title", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.5.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { wrap: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" id="the-stormtroopocat" />
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a></li>
      </ol>
    `);
  });

  it("plain html figure and image", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.3.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="trooper" />
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("plain html figure and image w/o wrap", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.3.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences, { wrap: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>The Stormtroopocat</figcaption>
      </figure>
      <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="trooper" />
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#trooper" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });

  it("plain html figure, image and table", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.4.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>
          <a href="#the-stormtroopocat" class="anchor">§</a><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat
        </figcaption>
      </figure>
      <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="trooper" />
      <figure id="client-overview">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>Mobile</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>Desktop</td>
            </tr>
          </tbody>
        </table>
        <figcaption>Client overview</figcaption>
      </figure>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat" class="label">Figure 1</a>: The Stormtroopocat</li>
      </ol>
    `);
  });
});
