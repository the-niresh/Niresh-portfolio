import hero from "../../assets/readings/img-0016-codex-cage.png";
import ownCage from "../../assets/readings/img-0025-agent-own-cage.png";
import sandboxes from "../../assets/readings/img-0023-codex-sandboxes.png";
import fourLoops from "../../assets/readings/img-0034-codex-four-loops.png";
import execPath from "../../assets/readings/img-0032-codex-exec-path.png";
import seatbelt from "../../assets/readings/img-0033-seatbelt-policy.png";

const codex = {
  slug: "codex",
  name: "Codex",
  published: "23 August 2026",
  minutes: 14,
  excerpt:
    "Four loops, a lock that guards nothing, and the most honest function in the repo. Read next to my own Rust engine, which gets three of these wrong.",
  owner: "OpenAI",
  repo: "https://github.com/openai/codex",
  readAt: "0bdce9f424",
  dates: "10 – 23 August 2026",
  tagline: "130 Rust crates. Eleven of them exist only to keep the agent in its box.",
  whatItIs:
    "Codex is OpenAI's coding agent. You type what you want in a terminal, it edits your files, runs your tests and hands the work back. I read the source for two weeks, and not to learn how to use it.",
  hero: {
    src: hero,
    alt: "Eleven of Codex's crates exist only to contain the agent",
    caption: "The diagram says 109. I now count 130. See below. I would rather show the disagreement than quietly redraw it.",
  },
  headline: { value: "11 / 130", label: "crates spent purely on containment" },

  body: [
    {
      t: "p",
      text: "I am building a crypto exchange in Rust and an agent writes most of it. Four problems keep coming back at me. How do you stop work that is already running. How do you replay a run and get the same answer. How do you keep results in order when they finish out of order. How do you come back after a crash. OpenAI have answered all four, in Rust, in public. So I stopped guessing and went to read it.",
    },
    {
      t: "p",
      text: "This is not a summary of Codex. It is the eleven things I actually opened, with the file and line, and what each one told me about code I had already written badly.",
    },
    {
      t: "note",
      text: "First thing I got wrong: I went looking for the agent loop. I read `codex.rs`, then all of `session/`, and lost most of a day before working out that the thing I was looking for does not exist..?!",
    },
    {
      t: "p",
      text: "Second thing, and I am leaving the evidence up top. My diagram says 109 crates. I cannot reproduce that number any more. What I can reproduce is the `members` list in `codex-rs/Cargo.toml`, which has 130 entries at commit `0bdce9f4`, and had 126 a month ago. Eleven of them are containment: `sandboxing`, `linux-sandbox`, `windows-sandbox-rs`, `process-hardening`, `network-proxy`, `responses-api-proxy`, `execpolicy`, `exec-server`, `exec-server-protocol`, `secrets`, `utils/sandbox-summary`. Count it yourself and tell me if I am wrong. The ratio is the finding, not the number, but a number you cannot re-derive is not a finding at all.",
    },

    { t: "h", text: "There is no agent loop. There are four." },
    {
      t: "p",
      text: "People say \"the agent loop\" like there is one. In Codex there are four, and they are kept apart on purpose. The outer one takes whatever you send it and never blocks:",
    },
    {
      t: "code",
      file: "codex-rs/core/src/session/handlers.rs:703",
      lang: "rust",
      code: `pub(super) async fn submission_loop(
    sess: Arc<Session>,
    config: Arc<Config>,
    rx_sub: Receiver<Submission>,
) {
    // To break out of this loop, send Op::Shutdown.
    let mut shutdown_received = false;
    while let Ok(sub) = rx_sub.recv().await {`,
    },
    {
      t: "p",
      text: "Look at what that loop is not doing. It does not await the turn. It spawns it and comes straight back round. That one choice is why you can press Ctrl-C, or approve a command, while the model is still talking. If the submission loop awaited the turn, interrupt would be a feature nobody could build later.",
    },
    {
      t: "p",
      text: "Inside that sits the turn loop, then a retry loop around the model call, then a loop draining stream events. Four levels. I think this is the single most useful thing in the repo for anybody writing agent code, and it is not clever at all. It is just refusing to let one loop do two jobs.",
    },
    {
      t: "fig",
      src: fourLoops,
      caption: "Four loops, one job each. The count is the finding.",
    },

    { t: "h", text: "History is the transport" },
    {
      t: "p",
      text: "I assumed tool results get passed forward to the next model call. They do not. Every single time round the turn loop, Codex throws away what it was holding and rebuilds the whole prompt from the session history:",
    },
    {
      t: "code",
      file: "codex-rs/core/src/session/turn.rs:335",
      lang: "rust",
      code: `// Construct the input that we will send to the model.
let sampling_request_input: Vec<ResponseItem> = async {
    sess.clone_history()
        .await
        .for_prompt(&turn_context.model_info.input_modalities)
}`,
    },
    {
      t: "p",
      text: "The same three lines appear again in the retry loop at `turn.rs:1347`. Tool output was already written into history by the drain step, so there is nothing to thread through.",
    },
    {
      t: "pull",
      text: "Once that clicks, resume, fork, compaction and retry stop being four features. They are one operation: rewrite history, then loop.",
    },
    {
      t: "p",
      text: "That is the part I had to sit with. I had been thinking of those as four things to build. They are one thing to build and four ways to call it. My engine already works this way and I did not notice, because I arrived at it from the other end:",
    },
    {
      t: "mine",
      text: "I refused a Redis consumer group for the same reason, and wrote down why at the top of the file. Two things claiming to know where you are is one thing too many.",
      file: "cex/crates/engine/src/runner.rs:6",
      lang: "rust",
      code: `//! ## Why plain \`XREAD\` and not a consumer group
//!
//! A consumer group tracks its own cursor server-side, which would compete with
//! the snapshot for authority over "where are we". Here the snapshot *is* the
//! cursor: it records the last applied id, and on boot we resume from exactly
//! that point. One source of truth for position, and replay stays exact.`,
    },
    {
      t: "p",
      text: "Codex says history is the cursor. I say the snapshot is the cursor. Same rule underneath: one thing owns position, and everything else is derived from it. I am fairly pleased I got there on my own. I am less pleased it took reading somebody else's Rust to see that it was a rule and not a preference.",
    },

    { t: "h", text: "A lock that guards nothing" },
    {
      t: "p",
      text: "This one took me three reads. There is a lock in the tool runtime, and it protects no data at all:",
    },
    {
      t: "code",
      file: "codex-rs/core/src/tools/parallel.rs:40",
      lang: "rust",
      code: `#[derive(Clone)]
pub(crate) struct ToolCallRuntime {
    session: Arc<Session>,
    // Tool calls may run later, so retain the step whose tool list advertised them.
    step_context: Arc<StepContext>,
    tracker: SharedTurnDiffTracker,
    parallel_execution: Arc<RwLock<()>>,
}`,
    },
    {
      t: "p",
      text: "`RwLock<()>`. A read-write lock around the empty tuple. The first time I saw it I assumed it was left over from a refactor. It is not. Here is what it is for:",
    },
    {
      t: "code",
      file: "codex-rs/core/src/tools/parallel.rs:153",
      lang: "rust",
      code: `let _guard = if supports_parallel {
    Either::Left(lock.read().await)
} else {
    Either::Right(lock.write().await)
};`,
    },
    {
      t: "p",
      text: "Read lock means \"I am happy to run alongside others\". Write lock means \"everything in flight must finish, then I go alone\". Nothing is being protected. The lock is being used as a queue. Tools are serial by default and opt in to running together, which is the safe way round.",
    },
    {
      t: "p",
      text: "I like this a lot. It is four lines and it replaces the scheduler I was about to write.",
    },
    {
      t: "mine",
      text: "I have three locks in my exchange and until this week I thought they were all the same kind of thing. They are not. `Arc<Mutex<State>>` protects memory. The Redis lease in `EngineLock` protects a fact about the world, that I am the only engine on this stream. Codex's `RwLock<()>` protects neither; it only decides who goes next. Three locks, three jobs, one of them actually about data.",
    },

    {
      t: "p",
      text: "Right below the lock is a detail that is easy to skim past and should not be:",
    },
    {
      t: "code",
      file: "codex-rs/core/src/session/turn.rs:2186",
      lang: "rust",
      code: `let mut in_flight: FuturesOrdered<BoxFuture<'static, CodexResult<ResponseInputItem>>> =
    FuturesOrdered::new();`,
    },
    {
      t: "p",
      text: "`FuturesOrdered`, not `FuturesUnordered`. Tools may run at the same time, but their results are collected in the order they were called, not the order they finished. It costs you throughput: one slow tool holds up the ones behind it.",
    },
    {
      t: "p",
      text: "They pay that cost on purpose. Results go into history, history is the prompt, and the prompt is a cache key. If two runs of the same work produce two different orderings, replay breaks and the prompt cache misses. So the ordering has to be a property of the code, not of who finished first.",
    },
    {
      t: "pull",
      text: "That is the same law my matching engine runs on, and I never wrote it down as a law.",
    },
    {
      t: "p",
      text: "My engine applies commands strictly in stream order, one at a time, and everything else falls out of that. I always described it as \"the engine is single threaded\". It is not really about threads. It is that the record has to be reproducible, so the order cannot depend on timing. Codex pays for the same rule with head-of-line blocking in a tool batch. I pay for it with a single apply path. Same bill.",
    },

    { t: "h", text: "Cancellation is a tree. Mine is a hammer." },
    {
      t: "p",
      text: "Codex hangs cancellation tokens off each other in a hierarchy: task, session task, turn, model request, one per tool call. Cancel a parent and the whole subtree below it stops. Then there is this, which is the bit I actually want:",
    },
    {
      t: "code",
      file: "codex-rs/async-utils/src/lib.rs:25",
      lang: "rust",
      code: `async fn or_cancel(self, token: &CancellationToken) -> Result<Self::Output, CancelErr> {
    tokio::select! {
        _ = token.cancelled() => Err(CancelErr::Cancelled),
        res = self => Ok(res),
    }
}`,
    },
    {
      t: "p",
      text: "That is a blanket implementation over every future in the codebase. Anything you can await, you can write `.or_cancel(&token)` on. Six lines, and it makes \"this can be stopped\" the normal shape of a future instead of something you remember to add.",
    },
    { t: "p", text: "Now mine. This is my whole cancellation story:" },
    {
      t: "mine",
      text: "Two calls to `abort()` and a `Drop` as backup. No token, no cooperative stop, no teardown. The query task is killed where it stands.",
      file: "cex/crates/engine/src/runner.rs:413 and :442",
      lang: "rust",
      code: `let outcome = self.command_loop().await;

if let Some(handle) = self.query_task.take() {
    handle.abort();
}

// ...

impl Drop for Runner {
    fn drop(&mut self) {
        if let Some(handle) = self.query_task.take() {
            handle.abort();
        }
    }
}`,
    },
    {
      t: "p",
      text: "My first reaction was that mine is obviously wrong and I should go and build the token tree. I sat with it and I do not think that is right either, and working out why was the most useful hour of the fortnight.",
    },
    {
      t: "p",
      text: "A tokio `abort()` drops the task at its next await point. My query task never holds the state lock across an await. That was already a rule, for a different reason, so that a query can never see a half-applied command. Which means abort can only ever land between two whole commands. There is nothing half-finished to tear down. The hammer is safe here, and it is safe because of a rule I made for an unrelated reason.",
    },
    {
      t: "p",
      text: "It stops being safe the moment a task owns something outside memory. A child process. A file it is halfway through writing. An open Redis transaction. Codex needs the graceful phase because its tool calls shell out, and you cannot kill a process tree by dropping a future. The pattern I am taking is not the token tree. It is `or_cancel`, because the cost of adding it now is nearly nothing, and the cost of adding it after I have a task that owns a child process is a rewrite.",
    },
    {
      t: "p",
      text: "There is also a hole in mine that reading this made obvious. `command_loop` is a bare `loop {}` with no cancellation at all. It stops by losing its Redis lease or by the process dying. Nothing can ask it to stop. I had not thought of that as missing until I saw what it looks like when someone has thought about it.",
    },

    { t: "h", text: "The most honest function in the repo" },
    {
      t: "p",
      text: "When a sandboxed command fails, you want to tell the user whether the sandbox did it. Codex cannot tell you. The kernel does not say \"the sandbox stopped this\", it returns an ordinary permission error, the same one you would get from a file you do not own. So Codex guesses:",
    },
    {
      t: "code",
      file: "codex-rs/sandboxing/src/denial.rs:25",
      lang: "rust",
      code: `const SANDBOX_DENIED_KEYWORDS: [&str; 7] = [
    "operation not permitted",
    "permission denied",
    "read-only file system",
    "seccomp",
    "sandbox",
    "landlock",
    "failed to write file",
];`,
    },
    {
      t: "p",
      text: "It lowercases stderr and looks for one of those seven strings. That is it. Over a million lines of Rust in that workspace, three operating system sandboxes, and the answer to \"did we block that\" is a substring search.",
    },
    {
      t: "p",
      text: "The function is called `is_likely_sandbox_denied`. Likely. Somebody named it honestly instead of naming it `is_sandbox_denied` and hoping. I have written the dishonest version of this function more than once.",
    },
    {
      t: "mine",
      text: "The closest thing I have to that instinct is in the websocket feed. A client that falls behind the broadcast ring gets disconnected rather than quietly skipped, because a book rebuilt from a feed with a hole in it is wrong without ever looking wrong.",
      file: "cex/crates/ws/src/server.rs:94",
      lang: "rust",
      code: `Err(RecvError::Lagged(missed)) => {
    warn!(missed, "subscriber fell behind, closing so it resyncs");
    let reply = ServerMessage::Error {
        error: format!(
            "fell behind by {missed} updates; reconnect and resync"
        ),
    };`,
    },
    {
      t: "p",
      text: "Different problem, same move: when you cannot be sure, say so in the API rather than papering over it. Codex says it in a function name. I say it by hanging up on you.",
    },

    { t: "h", text: "The policy file is the actual product" },
    {
      t: "p",
      text: "Three sandboxes, one per operating system: Apple's seatbelt, a Linux one, a Windows one. Nobody writes three sandboxes for fun. But the interesting file is not the Rust, it is the 122 lines of policy that ship with it.",
    },
    {
      t: "code",
      file: "codex-rs/sandboxing/src/seatbelt_base_policy.sbpl:7",
      lang: "sbpl",
      code: `; start with closed-by-default
(deny default)

; child processes inherit the policy of their parent
(allow process-exec)
(allow process-fork)
(allow signal (target same-sandbox))

(allow file-write-data
  (require-all
    (path "/dev/null")
    (vnode-type CHARACTER-DEVICE)))`,
    },
    {
      t: "p",
      text: "Everything is denied, then holes get opened one at a time, and every line after line 8 is a hole somebody had to argue for. `process-exec` and `process-fork` being allowed looks like a mistake until you read the comment: children inherit the parent's cage, so letting the agent spawn a process is safe and stopping it would just push work outside the box.",
    },
    {
      t: "p",
      text: "And then look at `/dev/null`. Not \"you may write to /dev/null\". You may write to that exact path, and only if it really is a character device. `require-all` on both. Somebody thought about a file called `/dev/null` that is not the real one.",
    },
    {
      t: "p",
      text: "This is the file I would show anybody who thinks agent safety is a prompt.",
    },
    { t: "fig", src: seatbelt, caption: "Closed by default, then one narrow hole at a time." },

    { t: "h", text: "Small things I noted and did not chase" },
    {
      t: "list",
      items: [
        "`store: false`. Codex does not keep conversation state on the server. It resends the entire item list, including encrypted reasoning, on every request. That one setting is why history rebuilding and prompt-prefix stability are load-bearing rather than tidy-ups.",
        "A tool can be registered and executable without the model being able to see it. `ToolExposure` in `tools/src/tool_executor.rs:51` has Direct, Deferred and hidden variants. That is how fifty MCP schemas stay out of your context.",
        "The tool list is frozen into the step context and re-registered from scratch every step, so a tool call arriving late still resolves against the list that produced it. If your agent lets the tool set change mid-run, that is a bug you have not hit yet.",
        "Their instruction file bans helper methods used only once, and they wrote a checker for it. Instruction files are scar tissue. Every rule in one is a thing that already went wrong.",
      ],
    },
    { t: "fig", src: ownCage, caption: "The instruction file describes the reader, not the task." },
    { t: "fig", src: sandboxes, caption: "Three sandboxes, because no two machines stop a process the same way." },

    { t: "h", text: "What I could not work out" },
    {
      t: "open",
      items: [
        "The abort path waits 100ms after a cooperative cancel before it kills the task. Why 100..?! I could not find the discussion. It smells like a number that worked on somebody's Mac.",
        "With `store: false` and the whole history resent each time, what actually happens to the prompt cache when one item in the middle changes. I think the entire suffix after it is lost. I have not proved it and I could not find where it is handled.",
        "Three sandboxes have to agree on what \"denied\" means, but only the stderr heuristic is shared. I cannot see what stops the three drifting apart, other than the tests.",
        "The exec policy language is a real interpreter. I still do not know whether a policy can be shipped by a project, or only by Codex itself. That difference matters a lot if you want to use it.",
      ],
    },

    { t: "h", text: "What I am taking" },
    {
      t: "list",
      items: [
        "`or_cancel`, more or less verbatim. Six lines, and it turns cancellation into the default shape of a future instead of a thing I remember.",
        "The executable policy file for what a command may run. Better than the hand-written allowlist I have, and it can be reviewed in a pull request.",
        "Naming the guess a guess. My error types have at least two places where I claim to know a cause I only inferred.",
        "Killing the whole process tree on exit rather than the process I started.",
      ],
    },

    { t: "h", text: "Verdict" },
    {
      t: "p",
      text: "Almost none of Codex is about being clever. It is sandboxes, a policy file, process cleanup, a session record, and a lint rule about comments. The forty lines that look like an agent are the cheap part. Eleven crates out of a hundred and thirty exist purely so that the cheap part can be pointed at real code without wrecking it.",
    },
    {
      t: "p",
      text: "I came for the agent loop and left with a cancellation trait and an argument about locks. That is roughly the right ratio.",
    },
    { t: "fig", src: execPath, caption: "One shell command through the sandbox, end to end." },
  ],
};

export default codex;
