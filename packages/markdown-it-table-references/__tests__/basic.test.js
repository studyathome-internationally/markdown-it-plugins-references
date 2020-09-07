const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginTableReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("basic functionality", () => {
  it("automatic id insertion", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.1.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <div class="table-wrapper"
           id="client-overview"
      >
        <figure>
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Client
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Alice
                </td>
                <td>
                  Mobile
                </td>
              </tr>
              <tr>
                <td>
                  Bob
                </td>
                <td>
                  Desktop
                </td>
              </tr>
            </tbody>
          </table>
          <figcaption>
            <a href="#client-overview">
              Table 1
            </a>
            : Client overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">
        List of Tables
      </h2>
      <ol class="list-of-tables-list">
        <li>
          <a href="#client-overview">
            Table 1
          </a>
          : Client overview
        </li>
      </ol>
    `);
  });

  it("manual id insertion", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.2.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <div class="table-wrapper"
           id="overview"
      >
        <figure>
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Client
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Alice
                </td>
                <td>
                  Mobile
                </td>
              </tr>
              <tr>
                <td>
                  Bob
                </td>
                <td>
                  Desktop
                </td>
              </tr>
            </tbody>
          </table>
          <figcaption>
            <a href="#overview">
              Table 1
            </a>
            : Client overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">
        List of Tables
      </h2>
      <ol class="list-of-tables-list">
        <li>
          <a href="#overview">
            Table 1
          </a>
          : Client overview
        </li>
      </ol>
    `);
  });

  it("multiple tables", () => {
    const text = readFileSync(
      join(__dirname, "__cases__", "basic.3.md"),
      "utf8"
    );
    md.use(MarkdownItPluginTableReferences);
    const result = md.render(text);
    expect(result).toMatchInlineSnapshot(`
      <h1>
        Hello World
      </h1>
      <div class="table-wrapper"
           id="client-overview"
      >
        <figure>
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Client
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Alice
                </td>
                <td>
                  Mobile
                </td>
              </tr>
              <tr>
                <td>
                  Bob
                </td>
                <td>
                  Desktop
                </td>
              </tr>
            </tbody>
          </table>
          <figcaption>
            <a href="#client-overview">
              Table 1
            </a>
            : Client overview
          </figcaption>
        </figure>
      </div>
      <div class="table-wrapper"
           id="server-overview"
      >
        <figure>
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Server
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Chris
                </td>
                <td>
                  nginx
                </td>
              </tr>
              <tr>
                <td>
                  Debra
                </td>
                <td>
                  apache
                </td>
              </tr>
            </tbody>
          </table>
          <figcaption>
            <a href="#server-overview">
              Table 2
            </a>
            : Server overview
          </figcaption>
        </figure>
      </div>
      <h2 id="list-of-tables">
        List of Tables
      </h2>
      <ol class="list-of-tables-list">
        <li>
          <a href="#client-overview">
            Table 1
          </a>
          : Client overview
        </li>
        <li>
          <a href="#server-overview">
            Table 2
          </a>
          : Server overview
        </li>
      </ol>
    `);
  });
});
