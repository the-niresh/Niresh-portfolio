import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getReading, READINGS, CONCLUSION } from "../data/readings";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay },
});

const NotFound = () => (
  <div className="pt-32 pb-24 text-center">
    <h1 className="mb-4 text-4xl">Nothing here</h1>
    <p className="mb-8 text-neutral-400">That reading does not exist yet.</p>
    <div className="flex flex-wrap justify-center gap-3">
      {READINGS.map((r) => (
        <Link
          key={r.slug}
          to={`/projects/${r.slug}`}
          className="rounded border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-purple-300 transition hover:border-purple-800"
        >
          {r.name}
        </Link>
      ))}
    </div>
  </div>
);

const Reading = () => {
  const { projectName } = useParams();
  const reading = getReading(projectName);
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
          Reading the source &middot; {reading.dates}
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
        </p>
      </motion.header>

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

      <section className="border-t border-neutral-800 pt-12">
        <h2 className="mb-10 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          What I found
        </h2>
        <ol className="space-y-10">
          {reading.findings.map((f, i) => (
            <motion.li key={f.title} {...fade(i * 0.04)} className="flex gap-6">
              <span className="mt-1 font-mono text-sm text-neutral-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-2 text-lg text-neutral-200">{f.title}</h3>
                <p className="max-w-2xl leading-relaxed text-neutral-400">{f.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <motion.section
        {...fade()}
        className="mt-12 rounded-lg border border-neutral-800 bg-neutral-900/40 p-8"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          What I am taking
        </h2>
        <ul className="space-y-3">
          {reading.stealing.map((s) => (
            <li key={s} className="flex gap-3 text-neutral-300">
              <span className="text-purple-400">&rarr;</span>
              <span className="max-w-2xl">{s}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section {...fade()} className="mt-12 border-l-2 border-purple-800 pl-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Verdict
        </h2>
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-300">{reading.verdict}</p>
      </motion.section>

      <motion.section {...fade()} className="mt-16 border-t border-neutral-800 pt-12">
        <h2 className="mb-3 text-2xl text-neutral-200">{CONCLUSION.title}</h2>
        <p className="max-w-2xl leading-relaxed text-neutral-400">{CONCLUSION.body}</p>
      </motion.section>

      <nav className="mt-16 flex flex-wrap gap-4 border-t border-neutral-800 pt-8">
        <span className="w-full text-sm text-neutral-600">Other readings</span>
        {others.map((r) => (
          <Link
            key={r.slug}
            to={`/projects/${r.slug}`}
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
