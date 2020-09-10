const attribution_references = (md, opts) => {
  opts = Object.assign({}, attribution_references.defaults, opts);

  const reload = md.block.ruler.getRules("").find(({ name }) => name === "attribution") || false;
  if (reload) {
    md.block.ruler.at("attribution", attribution_rule(opts));
    md.core.ruler.at("attribution_list", attribution_list_rule(opts));
  } else {
    md.block.ruler.before("paragraph", "attribution", attribution_rule(opts));
    md.core.ruler.push("attribution_list", attribution_list_rule(opts));
  }

  md.renderer.rules.attribution_open = attribution_open_renderer(opts);
  md.renderer.rules.attribution_close = attribution_close_renderer(opts);

  md.renderer.rules.attribution_list_item = attribution_list_item_renderer(opts);
};

function attribution_rule(opts) {
  const attribution = (state, startLine /* , endLine, silent */) => {
    const tokens = state.tokens;

    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const terminatorLength = opts.terminator.length + opts.terminatorLabel.length + 1;

    const line = state.src.substring(pos, Math.min(max, pos + terminatorLength));
    const attribution_terminator_open = opts.terminator + " " + opts.terminatorLabel;
    const attribution_terminator_close = opts.terminator;

    if (line === attribution_terminator_open) {
      const r = /(?:#([\w-]+)\s+)?([\w-]+)\s+\[(.*?)\]\((.*?)\)\s+\[(.*?)\]\((.*?)\)/;
      const data = state.src.substring(pos + line.length + 1, max);
      const [m, idLabel, licenseLabel, title, titleUrl, author, authorUrl] = r.exec(data);

      if (!m) return false;
      const id = idLabel ? idLabel : slugify(author + "-" + title);
      const license = opts.licenses.find(({ id }) => id === licenseLabel) || licenseLabel;

      state.line++;

      const attributionOpen = new state.Token("attribution_open", opts.wrapTag, 1);
      attributionOpen.block = true;
      attributionOpen.attrSet("id", id);
      attributionOpen.meta = { license, title, titleUrl, author, authorUrl };

      tokens.push(attributionOpen);

      addAttribution(state, opts, id, attributionOpen.meta);

      return true;
    } else if (line === attribution_terminator_close) {
      state.line++;

      const attributionOpen = tokens
        .slice()
        .reverse()
        .find(({ type }) => type === "attribution_open");
      if (!attributionOpen) return false;

      const id = attributionOpen.attrGet("id");
      const meta = attributionOpen.meta;

      const attributionClose = new state.Token("attribution_close", opts.wrapTag, -1);
      attributionClose.block = true;
      attributionClose.meta = { targetId: id, ...meta };

      tokens.push(attributionClose);

      return true;
    }

    return false;
  };
  return attribution;
}

function attribution_list_rule(opts) {
  const attribution_list = (state) => {
    if (!state.env[opts.ns] || !opts.list) return;
    const tokens = state.tokens;
    let token, tokenChild;

    if (opts.listTitle !== "") {
      token = new state.Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-attributions");
      // token.attrSet("class", opts.list.class);
      token.markup = "##";
      token.block = true;
      tokens.push(token);

      token = new state.Token("inline", "", 0);
      tokenChild = new state.Token("text", "", 0);
      // tokenChild.content = opts.list.title;
      tokenChild.content = opts.listTitle;
      token.children = [tokenChild];
      tokens.push(token);

      token = new state.Token("heading_close", "h2", -1);
      tokens.push(token);
    }

    token = new state.Token("attribution_list_open", opts.listTag, 1);
    token.attrSet("class", "list-of-attributions-list");
    token.block = true;
    tokens.push(token);

    for (const id in state.env[opts.ns].refs) {
      const entry = state.env[opts.ns].refs[id];
      token = new state.Token("attribution_list_item", "li", 0);
      token.meta = { ...entry };
      tokens.push(token);
    }

    token = new state.Token("attribution_list_close", opts.listTag, -1);
    token.block = true;
    tokens.push(token);
  };
  return attribution_list;
}

function attribution(token, opts) {
  return `<p>\n<span>${opts.attribution.title}<a href="${token.meta.titleUrl}">${token.meta.title}</a>${opts.attribution.author}<a href="${token.meta.authorUrl}">${token.meta.author}</a>${opts.attribution.license}<a href="${token.meta.license.url.deeds}">${token.meta.license.name} ${token.meta.license.version}</a></span>\n</p>`;
}

function attribution_open_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    const id = token.attrGet("id");
    return `<${token.tag} id="${id}">\n` + `${opts.top ? attribution(token, opts) + "\n" : ""}` + "<div>\n";
  };
}

function attribution_close_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `</div>\n${opts.top ? "" : attribution(token, opts) + "\n"}</${token.tag}>\n`;
  };
}

function attribution_list_item_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `  <${token.tag}><a href="#${token.meta.id}">${opts.label} ${token.meta.index}</a>: ${token.meta.title}</${token.tag}>\n`;
  };
}

function addAttribution(state, opts, id, meta) {
  if (!state.env[opts.ns]) {
    state.env[opts.ns] = {};
  }
  if (!state.env[opts.ns].refs) {
    state.env[opts.ns].refs = {};
  }
  state.env[opts.ns].refs[id] = {
    id,
    ...meta,
    index: Object.keys(state.env[opts.ns].refs).length + 1,
  };
}

function slugify(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

attribution_references.defaults = {
  ns: "attributions",
  top: false,
  label: "Attribution",
  wrapTag: "div",
  list: true,
  listTitle: "List of Attributions",
  listTag: "ol",
  terminator: ":::",
  terminatorLabel: "attribution",
  attribution: {
    title: "Based on: ",
    author: " by ",
    license: ", License: ",
  },
  licenses: [
    {
      id: "cc-by",
      short: "CC BY",
      name: "Creative Commons: Attribution",
      version: "4.0",
      url: {
        deeds: "https://creativecommons.org/licenses/by/4.0/",
        legalCode: "https://creativecommons.org/licenses/by/4.0/legalcode",
      },
    },
    {
      id: "cc-by-sa",
      short: "CC BY-SA",
      name: "Creative Commons: Attribution-ShareAlike",
      version: "4.0",
      url: {
        deeds: "https://creativecommons.org/licenses/by-sa/4.0/",
        legalCode: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
      },
    },
    {
      id: "cc-by-nd",
      short: "CC BY-ND",
      name: "Creative Commons: Attribution-NoDerivs",
      version: "4.0",
      url: {
        deeds: "https://creativecommons.org/licenses/by-nd/4.0/",
        legalCode: "https://creativecommons.org/licenses/by-nd/4.0/legalcode",
      },
    },
    {
      id: "cc-by-nc",
      short: "CC BY-NC",
      name: "Creative Commons: Attribution-NonCommercial",
      version: "4.0",
      url: {
        deeds: "https://creativecommons.org/licenses/by-nc/4.0/",
        legalCode: "https://creativecommons.org/licenses/by-nc/4.0/legalcode",
      },
    },
    {
      id: "cc-by-nc-sa",
      short: "CC BY-NC-SA",
      name: "Creative Commons: Attriubtion-NonCommercial-ShareAlike",
      version: "4.0",
      url: {
        deeds: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        legalCode: "https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode",
      },
    },
    {
      id: "cc-by-nc-nd",
      short: "CC BY-NC-ND",
      name: "Creative Commons: Attribution-NonCommercial-NoDerivs",
      version: "4.0",
      url: {
        licsenseDeeds: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        legalCode: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
      },
    },
  ],
};

module.exports = attribution_references;
