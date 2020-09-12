const Token = require("markdown-it/lib/token");

const attribution_references = (md, opts) => {
  opts = loadOptions(opts);

  if (typeof opts.after === "string") {
    if (md.block.ruler.getRules("").find(({ name }) => name === opts.after)) {
      md.core.ruler.after(opts.after, "attribution_list", attribution_list_rule(opts));
    }
  } else {
    md.core.ruler.push("attribution_list", attribution_list_rule(opts));
  }
  md.block.ruler.before("paragraph", "attribution", attribution_rule(opts));
};

function attribution_rule(opts) {
  const attribution = (state, startLine /* , endLine, silent */) => {
    const tokens = state.tokens;

    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const terminatorLength = opts.attribution.terminator.length + opts.attribution.label.length + 1;

    const line = state.src.substring(pos, Math.min(max, pos + terminatorLength));
    const attribution_terminator_open = opts.attribution.terminator + " " + opts.attribution.label;
    const attribution_terminator_close = opts.attribution.terminator;

    if (line === attribution_terminator_open) {
      const r = /(?:#([\w-]+)\s+)?([\w-]+)\s+\[(.*?)\]\((.*?)\)\s+\[(.*?)\]\((.*?)\)/;
      const data = state.src.substring(pos + line.length + 1, max);
      const [m, idLabel, licenseLabel, title, titleUrl, author, authorUrl] = r.exec(data);

      if (!m) return false;
      const id = idLabel ? idLabel : slugify(author + "-" + title);
      const license = opts.attribution.licenses.find(({ id }) => id === licenseLabel) || licenseLabel;

      state.line++;

      let token = new state.Token("attribution_parent_open", opts.wrap.parent.tag, 1);
      token.block = true;
      token.attrSet("id", id);
      token.attrSet("class", opts.wrap.parent.class);
      token.meta = { license, title, titleUrl, author, authorUrl };

      tokens.push(token);
      add_attribution(state, opts, id, token.meta);

      if (opts.attribution.top) {
        insert_attribution(state, id, token.meta, opts);
      }

      if (opts.wrap.child.enable) {
        token = new state.Token("attribution_child_open", opts.wrap.child.tag, 1);
        token.attrSet("class", opts.wrap.child.class);
        tokens.push(token);
      }

      return true;
    } else if (line === attribution_terminator_close) {
      let token = tokens
        .slice()
        .reverse()
        .find(({ type }) => type === "attribution_parent_open");
      if (!token) return false;

      const id = token.attrGet("id");
      const meta = token.meta;

      state.line++;

      if (opts.wrap.child.enable) {
        token = new state.Token("attribution_child_close", opts.wrap.child.tag, -1);
        tokens.push(token);
      }

      if (!opts.attribution.top) {
        insert_attribution(state, id, meta, opts);
      }

      token = new state.Token("attribution_parent_close", opts.wrap.parent.tag, -1);
      token.block = true;
      token.meta = { targetId: id, ...meta };

      tokens.push(token);

      return true;
    }

    return false;
  };
  return attribution;
}

function attribution_list_rule(opts) {
  const attribution_list = (state) => {
    if (!state.env[opts.ns] || !opts.list.enable) return;
    const tokens = state.tokens;
    let token, tokenChild;

    if (opts.list.title !== "") {
      token = new state.Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-attributions");
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

    token = new state.Token("attribution_list_open", opts.list.tag, 1);
    token.attrSet("class", opts.list.class);
    token.block = true;
    tokens.push(token);

    for (const id in state.env[opts.ns].refs) {
      const entry = state.env[opts.ns].refs[id];
      token = new state.Token("attribution_list_item_open", opts.list.item.tag, 1);
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
        if (opts.list.item.text) {
          token = new Token("text", "", 0);
          token.content = ": ";
          children.push(token);
        }
      }

      if (opts.list.item.text) {
        insert_title(children, opts.list.item.text, entry, opts);
      }

      token = new Token("inline", "", 0);
      token.children = children;
      tokens.push(token);

      token = new Token("attribution_list_item_close", opts.list.item.tag, -1);
      tokens.push(token);
    }

    token = new state.Token("attribution_list_close", opts.list.tag, -1);
    token.block = true;
    tokens.push(token);
  };
  return attribution_list;
}

function add_attribution(state, opts, id, meta) {
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

function insert_title(tokens, text, meta, opts) {
  const r = /(.*?)<(title|author|license)>(.*?)/gm;
  let m, token;
  while ((m = r.exec(text))) {
    const [_, before, type, after] = m;

    token = new Token("text", "", 0);
    token.content = before;
    tokens.push(token);

    if (type === "author") {
      tokens.push(...generate_link(meta.authorUrl, "", meta.author));
    } else if (type === "title") {
      tokens.push(...generate_link(meta.titleUrl, "", meta.title));
    } else if (type === "license") {
      tokens.push(
        ...generate_link(
          typeof meta.license === "string" ? "" : meta.license.url.deeds,
          "",
          typeof meta.license === "string" ? meta.license : `${meta.license.name} ${meta.license.version}`
        )
      );
    }

    token = new Token("text", "", 0);
    token.content = after;
    tokens.push(token);
  }
}

function insert_attribution(state, id, meta, opts) {
  const tokens = state.tokens;
  let token = new Token("paragraph_open", "p", 1);
  token.block = true;
  tokens.push(token);

  let children = [];
  if (opts.anchor.enable) {
    children.push(...generate_link(`#${id}`, opts.anchor.class, opts.anchor.content));
  }

  if (opts.label.enable) {
    const index = state.env[opts.ns].refs[id].index;
    children.push(...generate_link(`#${id}`, opts.label.class, opts.label.text.replace(opts.label.placeholder, index)));
  }

  if (opts.attribution.text) {
    token = new state.Token("attribution_text_open", "span", 1);
    children.push(token);

    insert_title(children, opts.attribution.text, meta, opts);

    token = new state.Token("attribution_text_close", "span", -1);
    children.push(token);
  }

  token = new state.Token("inline", "", 0);
  token.children = children;
  tokens.push(token);

  token = new state.Token("paragraph_close", "p", -1);
  token.block = true;
  tokens.push(token);
}

function slugify(text) {
  return text.replace(/[^\w]/g, "-").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

function loadOptions(options) {
  return options
    ? {
        ns: options.ns || attribution_references.defaults.ns,
        wrap: {
          parent: Object.assign(
            {},
            attribution_references.defaults.wrap.parent,
            options.wrap && options.wrap.parent ? options.wrap.parent : {}
          ),
          child: Object.assign(
            {},
            attribution_references.defaults.wrap.child,
            options.wrap && options.wrap.child ? options.wrap.child : {}
          ),
        },
        anchor: Object.assign({}, attribution_references.defaults.anchor, options.anchor || {}),
        label: Object.assign({}, attribution_references.defaults.label, options.label || {}),
        list: {
          enable:
            options.list && typeof options.list.enable === "boolean"
              ? options.list.enable
              : attribution_references.defaults.list.enable,
          class:
            options.list && typeof options.list.class === "string"
              ? options.list.class
              : attribution_references.defaults.list.class,
          title:
            options.list && typeof options.list.title === "string"
              ? options.list.title
              : attribution_references.defaults.list.title,
          tag:
            options.list && typeof options.list.tag === "string"
              ? options.list.tag
              : attribution_references.defaults.list.tag,
          item: Object.assign(
            {},
            attribution_references.defaults.list.item,
            options.list && options.list.item ? options.list.item : {}
          ),
        },
        attribution: {
          top:
            options.attribution && typeof options.attribution.top === "boolean"
              ? options.attribution.top
              : attribution_references.defaults.attribution.top,
          terminator:
            options.attribution && typeof options.attribution.terminator === "string"
              ? options.attribution.terminator
              : attribution_references.defaults.attribution.terminator,
          label:
            options.attribution && typeof options.attribution.label === "string"
              ? options.attribution.label
              : attribution_references.defaults.attribution.label,
          text:
            options.attribution && typeof options.attribution.text === "string"
              ? options.attribution.text
              : attribution_references.defaults.attribution.text,
          licenses:
            options.attribution && Array.isArray(options.attribution.licenses)
              ? options.attribution.licenses
              : attribution_references.defaults.attribution.licenses,
        },
      }
    : attribution_references.defaults;
}

attribution_references.defaults = {
  after: false,
  ns: "attributions",
  wrap: {
    parent: {
      tag: "div",
      class: "parent",
    },
    child: {
      enable: true,
      tag: "div",
      class: "child",
    },
  },
  anchor: {
    enable: true,
    content: "§",
    class: "anchor",
  },
  label: {
    enable: true,
    text: "Attribution #",
    placeholder: "#",
    class: "label",
  },
  list: {
    enable: true,
    class: "list",
    title: "List of Attributions",
    tag: "ol",
    item: {
      tag: "li",
      href: true,
      class: "item",
      label: true,
      text: "<title> (By: <author>, <license>)",
    },
  },
  attribution: {
    top: false,
    terminator: ":::",
    label: "attribution",
    text: "Based on: <title> by <author>, License: <license>",
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
  },
};

module.exports = attribution_references;
