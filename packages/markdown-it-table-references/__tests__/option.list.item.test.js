const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginTableReferences = require("./../index.js");

describe("option: list item", () => {
  it("list item: null", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { list: { item: null } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
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
        <figcaption>
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("list item: tag", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { list: { tag: "div", item: { tag: "span" } } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
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
        <figcaption>
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <div class="list">
        <span class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</span>
      </div>
    `);
  });

  it("list item: href", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { list: { item: { href: false } } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
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
        <figcaption>
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="item"><a class="label">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("list item: class", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { list: { item: { class: "table" } } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
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
        <figcaption>
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="table"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("list item: label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { list: { item: { label: false } } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
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
        <figcaption>
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="item">Client overview</li>
      </ol>
    `);
  });

  it("list item: title", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { list: { item: { title: false } } });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
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
        <figcaption>
          <a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Table 1</a></li>
      </ol>
    `);
  });
});
