const table_references = (md, opts) => {
  opts = Object.assign({}, table_references.defaults, opts);

  const reload = md.core.ruler.getRules("").find(({ name }) => name === "table_reference") || false;
  if (reload) {
    md.core.ruler.at("table_reference", table_reference_rule(opts));
    md.core.ruler.at("list_of_tables", table_reference_list_rule(opts));
  } else {
    md.core.ruler.push("table_reference", table_reference_rule(opts));
    md.core.ruler.push("list_of_tables", table_reference_list_rule(opts));
  }

  md.renderer.rules.table_reference_list_open = table_reference_list_open_renderer(opts);
  md.renderer.rules.table_reference_list_item = table_reference_list_item_renderer(opts);
  md.renderer.rules.table_reference_list_close = table_reference_list_close_renderer(opts);
  md.renderer.rules.table_wrapper_open = table_wrapper_open_renderer(opts);
  md.renderer.rules.table_wrapper_close = table_wrapper_close_renderer(opts);
};

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

function table_reference_rule(opts) {
  const table_reference = (state /* , silent */) => {
    let tableOpenPos = 0;
    const tokens = state.tokens;

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

            if (opts.injectLabel) {
              const start = content.substring(0, match.index);
              const end = content.substring(match.index + match[0].length);
              const label = opts.label;
              const index = state.env[opts.ns].refs[id].index;
              const newFigure = match[0].replace(
                "<figcaption>",
                `<figcaption>\n  <a href="#${id}">${label} ${index}</a>: `
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

            if (opts.injectLabel) {
              const start = content.substring(0, match.index);
              const end = content.substring(match.index + match[0].length);
              const label = opts.label;
              const index = state.env[opts.ns].refs[id].index;
              const newTable = match[0].replace("<caption>", `<caption>\n  <a href="#${id}">${label} ${index}</a>: `);
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
        if (tokens[i + 2].type !== "inline") {
          break;
        }
        if (tokens[i + 2].children.length !== 1) {
          break;
        }
        if (tokens[i + 3].type !== "paragraph_close") {
          break;
        }
        if (tokens[i + 2].content.charCodeAt(0) !== 0x2e /* . */) {
          break;
        }
        if (tokens[i + 2].content.charCodeAt(1) === 0x20) {
          break;
        }

        let id, caption;
        const tableCaption = tokens[i + 2];
        if (tableCaption.content.split("#").length === 2) {
          [id, caption] = tableCaption.content.substring(1).split("#");
        } else {
          caption = tableCaption.content.substring(1);
          id = sanitize(caption);
        }

        const tableOpen = tokens[tableOpenPos];
        tableOpen.attrSet("id", id);
        if (opts.wrap) tableOpen.type = "table_wrapper_open";
        tableOpen.meta = { id, caption };

        const tableClose = tokens[i];
        if (opts.wrap) tableClose.type = "table_wrapper_close";
        tableClose.meta = { origin: id, caption };

        tokens.splice(i + 1, 3);

        if (!opts.wrap) {
          const tableCaptionOpen = new state.Token("table_caption_open", "caption", 1);
          const tableCaptionContent = new state.Token("inline", "", 0);
          const tableCaptionText = new state.Token("text", "", 0);
          tableCaptionContent.content = caption;
          tableCaptionText.content = caption;
          tableCaptionContent.children = [tableCaptionText];
          const tableCaptionClose = new state.Token("table_caption_close", "caption", -1);

          tokens.splice(tableOpenPos + 1, 0, tableCaptionOpen, tableCaptionContent, tableCaptionClose);
        }

        addTable(state, opts, id, caption);
      }
    }
  };
  return table_reference;
}

function table_reference_list_rule(opts) {
  const table_reference_list = (state /* , silent */) => {
    if (!state.env[opts.ns] || !opts.list) return;
    const tokens = state.tokens;

    let token = new state.Token("table_reference_list_open", opts.listTag, 1);
    token.block = true;
    tokens.push(token);

    for (const table in state.env[opts.ns].refs) {
      const entry = state.env[opts.ns].refs[table];
      token = new state.Token("table_reference_list_item", "li", 0);
      token.meta = { ...entry };
      tokens.push(token);
    }

    token = new state.Token("table_reference_list_close", opts.listTag, -1);
    token.block = true;
    tokens.push(token);
  };
  return table_reference_list;
}

function table_reference_list_open_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    const title = opts.listTitle ? `<h2 id="list-of-tables">${opts.listTitle}</h2>\n` : "";
    return title + `<${token.tag} class="list-of-tables-list">\n`;
  };
}

function table_reference_list_item_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `  <${token.tag}><a href="#${token.meta.id}">${opts.label} ${token.meta.index}</a>: ${token.meta.caption}</${token.tag}>\n`;
  };
}

function table_reference_list_close_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `</${token.tag}>`;
  };
}

function table_wrapper_open_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    const id = token.attrGet("id");
    return `<figure id="${id}">\n<${token.tag}>\n`;
  };
}

function table_wrapper_close_renderer(opts) {
  return (tokens, idx, options, env /* , self */) => {
    const token = tokens[idx];
    const id = token.meta.origin;
    const caption = token.meta.caption;
    const entry = env[opts.ns].refs[id];
    return (
      `</${token.tag}>\n` +
      `  <figcaption>\n` +
      `    ${opts.injectLabel ? `<a href="#${id}">${opts.label} ${entry.index}</a>: ` : ""}${caption}\n` +
      `  </figcaption>\n` +
      `</figure>\n`
    );
  };
}

function sanitize(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

table_references.defaults = {
  ns: "tables",
  label: "Table",
  injectLabel: true,
  wrap: true,
  list: true,
  listTitle: "List of Tables",
  listTag: "ol",
};

module.exports = table_references;
