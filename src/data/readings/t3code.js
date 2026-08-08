import hero from "../../assets/readings/img-0029-what-t3code-is.png";
import adapters from "../../assets/readings/img-0019-t3code-adapters.png";
import streaming from "../../assets/readings/img-0030-t3code-streaming.png";

const t3code = {
  slug: "t3code",
  name: "t3code",
  published: "5 September 2026",
  minutes: 10,
  excerpt:
    "One web page driving five coding agents. I said the adapter was four verbs. It is fourteen, and the extra ten are where the honesty is.",
  owner: "Theo / Ping.gg",
  repo: "https://github.com/pingdotgg/t3code",
  readAt: "89c5a192f",
  dates: "24 August – 5 September 2026",
  tagline: "One web screen driving five completely different coding agents.",
  whatItIs:
    "Every good coding agent lives in a terminal. t3code puts a web page in front of five of them, so you can drive them from a browser, from a phone, from anywhere that is not the machine they run on. Their own architecture doc still says Codex is the only provider. The code has five.",
  hero: { src: hero, alt: "t3code moves terminal agents into a browser" },
  headline: { value: "14", label: "methods every provider must implement" },

  body: [
    {
      t: "p",
      text: "I picked this one because I have the same problem in a smaller form. My exchange has a Rust back end and a browser front end, and the hard part was never the matching. It was getting a stream of updates into a page without lying to the person reading it.",
    },
    {
      t: "p",
      text: "t3code has that problem five times over, from five different agents that do not agree on anything.",
    },

    { t: "h", text: "I said four verbs. It is fourteen." },
    {
      t: "p",
      text: "I wrote earlier that every provider implements four things: start a session, send a turn, interrupt, roll back. I got that from the diagram I drew, and the diagram came from a skim. Here is the actual contract:",
    },
    {
      t: "code",
      file: "apps/server/src/provider/Services/ProviderAdapter.ts:45",
      lang: "ts",
      code: `export interface ProviderAdapterShape<TError> {
  readonly provider: ProviderDriverKind;
  readonly capabilities: ProviderAdapterCapabilities;
  readonly startSession: (input) => Effect.Effect<ProviderSession, TError>;
  readonly sendTurn: (input) => Effect.Effect<ProviderTurnStartResult, TError>;
  readonly interruptTurn: (threadId, turnId?) => Effect.Effect<void, TError>;
  readonly respondToRequest: (threadId, requestId, decision) => Effect.Effect<void, TError>;
  readonly respondToUserInput: (threadId, requestId, answers) => Effect.Effect<void, TError>;
  readonly stopSession: (threadId) => Effect.Effect<void, TError>;
  readonly listSessions: () => Effect.Effect<ReadonlyArray<ProviderSession>>;
  readonly hasSession: (threadId) => Effect.Effect<boolean>;
  readonly readThread: (threadId) => Effect.Effect<ProviderThreadSnapshot, TError>;
  readonly rollbackThread: (threadId, numTurns) => Effect.Effect<ProviderThreadSnapshot, TError>;
  readonly stopAll: () => Effect.Effect<void, TError>;
  readonly streamEvents: Stream.Stream<ProviderRuntimeEvent>;
}`,
    },
    {
      t: "p",
      text: "Fourteen members. Some of the argument types are trimmed above so it fits on a screen; the shape is exact.",
    },
    {
      t: "p",
      text: "The four I named are the ones you would guess. The ten I missed are the ones that cost money to get right. `hasSession` exists because something has to answer \"is this thread yours\" when five adapters are live. `stopAll` exists because shutdown is different from stopping one session. `capabilities` exists because one of the five cannot change model mid-session and the other four can, and the interface says so out loud rather than throwing at the worst moment.",
    },
    {
      t: "pull",
      text: "A tidy interface is usually a sign nobody has shipped it yet. Fourteen members is what five real agents cost.",
    },
    { t: "fig", src: adapters, caption: "Five agents, four protocols, one shape." },

    { t: "h", text: "Four protocols, not four sets of flags" },
    {
      t: "p",
      text: "The word adapter undersells this. These are not five CLIs with different arguments. They are four genuinely different ways of talking:",
    },
    {
      t: "list",
      items: [
        "Codex through `codex app-server`, with a hand-written client in `packages/effect-codex-app-server`.",
        "Claude through the Agent SDK's `query()`, not the raw CLI, which buys typed messages, hooks and permission callbacks for free.",
        "Cursor and Grok over ACP, through their own client in `packages/effect-acp`, with an xAI extension bolted on top.",
        "OpenCode as plain HTTP against `opencode serve`.",
      ],
    },
    {
      t: "p",
      text: "The interesting decision is that the code meets each one on its own terms instead of flattening them to whatever all five can do. `capabilities` is the seam that makes that possible. Without it you get the usual integration disease: everything reduced to the weakest member.",
    },

    { t: "h", text: "The bug that made me like this repo" },
    {
      t: "p",
      text: "Their dev runner picks a port. Before checking whether the port is free, it checks whether a browser will even talk to it:",
    },
    {
      t: "code",
      file: "scripts/dev-runner.ts:32",
      lang: "ts",
      code: `// HTTP(S) requests to these ports are blocked by the Fetch standard before a
// browser reaches the network. Keep the complete list here so explicit or
// future wider offsets cannot produce a URL that curl accepts but browsers
// reject. https://fetch.spec.whatwg.org/#port-blocking
const FETCH_BAD_PORTS = new Set([
  0, 1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79, 87, 95, 101, 102,
  // ... the whole list
  6669, 6679, 6697, 10080,
]);`,
    },
    {
      t: "p",
      text: "\"A URL that curl accepts but browsers reject.\" That sentence is somebody's afternoon. They shared a dev URL, the other person could not open it, curl worked fine on both machines, and it took a while to find out that the Fetch spec blocks the port before a request is ever made.",
    },
    {
      t: "p",
      text: "The fix is a `continue` before the availability probe. Nineteen lines of code, forty-nine lines of test. Nobody will ever notice it working.",
    },
    {
      t: "p",
      text: "Four lines further down is the other half of the same afternoon:",
    },
    {
      t: "code",
      file: "scripts/dev-runner.ts:43",
      lang: "ts",
      code: `// Dev servers bind loopback, so loopback is the only interface whose
// availability decides whether we can use a port. Probing wildcards too made
// the runner walk away from a perfectly free port whenever something else held
// the same number on another interface — \`tailscale serve\` does exactly that,
// which silently moved the ports out from under a URL that had just been shared.
const DEV_PORT_PROBE_HOSTS = ["127.0.0.1", "::1"] as const;`,
    },
    {
      t: "p",
      text: "Same shared URL, broken a second way. I have read a lot of repos this month and this is the best comment I found in any of them. It says what broke, what it looked like, and which tool caused it.",
    },
    {
      t: "note",
      text: "These two comments taught me more about how this project is actually used than the README did. Which is roughly the whole argument for reading source instead of docs.",
    },

    { t: "h", text: "Streaming, and what you owe the reader" },
    {
      t: "p",
      text: "Output arrives a character at a time, forever, from up to five agents at once, and the page has to stay upright. Their answer is an event-sourced store on the server and a WebSocket carrying sequenced typed pushes, so a client that misses a message can tell that it missed one.",
    },
    {
      t: "p",
      text: "That last part is the design, not the plumbing. A sequence number is a promise: if you get 41 then 43, you know something is gone and you can go and ask for it.",
    },
    {
      t: "mine",
      text: "My feed makes the opposite promise. Falling behind is not repairable, so I do not let the client try — a slow subscriber gets closed with the reason, and has to reconnect and take a fresh snapshot. Order book depth is not worth catching up on, and a book rebuilt from a feed with a hole in it is wrong without ever looking wrong.",
      file: "cex/crates/ws/src/server.rs:6",
      lang: "rust",
      code: `//! ## What happens to a subscriber that cannot keep up
//!
//! It is disconnected, and told why. A broadcast receiver that falls behind the
//! ring reports \`RecvError::Lagged\` rather than blocking the sender, so a
//! stalled connection can never hold up the others — but it also means the
//! updates it missed are simply gone. Carrying on would hand that client a feed
//! with a silent hole in it [...] Closing forces a reconnect and a fresh
//! snapshot, which is the only honest option.`,
    },
    {
      t: "p",
      text: "Both are right for their own data. Agent output is worth recovering, because a missing chunk of a code review is worth going back for. Market depth from four seconds ago is not; replaying it would not be catching up, it would be lying about the state of the book. What matters is that both systems decided which one they were, and said so.",
    },
    {
      t: "p",
      text: "I did not decide that. I arrived at it because `broadcast::Receiver` gives you `Lagged` and you have to do something with it. Reading t3code is what turned my accident into a position I can defend.",
    },
    { t: "fig", src: streaming, caption: "Output arriving forever, from several sources, into one page." },

    { t: "h", text: "The event log gets edited" },
    {
      t: "p",
      text: "I went looking for whether old events are ever rewritten, expecting to find nothing and leave it as an open question. There are 34 migrations. Number 16 does this, three times:",
    },
    {
      t: "code",
      file: "apps/server/src/persistence/Migrations/016_CanonicalizeModelSelections.ts:67",
      lang: "ts",
      code: `UPDATE orchestration_events`,
    },
    {
      t: "p",
      text: "So the append-only log is not append-only. A migration reaches back and rewrites history to canonicalise how a model was named.",
    },
    {
      t: "p",
      text: "I want to be careful here, because the easy version of this criticism is cheap. They had a real problem: model names were stored inconsistently and every projection built from those events would be wrong. The options are rewrite the events, or write a compatibility shim into every reader forever. They picked the one that leaves the code clean. Almost everybody eventually does.",
    },
    {
      t: "p",
      text: "But it does change what the store is. \"Event-sourced\" implies the events are the truth and everything else is derived. Once a migration can edit them, the truth is whatever the last migration left behind, and the sequence number you handed the client is a promise about ordering, not about content.",
    },
    {
      t: "mine",
      text: "My command log has the same shape and I have not been tested on it yet. Every command sits in a Redis stream and state is rebuilt by replaying from a snapshot. If I ever ship a bug that writes a bad command, I have exactly these two options: edit the log and give up on it being a record, or carry the bug forward in the replay path forever. I do not know which I would pick, and I would rather work that out now than at three in the morning.",
    },

    { t: "h", text: "Two things I would push back on" },
    {
      t: "p",
      text: "Their architecture doc says Codex is the only implemented provider. The code has five. That is not a nitpick — it is the visible cost of the thing I actually worry about here: five providers means every new feature has to be built five times, and the doc is the first thing to be dropped when that gets heavy.",
    },
    {
      t: "p",
      text: "And rollback is paired with git refs, one per turn, so undoing a turn undoes the diff with it. Genuinely good. But provider instances can run the same agent twice under different home directories, against one repo. I could not find what happens when two of those roll back the same ref. Maybe nothing does, and maybe that is fine because nobody has done it yet.",
    },

    { t: "h", text: "What I could not work out" },
    {
      t: "open",
      items: [
        "Two provider instances, one repo, both rolling back a git ref. Does something stop that, or has nobody tried it..?!",
        "Whether anything stops a migration rewriting an event a live client has already read and acted on. I found the rewrite. I did not find the guard.",
        "`capabilities` currently declares one thing, whether the model can be switched mid-session. I would like to know what the second entry is going to be, because the first one is easy and the second one is where this design gets tested.",
      ],
    },

    { t: "h", text: "What I am taking" },
    {
      t: "list",
      items: [
        "Declaring capabilities on the interface instead of throwing later. My exchange has two order types that not every market supports, and right now the market finds out by failing.",
        "Writing the bug into the comment. Not what the code does — what happened, and to whom.",
        "A project-specific lint rule instead of a paragraph in a contributing guide. The bar for writing your own plugin used to be high and it is not any more.",
        "Per-agent isolated working state. Third project in a row doing this, so I have stopped treating it as a coincidence.",
      ],
    },

    { t: "h", text: "Verdict" },
    {
      t: "p",
      text: "Supporting five agents means every feature ships five times and the weakest one sets the ceiling. Excellent for the people using it, brutal to maintain, and the stale architecture doc is the receipt.",
    },
    {
      t: "p",
      text: "I would have picked two and done them properly. I also would not have written that port list, and I would have lost the afternoon they already paid for.",
    },
  ],
};

export default t3code;
