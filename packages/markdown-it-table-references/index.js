const Token = require("markdown-it/lib/token");
const { isSpace } = require("markdown-it/lib/common/utils");

const table_references = (md, opts) => {
  opts = loadOptions(opts);

  if (typeof opts.after === "string") {
    if (md.core.ruler.getRules("").find(({ name }) => name === opts.after)) {
      md.core.ruler.after(opts.after, "table_reference", table_reference_rule(opts));
      md.core.ruler.after("table_reference", "table_reference_list", table_reference_list_rule(opts));
    }
  } else {
    md.core.ruler.push("table_reference", table_reference_rule(opts));
    md.core.ruler.push("table_reference_list", table_reference_list_rule(opts));
  }
};

function table_reference_rule(opts) {
  const table_reference = (state /* , silent */) => {
    let tableOpenPos = 0;
    let tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const { type, content } = tokens[i];

      if (type === "html_block") {
        if (opts.wrap) {
          const rFigure = /<figure[\s\S]*?<\/figure>/gm;
          let match;
          while ((match = rFigure.exec(content))) {
            const rProp = /id\s*?=\s*?"(.*?)"[\s\S]*?table[\s\S]*<figcaption>(.*?)<\/figcaption>/gm;
            let m = rProp.exec(match);
            if (!m) continue;
            const [figure, id, caption] = m;
            add_table(state, opts, id, caption);

            if (opts.anchor.enable || opts.label.enable) {
              const start = content.substring(0, match.index);
              const end = content.substring(match.index + match[0].length);

              const index = state.env[opts.ns].refs[id].index;
              const caption = state.env[opts.ns].refs[id].caption;
              const anchor = render_anchor(id, opts);
              const label = render_label(id, index, opts);
              const newFigure = match[0].replace(
                "<figcaption>",
                `<figcaption>\n${anchor}${label}${label && caption ? ": " : ""}`
              );
              tokens[i].content = start + newFigure + end;
            }
          }
        } else {
          const rTable = /<table[\s\S]*?<\/table>/gm;
          let match;
          while ((match = rTable.exec(content))) {
            const rProp = /id\s*?=\s*?"(.*?)"[\s\S]*?<caption>([\s\S]*?)<\/caption>/gm;
            let m = rProp.exec(match);
            if (!m) continue;
            const [table, id, caption] = m;
            add_table(state, opts, id, caption);

            if (opts.anchor.enable || opts.label.enable) {
              const start = content.substring(0, match.index);
              const end = content.substring(match.index + match[0].length);

              const index = state.env[opts.ns].refs[id].index;
              const caption = state.env[opts.ns].refs[id].caption;
              const anchor = render_anchor(id, opts);
              const label = render_label(id, index, opts);
              const newTable = match[0].replace(
                "<caption>",
                `<caption>\n${anchor}${label}${label && caption ? ": " : ""}`
              );
              tokens[i].content = start + newTable + end;
            }
          }
        }
      } else if (type === "table_open") {
        tableOpenPos = i;
      } else if (type === "table_close") {
        if (i + 4 > tokens.length) {
          break;
        }
        if (i < tableOpenPos) {
          break;
        }
        if (tokens[i + 1].type !== "paragraph_open") {
          break;
        }
        if (tokens[i + 2].children.length !== 1) {
          break;
        }
        if (tokens[i + 2].content.charCodeAt(0) !== 0x2e /* . */) {
          break;
        }
        if (isSpace(tokens[i + 2].content.charCodeAt(0))) {
          break;
        }

        let id, caption, token;
        const tableCaption = tokens[i + 2];
        if (tableCaption.content.split("#").length === 2) {
          [id, caption] = tableCaption.content.substring(1).split("#");
        } else {
          caption = tableCaption.content.substring(1);
          id = slugify(caption);
        }

        add_table(state, opts, id, caption);
        const index = state.env[opts.ns].refs[id].index;

        if (opts.wrap) {
          const pre = tokens.slice(0, tableOpenPos);
          token = new Token("figure_table_open", "figure", 1);
          token.attrSet("id", id);
          token.block = true;
          token.meta = { id, caption };
          pre.push(token);

          i = i + pre.length - tableOpenPos;
          tokens = [...pre, ...tokens.slice(tableOpenPos)];
          state.tokens = tokens;
        } else {
          token = tokens[tableOpenPos];
          token.attrSet("id", id);

          const pre = tokens.slice(0, tableOpenPos + 1);
          token = new Token("table_caption_open", "caption", 1);
          pre.push(token);

          generate_caption(pre, id, index, caption, opts);

          token = new Token("table_caption_close", "caption", -1);
          pre.push(token);

          i = i + pre.length - tableOpenPos - 1;
          tokens = [...pre, ...tokens.slice(tableOpenPos + 1)];
          state.tokens = tokens;
        }

        if (opts.wrap) {
          const pre = tokens.slice(0, i + 1);
          let children = [];

          token = new Token("figure_table_caption_open", "figcaption", 1);
          token.block = opts.anchor.enable || opts.label.enable;
          children.push(token);

          generate_caption(children, id, index, caption, opts);

          token = new Token("figure_table_caption_close", "figcaption", -1);
          token.block = true;
          children.push(token);

          token = new Token("inline", "", 0);
          token.children = children;
          pre.push(token);

          token = new Token("figure_table_close", "figure", -1);
          token.block = true;
          pre.push(token);

          const post = tokens.slice(i + 1);
          i = pre.length - 1;
          tokens = [...pre, ...post];
          state.tokens = tokens;
        }

        token = tokens[i];
        token.meta = { origin: id, caption };

        tokens.splice(i + 1, 3);
      }
    }
  };
  return table_reference;
}

