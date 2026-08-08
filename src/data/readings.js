// Source-reading write-ups, one per open-source project.
//
// These exist so a LinkedIn post has somewhere of Nire's OWN to point at. A fork
// of somebody else's repo is byte-identical to theirs and shows a reader nothing,
// which is exactly the wrong link to hand a hiring manager. This is the analysis;
// the repo link is credit and sits inside the page.

import codexCage from "../assets/readings/img-0016-codex-cage.png";
import codexOwnCage from "../assets/readings/img-0025-agent-own-cage.png";
import codexSandboxes from "../assets/readings/img-0023-codex-sandboxes.png";
import codexMemory from "../assets/readings/img-0026-codex-memory.png";
import archonWhat from "../assets/readings/img-0021-what-archon-is.png";
import archonWorktrees from "../assets/readings/img-0017-archon-worktrees.png";
import archonNodes from "../assets/readings/img-0022-archon-nodes.png";
import t3What from "../assets/readings/img-0029-what-t3code-is.png";
import t3Adapters from "../assets/readings/img-0019-t3code-adapters.png";
import t3Streaming from "../assets/readings/img-0030-t3code-streaming.png";
import allAgree from "../assets/readings/img-0024-all-agree.png";
import codexExecPath from "../assets/readings/img-0032-codex-exec-path.png";
import seatbeltPolicy from "../assets/readings/img-0033-seatbelt-policy.png";
import codexFourLoops from "../assets/readings/img-0034-codex-four-loops.png";
import archonDag from "../assets/readings/img-0035-archon-dag.png";

