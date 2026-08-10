import PropTypes from "prop-types";

// Descriptions in src/constants are written as plain lines: some prose, some
// "- " bullets, in whatever order reads best. Rendering that string straight
// into a <p> collapses every newline into a space, so the bullets ran together
// into one long line. This splits it back into paragraphs and real lists, in
// the order the text was written.
const groupLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((groups, line) => {
      if (!line.startsWith("- ")) return [...groups, { type: "text", text: line }];

      const item = line.slice(2).trim();
      const last = groups[groups.length - 1];
      // Consecutive bullets belong to one list, not one list each.
      if (last?.type === "list") {
        return [...groups.slice(0, -1), { type: "list", items: [...last.items, item] }];
      }
      return [...groups, { type: "list", items: [item] }];
    }, []);

const Description = ({ text }) => (
  <div className="mb-4 space-y-3 text-neutral-400">
    {groupLines(text).map((group, i) =>
      group.type === "text" ? (
        <p key={i} className="leading-relaxed">
          {group.text}
        </p>
      ) : (
        <ul key={i} className="space-y-2">
          {group.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-purple-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    )}
  </div>
);

Description.propTypes = { text: PropTypes.string.isRequired };

export default Description;
