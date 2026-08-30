import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { READINGS } from "../data/readings";
import BlogCard from "../components/BlogCard";

const Blogs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pb-24 pt-12">
      <Link
        to="/"
        className="mb-10 inline-block text-sm text-neutral-500 transition hover:text-neutral-300"
      >
        &larr; Niresh Shankar
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="border-b border-neutral-800 pb-10"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-purple-400">
          Reading the source &middot; {READINGS.length} posts
        </p>
        <h1 className="mb-4 text-4xl leading-tight lg:text-6xl">
          <span className="bg-gradient-to-r from-pink-300 via-slate-300 to-purple-400 bg-clip-text text-transparent">
            Blog
          </span>
        </h1>
        <p className="max-w-2xl text-xl text-neutral-400">
          One open-source project at a time, read properly and written up. Not what it does,
          which is in the README, but how it actually works underneath.
        </p>
      </motion.header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {READINGS.map((r, i) => (
          <BlogCard key={r.slug} reading={r} delay={i * 0.06} />
        ))}
      </div>

      <p className="mt-12 border-t border-neutral-800 pt-8 text-sm text-neutral-500">
        Every code block on these pages carries the file and line it came from, and every
        number is one a reader can go and check.
      </p>
    </div>
  );
};

export default Blogs;
