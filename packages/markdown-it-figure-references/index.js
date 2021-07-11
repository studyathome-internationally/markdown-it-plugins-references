const Token = require("markdown-it/lib/token");

const figure_references = (md, opts) => {
  opts = loadOptions(opts);

  if (typeof opts.after === "string") {
    if (md.core.ruler.getRules("").find(({ name }) => name === opts.after)) {
      md.core.ruler.after(opts.after, "figure_reference", figure_reference_rule(opts), [""]);
      md.core.ruler.after("figure_reference", "figure_reference_list", figure_reference_list_rule(opts));
    }
  } else {
    md.core.ruler.push("figure_reference", figure_reference_rule(opts), [""]);
    md.core.ruler.push("figure_reference_list", figure_reference_list_rule(opts));
  }
};

function figure_reference_rule(opts) {
  const figure_reference = (state /* , silent */) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      let { children, type, content } = state.tokens[i];

      if (type !== "inline" && type !== "html_block") continue;

      if (type === "html_block") {
        if (opts.wrap) {
          const rFigure = /<figure[\s\S]*?<\/figure>/gm;
          let match;
          while ((match = rFigure.exec(content))) {
            const rProp = /id\s*?=\s*?"(.*?)"[\s\S]*?img[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>/gm;
            const m = rProp.exec(match);
            if (!m) continue;
            const [figure, id, title] = m;
            add_image(state, opts, id, title);

            if (opts.anchor.enable || opts.label.enable) {
              const start = content.substring(0, match.index);
              const end = content.substring(match.index + match[0].length);

              const index = state.env[opts.ns].refs.find((ref) => ref.id === id)?.index;
              const title = state.env[opts.ns].refs.find((ref) => ref.id === id)?.title;
              const anchor = render_anchor(id, opts);
              const label = render_label(id, index, opts);
              const newFigure = match[0].replace(
                "<figcaption>",
                `<figcaption>\n${anchor}${label}${label && title ? ": " : ""}`
              );
              tokens[i].content = start + newFigure + end;
            }
          }
        } else {
          const rImage = /<img[\s\S]*?(?:id\s*?=\s*?"(.*?))"[\s\S]*?\/(?:img)?>/gm;
          let match;
          while ((match = rImage.exec(content))) {
            const [image, id] = match;

            const rTitle = /title\s*?=\s*?"(.*?)"/gm.exec(image);
            const title = rTitle ? rTitle[1] : "";
            add_image(state, opts, id, title);
          }
        }
      } else {
        for (let j = 0; j < children.length; j++) {
          let token = children[j];
          if (token.type !== "image") continue;

          const titleContent = token.attrGet("title");
          if (!titleContent) continue;

          let id,
            title = titleContent;
          if (titleContent.split("#").length === 2) {
            [id, title] = titleContent.split("#");
          } else {
            id = slugify(title);
          }

          add_image(state, opts, id, title);

          if (opts.wrap) {
            const pre = children.slice(0, j);
            let child = new state.Token("figure_image_open", "figure", 1);
            child.attrSet("id", id);
            child.block = true;
            pre.push(child);

            token.attrSet("title", title);
            token.meta = { targetId: id };
            pre.push(token);

            child = new state.Token("figure_image_caption_open", "figcaption", 1);
            child.block = opts.anchor.enable || opts.label.enable;
            pre.push(child);

            if (opts.anchor.enable) {
              if (opts.anchor.href) {
                pre.push(...generate_link(`#${id}`, opts.anchor.class, opts.anchor.content));
              } else {
                pre.push(...generate_span(opts.anchor.class, opts.anchor.content));
              }
            }
            if (opts.label.enable) {
              const index = state.env[opts.ns].refs.find((ref) => ref.id === id)?.index;
              const labelText = opts.label.text.replace(opts.label.placeholder, index);
              if (opts.label.href) {
                pre.push(...generate_link(`#${id}`, opts.label.class, labelText));
              } else {
                pre.push(...generate_span(opts.label.class, labelText));
              }
            }
            if (title) {
              child = new state.Token("text", "", 0);
              child.content = opts.label.enable ? `: ${title}` : title;
              pre.push(child);
            }

            child = new state.Token("figure_image_caption_close", "figcaption", -1);
            child.block = true;
            pre.push(child);

            child = new state.Token("figure_image_close", "figure", -1);
            child.block = true;
            pre.push(child);

            children = [...pre, ...children.slice(j + 1)];
            state.tokens[i].children = children;
            j = pre.length - 1;
          } else {
            token.attrSet("id", id);
          }
        }
      }
    }
  };
  return figure_reference;
}

