const figure_references = (md, opts) => {
  opts = Object.assign({}, figure_references.defaults, opts);

  const reload = md.core.ruler.getRules("").find(({ name }) => name === "figure_reference") || false;
  if (reload) {
    md.core.ruler.at("figure_reference", figure_reference_rule(opts));
    md.core.ruler.at("figure_reference_list", figure_reference_list_rule(opts));
  } else if (md.core.ruler.getRules("").find(({ name }) => name === "inline")) {
    md.core.ruler.after("inline", "figure_reference", figure_reference_rule(opts), [""]);
    md.core.ruler.after("figure_reference", "figure_reference_list", figure_reference_list_rule(opts));
  } else {
    md.core.ruler.push("figure_reference", figure_reference_rule(opts), [""]);
    md.core.ruler.after("figure_reference", "figure_reference_list", figure_reference_list_rule(opts));
  }

  md.renderer.rules.figure_reference_list_open = figure_reference_list_open_renderer(opts);
  md.renderer.rules.figure_reference_list_item = figure_reference_list_item_renderer(opts);
  md.renderer.rules.figure_reference_list_close = figure_reference_list_close_renderer(opts);
  md.renderer.rules.figure_wrapper = figure_wrapper_renderer(opts, md.renderer.rules.image);
};

function addImage(state, opts, id, title) {
  if (!state.env[opts.ns]) {
    state.env[opts.ns] = {};
  }
  if (!state.env[opts.ns].refs) {
    state.env[opts.ns].refs = {};
  }
  const refs = state.env[opts.ns].refs;
  refs[id] = {
    id,
    title,
    index: Object.keys(refs).length + 1,
  };
}

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
            addImage(state, opts, id, title);

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
          const rImage = /<img[\s\S]*?(?:id\s*?=\s*?"(.*?))"[\s\S]*?\/(?:img)?>/gm;
          let match;
          while ((match = rImage.exec(content))) {
            const [image, id] = match;

            let title;
            const rTitle = /title\s*?=\s*?"(.*?)"/gm.exec(image);
            const rAlt = /alt\s*?=\s*?"(.*?)"/gm.exec(image);

            title = rTitle ? rTitle[1] : rAlt ? rAlt[1] : false;
            if (!title) continue;

            addImage(state, opts, id, title);
          }
        }
      } else {
        for (let j = 0; j < children.length; j++) {
          let token = children[j];
          if (token.type !== "image") continue;

          const titleContent = token.attrGet("title") || token.attrGet("alt");
          if (!titleContent) continue;

          // if (opts.wrap)
          token.type = "figure_wrapper";

          let id,
            title = titleContent;
          if (titleContent.split("#").length === 2) {
            [id, title] = titleContent.split("#");
          } else {
            id = slugify(title);
          }
          // if (!opts.wrap)
          token.attrSet("id", id);
          token.attrSet("title", title);
          token.meta = { targetId: id };

          addImage(state, opts, id, title);
        }
      }
    }
  };
  return figure_reference;
}

function figure_reference_list_rule(opts) {
  const figure_reference_list = (state) => {
    if (!state.env[opts.ns] || !opts.list) return;
    const tokens = state.tokens;
    let token, tokenChild;

    if (opts.list && opts.listTitle !== "") {
      token = new state.Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-figures");
      token.markup = "##";
      token.block = true;
      tokens.push(token);

      token = new state.Token("inline", "", 0);
      tokenChild = new state.Token("text", "", 0);
      tokenChild.content = opts.listTitle;
      token.children = [tokenChild];
      tokens.push(token);

      token = new state.Token("heading_close", "h2", -1);
      tokens.push(token);
    }

    token = new state.Token("figure_reference_list_open", opts.listTag, 1);
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
    return `<${token.tag} class="list-of-figures-list">\n`;
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
    const id = token.meta.targetId;
    const title = token.attrGet("title");
    const entry = env[opts.ns].refs[id];
    const rId = new RegExp('\\s?id="' + id + '"');
    const figure = defaultRenderer(tokens, idx, options, env, self);
    if (id && entry && opts.wrap) {
      return (
        `<figure id="${id}">\n` +
        `  ${figure.replace(rId, "")}\n` +
        `  <figcaption>\n` +
        `    ${opts.injectLabel ? `<a href="#${id}">${opts.label} ${entry.index}</a>: ` : ""}${title}\n` +
        `  </figcaption>\n` +
        `</figure>`
      );
    }
    return figure;
  };
}

function slugify(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

figure_references.defaults = {
  ns: "figures",
  label: "Figure",
  injectLabel: true,
  wrap: true,
  list: true,
  listTitle: "List of Figures",
  listTag: "ol",
};

module.exports = figure_references;
