const figure_references = (md, opts) => {
  opts = Object.assign({}, figure_references.defaults, opts);

  md.core.ruler.push("figure_reference", figure_reference_rule(opts));
  md.core.ruler.push("figure_reference_list", figure_reference_list_rule(opts));

  md.renderer.rules.figure_reference_list_open = figure_reference_list_open_renderer(opts);
  md.renderer.rules.figure_reference_list_item = figure_reference_list_item_renderer(opts);
  md.renderer.rules.figure_reference_list_close = figure_reference_list_close_renderer(opts);

  if (opts.wrapImage) {
    const defaultImageRenderer = md.renderer.rules.image;
    md.renderer.rules.image = figure_wrapper_renderer(opts, defaultImageRenderer);
  }
};

function figure_reference_rule(opts) {
  return (state /* , silent */) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      let { children, type } = state.tokens[i];

      if (type !== "inline") continue;

      for (let j = 0; j < children.length; j++) {
        let token = children[j];
        if (token.type !== "image") continue;

        const title = token.attrGet("title") || token.attrGet("alt");
        if (!title) continue;

        if (!state.env.figures) {
          state.env.figures = {};
        }
        if (!state.env.figures.refs) {
          state.env.figures.refs = {};
        }

        if (title.split("#").length === 2) {
          const [id, newTitle] = title.split("#");
          token.attrSet("title", newTitle);
          token.attrSet("id", id);
          state.env.figures.refs[id] = {
            id,
            alt: token.attrGet("alt"),
            index: Object.keys(state.env.figures.refs).length + 1,
            title: newTitle,
          };
        } else {
          const id = sanitize(title);
          token.attrSet("id", id);
          state.env.figures.refs[id] = {
            id,
            alt: token.attrGet("alt"),
            index: Object.keys(state.env.figures.refs).length + 1,
            title,
          };
        }
      }
    }
  };
}

function figure_reference_list_rule(opts) {
  return (state) => {
    if (!state.env.figures || !opts.list) return;
    const tokens = state.tokens;
    const figures = [];
    tokens
      .filter((tok) => tok.type === "inline")
      .filter((tok) => {
        for (const child of tok.children) {
          if (child.type === "image") {
            figures.push(child);
          }
        }
      });

    let token = new state.Token("figure_reference_list_open", opts.listTag, 1);
    token.block = true;
    tokens.push(token);

    for (const figure of figures) {
      const id = figure.attrGet("id");
      const entry = state.env.figures.refs[id];
      token = new state.Token("figure_reference_list_item", "li", 0);
      token.meta = { ...entry };
      tokens.push(token);
    }

    token = new state.Token("figure_reference_list_close", opts.listTag, -1);
    token.block = true;
    tokens.push(token);
  };
}

function figure_reference_list_open_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return (
      `<h2 id="list-of-figures"><a href="#list-of-figures" class="header-anchor">#</a>` +
      opts.listTitle +
      `</h2>\n` +
      `<${token.tag} class="list-of-figures-list">\n`
    );
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
    const id = token.attrGet("id");
    const title = token.attrGet("title");
    const entry = env.figures.refs[id];
    if (id && entry) {
      return (
        `<${opts.wrapTag} class="figure-wrapper" id="${id}">\n` +
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
  list: true,
  listTitle: "List of Figures",
  listTag: "ol",
  label: "Figure",
  wrapImage: true,
  wrapTag: "div",
  injectLabel: true,
};

module.exports = figure_references;
