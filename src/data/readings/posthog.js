import rustPython from "../../assets/readings/img-0067-posthog-rust-python.png";
import groupFirst from "../../assets/readings/img-0068-posthog-group-then-limit.png";
import twoBrakes from "../../assets/readings/img-0069-posthog-two-brakes.png";
import twoTexts from "../../assets/readings/img-0070-posthog-two-texts.png";

const posthog = {
  slug: "posthog",
  name: "PostHog",
  published: "12 September 2026",
  minutes: 13,
  excerpt:
    "It stopped being an analytics tool. Errors and rage clicks go in, researched reports and pull requests come out. Seven patterns from the code, and the one that is a security finding.",
  owner: "PostHog",
  repo: "https://github.com/PostHog/posthog",
  readAt: "551ebc4b",
  dates: "21 August 2026",
  tagline: "588,856 lines of Rust that run per event, and 93 Django apps that run per decision.",
  whatItIs:
    "PostHog is product analytics, session replay, error tracking and feature flags in one open-source product. I did not read it to learn the product. I read it because I want agents that watch my own systems, notice a problem, and act on it, and PostHog has already shipped that loop in public.",
  hero: {
    src: rustPython,
    alt: "Per event is Rust, per decision is Python: the rule that explains the whole repository",
    caption:
      "One architectural rule explains almost every file placement in the repo. Once you have it, you stop getting lost.",
  },
  headline: { value: "7 patterns", label: "worth copying, and one that is a warning" },

  body: [
    {
      t: "p",
      text: "I want autonomous agents that watch my own products, notice when something is broken, and do something about it without me. Every time I start designing that I hit the same set of questions, and every time I realise somebody must have solved them already. PostHog have, and their whole repository is public.",
    },
    {
      t: "p",
      text: "So this is not a review of PostHog. It is the seven things I opened, and what each one told me about a system I had already designed badly.",
    },
    {
      t: "note",
      text: "First thing that surprised me. Their README does not lead with analytics any more. It leads with **self-driving**: turn signals like errors, rage clicks and failed queries into researched reports and pull requests. Everything else in the product is feedstock for that loop..?!",
    },

    { t: "h", text: "One rule explains the whole repository" },
    {
      t: "p",
      text: "Before any of the patterns, you need the rule that decides where code lives, or you will spend a day lost like I did.",
    },
    {
      t: "pull",
      text: "Anything that runs per event is Rust. Anything that runs per decision is Python.",
    },
    {
      t: "list",
      items: [
        "`rust/capture`, `rust/capture-logs`, `rust/ingestion-consumer`, `rust/cymbal`, `rust/hogql`. 55 services, 588,856 lines. These run millions of times.",
        "`products/*`. 93 Django apps. Alert logic, agent orchestration, scheduling. These run when a decision has to be made.",
        "ClickHouse for events, Postgres for config, Kafka between them, Temporal for durable agent runs.",
      ],
    },
    {
      t: "p",
      text: "I am copying none of that infrastructure. My products have nowhere near the volume and I already have durable reactive storage. The value here is in the decisions, not the plumbing. But knowing the rule turns the repository from a maze into a map.",
    },

    { t: "h", text: "1. Rate limit after grouping, never before" },
    {
      t: "p",
      text: "`rust/cymbal/src/modes/processing/stages/pipeline.rs` composes the stages in this order: PreProcessing, Resolution, Grouping, **Linking, RateLimiting**, Alerting, PostProcessing.",
    },
    {
      t: "p",
      text: "Look at where rate limiting sits. After grouping, not before. Limit first and you throw away the very events that prove an issue is spiking, at exactly the moment you needed them. Group first and you can keep counting cheaply while dropping the heavy payloads.",
    },
    {
      t: "fig",
      src: groupFirst,
      alt: "Limiting before grouping loses the proof of a spike; grouping first keeps the count",
      caption: "The spike is the signal. Do not drop the signal to save money on the signal.",
    },
    {
      t: "mine",
      text: "I had this backwards. My own ingestion dropped events at the door when a burst came in, because that is the obvious place to put a limiter and it is where every tutorial puts one. So the one incident I most needed to see was also the one where my counts were least trustworthy.",
    },

    { t: "h", text: "2. Automatic fingerprints carry a version. Manual ones do not." },
    {
      t: "p",
      text: "`stages/grouping/fingerprint.rs`. The selection order is: client-sent manual fingerprint, then a team rule, then the newest already-saved version, then the newest algorithm.",
    },
    {
      t: "p",
      text: "The asymmetry is deliberate and it took me a minute. **Automatic fingerprints carry a version number, manual ones do not.** That means you can improve the grouping algorithm later without splitting every existing issue into a new one, because old events keep resolving through the version they were grouped under. A manual fingerprint is a human promise and does not need a version, it needs to be stable.",
    },
    {
      t: "p",
      text: "Small bonus in the same file: they defer JSON-serialising the event until they know the team actually has grouping rules configured. Most teams do not, so most events never pay for it.",
    },

    { t: "h", text: "3. The alert state machine, which is the most copyable file in the repo" },
    {
      t: "p",
      text: "`products/alerts/backend/state_machine.py`, configured per product through a policy object. Four states: `NOT_FIRING`, `FIRING`, `SNOOZED`, and **`BROKEN`**.",
    },
    {
      t: "list",
        items: [
        "**BROKEN means the monitor itself is broken**, after `MAX_CONSECUTIVE_FAILURES = 5`. It is terminal until a person explicitly resets it.",
        "**Transient errors do not count towards BROKEN.** `alert_error_classifier.py` defines `TRANSIENT_ERROR_CODES = {server_busy, cancelled, unknown}`. A database hiccup must not disable your alert. A malformed query should.",
        "**N-of-M sliding window to fire, one clean window to resolve.** Asymmetric on purpose, so a flapping signal does not flap the alert.",
        "**Snoozing is a state, not a filter.** A breach while snoozed parks in SNOOZED without notifying, so the history is still true.",
        "**One writer, enforced in CI** by a semgrep rule that fails the build if anything writes alert state outside the state machine.",
      ],
    },
    {
      t: "pull",
      text: "A monitor that is silent and a monitor that is healthy look identical from the outside. BROKEN is how you tell them apart.",
    },
    {
      t: "p",
      text: "The semgrep rule is the part I keep thinking about. They did not trust a comment to protect the invariant. They wrote a lint that fails the build. That is a whole engineering culture compressed into one YAML file.",
    },

    { t: "h", text: "4. A scan with a budget, that degrades in a defined order" },
    {
      t: "p",
      text: "`products/logs/backend/anomaly_scan.py`. Baselines sample time-of-week and time-of-day slices as explicit ranges, not one contiguous scan. There is a hard `max_bytes_to_read` budget enforced on the ClickHouse side.",
    },
    {
      t: "p",
      text: "When it overflows the budget it does not just fail. It shortens the lookback first, then clips the evaluation window, **and it reports which bound it hit**. So a degraded answer arrives labelled as degraded rather than quietly wrong.",
    },
    {
      t: "pull",
      text: "A monitoring query that can cost anything will eventually cost everything, usually during the incident it was meant to detect.",
    },
    {
      t: "p",
      text: "They also documented what the optimisation costs them: level adjustment is disabled on this path. Writing down the price of your own shortcut is rarer than it should be.",
    },

    { t: "h", text: "5. Two remediation texts per signal" },
    {
      t: "code",
      file: "products/signals/backend/contracts.py",
      lang: "python",
      code: `class SignalRemediation(ContractModel):
    human: str
    agent: str
    priority: ReportPriority | None = None`,
    },
    {
      t: "p",
      text: "Two audiences, two texts, written at the moment the problem is detected while the context is still present. A human needs \"the PDF render queue is stalled, check depth\". An agent needs the command.",
    },
    {
      t: "fig",
      src: twoTexts,
      alt: "One signal carries a human remediation text and an agent remediation text",
      caption: "Costs nothing on day one. Expensive to retrofit, because by then nobody remembers why the check exists.",
    },
    {
      t: "p",
      text: "This is the pattern with the best value-to-effort ratio on the whole list. It is one extra field.",
    },

    { t: "h", text: "6. An actionability gate before any agent spends a token" },
    {
      t: "p",
      text: "An LLM call decides whether a record becomes a signal **at all**, before any expensive agent work starts. It is steerable per source in plain language, and the injection escapes braces and caps length so a team's own text cannot break the one-word output contract.",
    },
    {
      t: "p",
      text: "The default posture is load-bearing and stated out loud: *when in doubt, classify as ACTIONABLE*. A gate that fails closed on ambiguity slowly stops reporting anything and nobody notices.",
    },
    {
      t: "p",
      text: "The detail I liked: a source needing extra metadata declares `actionability_context_fields`. A source declaring nothing keeps a byte-identical prompt, so prompt caching still works. Somebody thought about the cost of their own flexibility.",
    },

    { t: "h", text: "7. Two circuit breakers, on two different axes" },
    {
      t: "p",
      text: "`scout_harness/limits.py` and `scout_harness/inactivity.py`. This is the pattern I had never seen anywhere else and it is the one I most needed.",
    },
    {
      t: "list",
      items: [
        "**Failure axis.** The agent keeps crashing. Pause the lane, then allow one probe run after an interval.",
        "**Waste axis.** The agent works fine, and nobody reads what it produces. Warn, then pause after a grace period.",
      ],
    },
    {
      t: "fig",
      src: twoBrakes,
      alt: "A failure brake and a waste brake, judged on different signals",
      caption: "The waste brake judges consumption, not emission. Writing more reports counts for nothing.",
    },
    {
      t: "p",
      text: "Two reasons for silence are distinguished, which is the subtle part. `ignored`, meaning established reports that nobody consumed, warns then pauses. `no_output`, meaning it said nothing at all, only ever warns, because a watchdog's silence can be its job. There is an `auto_pause_exempt` flag for the ones where that is permanent.",
    },
    {
      t: "p",
      text: "And then the line that made me sit back: they emit `signals_scout_auto_pause_reverted` as **the false-positive metric for their own brake**. They measure whether their safety mechanism is too aggressive. I have never once instrumented a guardrail to find out if it was wrong.",
    },

    { t: "h", text: "The security finding" },
    {
      t: "p",
      text: "Agent scratchpads are shared across a team, and upserts keep the original author, so **attribution never proves who last wrote the content**. The prompt therefore instructs the agent to treat every stored probe as untrusted and re-derive it from the live source, never to execute it as stored.",
    },
    {
      t: "pull",
      text: "An agent's own memory is a prompt-injection surface. Anything that can write to it steers every future run.",
    },
    {
      t: "mine",
      text: "My vault is my agents' memory and it is writable by every session, every hook, and me at 2am. If anything ever wrote a poisoned note into it, every future run would read that note as established fact and act on it, politely. I have no gate on that at all. This is now the top of my list.",
    },

    { t: "h", text: "Bonus: model routing without a deploy" },
    {
      t: "p",
      text: "`products/signals/backend/agent_runtime.py` resolves runtime, model and reasoning effort per team and per step from a feature-flag payload. Most-specific-first, and **atomic**: a step block's fields are taken as a set, so a Codex runtime can never accidentally pair with a Claude model. A malformed payload falls back to the default rather than breaking the run.",
    },

    {
      t: "open",
      items: [
        "How they decide when the actionability gate itself needs retraining. It is an LLM call making a judgement thousands of times a day and I could not find where its accuracy is measured, only where its output is used.",
        "Whether the semgrep-enforced single-writer rule has ever actually caught somebody, or whether it is a fence around a field nobody walks into. The second is still worth it, but they are different values.",
        "What happens to an issue's history when the grouping algorithm version changes underneath it. The versioning stops the split, but I could not find whether an old issue and a new one covering the same bug ever get reconciled.",
      ],
    },

    { t: "h", text: "The build order I took away" },
    {
      t: "list",
      items: [
        "A signal table with `remediation.human` and `remediation.agent`, written from the paths that already know something failed. No agent yet, just an honest inbox. About a day, and it is pure addition.",
        "Fingerprint and group before anything notifies. Version the automatic ones. This must land before notifications, or step three pages you 400 times and gets switched off forever.",
        "Port the alert state machine nearly verbatim. Highest value-to-novelty ratio on the list.",
        "A budgeted scan with defined degradation. Half a day now, a rewrite later.",
        "The actionability gate, which needs a steering field on the source config from day one.",
        "Both circuit breakers. Non-negotiable before any unattended run, and I am currently running unattended without them, which is the wrong way round.",
      ],
    },
    {
      t: "p",
      text: "If you only read one file, read `products/signals/backend/scout_harness/AGENTS.md`. It is dense and long and it is the best public document I have found on running agents unattended.",
    },
  ],
};

export default posthog;
