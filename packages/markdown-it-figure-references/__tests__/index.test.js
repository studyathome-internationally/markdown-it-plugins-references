const text = `# Hello World

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

![Minion](https://octodex.github.com/images/minion.png "minion#The Minion")
`;

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

md.use(MarkdownItPluginFigureReferences);

test("figure reference basic renderering test", () => {
  const result = md.render(text);
  expect(result).toBe(
    "<h1>Hello World</h1>\n" +
      '<p><img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat" id="the-stormtroopocat" /></p>\n' +
      '<p><img src="https://octodex.github.com/images/minion.png" alt="Minion" title="The Minion" id="minion" /></p>\n' +
      '<h2 id="list-of-figures"><a href="#list-of-figures" class="header-anchor">#</a>List of Figures</h2>\n' +
      '<ol class="list-of-figures-list">\n' +
      '  <li><a href="#the-stormtroopocat">Figure 1</a>: The Stormtroopocat</li>\n' +
      '  <li><a href="#minion">Figure 2</a>: The Minion</li>\n' +
      "</ol>"
  );
});
