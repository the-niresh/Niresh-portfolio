import hero from "../../assets/readings/img-0021-what-archon-is.png";
import worktrees from "../../assets/readings/img-0017-archon-worktrees.png";
import nodes from "../../assets/readings/img-0022-archon-nodes.png";
import dag from "../../assets/readings/img-0035-archon-dag.png";

const archon = {
  slug: "archon",
  name: "Archon",
  published: "30 August 2026",
  minutes: 11,
  excerpt:
    "A workflow engine for coding agents. One idea went straight into my own setup, and one claim I made about it turned out to be wrong when I read the scheduler.",
  owner: "Cole Medin",
  repo: "https://github.com/coleam00/Archon",
  readAt: "41765d6a",
  dates: "17 – 30 August 2026",
  tagline: "Dockerfiles, but for how your AI works rather than how your server boots.",
  whatItIs:
    "Tell a coding agent to fix a bug and what it actually does depends on the day. It might skip planning. It might not run the tests. Archon makes you write the steps down once, as a YAML file in your repo. The model still supplies the thinking. You own the order, and the order does not change.",
  hero: { src: hero, alt: "An Archon workflow: plan, write, test, review, open the PR" },
  headline: { value: "8,442", label: "lines in the one file that runs it all" },

  body: [
    {
      t: "p",
      text: "I read Codex to learn how to cage a model. I read Archon for the opposite reason: to find out how few places a model needs to be involved at all. Version 0.8.0, TypeScript on Bun, SQLite or Postgres underneath.",
    },
    {
      t: "p",
      text: "One idea from it is running in my own setup now. One thing I said about it in public was wrong, and I only found out because I opened the scheduler. Both are below.",
    },

    { t: "h", text: "The workflow file is the whole argument" },
    {
      t: "p",
      text: "This is their shipped PR review block. Not an example from the docs. This is the file the tool actually runs on its own pull requests:",
    },
    {
      t: "code",
      file: ".archon/workflows/defaults/archon-review-block.yaml:43",
      lang: "yaml",
      code: `  - id: code-review
    command: archon-code-review-agent
    depends_on: [sync]
    context: fresh

  - id: error-handling
    command: archon-error-handling-agent
    depends_on: [sync]
    context: fresh

  # ... test-coverage, comment-quality, docs-impact, all depends_on: [sync]

  - id: synthesize
    command: archon-synthesize-review
    depends_on: [code-review, error-handling, test-coverage, comment-quality, docs-impact]
    trigger_rule: one_success
    context: fresh`,
    },
    {
      t: "p",
      text: "Five reviewers, and the word parallel does not appear anywhere. They all depend on `sync` and nothing orders them against each other, so the engine runs them together. You write what depends on what, and the shape falls out.",
    },
    {
      t: "p",
      text: "Then `trigger_rule: one_success` on the step that pulls the five reviews together. It runs if any one of them finished. That is one line deciding whether a single flaky reviewer wedges the whole run, and it is the kind of thing that only gets a name after somebody has been burned by it.",
    },
    {
      t: "p",
      text: "The bit I nearly skimmed past is `context: fresh` on every single node. Their answer to a context window filling up with rubbish is not a better summariser. It is to throw the context away between steps and pass forward only the output. I have been doing the opposite in my own runs, carrying one long conversation and wondering why quality falls off a cliff around the fourth task..?!",
    },
    { t: "fig", src: dag, caption: "Five reviewers, no parallel keyword anywhere." },

    { t: "h", text: "Where I was wrong" },
    {
      t: "p",
      text: "I wrote, in a post, that Archon works out the shape of a run from the dependencies. Then I opened the executor. It builds topological layers with Kahn's algorithm, and runs them like this:",
    },
    {
      t: "code",
      file: "packages/workflows/src/dag-executor.ts:6549",
      lang: "ts",
      code: `for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
    const layer = layers[layerIdx];
    const isParallelLayer = layer.length > 1;
    // ...
    const layerResults = await Promise.allSettled(
      layer.map(async (node): Promise<LayerNodeResult> => {`,
    },
    {
      t: "p",
      text: "`await Promise.allSettled` on the whole layer, then the next layer. That is a barrier, not a dataflow scheduler. A node in layer three waits for every node in layer two, including nodes it does not depend on.",
    },
    {
      t: "pull",
      text: "So the concurrency falls out of the dependencies. The scheduling does not.",
    },
    {
      t: "p",
      text: "For the five-reviewer workflow it makes no difference, because they are all in one layer and one node follows. For a wide workflow with uneven step times it does: your quick two-second lint step sits and waits behind somebody's eight-minute test run in the same layer, even if nothing connects them.",
    },
    {
      t: "p",
      text: "I want to be fair about this. Barrier waves are much easier to make resumable, and this thing has to survive its own server restarting. If you record progress per layer you have a clean place to restart from. A true dataflow scheduler would have to checkpoint per node, and per-node state that survives a restart is a genuinely harder problem. I think they made the right call and described it slightly better than it is. I described it worse than they did, having read only the YAML.",
    },
    {
      t: "note",
      text: "Lesson I keep re-learning: the config file tells you what the authors meant. Only the executor tells you what happens.",
    },
    {
      t: "p",
      text: "I have a strong opinion about this trade because my engine sits at the far end of it. Archon gives up some concurrency to get a clean restart point. I give up all of it:",
    },
    {
      t: "mine",
      text: "One command at a time, and the position only moves after that command has been applied and published. There is no wave and no parallelism at all, because the position has to mean something exact after a crash. Archon buys resumability with a barrier per layer. I buy it with a barrier per command. Their version is a design choice with a cost I can measure. Mine is the same choice taken as far as it goes, and I had been calling it \"the engine is simple\" rather than admitting what it costs.",
      file: "cex/crates/engine/src/runner.rs:206",
      lang: "rust",
      code: `self.handle(&payload).await;

// Advance only after the command is fully applied and published.
self.position = id;
applied += 1;
self.applied_since_snapshot += 1;`,
    },

    { t: "h", text: "The rule engine is thirty lines" },
    {
      t: "p",
      text: "After all that, the thing that decides whether a node runs is small enough to read in one go:",
    },
    {
      t: "code",
      file: "packages/workflows/src/dag-executor.ts:1200",
      lang: "ts",
      code: `const rule: TriggerRule = node.trigger_rule ?? 'all_success';

switch (rule) {
    case 'all_success':
      return upstreams.every(u => u.state === 'completed') ? 'run' : 'skip';
    case 'one_success':
      return upstreams.some(u => u.state === 'completed') ? 'run' : 'skip';
    case 'none_failed_min_one_success': {
      const anyFailed = upstreams.some(u => u.state === 'failed');
      const anySucceeded = upstreams.some(u => u.state === 'completed');
      return !anyFailed && anySucceeded ? 'run' : 'skip';
    }
    case 'all_done':
      return upstreams.every(u => u.state !== 'pending' && u.state !== 'running') ? 'run' : 'skip';
}`,
    },
    {
      t: "p",
      text: "Four rules, one `switch`, no cleverness. And just above it, a missing upstream is treated as failed rather than thrown, with the reason written into the output. That is a small thing and it is the difference between a run that stops with an explanation and a run that stops with a stack trace.",
    },

    { t: "h", text: "The 8,442-line file" },
    {
      t: "p",
      text: "`dag-executor.ts` is eight and a half thousand lines. One file. I am not going to pretend that is fine, because I spent a real amount of time scrolling it, and the only reason I could work anything out is that whoever wrote it comments generously.",
    },
    {
      t: "p",
      text: "It is also the honest shape of this problem. A workflow engine has to hold resume, skip, trigger rules, include expansion, loops, sub-runs, approvals, artifacts and session ownership in one place, because they all interact. Split it into eight files and you get eight files that each import the other seven. I would still split it. I would also expect the split to be harder than it looks, and I would not lead a review with it.",
    },

    { t: "h", text: "The idea I took" },
    {
      t: "p",
      text: "Every run gets its own copy of the repository. Three agents on three bugs at the same time, none of them able to touch another one's files. I had been running mine one at a time and waiting.",
    },
    {
      t: "p",
      text: "That went into my own setup the same week and it is the single most useful thing I got out of the fortnight. The follow-on detail matters as much as the idea: when a run fails, its worktree stays on disk. You can go and look at the mess. That is the difference between a system you can debug and one you can only run again and hope.",
    },
    { t: "fig", src: worktrees, caption: "Three agents, three worktrees, one repo, no collisions." },
    {
      t: "mine",
      text: "The same instinct shows up in my exchange as a refusal rather than a copy. Exactly one engine may hold a command stream, and the process checks it is still the holder before every read, because two engines on one stream apply every command twice. Archon isolates so agents can run together. I isolate so a second one can never start. Both are the same admission: shared mutable state is the thing that kills you, and the fix is structural, not careful coding.",
      file: "cex/crates/engine/src/runner.rs:424",
      lang: "rust",
      code: `// Before touching anything, confirm we are still the engine. If the
// lease has been taken, another process is applying these very
// commands and the only safe thing left to do is stop: two engines
// on one stream double-apply everything they see.
self.lock.refresh_if_due().await?;`,
    },

    { t: "h", text: "Six node types, and the YAML lies about that" },
    {
      t: "p",
      text: "I counted node types off the YAML surface first and got ten. The schema says six:",
    },
    {
      t: "code",
      file: "packages/workflows/src/schemas/dag-node.ts:4",
      lang: "ts",
      code: `// Design: a flat "raw" schema validates all fields (with mutual exclusivity enforced via
// superRefine), then a transform produces one of the six concrete variant types
// (CommandNode, PromptNode, BashNode, LoopNode, ApprovalNode, CancelNode) as the DagNode union.`,
    },
    {
      t: "p",
      text: "`include:` and `workflow:` read like node types when you are writing the file, but they never reach the executor as nodes. They are expanded away at load time. That is why the executor's very first check inside a node body is a guard that throws if an unexpanded include ever gets that far. Six things run. The rest is structure that has already been flattened by the time anything executes.",
    },
    {
      t: "p",
      text: "Sorted by who decides, the six explain themselves: code decides (`bash`), a model decides (`prompt`, `command`, `loop`), a person decides (`approval`), and one exists to stop (`cancel`).",
    },
    {
      t: "p",
      text: "Pausing for a human looks trivial and is not. The run has to survive the server restarting. It has to be resumable from a different device than the one that started it. It must be impossible to approve twice. None of that is a blocking `await`; all of it is state in a database. Rejecting comes back downstream as `$REJECTION_REASON`, so the next step can read why.",
    },
    { t: "fig", src: nodes, caption: "The model runs where it adds something. Everything else is ordinary code." },

    { t: "h", text: "Small things" },
    {
      t: "list",
      items: [
        "`include:` is a real language feature, not copy-paste. The review block is pulled into other workflows with one line, names get prefixed as `review__sync` so they cannot collide, and it resolves at load time so the engine still sees one flat graph.",
        "An unexpanded `include` node reaching the executor throws immediately, and the guard is the first thing in the node body specifically so it cannot be swallowed by a skip, a `when:` or a trigger rule. Somebody had that bug.",
        "They deleted 434 lines from their own instruction file in `cef6d7de`, 1008 lines down to 574, because the tools already report it better. Half of most instruction files describes a folder tree the agent can just go and look at.",
        "The commit immediately before that one is `ec187c20`, \"correct rotted counts and a wrong path in CLAUDE.md\". They had numbers in their instruction file that had quietly stopped being true. So did I, at the top of the Codex write-up. It happens to everyone and the only defence is writing down how you counted.",
        "A migration that added a column, then an index and a trigger using it, ran the index first and died. Migrations are a sequence, not a set.",
      ],
    },

    { t: "h", text: "What I could not work out" },
    {
      t: "open",
      items: [
        "If one node in a wave fails and its worktree is kept for debugging, who eventually deletes it..?! I could not find the sweeper. On my box that would fill a disk in a fortnight.",
        "`context: fresh` on every node is clearly deliberate, but I could not find anywhere that says what a node is allowed to carry forward beyond `$node.output`. If the answer is nothing, some of these workflows are doing more work than they look like they are.",
        "Whether the layer barrier is a decision or an accident. I could not find it discussed anywhere, which usually means it started as the easy thing and then stopped being questioned.",
      ],
    },

    { t: "h", text: "What I am taking" },
    {
      t: "list",
      items: [
        "Per-run worktree isolation. Already running.",
        "Keeping a failed run's working copy instead of cleaning it up. Debuggability beats tidiness.",
        "`context: fresh` between steps, in place of one long conversation that slowly rots.",
        "Auditing my own instruction files for anything the tools already report better.",
      ],
    },

    { t: "h", text: "Verdict" },
    {
      t: "p",
      text: "I had been trying to get better answers out of the model. Archon's bet is the opposite: cut down the number of places where the answer matters, and make everything around them ordinary code that does the same thing every time.",
    },
    {
      t: "p",
      text: "Read next to Codex it is the same lesson from the other side. Codex spends its effort caging the model. Archon spends its effort routing around it. Neither team is spending much effort on prompts.",
    },
  ],
};

export default archon;
