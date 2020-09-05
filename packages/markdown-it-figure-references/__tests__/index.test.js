const { join } = require("path");
const { readFileSync } = require("fs");

const MarkdownIt = require("markdown-it");
const MarkdownItPluginFigureReferences = require("./../index.js");
const md = new MarkdownIt({ xhtmlOut: true, html: true });

describe("markdown-it handling", function () {
  it("reload rule", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences);
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "auto-id.html"), { encoding: "utf8" }));
  });
});

describe("basic functionality", function () {
  it("automatic id insertion", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "auto-id.html"), { encoding: "utf8" }));
  });
  it("manual id insertion", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "trooper#The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "manual-id.html"), { encoding: "utf8" }));
  });
  it("multiple images", () => {
    const text =
      `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n` +
      `![Minion](https://octodex.github.com/images/minion.png "minion#The Minion")`;
    md.use(MarkdownItPluginFigureReferences);
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "multiple-images.html"), { encoding: "utf8" }));
  });
});

describe("options", function () {
  it("option: list", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { list: false });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-list.html"), { encoding: "utf8" }));
  });

  it("option: listTitle", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { listTitle: "List of Images" });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-list-title.html"), { encoding: "utf8" }));
  });

  it("option: listTag", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { listTag: "ul" });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-list-tag.html"), { encoding: "utf8" }));
  });

  it("option: label", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { label: "Image" });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-label.html"), { encoding: "utf8" }));
  });

  it("option: wrapImage", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { wrapImage: false });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-wrap-image.html"), { encoding: "utf8" }));
  });

  it("option: wrapTag", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { wrapTag: "span" });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-wrap-tag.html"), { encoding: "utf8" }));
  });

  it("option: injectLabel", () => {
    const text = `# Hello World\n\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")`;
    md.use(MarkdownItPluginFigureReferences, { injectLabel: false });
    const result = md.render(text);
    expect(result).toBe(readFileSync(join(__dirname, "html", "option-inject-label.html"), { encoding: "utf8" }));
  });
});