function table_reference_list_rule(opts) {
  const table_reference_list = (state /* , silent */) => {
    if (!state.env[opts.ns] || !opts.list.enable) return;
    const tokens = state.tokens;
    let token, tokenChild;

    if (opts.list.title !== "") {
      token = new Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-tables");
      token.attrSet("class", opts.list.class);
      token.markup = "##";
      token.block = true;
      tokens.push(token);

      token = new Token("inline", "", 0);
      tokenChild = new Token("text", "", 0);
      tokenChild.content = opts.list.title;
      token.children = [tokenChild];
      tokens.push(token);

      token = new Token("heading_close", "h2", -1);
      tokens.push(token);
    }

    token = new Token("table_reference_list_open", opts.list.tag, 1);
    token.attrSet("class", opts.list.class);
    token.block = true;
    tokens.push(token);

    for (const id in state.env[opts.ns].refs) {
      const entry = state.env[opts.ns].refs[id];
      token = new Token("table_reference_list_item_open", opts.list.item.tag, 1);
      token.attrSet("class", opts.list.item.class);
      token.meta = { ...entry };
      tokens.push(token);

      const children = [];
      if (opts.list.item.label) {
        children.push(
          ...generate_link(
            opts.list.item.href ? `#${id}` : "",
            opts.label.class,
            opts.label.text.replace(opts.label.placeholder, entry.index)
          )
        );
      }
      if (opts.list.item.title) {
        token = new state.Token("text", "", 0);
        token.content =
          opts.list.item.label && opts.list.item.title && entry.caption ? `: ${entry.caption}` : entry.caption;
        children.push(token);
      }

      token = new state.Token("inline", "", 0);
      token.children = children;
      tokens.push(token);

      token = new state.Token("table_reference_list_item_close", opts.list.item.tag, -1);
      tokens.push(token);
    }

    token = new Token("table_reference_list_close", opts.list.tag, -1);
    token.block = true;
    tokens.push(token);
  };
  return table_reference_list;
}

function generate_caption(tokens, id, index, caption, opts) {
  if (opts.anchor.enable) {
    tokens.push(...generate_link(`#${id}`, opts.anchor.class, opts.anchor.content));
  }
  if (opts.label.enable) {
    tokens.push(...generate_link(`#${id}`, opts.label.class, opts.label.text.replace(opts.label.placeholder, index)));
  }
  if (caption) {
    token = new Token("text", "", 0);
    token.content = opts.label.enable ? `: ${caption}` : caption;
    tokens.push(token);
  }
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

function render_anchor(id, opts) {
  return opts.anchor.enable ? `<a href="#${id}" class="${opts.anchor.class}">${opts.anchor.content}</a>` : "";
}

function render_label(id, index, opts) {
  const label = opts.label.text.replace(opts.label.placeholder, index);
  return opts.label.enable ? `<a href="#${id}" class="${opts.label.class}">${label}</a>` : "";
}

function add_table(state, opts, id, caption) {
  if (!state.env[opts.ns]) {
    state.env[opts.ns] = {};
  }
  if (!state.env[opts.ns].refs) {
    state.env[opts.ns].refs = {};
  }
  const refs = state.env[opts.ns].refs;
  refs[id] = {
    id,
    caption,
    index: Object.keys(refs).length + 1,
  };
}

function slugify(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

function loadOptions(options) {
  return options
    ? {
        after: typeof options.after === "string" ? options.after : table_references.defaults.after,
        ns: typeof options.ns === "string" && options.ns ? options.ns : table_references.defaults.ns,
        wrap: typeof options.wrap === "boolean" ? options.wrap : table_references.defaults.wrap,
        anchor: Object.assign({}, table_references.defaults.anchor, options.anchor ? options.anchor : {}),
        label: Object.assign({}, table_references.defaults.label, options.label ? options.label : {}),
        list: {
          enable:
            options.list && typeof options.list.enable === "boolean"
              ? options.list.enable
              : table_references.defaults.list.enable,
          class:
            options.list && typeof options.list.class === "string"
              ? options.list.class
              : table_references.defaults.list.class,
          title:
            options.list && typeof options.list.title === "string"
              ? options.list.title
              : table_references.defaults.list.title,
          tag:
            options.list && typeof options.list.tag === "string"
              ? options.list.tag
              : table_references.defaults.list.tag,
          item: Object.assign(
            {},
            table_references.defaults.list.item,
            options.list && options.list.item ? options.list.item : {}
          ),
        },
      }
    : table_references.defaults;
}

table_references.defaults = {
  after: false,
  ns: "tables",
  wrap: true,
  anchor: {
    enable: true,
    content: "§",
    class: "anchor",
  },
  label: {
    enable: true,
    text: "Table #",
    placeholder: "#",
    class: "label",
  },
  list: {
    enable: true,
    class: "list",
    title: "List of Tables",
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

module.exports = table_references;
