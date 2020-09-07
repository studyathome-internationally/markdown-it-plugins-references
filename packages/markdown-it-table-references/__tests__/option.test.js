const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginTableReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("options", () => {
  it("option: list", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { list: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            <a href="#client-overview">Table 1</a>: Client overview
          </figcaption>
        </figure>
      </div>
    `);
  });

  it("option: listTitle", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { listTitle: "List of Boards" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            <a href="#client-overview">Table 1</a>: Client overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">List of Boards</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("option: listTitle empty", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { listTitle: "" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            <a href="#client-overview">Table 1</a>: Client overview
          </figcaption>
        </figure>
      </div>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("option: listTag", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { listTag: "ul" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            <a href="#client-overview">Table 1</a>: Client overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">List of Tables</h2>
      <ul class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ul>
    `);
  });

  it("option: label", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { label: "Board" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            <a href="#client-overview">Board 1</a>: Client overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Board 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("option: wrapTable", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { wrapTable: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <table id="client-overview">
        <caption>Client overview</caption>
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
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("option: wrapTag", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { wrapTag: "span" });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <span class="table-wrapper" id="client-overview">
      <figure>
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
          <a href="#client-overview">Table 1</a>: Client overview
        </figcaption>
      </figure>
      </span>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("option: injectLabel", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences, { injectLabel: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <div class="table-wrapper" id="client-overview">
        <figure>
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
            Client overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });
});
