import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { READINGS } from "../data/readings";

const Blog = () => (
  <div className="border-b border-neutral-900 pb-4">
    <motion.h2
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className="my-20 text-center text-4xl"
    >
      Reading the source
    </motion.h2>
    <p className="mx-auto mb-12 max-w-2xl text-center text-neutral-400">
      One AI coding harness at a time, read properly and written up. Not what it does,
      which is in the README, but how it actually works underneath.
    </p>
    <div className="grid gap-6 lg:grid-cols-3">
      {READINGS.map((r, i) => (
        <motion.div
          key={r.slug}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
        >
          <Link
            to={`/blog/${r.slug}`}
            className="group flex h-full flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-6 transition hover:border-purple-800"
          >
            <span className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-purple-400">
              {r.published} &middot; {r.minutes} min
            </span>
            <h3 className="mb-3 text-xl text-neutral-200 transition group-hover:text-purple-200">
              {r.name}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-400">{r.excerpt}</p>
            <span className="font-mono text-xs text-neutral-500">Read &rarr;</span>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Blog;
