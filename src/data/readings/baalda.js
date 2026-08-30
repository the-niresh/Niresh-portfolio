import impossible from "../../assets/readings/img-0075-baalda-impossible.png";
import bridge from "../../assets/readings/img-0076-baalda-bridge.png";
import graph from "../../assets/readings/img-0077-baalda-graph.png";
import versus from "../../assets/readings/img-0078-baalda-vs-obsidian.png";

const baalda = {
  slug: "baalda",
  name: "Baalda",
  published: "14 September 2026",
  minutes: 12,
  excerpt:
    "A note app where plain markdown on disk and real-time collaboration are both true at once. Everyone said that was impossible. The bridge that makes it work is about nine lines.",
  owner: "Naveed Harri",
  repo: "https://github.com/naveedharri/baalda",
  readAt: "7718e90",
  dates: "14 September 2026",
  tagline: "Two people and an AI, editing the same .md file, and none of them clobbers the others.",
  whatItIs:
    "Baalda is a local-first desktop app for notes. Every note is a plain .md file on your own disk, and the same files sync live between people with cursors, like a shared doc. Tauri v2, Rust core, React and CodeMirror on top. I read it because I did not believe both halves could be true.",
  hero: {
    src: impossible,
    alt: "AI-editable markdown and real-time collaboration run on foundations that do not mix",
    caption:
      "The seed research scanned 41 open-source Obsidian-likes against 12 requirements and found none that satisfied all 12. That is not a gap in the market, it is a structural conflict, and this write-up is about how they got around it.",
  },
  headline: { value: "9 lines", label: "of logic that make the whole product possible" },

  body: [
    {
      t: "p",
      text: "My second brain is a folder of markdown files. My coding agents read and write it directly, and that only works because the notes are ordinary files with nothing clever in the way. No API, no export, no plugin. `cat`, `grep`, `sed`, done.",
    },
    {
      t: "p",
      text: "The limit has always been that it is mine alone. Two people cannot type in the same note. The moment a team needs shared context you move to something like Google Docs, where live editing works perfectly and there is no longer a file you own. I had accepted that as a law of physics.",
    },
    {
      t: "note",
      text: "So when somebody told me there was a tool doing both, my first reaction was that they had misunderstood their own product. I cloned it to prove that. This write-up is me being wrong..?!",
    },

    { t: "h", text: "Why every other tool has to pick a side" },
    {
      t: "p",
      text: "The conflict is real and it is not about effort. It is about what each half needs to be true underneath.",
    },
    {
      t: "list",
      items: [
        "**AI-editable notes need loose markdown on disk as the source of truth.** If the truth lives anywhere else, a file on disk is a stale export and an agent editing it is editing a copy.",
        "**Real-time collaboration is always built on a CRDT.** Yjs, Automerge, take your pick. A CRDT's state is an opaque binary blob. Your AI cannot read it, `git diff` shows you nothing, and a text editor shows you noise.",
      ],
    },
    {
      t: "pull",
      text: "Two sources of truth, and neither can be derived from the other on demand without losing something. That is why 41 apps got checked and none passed all 12 requirements.",
    },

    { t: "h", text: "The bridge, which is the entire product" },
    {
      t: "p",
      text: "Their answer is to have both, and to keep them equal with a two-way bridge. The `.md` file on disk is the **durable** truth, the thing you, your agent and git touch. A per-note Yjs `Y.Text` holding the **raw markdown string** is the **live** truth while the note is open or syncing.",
    },
    {
      t: "p",
      text: "The choice of `Y.Text`-of-markdown rather than a structural CRDT is doing a lot of quiet work here. A structural CRDT models headings and lists and paragraphs as nodes, which means the round-trip to a file is lossy the first time somebody writes markdown it does not have a node for. A string CRDT holding the file's own bytes round-trips exactly.",
    },
    {
      t: "code",
      file: "docs/specs/03-sync-engine.md, the bridge algorithm",
      lang: "text",
      code: `STATE per note:  yText, lastWrittenHash

A. DISK -> CRDT   (file changed by AI, an editor, git, or our own write)
   on watcher event (debounced ~150ms):
     fileText = read(path)
     if sha256(fileText) == lastWrittenHash:   # our own write, echoing back
         return                                #   -> DROP. breaks the loop.
     patches = diff_match_patch(yText.toString(), fileText)
     doc.transact(() => applyPatchesAsInsertDelete(yText, patches), 'disk')

B. CRDT -> DISK   (edit from the local editor OR from a remote peer)
   yText.observe(evt):
     if evt.transaction.origin == 'disk':      # we caused this from the file
         return                                #   -> DROP.
     debounce(~300ms):
       content = yText.toString()
       lastWrittenHash = sha256(content)       # set BEFORE writing, so A's guard sees it
       atomicWrite(path, content)              # temp file + rename
       reindex(path)                           # SQLite FTS5, links, tags`,
      caption: "Read at 7718e90. Three transaction origins matter: 'disk', 'editor', 'remote'.",
    },
    {
      t: "fig",
      src: bridge,
      alt: "The bridge in both directions, with the hash guard that breaks the echo loop",
      caption: "Set the hash before the write, not after. That ordering is the difference between a working bridge and an infinite loop.",
    },
    {
      t: "p",
      text: "**Why the loop closes.** B's write fires A's file watcher. But B set `lastWrittenHash` *before* writing, so by the time A hashes the file the guard already matches and A drops it. Set the hash after the write and there is a window where the watcher fires first, sees a hash it does not recognise, diffs it back into the CRDT, which fires B again. Same nine lines, wrong order, infinite loop.",
    },
    {
      t: "p",
      text: "**Why concurrent edits are safe.** Both a remote update and a local file change funnel into the same `Y.Text` **as operations**. Yjs merges operations. That is its whole job. The rule they write in capitals is: never blindly overwrite `Y.Text` from the file, always diff into it. Overwrite and a remote colleague's half-typed sentence disappears with no error and no way to know it happened.",
    },
    {
      t: "note",
      text: "The spec is honest about the residual risk, which I respect: two edits can still interleave into markdown that is locally invalid syntax. They accept CRDT merge as the MVP behaviour and keep note snapshots for recovery rather than pretending the problem is solved.",
    },
    {
      t: "p",
      text: "One more detail that only shows up if you have been burned before. Diff frequency matters. `diff-match-patch` produces clean minimal patches when it is called often on small changes; one giant diff after a long silence merges badly against concurrent edits. So the ingest debounce is deliberately short, and the diff is always taken against the CRDT's *current* serialization, never a stale copy, or the cursor jumps under the person typing.",
    },
    {
      t: "p",
      text: "And the startup ordering, which is the kind of bug that only appears in production: on sign-in, **pull from the server first, then seed any orphan docs from local markdown**. Reversed, stale disk content seeds a document with a fresh client id, the server's sync step skips the bootstrap, and that device diverges permanently.",
    },

    { t: "h", text: "How the graph actually works" },
    {
      t: "p",
      text: "This is the part people ask me about, because the graph view is the thing that makes an Obsidian-like feel like a brain rather than a folder. It is much less magical than it looks, and that is a compliment.",
    },
    {
      t: "p",
      text: "A wiki link is a regular expression. That is the whole parser.",
    },
    {
      t: "code",
      file: "app/apps/desktop/src/lib/editor/wikilinks.ts:24",
      lang: "ts",
      code: `const WIKILINK_RE = /\\[\\[([^\\]\\n]+)\\]\\]/g;`,
    },
    {
      t: "p",
      text: "That one line drives three separate features: the `[[` autocomplete sourced from the note-title index, the CodeMirror decoration that makes a link look clickable, and the click handler that opens the target. The file is kept dependency-light and origin-agnostic on purpose, so the Yjs binding can be layered on later without touching it.",
    },
    {
      t: "p",
      text: "Resolution is the interesting half. A link is raw text, and the note it points at has both a title and a path. The server matches the raw title against note titles **and** against rel_path stems, case-insensitively, within the same vault. A link that matches nothing is not thrown away, it keeps `toDocId = null`.",
    },
    {
      t: "code",
      file: "app/apps/server/src/http/routes/graph.ts:98",
      lang: "ts",
      code: `toDocId: byTitle.get(l.to_title.toLowerCase()) ?? null,`,
      caption: "Keeping the unresolved link instead of dropping it is what makes a dangling [[link]] visible rather than silently absent.",
    },
    {
      t: "p",
      text: "Then the client assembles the picture. The pure transformation is separated from the IPC calls so it can be tested without a Tauri backend at all, which is a small structural choice I am stealing.",
    },
    {
      t: "code",
      file: "app/apps/desktop/src/lib/graph/buildGraph.ts:42",
      lang: "ts",
      code: `export function assembleGraph(titles: NoteTitle[], rawEdges: GraphEdge[]): Graph {
  const knownIds = new Set(titles.map((t) => t.id));
  ...
  for (const e of rawEdges) {
    if (e.source === e.target) continue;                 // no self-loops
    if (!knownIds.has(e.source) || !knownIds.has(e.target)) continue;  // drop dangling
    const key = \`\${e.source}->\${e.target}\`;
    if (edgeKeys.has(key)) continue;                     // dedupe repeated links
    ...
  }`,
    },
    {
      t: "fig",
      src: graph,
      alt: "The wikilink graph: one hub, its neighbours, and the edges between them",
      caption: "linkCount is the number of distinct edges touching a node, counted on both ends, which is why hub notes visibly swell.",
    },
    {
      t: "p",
      text: "The comment above that function is the part worth reading twice. The old version called `getBacklinks` **once per note**, which is one IPC round-trip per note and stalls completely on a large vault. The new version is two calls total: every note, and every resolved edge. Then it builds the graph in memory.",
    },
    {
      t: "pull",
      text: "O(1) calls instead of O(n). Most slow features I have ever shipped were shaped exactly like that, and I did not look until a user complained.",
    },
    {
      t: "p",
      text: "One thing that is easy to miss and matters if you are on a team: the graph route is gated. Private by default, and the server restricts the graph to notes the caller may actually read, specifically so a member cannot harvest every private note's id, title and path by hitting the graph endpoint. That is the kind of thing that gets bolted on after a security review, and it is in there already.",
    },

    { t: "h", text: "Would I move off Obsidian" },
    {
      t: "fig",
      src: versus,
      alt: "Obsidian, Google Docs, a shared folder and Baalda placed on two axes",
      caption: "Two axes: are your notes plain files, and can many people edit at once. Only one box has both.",
    },
    {
      t: "p",
      text: "Honest answer: not today, and it is not close. But the reason is not the product.",
    },
    {
      t: "list",
      items: [
        "**What I would gain.** A vault my team can hold at the same time as me. An MCP endpoint gated by the same permissions as a human, so a cloud agent gets exactly the folders a person would. Real-time cursors on the same `.md` I already hand to Claude. Self-hostable, Apache 2.0.",
        "**What I would give up.** Ten years of Obsidian plugins, most of which I do not need and three of which I use constantly. Obsidian Bases. My existing sync scripts, which cost nothing and already work. And the boring one: my vault is currently 100% mine, and every hour of migration is an hour not spent on the thing the vault is about.",
        "**The thing that would flip it.** The day a second person needs to write into my vault. Not read. Write. That is the exact day the plain-files-and-one-editor model stops being a preference and starts being the problem.",
      ],
    },
    {
      t: "mine",
      text: "The pattern I am taking regardless of whether I migrate is the hash guard. My own vault has a sync script and a file watcher, and it has absolutely bitten me: the script writes, the watcher fires, the watcher triggers a re-sync. I solved it with a lock file, which is the worse version of this. A `lastWrittenHash` set before the write is smaller, has no lock to leak, and survives a crash.",
    },
    {
      t: "open",
      items: [
        "What happens when the CRDT and the file genuinely disagree after a long offline period on both sides. The spec says snapshots exist for recovery, but I could not find who decides which side wins, or whether anyone is shown that a decision was made.",
        "Whether `reindex(path)` on every debounced write is cheap enough at the stated scale of millions of notes. It is FTS5 plus links plus tags on one file, so probably yes, but I could not find a number and it is the kind of thing that is fine until it is not.",
        "How an agent editing 40 files in one run interacts with a 150ms ingest debounce. That is exactly the coarse, fast, whole-file rewrite pattern the spec warns diffs badly, and it is also the single most common thing Claude Code does.",
      ],
    },

    { t: "h", text: "What I am taking" },
    {
      t: "list",
      items: [
        "The hash-before-write guard, into my own vault sync. Replacing a lock file.",
        "Splitting the pure transformation out of the IPC layer so the interesting logic is testable without the platform. `assembleGraph` is 30 lines and fully unit tested; `buildGraph` is four lines and needs Tauri.",
        "Two calls instead of one per item, everywhere. I have this exact bug in my own board's activity feed and I now know what it is called.",
        "Keeping unresolved references instead of dropping them. A dangling link you can see is a to-do. A dangling link that silently vanished is a bug you will never find.",
      ],
    },
    {
      t: "p",
      text: "The whole product is a bridge, and the bridge is nine lines. That is not a criticism, it is the point. The hard part was working out which nine.",
    },
  ],
};

export default baalda;
