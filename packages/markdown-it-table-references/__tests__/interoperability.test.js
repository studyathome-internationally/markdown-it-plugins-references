const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginAnchor = require("markdown-it-anchor");
const MarkdownItPluginTableReferences = require("./../index.js");

describe("interoperability", () => {
  it("markdown-it-anchor", () => {
    const text = readFileSync(join(__dirname, "__cases__", "basic.1.md"), "utf8");
    const md = new MarkdownIt({ xhtmlOut: true, html: true });
    md.use(MarkdownItPluginTableReferences);
    md.use(MarkdownItPluginAnchor, {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "#",
    });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1 id="hello-world"><a class="header-anchor" href="#hello-world">#</a> Hello World</h1>
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
      <h2 id="list-of-tables" class="list"><a class="header-anchor" href="#list-of-tables">#</a> List of Tables</h2>
      <ol class="list">
        <li class="item"><a href="#client-overview" class="label">Table 1</a>: Client overview</li>
      </ol>
    `);
  });
});
