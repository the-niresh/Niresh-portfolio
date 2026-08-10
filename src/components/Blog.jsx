import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { READINGS } from "../data/readings";
import BlogCard from "./BlogCard";

// The home page shows the newest few. /blogs has the whole list.
const ON_HOME = 3;

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
      {READINGS.slice(0, ON_HOME).map((r, i) => (
        <BlogCard key={r.slug} reading={r} delay={i * 0.08} />
      ))}
    </div>
    <div className="mt-10 text-center">
      <Link
        to="/blogs"
        className="inline-block rounded border border-neutral-800 bg-neutral-900/60 px-5 py-2.5 text-sm text-purple-300 transition hover:border-purple-800 hover:text-purple-200"
      >
        All posts ({READINGS.length}) &rarr;
      </Link>
    </div>
  </div>
);

export default Blog;
