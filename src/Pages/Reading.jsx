import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { getReading, READINGS, CONCLUSION } from "../data/readings";
import CodeBlock from "../components/CodeBlock";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay },
});

// Where a heading counts as "the one being read". Roughly a third of the way
// down, which is where the eye actually sits.
const READING_LINE = 150;

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ── inline `code` inside prose ──────────────────────────────────────────── */

const inline = (text) =>
  text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={i}
        className="rounded bg-neutral-800/70 px-1.5 py-0.5 font-mono text-[0.85em] text-purple-200"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );

/* ── blocks ──────────────────────────────────────────────────────────────── */

const Figure = ({ src, alt, caption, priority = false }) => (
  <figure className="my-8">
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-white p-3 shadow-lg shadow-black/40">
      <img
        src={src}
        alt={alt || caption}
        width="1280"
        height="640"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-auto w-full"
      />
    </div>
    {caption ? (
      <figcaption className="mt-3 text-sm text-neutral-500">{caption}</figcaption>
    ) : null}
  </figure>
);

Figure.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  caption: PropTypes.string,
  priority: PropTypes.bool,
};

// The comparison against his own exchange. Visually separate on purpose: it is
// the only part of the page that is first-hand, and it should not read as more
// of the same commentary.
const MineBlock = ({ text, file, lang, code }) => (
  <aside className="my-8 rounded-lg border border-purple-900/50 bg-purple-950/10 p-6">
    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-purple-400">
      In my own code
    </p>
    <p className="leading-relaxed text-neutral-300">{inline(text)}</p>
    {code ? (
      <div className="-mb-2">
        <CodeBlock file={file} lang={lang} code={code} />
      </div>
    ) : null}
  </aside>
);

MineBlock.propTypes = {
  text: PropTypes.string.isRequired,
  file: PropTypes.string,
  lang: PropTypes.string,
  code: PropTypes.string,
};

const NoteBlock = ({ text }) => (
  <p className="my-7 border-l-2 border-neutral-700 py-1 pl-5 leading-relaxed text-neutral-400">
    {inline(text)}
  </p>
);

NoteBlock.propTypes = { text: PropTypes.string.isRequired };

const OpenBlock = ({ items }) => (
  <div className="my-8 rounded-lg border border-dashed border-neutral-700 p-6">
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
      Still do not know
    </p>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-neutral-400">
          <span className="mt-1 shrink-0 font-mono text-xs text-neutral-600">?!</span>
          <span>{inline(item)}</span>
        </li>
      ))}
    </ul>
  </div>
);

OpenBlock.propTypes = { items: PropTypes.arrayOf(PropTypes.string).isRequired };

const Block = ({ block }) => {
  switch (block.t) {
    case "h":
      return (
        <h2
          id={slugify(block.text)}
          className="mt-16 scroll-mt-24 border-t border-neutral-800/80 pt-8 text-2xl text-neutral-100"
        >
          {block.text}
        </h2>
      );
    case "p":
      return <p className="my-5 leading-[1.75] text-neutral-300">{inline(block.text)}</p>;
    case "pull":
      return (
        <p className="my-9 text-xl leading-relaxed text-neutral-200">{inline(block.text)}</p>
      );
    case "code":
      return (
        <CodeBlock file={block.file} lang={block.lang} code={block.code} caption={block.caption} />
      );
    case "fig":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} />;
    case "mine":
      return (
        <MineBlock text={block.text} file={block.file} lang={block.lang} code={block.code} />
      );
    case "note":
      return <NoteBlock text={block.text} />;
    case "open":
      return <OpenBlock items={block.items} />;
    case "list":
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-neutral-300">
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-purple-500" />
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
};

Block.propTypes = { block: PropTypes.object.isRequired };

/* ── contents, with the current section always marked ────────────────────── */

const Contents = ({ headings, activeId }) => {
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeId) return;
    const link = nav.querySelector(`[href="#${CSS.escape(activeId)}"]`);
    // A correct highlight that sits outside the scrolled box is no highlight.
    if (link && nav.scrollHeight > nav.clientHeight) {
      link.scrollIntoView({ block: "nearest" });
    }
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      aria-label="On this page"
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600">
        On this page
      </p>
      <ul className="space-y-1 border-l border-neutral-800">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                className={
                  isActive
                    ? "-ml-px block border-l-2 border-purple-400 bg-purple-500/10 py-1.5 pl-4 pr-2 text-sm font-medium text-purple-200"
                    : "-ml-px block border-l-2 border-transparent py-1.5 pl-4 pr-2 text-sm text-neutral-500 transition hover:border-neutral-600 hover:text-neutral-300"
                }
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

Contents.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeId: PropTypes.string,
};

const useScrollSpy = (headings) => {
  const [activeId, setActiveId] = useState(headings[0]?.id);
  const frame = useRef(0);

  const measure = useCallback(() => {
    if (!headings.length) return;

    // Bottom of the page: the last section wins outright, or a short final
    // section could never be the active one.
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (atBottom) {
      setActiveId(headings[headings.length - 1].id);
      return;
    }

    let current = headings[0].id;
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.getBoundingClientRect().top <= READING_LINE) current = h.id;
    }
    setActiveId(current);
  }, [headings]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  return activeId;
};

