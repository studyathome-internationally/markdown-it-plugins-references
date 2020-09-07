const figure_references = (md, opts) => {
  opts = Object.assign({}, figure_references.defaults, opts);

  const reload = md.core.ruler.getRules("").find(({ name }) => name === "figure_reference") || false;
  if (reload) {
    md.core.ruler.at("figure_reference", figure_reference_rule(opts));
    md.core.ruler.at("figure_reference_list", figure_reference_list_rule(opts));
  } else {
    md.core.ruler.push("figure_reference", figure_reference_rule(opts));
    md.core.ruler.push("figure_reference_list", figure_reference_list_rule(opts));
  }

  md.renderer.rules.figure_reference_list_open = figure_reference_list_open_renderer(opts);
  md.renderer.rules.figure_reference_list_item = figure_reference_list_item_renderer(opts);
  md.renderer.rules.figure_reference_list_close = figure_reference_list_close_renderer(opts);

  if (opts.wrapImage) {
    md.renderer.rules.figure_wrapper = figure_wrapper_renderer(opts, md.renderer.rules.image);
  } else if (reload) {
    md.renderer.rules.figure_wrapper = md.renderer.rules.image;
  }
};

function figure_reference_rule(opts) {
  const figure_reference = (state /* , silent */) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      let { children, type } = state.tokens[i];

      if (type !== "inline") continue;

      for (let j = 0; j < children.length; j++) {
        let token = children[j];
        if (token.type !== "image") continue;

        const titleContent = token.attrGet("title") || token.attrGet("alt");
        if (!titleContent) continue;

        if (opts.wrapImage) token.type = "figure_wrapper";

        let id,
          title = titleContent;
        if (titleContent.split("#").length === 2) {
          [id, title] = titleContent.split("#");
        } else {
          id = sanitize(title);
        }
        token.attrSet("id", opts.wrapImage ? `${id}-img` : id);
        token.attrSet("title", title);
        token.meta = { origin: id };

        if (!state.env[opts.ns]) {
          state.env[opts.ns] = {};
        }
        if (!state.env[opts.ns].refs) {
          state.env[opts.ns].refs = {};
        }
        state.env[opts.ns].refs[id] = {
          id,
          title,
          index: Object.keys(state.env[opts.ns].refs).length + 1,
        };
      }
    }
  };
  return figure_reference;
}

function figure_reference_list_rule(opts) {
  const figure_reference_list = (state) => {
    if (!state.env[opts.ns] || !opts.list) return;
    const tokens = state.tokens;

    let token = new state.Token("figure_reference_list_open", opts.listTag, 1);
    token.block = true;
    tokens.push(token);

    for (const id in state.env[opts.ns].refs) {
      const entry = state.env[opts.ns].refs[id];
      token = new state.Token("figure_reference_list_item", "li", 0);
      token.meta = { ...entry };
      tokens.push(token);
    }

    token = new state.Token("figure_reference_list_close", opts.listTag, -1);
    token.block = true;
    tokens.push(token);
  };
  return figure_reference_list;
}

function figure_reference_list_open_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    const title = opts.listTitle ? `<h2 id="list-of-figures">${opts.listTitle}</h2>\n` : "";
    return title + `<${token.tag} class="list-of-figures-list">\n`;
  };
}

function figure_reference_list_item_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `  <${token.tag}><a href="#${token.meta.id}">${opts.label} ${token.meta.index}</a>: ${token.meta.title}</${token.tag}>\n`;
  };
}

function figure_reference_list_close_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `</${token.tag}>`;
  };
}

function figure_wrapper_renderer(opts, defaultRenderer) {
  return (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const id = token.meta.origin;
    const title = token.attrGet("title");
    const entry = env[opts.ns].refs[id];
    if (id && entry) {
      return (
        `<${opts.wrapTag} id="${id}" class="figure-wrapper">\n` +
        `  <figure>\n` +
        `    ${defaultRenderer(tokens, idx, options, env, self)}\n` +
        `    <figcaption>\n` +
        `      ${opts.injectLabel ? `<a href="#${id}">${opts.label} ${entry.index}</a>: ` : ""}${title}\n` +
        `    </figcaption>\n` +
        `  </figure>\n` +
        `</${opts.wrapTag}>`
      );
    }
  };
}

function sanitize(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

figure_references.defaults = {
  ns: "figures",
  list: true,
  listTitle: "List of Figures",
  listTag: "ol",
  label: "Figure",
  wrapImage: true,
  wrapTag: "div",
  injectLabel: true,
};

module.exports = figure_references;
