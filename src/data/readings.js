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

export const READINGS = [
  {
    slug: "codex",
    name: "Codex",
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
    owner: "Theo / Ping.gg",
    repo: "https://github.com/pingdotgg/t3code",
    dates: "24 August – 5 September 2026",
    tagline: "One web screen driving four completely different coding agents.",
    whatItIs:
      "There are four or five good coding agents now and every one of them lives in a terminal. t3code puts a web page in front of them, so you can drive them from a browser, from a phone, from anywhere that is not the machine they are running on.",
    hero: { src: t3What, alt: "t3code moves four terminal agents into a browser" },
    headline: { value: "4 → 1", label: "agent CLIs behind a single interface" },
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