export const READINGS = [
  {
    slug: "codex",
    name: "Codex",
    published: "23 August 2026",
    minutes: 9,
    excerpt: "What actually happens when an AI agent runs one shell command — the real call path, from SandboxManager down to the kernel saying no.",
    owner: "OpenAI",
    repo: "https://github.com/openai/codex",
    dates: "10 – 23 August 2026",
    tagline: "109 Rust crates. Nine of them exist only to keep the agent in its box.",
    whatItIs:
      "Codex is OpenAI's coding agent. You type what you want in a terminal, it edits your files, runs your tests and hands the work back. I read the source for two weeks to answer one question: how do you build software that is allowed to touch somebody's codebase without wrecking it?",
    hero: { src: codexCage, alt: "Nine of Codex's 109 Rust crates exist only to contain the agent" },
    headline: { value: "9 / 109", label: "crates spent purely on containment" },
    findings: [
      {
        title: "Most of an agent is not the agent",
        body: "109 separate Rust packages. Nine of them do nothing except keep the agent inside its box — sandboxing on Mac, Linux and Windows, process hardening, a proxy for its network calls, a rulebook for what it may execute, and a whole package holding secrets. That ratio is the most honest description of agent engineering I have found anywhere.",
      },
      {
        title: "The instruction file explains the agent to itself",
        figure: { src: codexOwnCage, caption: "Most instruction files are rules for a worker. This one describes the reader." },
        body: "There is a rule saying a particular environment setting exists because the agent cannot reach the network, and that any existing code checking it was written by somebody who already knew that about the reader. It is not telling the model to behave. It is telling the model what kind of thing it is. I had not seen an instruction file do that before.",
      },
      {
        title: "Every rule in there is scar tissue",
        body: "\"Do not create small helper methods that are referenced only once.\" That rule exists because a model kept doing exactly that. There is another one requiring you to write the parameter name as a comment beside a bare true or false, so a line says what it means instead of just reading foo(false) — and they built an automated checker for it.",
      },
      {
        title: "Three cages, one per operating system",
        figure: { src: codexSandboxes, caption: "Three sandboxes, because no two machines stop a process the same way." },
        body: "Apple's seatbelt on a Mac, bubblewrap on Linux, and a separate package for Windows. Nobody writes three sandboxes for fun. They wrote three because the agent has to be stopped the same way everywhere and no two machines stop it the same way.",
      },
      {
        title: "The session is the record, not the screen",
        figure: { src: codexMemory, caption: "Everything on disk, so a session can be closed, resumed, and forked." },
        body: "Every session is written to disk as it happens rather than summarised afterwards. That is what makes a session resumable, and forkable like a git branch. Same principle as the command log in the exchange I am building: write it down first, work out what it means second.",
      },
    ],
    deepDive: {
      title: "The part you only get by reading it",
      intro:
        "Codex is roughly forty lines of agent loop wrapped in a hundred thousand lines of harness. The interesting question is not what the loop is. It is what the other 119 crates are for.",
      figure: { src: codexFourLoops, caption: "Four loops, each with one job, each with a file and line you can open." },
      figure2: { src: codexExecPath, caption: "And one shell command through the sandbox: select_initial → transform → exec." },
      steps: [
        { code: "Four nested loops, not one",
          text: "People say \"the agent loop\" as if there is one. There are four, kept strictly apart: the submission loop (handlers.rs:714), the turn loop (turn.rs:268), the retry loop (turn.rs:1336) and the stream event loop (turn.rs:2218). Confusing them is the main reason agent code rots. The submission loop is never blocked by a turn — user_input_or_turn returns as soon as the task is spawned, which is why Interrupt and ExecApproval can be handled while the model is still talking." },
        { code: "History is the transport",
          text: "run_turn does not thread tool results forward. Every iteration rebuilds the entire prompt from sess.clone_history(). Tool outputs were already written into history by drain_in_flight. Once that clicks, resume, fork, compaction and retry stop being four features and become one operation: rewrite history, then loop." },
        { code: "ReAct is emergent, not implemented",
          text: "There is no Thought, Action or Observation type anywhere in the codebase. The whole ReAct control flow is two lines in stream_events_utils.rs:325 — set needs_follow_up, hand back a tool future. Planning and self-correction are prompt behaviours. The harness's only job is to be honest: never lose a tool result, never reorder history, never drop a reasoning item." },
        { code: "store: false",
          text: "Codex does not use server-side conversation state on OpenAI. It resends the entire item list, including encrypted reasoning, on every single request. That one line is why history reconstruction, normalisation and prompt-cache-prefix stability are load-bearing subsystems rather than nice-to-haves." },
        { code: "Registered ≠ advertised",
          text: "A tool can be executable without being visible. ToolExposure has Direct, Deferred, DirectModelOnly and Hidden. Every MCP tool becomes Deferred the moment a search tool is enabled — which is precisely the mechanism keeping fifty MCP schemas out of your prompt." },
        { code: "StepContext",
          text: "The sharpest idea in the turn machinery. Tools are re-registered from scratch every step, and the finalised router is frozen into the step context. The tool list the model saw and the list you execute against are literally the same object, so a tool call that arrives late still resolves against the list that produced it. If your agent lets the tool set change mid-run, this is the bug you have not hit yet." },
        { code: "A lock over nothing",
          text: "Tools default to serial and opt in to parallel. The gate is an Arc<RwLock<()>> guarding no data at all — read lock means batch together, write lock means wait for everything in flight. Results are still collected into a FuturesOrdered, because FuturesUnordered would make persisted history nondeterministic and break replay and prompt caching at the same time." },
        { code: "Cancellation is a tree, not a flag",
          text: "Tokens form a hierarchy through child_token(): task → session task → turn → sampling request → per tool call. Cancelling a parent cancels the subtree. A blanket extension trait adds .or_cancel(&token) to every future in the codebase. Abort is graceful then forceful: cooperative cancel, wait 100ms, then a hard JoinHandle::abort()." },
        { code: "is_likely_sandbox_denied()",
          text: "When a command fails, Codex cannot actually tell you the sandbox caused it — the kernel returns an ordinary permission error. So it guesses, from a heuristic, and the function is named honestly." },
      ],
      second: { src: seatbeltPolicy, caption: "The shipped macOS policy: closed by default, then opened one narrow hole at a time." },
      closing:
        "Two facts explain almost every non-obvious decision in the repo: the model-visible byte sequence is treated as a cache key, and the context window is treated as a budget. A 272,000 token window that auto-compacts at 90 percent is the scarcest resource in the system, so deterministic synthetic IDs, truncation at record time, what survives compaction and what a sub-agent inherits all fall out of those two. The policy file is worth reading on its own — it opens with (deny default) and every line after is a hole somebody argued for. process-exec and process-fork are allowed deliberately so children inherit the parent's cage, closing the obvious escape. Even writing to /dev/null is narrowed with require-all to that exact path AND that exact vnode type.",
    },
    stealing: [
      "The executable policy file for what a command may run — better than the hand-written allowlist I had",
      "Their three testing rules: compare whole objects, never test values that cannot change, never add a test for logic you just deleted",
      "Killing the whole process tree on exit, not just the process you started",
    ],
    verdict:
      "Almost none of Codex is about being clever. It is sandboxes, policy files, process cleanup, session records and a lint rule about comments. The model is the part you rent. Everything that makes it safe to point at real code is the part you build.",
  },
  {
    slug: "archon",
    name: "Archon",
    published: "30 August 2026",
    minutes: 7,
    excerpt: "A workflow engine that makes agent runs repeatable, and the one idea in it I put straight into my own setup.",
    owner: "Cole Medin",
    repo: "https://github.com/coleam00/Archon",
    dates: "17 – 30 August 2026",
    tagline: "Dockerfiles, but for how your AI works rather than how your server boots.",
    whatItIs:
      "When you tell a coding agent to fix a bug, what it actually does depends on the day. It might skip planning. It might not run the tests. Every run is different, which is fine for a toy and useless for real work. Archon makes you write the steps down once, as a file in your repo — plan, implement, test, review, open the PR. The model still supplies the thinking. You own the order, and the order does not change.",
    hero: { src: archonWhat, alt: "An Archon workflow: plan, write, test, review, open the PR" },
    headline: { value: "1 worktree", label: "per run, so agents cannot collide" },
    findings: [
      {
        title: "Every run gets its own copy of the repo",
        figure: { src: archonWorktrees, caption: "Three agents, three worktrees, one repo, no collisions." },
        body: "Three agents fixing three different bugs at the same time, and none of them can touch another one's files. I had been running mine one at a time and waiting for each to finish. This is the single idea from the whole fortnight I put straight into my own setup.",
      },
      {
        title: "The interesting part is the steps with no AI in them",
        figure: { src: archonNodes, caption: "The model runs where it adds something. Everything else is plain code." },
        body: "Running the tests, committing, opening the pull request — that is ordinary code, and ordinary code does the same thing every time. The model only runs where it genuinely adds something: planning, writing, reviewing. That split is why a run comes out the same twice. Not a better prompt. Fewer places where a prompt matters at all.",
      },
      {
        title: "Your process belongs in the repo",
        body: "Workflows are plain files sitting next to the code. Commit them, argue about them in a pull request, and every person and every machine runs the same steps. The moment a process is a file, it can be reviewed.",
      },
      {
        title: "They deleted 434 lines from their own instruction file",
        body: "1008 lines down to 574. The commit reason: remove the blocks the tools already report better. Half of most instruction files is a description of a folder tree the agent can simply go and look at.",
      },
      {
        title: "A migration is an ordered list, and the order bites",
        body: "They added a column, then added an index and a trigger that used it. The index and the trigger ran first and the upgrade died. Not a criticism so much as a reminder that migrations are not a set of changes, they are a sequence.",
      },
    ],
    deepDive: {
      title: "The part you only get by reading it",
      intro:
        "Archon is version 0.8.0, built on Bun and TypeScript over SQLite or Postgres. Its whole argument is that agent work has no shape — you cannot see where it is, you cannot stand in front of the risky part, you cannot rerun just the broken bit, and the record is a chat log. A plan with named steps fixes all four at once.",
      figure: { src: archonDag, caption: "Five reviewers, no parallel keyword anywhere. The shape falls out of the dependencies." },
      figure2: { src: archonNodes, caption: "The model runs where it adds something. Everything else is ordinary code." },
      steps: [
        { code: "Five words, and two get confused",
          text: "A workflow is the recipe — a YAML file, just text, writing one runs nothing. A run is one cooking of it, with its own ID and its own copy of your code. A node is one step. A gate is a step whose whole job is to stop and ask a person. An artifact is a file a step left behind, stored outside your repo so it never lands in a commit by accident." },
        { code: "You never write \"parallel\"",
          text: "In their shipped PR-review workflow, five reviewer steps — code review, error handling, test coverage, comment quality, docs impact — all list only sync as their dependency. Nothing orders them relative to each other, so the engine starts all five at once. You write dependencies and the shape falls out of them. The dashboard draws that picture from the same file." },
        { code: "trigger_rule: one_success",
          text: "The synthesize step depends on all five reviewers but carries trigger_rule: one_success — it goes ahead if any one of them finished. A small key that decides whether one flaky reviewer stalls the whole run." },
        { code: "Ten node types, sorted by who decides",
          text: "Listing them alphabetically teaches nothing. Sorted by who is responsible they explain themselves: code decides (bash, script), a model decides (prompt, command, loop, loop_group), a person decides (approval), structure only (include, workflow). loop hands the previous attempt back as $LOOP_PREV_OUTPUT, which is the keep-fixing-until-the-build-is-green pattern." },
        { code: "Why approval is its own type",
          text: "Pausing looks trivial and is not. The run has to survive the server restarting, be resumable from a different device than the one it started on, and be impossible to double-approve. That is state in a database, not a blocking await. Reject with a reason and it arrives downstream as $REJECTION_REASON, so the next step can act on it." },
        { code: "include: is a language feature",
          text: "Their review block is marked as a building block. Other workflows pull the whole nine-step graph in with one line rather than copying it. Names get prefixed — review__sync — so they cannot collide, and it resolves at load time so the engine still sees one flat graph. Reuse, not copy-paste." },
        { code: "A failed run keeps its worktree",
          text: "Runs never share a checkout, so three can be in flight at once. When one fails, its worktree stays on disk so you can go and look at the mess. That is the difference between a system you can debug and one you can only rerun." },
      ],
      closing:
        "The deeper point took me longer to see than the worktree trick. I had been trying to get better answers out of the model. Archon's bet is the opposite: shrink the number of places where the answer matters at all, and make everything around them ordinary code. Read next to Codex it is the same lesson approached from the other side — Codex spends its effort caging the model, Archon spends it routing around the model.",
    },
    stealing: [
      "Per-run worktree isolation, already running in my own setup",
      "Keeping the tool's own files out of the target repo's pull requests",
      "Auditing my instruction files for anything the tools already report better",
    ],
    verdict:
      "I had been trying to get better answers out of the model. Archon's bet is the opposite — shrink the number of places where the answer matters, and make everything around them ordinary code. Read next to Codex it is the same lesson from the other side: Codex spends its effort caging the model, Archon spends it routing around the model.",
  },
  {
    slug: "t3code",
    name: "t3code",
    published: "5 September 2026",
    minutes: 6,
    excerpt: "One web page driving four different coding agents, and why the adapter underneath is the actual product.",
    owner: "Theo / Ping.gg",
    repo: "https://github.com/pingdotgg/t3code",
    dates: "24 August – 5 September 2026",
    tagline: "One web screen driving five completely different coding agents.",
    whatItIs:
      "Every good coding agent lives in a terminal. t3code puts a web page in front of five of them, so you can drive them from a browser, from a phone, from anywhere that is not the machine they are running on. Their own architecture doc still says Codex is the only implemented provider. The code has five.",
    hero: { src: t3What, alt: "t3code moves four terminal agents into a browser" },
    headline: { value: "5 → 1", label: "agents, four protocols, one interface" },
    findings: [
      {
        title: "The adapter is the product, the screen is the demo",
        figure: { src: t3Adapters, caption: "Four CLIs with four opinions, flattened into one shape." },
        body: "Codex, Claude, Cursor and OpenCode each have their own ideas about sessions, streaming, permissions and error handling. All of that has to be flattened into one shape before the page can render any of it. That layer underneath is where the actual engineering is.",
      },
      {
        title: "Terminals stream, and browsers do not enjoy it",
        figure: { src: t3Streaming, caption: "Output arriving forever, from four sources, into one page." },
        body: "Output arrives a character at a time, forever, and the page has to stay upright while four agents talk at once. It is the same problem I hit on my exchange front end, and it is why so much of t3code is plumbing rather than interface.",
      },
      {
        title: "It skips the ports browsers refuse to open",
        body: "Browsers block certain port numbers outright. Land a dev server on one and the error tells you nothing useful. Two lines of code, and nobody will ever notice it working — which is the point.",
      },
      {
        title: "They wrote their own lint plugin",
        body: "Not configuration. An actual plugin, in the repo, for rules only this project cares about. The bar for that used to be high and it is not any more, and a rule you can check automatically beats a rule in a document every time.",
      },
    ],
    deepDive: {
      title: "The part you only get by reading it",
      intro:
        "The word adapter undersells it. These five agents do not merely have different flags — they speak four genuinely different protocols, and the code meets each one on its own terms rather than flattening them to a lowest common denominator.",
      figure: { src: t3Adapters, caption: "Five agents, four protocols, one ProviderAdapterShape." },
      steps: [
        { code: "Four protocols, not four CLIs",
          text: "Codex is driven through codex app-server with a hand-written TypeScript client in packages/effect-codex-app-server. Claude goes through @anthropic-ai/claude-agent-sdk query() — the SDK, not the raw CLI, so it gets typed messages, hooks and permission callbacks for free. Cursor and Grok speak ACP through their own client in packages/effect-acp, with an xAI extension on top. OpenCode is plain HTTP against opencode serve." },
        { code: "ProviderAdapterShape",
          text: "The contract every provider implements is four verbs on a live session: startSession, sendTurn, interruptTurn, rollbackThread. That last one is the interesting one — rollback is a first-class part of the interface rather than something bolted on afterwards." },
        { code: "Event-sourced, not CRUD",
          text: "The server is Node and Effect-TS throughout, over an event-sourced SQLite store — orchestration_events plus projections, 32 or more migrations deep. The wire is a WebSocket carrying sequenced typed pushes, so a client that misses a message knows it missed one." },
        { code: "Git-ref checkpoints per turn",
          text: "Every turn is paired with a git ref, so conversation rollback and code rollback happen together. Undo the turn and you undo the diff. Most agent tools give you one or the other and leave you to reconcile them by hand." },
        { code: "Provider instances",
          text: "The same agent can run twice with two different accounts, as independent processes with independent HOME directories. Sounds small. It is the difference between a tool one person uses and a tool a team uses." },
        { code: "A VcsDriver registry",
          text: "Worktree isolation lives behind a driver registry at apps/server/src/vcs/GitVcsDriverCore.ts, with setup scripts run per worktree. Third project in a row to isolate per-agent working state, which has stopped being a coincidence." },
      ],
      closing:
        "The honest criticism stands: supporting five agents means every new feature has to work five ways, and the weakest provider sets the ceiling for the rest. Excellent for the people using it, brutal to maintain. Their own architecture doc going stale — still claiming a single provider while the code carries five — is the visible cost of that. But the adapter layer itself is the most careful piece of integration code I read all month, precisely because it refused to pretend the five agents are the same thing.",
    },
    stealing: [
      "Writing a project-specific lint rule instead of a paragraph in a contributing guide",
      "Per-agent isolated working state, the third project in a row to do this",
    ],
    verdict:
      "The honest criticism: supporting four agents means every new feature has to work four ways, and the weakest one sets the ceiling for the rest. Excellent for the people using it, brutal to maintain. I would probably have picked two and done them properly.",
  },
];

export const CONCLUSION = {
  image: { src: allAgree, alt: "Codex, Archon and t3code all spend most of their code on isolation" },
  title: "What all three agree on",
  body: "Codex spends nine packages on sandboxes. Archon gives every run its own copy of the repository. t3code isolates each agent's working state. Three different teams, three different problems, and the same answer underneath: make sure the model cannot reach past the thing you handed it. That is not the conversation happening in public, where it is all about which model and what context window. Inside these repositories almost none of the code is about that. The model is the cheap part now. The box around it is the work.",
};

export const getReading = (slug) => READINGS.find((r) => r.slug === slug);
