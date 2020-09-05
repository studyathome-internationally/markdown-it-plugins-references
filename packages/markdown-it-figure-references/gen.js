const { join } = require("path");
const { writeFile } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

writeResult(
  join(__dirname, "__tests__", "html", "auto-id.html"),
  md.use(MarkdownItPluginFigureReferences),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "manual-id.html"),
  md.use(MarkdownItPluginFigureReferences),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "trooper#The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "multiple-images.html"),
  md.use(MarkdownItPluginFigureReferences),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n` +
    `![Minion](https://octodex.github.com/images/minion.png "minion#The Minion")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-list.html"),
  md.use(MarkdownItPluginFigureReferences, { list: false }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-list-title.html"),
  md.use(MarkdownItPluginFigureReferences, { listTitle: "List of Images" }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-list-tag.html"),
  md.use(MarkdownItPluginFigureReferences, { listTag: "ul" }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-label.html"),
  md.use(MarkdownItPluginFigureReferences, { label: "Image" }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-wrap-image.html"),
  md.use(MarkdownItPluginFigureReferences, { wrapImage: false }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-wrap-tag.html"),
  md.use(MarkdownItPluginFigureReferences, { wrapTag: "span" }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

writeResult(
  join(__dirname, "__tests__", "html", "option-inject-label.html"),
  md.use(MarkdownItPluginFigureReferences, { injectLabel: false }),
  `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`
);

function writeResult(destination, md, text) {
  writeFile(destination, md.render(text), "utf8", (err) => {
    if (err) console.log("Error writing file", destination, "\n", err);
  });
}
