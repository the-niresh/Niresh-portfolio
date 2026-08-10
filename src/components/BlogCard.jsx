import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// One card, used by the home section and by /blogs, so the two never drift.
const BlogCard = ({ reading, delay = 0 }) => (
  <motion.div
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 40 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, delay }}
  >
    <Link
      to={`/blog/${reading.slug}`}
      className="group flex h-full flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-6 transition hover:border-purple-800"
    >
      <span className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-purple-400">
        {reading.published} &middot; {reading.minutes} min
      </span>
      <h3 className="mb-3 text-xl text-neutral-200 transition group-hover:text-purple-200">
        {reading.name}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-400">{reading.excerpt}</p>
      <span className="font-mono text-xs text-neutral-500">Read &rarr;</span>
    </Link>
  </motion.div>
);

BlogCard.propTypes = {
  reading: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    published: PropTypes.string,
    minutes: PropTypes.number,
  }).isRequired,
  delay: PropTypes.number,
};

export default BlogCard;
