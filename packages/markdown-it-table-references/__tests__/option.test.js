const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginTableReferences = require("./../index.js");

describe("options", () => {
  it("option: ns", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { ns: "spreadsheets" });
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

  it("option: wrap", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences, { wrap: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <table id="client-overview">
        <caption><a href="#client-overview" class="anchor">§</a><a href="#client-overview" class="label">Table 1</a>: Client overview</caption>
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
      <h2 id="list-of-tables" class="list">List of Tables</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
      </ol>
    `);
  });
});
