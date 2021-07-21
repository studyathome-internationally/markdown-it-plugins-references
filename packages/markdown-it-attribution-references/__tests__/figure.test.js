const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAttributionReferences = require("./../index.js");

describe("figure attributions", function () {
  it("basic example", () => {
    const text = readFileSync(join(__dirname, "__cases__", "figure.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"));
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "github:octodex",
          author: ["GitHub", "https://github.com/"],
          title: ["Octodex", "https://octodex.github.com/"],
          license: ["Custom License", "https://octodex.github.com/faq/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat-github-octodex">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat [1]" />
        <figcaption>
          <a href="#the-stormtroopocat-github-octodex" class="anchor">§</a><a href="#the-stormtroopocat-github-octodex" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1</a>]
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat-github-octodex" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1</a>]</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="github_octodex" class="item"><span class="label">[1]</span>: <a href="https://octodex.github.com/" class="title">Octodex</a> (By: <a href="https://github.com/" class="author">GitHub</a>, <a href="https://octodex.github.com/faq/" class="license">Custom License</a>)</li>
      </ol>
    `);
  });

  it("basic example with annotation", () => {
    const text = readFileSync(join(__dirname, "__cases__", "figure.2.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"));
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "github:octodex",
          author: ["GitHub", "https://github.com/"],
          title: ["Octodex", "https://octodex.github.com/"],
          license: ["Custom License", "https://octodex.github.com/faq/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat-github-octodex-page-1">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat [1 (Page 1)]" />
        <figcaption>
          <a href="#the-stormtroopocat-github-octodex-page-1" class="anchor">§</a><a href="#the-stormtroopocat-github-octodex-page-1" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1 (Page 1)</a>]
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat-github-octodex-page-1" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1 (Page 1)</a>]</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="github_octodex" class="item"><span class="label">[1]</span>: <a href="https://octodex.github.com/" class="title">Octodex</a> (By: <a href="https://github.com/" class="author">GitHub</a>, <a href="https://octodex.github.com/faq/" class="license">Custom License</a>)</li>
      </ol>
    `);
  });

  it("multiple attributions with annotation", () => {
    const text = readFileSync(join(__dirname, "__cases__", "figure.3.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"));
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "github:main",
          author: ["Microsoft", "https://github.com/"],
          title: ["GitHub", "https://github.com/"],
          license: ["Custom License", "https://resources.github.com/faq/"],
        },
        {
          key: "github:octodex",
          author: ["GitHub", "https://github.com/"],
          title: ["Octodex", "https://octodex.github.com/"],
          license: ["Custom License", "https://octodex.github.com/faq/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat-github-octodex-page-1-github-main-homepage">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat [1 (Page 1), 2 (Homepage)]" />
        <figcaption>
          <a href="#the-stormtroopocat-github-octodex-page-1-github-main-homepage" class="anchor">§</a><a href="#the-stormtroopocat-github-octodex-page-1-github-main-homepage" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1 (Page 1)</a>, <a href="#github_main" class="label">2 (Homepage)</a>]
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat-github-octodex-page-1-github-main-homepage" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1 (Page 1)</a>, <a href="#github_main" class="label">2 (Homepage)</a>]</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="github_octodex" class="item"><span class="label">[1]</span>: <a href="https://octodex.github.com/" class="title">Octodex</a> (By: <a href="https://github.com/" class="author">GitHub</a>, <a href="https://octodex.github.com/faq/" class="license">Custom License</a>)</li>
        <li id="github_main" class="item"><span class="label">[2]</span>: <a href="https://github.com/" class="title">GitHub</a> (By: <a href="https://github.com/" class="author">Microsoft</a>, <a href="https://resources.github.com/faq/" class="license">Custom License</a>)</li>
      </ol>
    `);
  });

  it("multiple individual attributions", () => {
    const text = readFileSync(join(__dirname, "__cases__", "figure.4.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(require("markdown-it-figure-references"));
    md.use(MarkdownItPluginAttributionReferences, {
      sources: [
        {
          key: "github:main",
          author: ["Microsoft", "https://github.com/"],
          title: ["GitHub", "https://github.com/"],
          license: ["Custom License", "https://resources.github.com/faq/"],
        },
        {
          key: "github:octodex",
          author: ["GitHub", "https://github.com/"],
          title: ["Octodex", "https://octodex.github.com/"],
          license: ["Custom License", "https://octodex.github.com/faq/"],
        },
      ],
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <p>
      <figure id="the-stormtroopocat-github-octodex-github-main">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat [1] [2]" />
        <figcaption>
          <a href="#the-stormtroopocat-github-octodex-github-main" class="anchor">§</a><a href="#the-stormtroopocat-github-octodex-github-main" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1</a>] [<a href="#github_main" class="label">2</a>]
        </figcaption>
      </figure>
      </p>
      <h2 id="list-of-figures" class="list">List of Figures</h2>
      <ol class="list">
        <li class="item"><a href="#the-stormtroopocat-github-octodex-github-main" class="label">Figure 1</a>: The Stormtroopocat [<a href="#github_octodex" class="label">1</a>] [<a href="#github_main" class="label">2</a>]</li>
      </ol>
      <h2 id="list-of-attributions" class="list">List of Attributions</h2>
      <ol class="list">
        <li id="github_octodex" class="item"><span class="label">[1]</span>: <a href="https://octodex.github.com/" class="title">Octodex</a> (By: <a href="https://github.com/" class="author">GitHub</a>, <a href="https://octodex.github.com/faq/" class="license">Custom License</a>)</li>
        <li id="github_main" class="item"><span class="label">[2]</span>: <a href="https://github.com/" class="title">GitHub</a> (By: <a href="https://github.com/" class="author">Microsoft</a>, <a href="https://resources.github.com/faq/" class="license">Custom License</a>)</li>
      </ol>
    `);
  });

  // w individual attribution in text
  // w/o individual attribution in text
  // attribution annotation
  // no attribution key in config
  // multiple attributions
  // multiple attributions (w/o individual attribution in text)
  // adding/enabling attributions for single files/globally (without explicit usage)?
  // raw html?
  // configuration?
});
