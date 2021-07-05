const Token = require("markdown-it/lib/token");

const attribution_references = (md, opts) => {
  opts = loadOptions(opts);

  if (typeof opts.after === "string") {
    if (md.core.ruler.getRules("").find(({ name }) => name === opts.after)) {
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
    const attribution_terminator_open = opts.attribution.terminatorStart;
    const attribution_terminator_close = opts.attribution.terminatorEnd;
    const terminatorLength = attribution_terminator_open.length;
    const line = state.src.substring(pos, Math.min(max, pos + terminatorLength));

    if (line === attribution_terminator_open) {
      const keys = state.src.substring(pos + line.length + 1, max).split(",");

      if (keys.length === 0) return false;
      const id = add_attributions(state, opts, keys);
      state.line++;

      let token = new Token("attribution_parent_open", opts.attribution.wrap.parent.tag, 1);
      token.block = true;
      token.attrSet("id", id);
      token.attrSet("class", opts.attribution.wrap.parent.class);
      token.meta = { keys };

      tokens.push(token);

      if (opts.attribution.top) {
        tokens.push(...generate_attribution(keys, opts, { anchor: id, env: state.env }));
      }

      if (opts.attribution.wrap.child.enable) {
        token = new Token("attribution_child_open", opts.attribution.wrap.child.tag, 1);
        token.attrSet("class", opts.attribution.wrap.child.class);
        tokens.push(token);
      }

      return true;
    } else if (line === attribution_terminator_close) {
      let nesting = 0;
      let token = tokens
        .slice()
        .reverse()
        .find((element /*, index, array*/) => {
          const { type } = element;
          if (type === "attribution_parent_close") {
            nesting++;
          } else if (type === "attribution_parent_open") {
            if (nesting > 0) nesting--;
            else return true;
          }
        });
      if (!token) return false;

      const id = token.attrGet("id");
      const meta = token.meta;

      state.line++;

      if (opts.attribution.wrap.child.enable) {
        token = new Token("attribution_child_close", opts.attribution.wrap.child.tag, -1);
        tokens.push(token);
      }

      if (!opts.attribution.top) {
        tokens.push(...generate_attribution(meta.keys, opts, { anchor: id, env: state.env }));
      }

      token = new Token("attribution_parent_close", opts.attribution.wrap.parent.tag, -1);
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
      token = new Token("heading_open", "h2", 1);
      token.attrSet("id", "list-of-attributions");
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

    token = new Token("attribution_list_open", opts.list.tag, 1);
    token.attrSet("class", opts.list.class);
    token.block = true;
    tokens.push(token);

    for (const ref of state.env[opts.ns].refs) {
      token = new Token("attribution_list_item_open", opts.list.item.tag, 1);
      token.attrSet("id", ref.id);
      token.attrSet("class", opts.list.item.class);
      tokens.push(token);

      const children = [];

      token = new Token("paragraph_open", "span", 1);
      token.block = false;
      token.attrSet("class", opts.attribution.label.class);
      children.push(token);

      token = new Token("text", "", 0);
      token.content = "[" + ref.index + "]";
      children.push(token);

      token = new Token("paragraph_close", "span", -1);
      token.block = false;
      children.push(token);

      token = new Token("text", "", 0);
      token.content = ": ";
      children.push(token);

      children.push(...generate_attribution_list_entry(opts, ref));

      token = new Token("inline", "", 0);
      token.children = children;
      tokens.push(token);

      token = new Token("attribution_list_item_close", opts.list.item.tag, -1);
      tokens.push(token);
    }

    token = new Token("attribution_list_close", opts.list.tag, -1);
    token.block = true;
    tokens.push(token);
  };
  return attribution_list;
}

function add_attributions(state, opts, keys) {
  if (!state.env[opts.ns]) {
    state.env[opts.ns] = {};
  }

  if (!state.env[opts.ns].refs) {
    state.env[opts.ns].refs = [];
  }
  for (const key_annot of keys) {
    const [key, annot] = key_annot.split("|");
    const data = opts.sources.find((source) => key === source.key);
    if (!data) continue;
    if (!state.env[opts.ns].refs.find(({ id }) => id === slugify(key))) {
      state.env[opts.ns].refs.push({
        id: slugify(key),
        index: state.env[opts.ns].refs.length + 1,
      });
    }
  }

  if (!state.env[opts.ns].attributions) {
    state.env[opts.ns].attributions = {};
  }
  const id = keys
    .map((key) => key.split("|")[0])
    .map((key) => slugify(key))
    .join("_");
  if (!state.env[opts.ns].attributions[id]) {
    state.env[opts.ns].attributions[id] = {
      id,
      counter: 1,
    };
  } else {
    state.env[opts.ns].attributions[id].counter++;
  }

  return id + "__" + state.env[opts.ns].attributions[id].counter;
}

function generate_attribution(keys, opts, { anchor = "", env }) {
  const tokens = [];

  token = new Token("paragraph_open", "p", 1);
  token.block = true;
  tokens.push(token);

  let children = [];
  if (opts.attribution.anchor.enable) {
    children.push(...generate_link(`#${anchor}`, opts.attribution.anchor.class, opts.attribution.anchor.content));
  }

  token = new Token("text", "", 0);
  token.content = "[";
  children.push(token);

  for (const key_annot of keys) {
    const [key, annot] = key_annot.split("|");
    const index = env[opts.ns].refs.find(({ id }) => id === slugify(key))?.index;
    children.push(
      ...generate_link(`#${slugify(key)}`, opts.attribution.label.class, annot ? `${index} ${annot}` : index)
    );

    if (key_annot !== keys[keys.length - 1]) {
      token = new Token("text", "", 0);
      token.content = ", ";
      children.push(token);
    }
  }

  token = new Token("text", "", 0);
  token.content = "]";
  children.push(token);

  token = new Token("inline", "", 0);
  token.children = children;
  tokens.push(token);

  token = new Token("paragraph_close", "p", -1);
  tokens.push(token);

  return tokens;
}

function generate_attribution_list_entry(opts, source) {
  const tokens = [];
  if (!opts.list.item.template) return [];
  source = opts.sources.find(({ key }) => slugify(key) === source.id);

  const tags = "<title>|<author>|<license>";
  const r = new RegExp("(" + tags + "|^)(.*?)(?=" + tags + "|$)", "gm");
  let m, token;
  while ((m = r.exec(opts.list.item.template))) {
    let [_, type, text] = m;

    if (type) {
      type = type.substring(1, type.length - 1);
      const [label, href] = source[type];
      if (href) {
        tokens.push(...generate_link(href, type, label));
      } else {
        token = new Token("text", "", 0);
        token.content = label;
        tokens.push(token);
      }
    }

    if (text) {
      token = new Token("text", "", 0);
      token.content = text;
      tokens.push(token);
    }
  }

  return tokens;
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

function slugify(text) {
  return text.replace(/[^\w]/g, "_").replace(/\-+/g, "-").replace(/\-$/, "").toLowerCase();
}

function loadOptions(options) {
  return options
    ? {
        after: typeof options.after === "string" ? options.after : attribution_references.defaults.after,
        ns: options.ns || attribution_references.defaults.ns,
        attribution: {
          top:
            options.attribution && typeof options.attribution.top === "boolean"
              ? options.attribution.top
              : attribution_references.defaults.attribution.top,
          wrap: {
            parent: Object.assign(
              {},
              attribution_references.defaults.attribution.wrap.parent,
              options.attribution && options.attribution.wrap && options.attribution.wrap.parent
                ? options.attribution.wrap.parent
                : {}
            ),
            child: Object.assign(
              {},
              attribution_references.defaults.attribution.wrap.child,
              options.attribution && options.attribution.wrap && options.attribution.wrap.child
                ? options.attribution.wrap.child
                : {}
            ),
          },
          anchor: Object.assign(
            {},
            attribution_references.defaults.attribution.anchor,
            options.attribution && options.attribution.anchor ? options.attribution.anchor : {}
          ),
          label: Object.assign(
            {},
            attribution_references.defaults.attribution.label,
            options.attribution && options.attribution.label ? options.attribution.label : {}
          ),
          terminatorStart:
            options.attribution && options.attribution.terminatorStart
              ? options.attribution.terminatorStart
              : attribution_references.defaults.attribution.terminatorStart,
          terminatorEnd:
            options.attribution && options.attribution.terminatorEnd
              ? options.attribution.terminatorEnd
              : attribution_references.defaults.attribution.terminatorEnd,
        },
        list: {
          enable:
            options.list && typeof options.list.enable === "boolean"
              ? options.list.enable
              : attribution_references.defaults.list.enable,
          title:
            options.list && typeof options.list.title === "string"
              ? options.list.title
              : attribution_references.defaults.list.title,
          tag:
            options.list && typeof options.list.tag === "string"
              ? options.list.tag
              : attribution_references.defaults.list.tag,
          class:
            options.list && typeof options.list.class === "string"
              ? options.list.class
              : attribution_references.defaults.list.class,
          item: Object.assign(
            {},
            attribution_references.defaults.list.item,
            options.list && options.list.item ? options.list.item : {}
          ),
        },
        sources:
          options.sources && Array.isArray(options.sources) ? options.sources : attribution_references.defaults.sources,
      }
    : attribution_references.defaults;
}

attribution_references.defaults = {
  after: false,
  ns: "attributions",
  attribution: {
    top: false,
    terminatorStart: "::: attribution",
    terminatorEnd: ":::",
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
      class: "anchor",
      content: "§",
    },
    label: {
      class: "label",
    },
  },
  list: {
    enable: true,
    title: "List of Attributions",
    tag: "ol",
    class: "list",
    item: {
      tag: "li",
      class: "item",
      template: "<title> (By: <author>, <license>)",
    },
  },
  sources: [],
};

module.exports = attribution_references;