function figure_reference_list_rule(opts) {
  const figure_reference_list = (state) => {
    if (!state.env[opts.ns] || !opts.list.enable) return;
    const tokens = state.tokens;
    let token, tokenChild;

    if (opts.list.title !== "") {
      token = new state.Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-figures");
      token.attrSet("class", opts.list.class);
      token.markup = "##";
      token.block = true;
      tokens.push(token);

      token = new state.Token("inline", "", 0);
      tokenChild = new state.Token("text", "", 0);
      tokenChild.content = opts.list.title;
      token.children = [tokenChild];
      tokens.push(token);

      token = new state.Token("heading_close", "h2", -1);
      tokens.push(token);
    }

    token = new state.Token("figure_reference_list_open", opts.list.tag, 1);
    token.attrSet("class", opts.list.class);
    token.block = true;
    tokens.push(token);

    for (const entry of state.env[opts.ns].refs) {
      token = new state.Token("figure_reference_list_item_open", opts.list.item.tag, 1);
      token.attrSet("class", opts.list.item.class);
      token.meta = { ...entry };
      tokens.push(token);

      const children = [];
      if (opts.list.item.label) {
        children.push(
          ...generate_link(
            opts.list.item.href ? `#${entry.id}` : "",
            opts.label.class,
            opts.label.text.replace(opts.label.placeholder, entry.index)
          )
        );
      }
      if (opts.list.item.title && entry.title) {
        token = new state.Token("text", "", 0);
        token.content = opts.list.item.label ? `: ${entry.title}` : entry.title;
        children.push(token);
      }

      token = new state.Token("inline", "", 0);
      token.children = children;
      tokens.push(token);

      token = new state.Token("figure_reference_list_item_close", opts.list.item.tag, -1);
      tokens.push(token);
    }

    token = new state.Token("figure_reference_list_close", opts.list.tag, -1);
    token.block = true;
    tokens.push(token);
  };
  return figure_reference_list;
}

function generate_link(href, className, content) {
  const tokens = [];
  let token = new Token("link_open", "a", 1);
  if (href) token.attrSet("href", href);
  if (className) token.attrSet("class", className);
  tokens.push(token);

  token = new Token("text", "", 0);
  token.content = content;
  tokens.push(token);

  token = new Token("link_close", "a", -1);
  tokens.push(token);

  return tokens;
}

function generate_span(className, content) {
  const tokens = [];
  let token = new Token("label_open", "span", 1);
  if (className) token.attrSet("class", className);
  tokens.push(token);

  token = new Token("text", "", 0);
  token.content = content;
  tokens.push(token);

  token = new Token("label_close", "span", -1);
  tokens.push(token);

  return tokens;
}

function render_anchor(id, opts) {
  return opts.anchor.enable ? `<a href="#${id}" class="${opts.anchor.class}">${opts.anchor.content}</a>` : "";
}

function render_label(id, index, opts) {
  const label = opts.label.text.replace(opts.label.placeholder, index);
  return opts.label.enable ? `<a href="#${id}" class="${opts.label.class}">${label}</a>` : "";
}

function add_image(state, opts, id, title) {
  if (!state.env[opts.ns]) {
    state.env[opts.ns] = {};
  }
  if (!state.env[opts.ns].refs) {
    state.env[opts.ns].refs = [];
  }
  if (!state.env[opts.ns].refs.find((ref) => id === ref.id)) {
    state.env[opts.ns].refs.push({
      id,
      title,
      index: state.env[opts.ns].refs.length + 1,
    });
  }
}

function slugify(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

function loadOptions(options) {
  return options
    ? {
        after: typeof options.after === "string" ? options.after : figure_references.defaults.after,
        ns: typeof options.ns === "string" && options.ns ? options.ns : figure_references.defaults.ns,
        wrap: typeof options.wrap === "boolean" ? options.wrap : figure_references.defaults.wrap,
        anchor: Object.assign({}, figure_references.defaults.anchor, options.anchor ? options.anchor : {}),
        label: Object.assign({}, figure_references.defaults.label, options.label ? options.label : {}),
        list: {
          enable:
            options.list && typeof options.list.enable === "boolean"
              ? options.list.enable
              : figure_references.defaults.list.enable,
          class:
            options.list && typeof options.list.class === "string"
              ? options.list.class
              : figure_references.defaults.list.class,
          title:
            options.list && typeof options.list.title === "string"
              ? options.list.title
              : figure_references.defaults.list.title,
          tag:
            options.list && typeof options.list.tag === "string"
              ? options.list.tag
              : figure_references.defaults.list.tag,
          item: Object.assign(
            {},
            figure_references.defaults.list.item,
            options.list && options.list.item ? options.list.item : {}
          ),
        },
      }
    : figure_references.defaults;
}

figure_references.defaults = {
  after: false,
  ns: "figures",
  wrap: true,
  anchor: {
    enable: true,
    href: true,
    content: "§",
    class: "anchor",
  },
  label: {
    enable: true,
    href: true,
    text: "Figure #",
    placeholder: "#",
    class: "label",
  },
  list: {
    enable: true,
    class: "list",
    title: "List of Figures",
    tag: "ol",
    item: {
      tag: "li",
      href: true,
      class: "item",
      label: true,
      title: true,
    },
  },
};

module.exports = figure_references;
