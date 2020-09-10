const table_references = (md, opts) => {
  opts = loadOptions(opts);

  md.core.ruler.push("table_reference", table_reference_rule(opts));
  md.core.ruler.push("table_reference_list", table_reference_list_rule(opts));

  md.renderer.rules.table_reference_list_item = table_reference_list_item_renderer(opts);
  md.renderer.rules.table_wrapper_open = table_wrapper_open_renderer(opts);
  md.renderer.rules.table_wrapper_close = table_wrapper_close_renderer(opts);
};

function table_reference_rule(opts) {
  const table_reference = (state /* , silent */) => {
    let tableOpenPos = 0;
    const tokens = state.tokens;
    const { isSpace } = state.md.utils;

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
            addTable(state, opts, id, caption);

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
            addTable(state, opts, id, caption);

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

        let id, caption;
        const tableCaption = tokens[i + 2];
        if (tableCaption.content.split("#").length === 2) {
          [id, caption] = tableCaption.content.substring(1).split("#");
        } else {
          caption = tableCaption.content.substring(1);
          id = slugify(caption);
        }

        const tableOpen = tokens[tableOpenPos];
        tableOpen.attrSet("id", id);
        tableOpen.type = "table_wrapper_open";
        tableOpen.meta = { id, caption };

        const tableClose = tokens[i];
        tableClose.type = "table_wrapper_close";
        tableClose.meta = { origin: id, caption };

        tokens.splice(i + 1, 3);

        addTable(state, opts, id, caption);

        if (!opts.wrap) {
          const tableCaptionOpen = new state.Token("table_caption_open", "caption", 1);

          const tableCaptionContentChildren = [];
          if (opts.anchor.enable) {
            const tableCaptionAnchorOpen = new state.Token("link_open", "a", 1);
            tableCaptionAnchorOpen.attrSet("href", `#${id}`);
            tableCaptionAnchorOpen.attrSet("class", opts.anchor.class);
            tableCaptionContentChildren.push(tableCaptionAnchorOpen);

            const tableCaptionAnchorText = new state.Token("text", "", 0);
            tableCaptionAnchorText.content = opts.anchor.content;
            tableCaptionContentChildren.push(tableCaptionAnchorText);

            const tableCaptionAnchorClose = new state.Token("link_close", "a", -1);
            tableCaptionContentChildren.push(tableCaptionAnchorClose);
          }
          if (opts.label.enable) {
            const tableCaptionLabelOpen = new state.Token("link_open", "a", 1);
            tableCaptionLabelOpen.attrSet("href", `#${id}`);
            tableCaptionLabelOpen.attrSet("class", opts.label.class);
            tableCaptionContentChildren.push(tableCaptionLabelOpen);

            const entry = state.env[opts.ns].refs[id];
            const tableCaptionLabelContent = new state.Token("text", "", 0);
            tableCaptionLabelContent.content = opts.label.text.replace(opts.label.placeholder, entry.index);
            tableCaptionContentChildren.push(tableCaptionLabelContent);

            const tableCaptionLabelClose = new state.Token("link_close", "a", -1);
            tableCaptionContentChildren.push(tableCaptionLabelClose);
          }
          const sep = opts.anchor.enable || opts.label.enable ? ": " : "";
          const tableCaptionText = new state.Token("text", "", 0);
          tableCaptionText.content = sep + caption;
          tableCaptionContentChildren.push(tableCaptionText);

          const tableCaptionContent = new state.Token("inline", "", 0);
          tableCaptionContent.content = sep + caption;
          tableCaptionContent.children = [...tableCaptionContentChildren];

          const tableCaptionClose = new state.Token("table_caption_close", "caption", -1);

          tokens.splice(tableOpenPos + 1, 0, tableCaptionOpen, tableCaptionContent, tableCaptionClose);
        }
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

    if (opts.list.enable && opts.list.title !== "") {
      token = new state.Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-tables");
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

    token = new state.Token("table_reference_list_open", opts.list.tag, 1);
    token.attrSet("class", opts.list.class);
    token.block = true;
    tokens.push(token);

    for (const id in state.env[opts.ns].refs) {
      const entry = state.env[opts.ns].refs[id];
      token = new state.Token("table_reference_list_item", opts.list.item.tag, 0);
      token.attrSet("class", opts.list.item.class);
      token.meta = { ...entry };
      tokens.push(token);
    }

    token = new state.Token("table_reference_list_close", opts.list.tag, -1);
    token.block = true;
    tokens.push(token);
  };
  return table_reference_list;
}

function table_reference_list_item_renderer(opts) {
  return (tokens, idx, options, env /* , self */) => {
    const token = tokens[idx];
    const id = token.meta.id;
    const index = env[opts.ns].refs[id].index;
    const label = render_item_label(id, index, opts);
    const sep = opts.list.item.title && label && token.meta.caption ? ": " : "";
    const title = opts.list.item.title ? token.meta.caption : "";
    return `  <${token.tag} class="${token.attrGet("class")}">${label}${sep}${title}</${token.tag}>\n`;
  };
}

function table_wrapper_open_renderer(opts) {
  return (tokens, idx, options, env /* , self */) => {
    const token = tokens[idx];
    const id = token.attrGet("id");
    return opts.wrap ? `<figure id="${id}">\n<${token.tag}>\n` : `<${token.tag} id="${id}">\n`;
  };
}

function table_wrapper_close_renderer(opts) {
  return (tokens, idx, options, env /* , self */) => {
    const token = tokens[idx];
    const id = token.meta.origin;
    const caption = token.meta.caption;
    const entry = env[opts.ns].refs[id];
    const anchor = render_anchor(id, opts);
    const label = render_label(id, entry.index, opts);
    return opts.wrap
      ? `</${token.tag}>\n` +
          `  <figcaption>\n` +
          `    ${anchor}${label}${label && caption ? ": " : ""}${caption}\n` +
          `  </figcaption>\n` +
          `</figure>\n`
      : `</${token.tag}>\n`;
  };
}

function loadOptions(options) {
  const item = Object.assign(
    {},
    table_references.defaults.list.item,
    options && options.list && options.list.item ? options.list.item : {}
  );
  if (options && options.list) options.list.item = item;
  const list = Object.assign({}, table_references.defaults.list, options && options.list ? options.list : {});
  const label = Object.assign({}, table_references.defaults.label, options && options.label ? options.label : {});
  const anchor = Object.assign({}, table_references.defaults.anchor, options && options.anchor ? options.anchor : {});
  const opts = Object.assign({}, options, { list, label, anchor });
  return Object.assign({}, table_references.defaults, opts);
}

function render_anchor(id, opts) {
  return opts.anchor.enable ? `<a href="#${id}" class="${opts.anchor.class}">${opts.anchor.content}</a>` : "";
}

function render_label(id, index, opts) {
  const label = opts.label.text.replace(opts.label.placeholder, index);
  return opts.label.enable ? `<a href="#${id}" class="${opts.label.class}">${label}</a>` : "";
}

function render_item_label(id, index, opts) {
  const label = opts.label.text.replace(opts.label.placeholder, index);
  return opts.list.item.label
    ? `<a${opts.list.item.href ? ` href="#${id}"` : ""} class="${opts.label.class}">${label}</a>`
    : "";
}

function addTable(state, opts, id, caption) {
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

table_references.defaults = {
  ns: "tables",
  wrap: true,
  label: "Table",
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
