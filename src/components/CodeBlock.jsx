// Code display for the source-reading write-ups.
//
// No highlighting library. A blog page has a small JS budget and the whole job
// here is comments, strings, keywords and numbers - about forty lines of regex.
// The tokeniser returns React nodes rather than HTML, so there is no
// dangerouslySetInnerHTML anywhere near source text pasted out of other
// people's repositories.

import PropTypes from "prop-types";

const RUST = "as|async|await|break|const|continue|crate|else|enum|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|type|unsafe|use|where|while|dyn";
const TS = "as|async|await|break|case|catch|class|const|continue|default|else|enum|export|extends|finally|for|function|if|implements|import|in|interface|let|new|of|readonly|return|switch|this|throw|try|type|typeof|var|void|while|yield";

const LANGS = {
  rust: { comment: "//[^\\n]*", keywords: RUST },
  ts: { comment: "//[^\\n]*", keywords: TS },
  yaml: { comment: "#[^\\n]*", keywords: "true|false|null" },
  sbpl: { comment: ";[^\\n]*", keywords: "allow|deny|version|require-all|require-any" },
  text: { comment: "(?!x)x", keywords: "(?!x)x" },
};

const CLASS = {
  comment: "text-neutral-500 italic",
  str: "text-emerald-300/90",
  kw: "text-purple-300",
  num: "text-amber-200/90",
};

const tokenise = (source, lang) => {
  const spec = LANGS[lang] || LANGS.text;
  const re = new RegExp(
    [
      `(?<comment>${spec.comment})`,
      `(?<str>"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')`,
      `(?<kw>\\b(?:${spec.keywords})\\b)`,
      `(?<num>\\b\\d+(?:\\.\\d+)?\\b)`,
    ].join("|"),
    "g",
  );

  const out = [];
  let cursor = 0;
  let key = 0;

  for (const match of source.matchAll(re)) {
    const kind = Object.keys(match.groups).find((k) => match.groups[k] !== undefined);
    if (!kind) continue;
    if (match.index > cursor) out.push(source.slice(cursor, match.index));
    out.push(
      <span key={(key += 1)} className={CLASS[kind]}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) out.push(source.slice(cursor));
  return out;
};

// `file` is the path and line range the snippet came from. It is not decoration:
// it is the thing that lets a reader disagree with the write-up.
const CodeBlock = ({ file, lang = "text", code, caption }) => (
  <figure className="my-7">
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950/80">
      {file ? (
        <div className="flex items-center gap-2 border-b border-neutral-800/80 bg-neutral-900/60 px-4 py-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500/70" />
          <code className="truncate font-mono text-[11px] tracking-tight text-neutral-400">
            {file}
          </code>
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code className="font-mono text-neutral-200">{tokenise(code.replace(/\n$/, ""), lang)}</code>
      </pre>
    </div>
    {caption ? (
      <figcaption className="mt-2 text-sm text-neutral-500">{caption}</figcaption>
    ) : null}
  </figure>
);

CodeBlock.propTypes = {
  file: PropTypes.string,
  lang: PropTypes.oneOf(Object.keys(LANGS)),
  code: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default CodeBlock;
