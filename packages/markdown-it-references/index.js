const references = (md, opts) => {
  opts = Object.assign({}, references.defaults, opts);

  const reload = md.inline.ruler.getRules("").find(({ name }) => name === "references") || false;
  if (reload) {
    md.inline.ruler.at("references", references_rule(opts));
  } else {
    md.inline.ruler.push("references", references_rule(opts));
  }

  md.renderer.rules.reference = reference_renderer(opts);
};

function references_rule(opts) {
  const references = (state) => {
    const tokens = state.tokens;

    const start = state.pos;
    const max = state.posMax;

    // should be at least 5 chars - "<<x>>"
    if (start + 4 > max) {
      return false;
    }

    if (state.src.charCodeAt(start) !== 0x3c /* < */) {
      return false;
    }
    if (state.src.charCodeAt(start + 1) !== 0x3c /* < */) {
      return false;
    }

    for (pos = start + 2; pos < max - 1; pos++) {
      if (state.src.charCodeAt(pos) === 0x20) {
        return false;
      }
      if (state.src.charCodeAt(pos) === 0x0a /* \n */) {
        return false;
      }
      if (state.src.charCodeAt(pos) === 0x3e /* > */ && state.src.charCodeAt(pos + 1) === 0x3e) {
        break;
      }
    }

    // no empty references
    if (pos === start + 2) {
      return false;
    }

    if (state.pending) {
      state.pushPending();
    }

    const targetId = state.src.slice(start + 2, pos);
    token = new state.Token("reference", "", 0);
    token.content = targetId;
    token.meta = { targetId };
    tokens.push(token);

    state.pos = pos + 2;
    state.posMax = max;
    return true;
  };
  return references;
}

function reference_renderer(opts) {
  return (tokens, idx, options, env /* , self */) => {
    const token = tokens[idx];
    const id = token.meta.targetId;

    let label, index, renderer;
    for (const [
      ns,
      nsLabel,
      customRenderer = (id, label, index) => `<a href="#${id}">${label} ${index}</a>`,
    ] of opts.labels) {
      if (env[ns] && env[ns].refs && env[ns].refs[id]) {
        const entry = env[ns].refs[id];
        label = nsLabel;
        index = entry.index;
        renderer = customRenderer;
        break;
      }
    }
    if (label) {
      return renderer(id, label, index);
    }
    return `&lt;&lt;${token.meta.targetId}&gt;&gt;`;
  };
}

references.defaults = {
  labels: [
    ["figures", "Figure"],
    ["tables", "Table"],
    ["attributions", "Attribution"],
  ],
};

module.exports = references;
