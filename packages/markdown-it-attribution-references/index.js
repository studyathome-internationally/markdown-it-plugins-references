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

  md.renderer.rules.attribution_list_open = attribution_list_open_renderer(opts);
  md.renderer.rules.attribution_list_item = attribution_list_item_renderer(opts);
  md.renderer.rules.attribution_list_close = attribution_list_close_renderer(opts);
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
      const id = idLabel ? idLabel : sanitize(author + "-" + title);
      const license = opts.licenses.find(({ id }) => id === licenseLabel) || licenseLabel;

      state.line++;

      const attributionOpen = new state.Token("attribution_open", opts.wrapTag, 1);
      attributionOpen.block = true;
      attributionOpen.attrSet("id", id);
      attributionOpen.attrSet("class", opts.class);
      attributionOpen.meta = { license, title, titleUrl, author, authorUrl };

      tokens.push(attributionOpen);

      if (!state.env[opts.ns]) {
        state.env[opts.ns] = {};
      }
      if (!state.env[opts.ns].refs) {
        state.env[opts.ns].refs = {};
      }
      state.env[opts.ns].refs[id] = {
        id,
        ...attributionOpen.meta,
        index: Object.keys(state.env[opts.ns].refs).length + 1,
      };

      return true;
    } else if (line === attribution_terminator_close) {
      state.line++;

      const attributionClose = new state.Token("attribution_close", opts.tag, -1);
      attributionClose.block = true;

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

    let token = new state.Token("attribution_list_open", opts.listTag, 1);
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

function attribution_open_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    const id = token.attrGet("id");
    const className = token.attrGet("class");
    return (
      `<${token.tag} id="${id}" class="${className}">\n` +
      `<p>\n` +
      `<a href="#${id}" class="attribution-anchor">#</a>` +
      `<span>Based on: <a href="${token.meta.titleUrl}">${token.meta.title}</a> by <a href="${token.meta.authorUrl}">${token.meta.author}</a>, License: <a href="${token.meta.license.url.deeds}">${token.meta.license.name} ${token.meta.license.version}</a></span>` +
      "</p>\n" +
      "<div>\n"
    );
  };
}

function attribution_close_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `</div></${token.tag}>\n`;
  };
}

function attribution_list_open_renderer(opts) {
  return function (tokens, idx /* , options, env, self */) {
    const token = tokens[idx];
    return (
      '<h2 id="list-of-attributions"><a href="#list-of-attributions" class="header-anchor">#</a>' +
      opts.listTitle +
      "</h2>\n" +
      `<${token.tag} class="list-of-attributions-list">\n`
    );
  };
}

function attribution_list_item_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `  <${token.tag}><a href="#${token.meta.id}">${opts.label} ${token.meta.index}</a>: ${token.meta.title}</${token.tag}>\n`;
  };
}

function attribution_list_close_renderer(opts) {
  return (tokens, idx /* , options, env, self */) => {
    const token = tokens[idx];
    return `</${token.tag}>`;
  };
}

function sanitize(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

attribution_references.defaults = {
  ns: "attributions",
  list: true,
  listTitle: "List of Attributions",
  listTag: "ol",
  label: "Attribution",
  wrapTag: "div",
  terminator: ":::",
  terminatorLabel: "attribution",
  class: "attribution-container",
  // https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licences
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
