const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginTableReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("advanced functionality", () => {
  it("plain html figure", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.1.md"), "utf8");
    md.use(MarkdownItPluginTableReferences);
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
          <a href="#client-overview">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("plain html figure w/o label", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.1.md"), "utf8");
    md.use(MarkdownItPluginTableReferences, { injectLabel: false });
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
        <figcaption>Client overview</figcaption>
      </figure>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("plain html table", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.2.md"), "utf8");
    md.use(MarkdownItPluginTableReferences, { wrap: false });
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <table id="client-overview">
        <caption>
          <a href="#client-overview">Table 1</a>: Client overview
        </caption>
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

  it("plain html figure and table", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.3.md"), "utf8");
    md.use(MarkdownItPluginTableReferences);
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
          <a href="#client-overview">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <table id="server-overview">
        <caption>Server overview</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Server</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Chris</td>
            <td>nginx</td>
          </tr>
          <tr>
            <td>Debra</td>
            <td>apache</td>
          </tr>
        </tbody>
      </table>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });

  it("plain html figure and image w/o wrap", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.3.md"), "utf8");
    md.use(MarkdownItPluginTableReferences, { wrap: false });
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
        <figcaption>Client overview</figcaption>
      </figure>
      <table id="server-overview">
        <caption>
          <a href="#server-overview">Table 1</a>: Server overview
        </caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Server</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Chris</td>
            <td>nginx</td>
          </tr>
          <tr>
            <td>Debra</td>
            <td>apache</td>
          </tr>
        </tbody>
      </table>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#server-overview">Table 1</a>: Server overview</li>
      </ol>
    `);
  });

  it("plain html figure, image and table", () => {
    const text = readFileSync(join(__dirname, "__cases__", "advanced.4.md"), "utf8");
    md.use(MarkdownItPluginTableReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>Hello World</h1>
      <figure id="the-stormtroopocat">
        <img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" />
        <figcaption>The Stormtroopocat</figcaption>
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
        <figcaption>
          <a href="#client-overview">Table 1</a>: Client overview
        </figcaption>
      </figure>
      <h2 id="list-of-tables">List of Tables</h2>
      <ol class="list-of-tables-list">
        <li><a href="#client-overview">Table 1</a>: Client overview</li>
      </ol>
    `);
  });
});