/* ── page ────────────────────────────────────────────────────────────────── */

const NotFound = () => (
  <div className="pb-24 pt-32 text-center">
    <h1 className="mb-4 text-4xl">Nothing here</h1>
    <p className="mb-8 text-neutral-400">That reading does not exist yet.</p>
    <div className="flex flex-wrap justify-center gap-3">
      {READINGS.map((r) => (
        <Link
          key={r.slug}
          to={`/blog/${r.slug}`}
          className="rounded border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-purple-300 transition hover:border-purple-800"
        >
          {r.name}
        </Link>
      ))}
    </div>
  </div>
);

const Reading = () => {
  const { slug } = useParams();
  const reading = getReading(slug);

  const headings = useMemo(
    () => [
      ...(reading?.body ?? [])
        .filter((b) => b.t === "h")
        .map((b) => ({ id: slugify(b.text), text: b.text })),
      // The conclusion renders below the body but is still a section of the
      // page. Leaving it out let the scroll-spy mark a heading the reader had
      // already scrolled past, and the bottom-of-page rule made that permanent.
      { id: slugify(CONCLUSION.title), text: CONCLUSION.title },
    ],
    [reading],
  );

  const activeId = useScrollSpy(headings);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!reading) return <NotFound />;

  const others = READINGS.filter((r) => r.slug !== reading.slug);

  return (
    <article className="pb-24 pt-12">
      <Link
        to="/"
        className="mb-10 inline-block text-sm text-neutral-500 transition hover:text-neutral-300"
      >
        &larr; Niresh Shankar
      </Link>

      <motion.header {...fade()} className="border-b border-neutral-800 pb-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-purple-400">
          Reading the source &middot; {reading.published || reading.dates} &middot;{" "}
          {reading.minutes} min
        </p>
        <h1 className="mb-4 text-4xl leading-tight lg:text-6xl">
          <span className="bg-gradient-to-r from-pink-300 via-slate-300 to-purple-400 bg-clip-text text-transparent">
            {reading.name}
          </span>
        </h1>
        <p className="max-w-2xl text-xl text-neutral-400">{reading.tagline}</p>
        <p className="mt-6 font-mono text-xs text-neutral-500">
          by {reading.owner} &middot;{" "}
          <a
            href={reading.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition hover:text-purple-300"
          >
            source
          </a>
          {reading.readAt ? ` · read at ${reading.readAt}` : null}
        </p>
      </motion.header>

      {reading.hero ? (
        <motion.div {...fade(0.03)}>
          <Figure
            src={reading.hero.src}
            alt={reading.hero.alt}
            caption={reading.hero.caption}
            priority
          />
        </motion.div>
      ) : null}

      <motion.section {...fade(0.05)} className="grid gap-10 py-12 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            What it is
          </h2>
          <p className="max-w-2xl leading-relaxed text-neutral-300">{reading.whatItIs}</p>
        </div>
        <div className="flex flex-col justify-center rounded-lg border border-neutral-800 bg-neutral-900/40 px-8 py-6 text-center">
          <span className="font-mono text-4xl text-purple-300">{reading.headline.value}</span>
          <span className="mt-2 max-w-[16rem] text-xs text-neutral-500">
            {reading.headline.label}
          </span>
        </div>
      </motion.section>

      <div className="gap-14 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 max-w-[46rem]">
          {reading.body.map((block, i) => (
            <Block key={`${block.t}-${i}`} block={block} />
          ))}
        </div>

        <div className="hidden lg:block">
          <Contents headings={headings} activeId={activeId} />
        </div>
      </div>

      <motion.section {...fade()} className="mt-16 border-t border-neutral-800 pt-12">
        <h2
          id={slugify(CONCLUSION.title)}
          className="mb-3 scroll-mt-24 text-2xl text-neutral-200"
        >
          {CONCLUSION.title}
        </h2>
        <p className="max-w-2xl leading-relaxed text-neutral-400">{CONCLUSION.body}</p>
        {CONCLUSION.image ? (
          <div className="max-w-2xl">
            <Figure src={CONCLUSION.image.src} alt={CONCLUSION.image.alt} />
          </div>
        ) : null}
      </motion.section>

      <nav className="mt-16 flex flex-wrap gap-4 border-t border-neutral-800 pt-8">
        <span className="w-full text-sm text-neutral-600">Other readings</span>
        {others.map((r) => (
          <Link
            key={r.slug}
            to={`/blog/${r.slug}`}
            className="rounded border border-neutral-800 bg-neutral-900/60 px-4 py-3 transition hover:border-purple-800"
          >
            <span className="block text-neutral-200">{r.name}</span>
            <span className="block max-w-xs text-xs text-neutral-500">{r.tagline}</span>
          </Link>
        ))}
      </nav>
    </article>
  );
};

export default Reading;
