import variants from "../../assets/readings/img-0071-sentry-variants.png";
import states from "../../assets/readings/img-0072-sentry-states.png";
import seer from "../../assets/readings/img-0073-sentry-seer.png";
import escalating from "../../assets/readings/img-0074-sentry-escalating.png";

const sentry = {
  slug: "sentry",
  name: "Sentry",
  published: "13 September 2026",
  minutes: 13,
  excerpt:
    "Twelve years spent on one question: what counts as the same error. Then an agent on top of the answer, with three verdicts instead of two. Read next to PostHog, which arrived at the same architecture from the opposite direction.",
  owner: "Functional Software / Sentry",
  repo: "https://github.com/getsentry/sentry",
  readAt: "main, 21 August 2026",
  dates: "21 August 2026",
  tagline: "Every judgement it makes, it writes down the reason as a field, not a log line.",
  whatItIs:
    "Sentry is error and performance monitoring. I read it the week after PostHog, on purpose, to see whether two teams solving adjacent problems had landed anywhere near each other. They had landed in the same place, which is the most useful thing in this write-up.",
  hero: {
    src: variants,
    alt: "One event produces several competing grouping variants, each with its own hash and explanation",
    caption:
      "Not one fingerprint. A set of them, each carrying its own explanation of why it contributed.",
  },
  headline: { value: "3 verdicts", label: "where everyone else builds two" },

  body: [
    {
      t: "p",
      text: "PostHog started with analytics and grew an agent that fixes what the analytics noticed. Sentry started with crashes and grew an agent that fixes what the crash revealed. Different companies, different starting data, different languages.",
    },
    {
      t: "pull",
      text: "Both landed in the same architecture. When that happens the overlap is not a trend, it is the shape of the problem. Trust it and copy it.",
    },
    {
      t: "p",
      text: "The difference is depth of noticing. PostHog's error tracking is a few thousand lines of Rust. Sentry's is twelve years on the single question of what counts as the same error, and it shows.",
    },

    { t: "h", text: "Grouping: an event gets several competing hashes, not one" },
    {
      t: "p",
      text: "`src/sentry/grouping/variants.py`. Rather than computing one hash, Sentry computes a **set of variants**, each with its own hash and its own explanation of itself.",
    },
    {
      t: "list",
      items: [
        "`ChecksumVariant` and `HashedChecksumVariant`: the client sent a raw checksum. Trust it.",
        "`ComponentVariant`: computed from the stack trace, exception type and message.",
        "`CustomFingerprintVariant`: a team rule matched and **replaced** the computed hash.",
        "`SaltedComponentVariant`: a team rule matched **and kept `{{ default }}`**, so the computed hash is *salted* rather than replaced.",
        "`FallbackVariant`: nothing produced anything. Everything lands in one group.",
      ],
    },
    {
      t: "p",
      text: "`SaltedComponentVariant` is the subtle one and it is the reason to read this file. **Override and refine are different operations.** You can say \"split these by customer id\" without throwing away the stack-trace grouping underneath. Every system with a custom rule needs this distinction and almost none of them have it, so a team writing one rule silently loses all the built-in intelligence.",
    },
    {
      t: "p",
      text: "But the transferable lesson is bigger than errors, and it took me a second read to see it. Every variant carries `contributes`, `description` and `hint`.",
    },
    {
      t: "pull",
      text: "When a system makes a judgement a human will later question, emit the reasoning as structured data at the moment it decides. Not a log line. A field.",
    },
    {
      t: "p",
      text: "A log line is for a person with grep and a suspicion. A field is something the UI can render, a query can filter on, and an agent can read instead of guessing. Same information, completely different downstream.",
    },

    { t: "h", text: "Issue lifecycle: states that earn their keep" },
    {
      t: "p",
      text: "Most trackers have open and closed. Sentry has five states and every one of them is doing work.",
    },
    {
      t: "list",
      items: [
        "`unresolved`. The default.",
        "`resolved`. Which means coming back is a **regression**, a distinct and louder event than simply happening.",
        "`ignored`. Muted outright.",
        "`archived until escalating`. Muted **conditionally**, and this is the one everyone else is missing.",
        "`ongoing`. Not new, not escalating. Stops a week-old issue sitting in \"new\" forever.",
      ],
    },
    {
      t: "fig",
      src: states,
      alt: "Ignored, archived until escalating, and ongoing, side by side",
      caption: "'Archive until escalating' is the honest answer to a problem every team actually has.",
    },
    {
      t: "p",
      text: "Archive until escalating is the honest answer to *\"this happens 20 times a day, I know, stop telling me.\"* You are not saying ignore it. You are saying **tell me if it gets worse**, which requires the system to know what worse means for this specific issue. That requirement is what the next section is about.",
    },
    {
      t: "p",
      text: "Priority is a **separate axis** from state, which sounds obvious and is routinely conflated. Every change is written to `GroupHistory` with a reason of `escalating`, `ongoing` or `issue_platform`, and records the actor even when it was `SYSTEM_ACTOR`.",
    },
    {
      t: "note",
      text: "The system records that it changed its own mind, and why. I have never built anything that does that, and every time an automated system has surprised me it is the exact thing I wished existed..?!",
    },

    { t: "h", text: "Forecasting worse, per issue" },
    {
      t: "p",
      text: "`src/sentry/issues/escalating/escalating_issues_alg.py`. The docstring is better than most papers I have read on the subject. For an issue with at least 14 days of history:",
    },
    {
      t: "list",
      items: [
        "Weighted average of the last 7 days of **hourly** data.",
        "**Double the weight when the historical hour falls on the same day of week.** Daily and weekly seasonality is real, and ignoring it means alerting every Monday morning forever.",
        "Calibrate to 5 standard deviations, then **clamp to [5, 8]**. Unclamped behaves terribly at both ends: a stable series alerts on nothing, a noisy one alerts on everything.",
        "A separate **bursty** ceiling: coefficient of variation, then exponential, giving a multiplier inversely related to CV, clamped to [2, 5], times the busiest single hour of the week.",
        "**The limit is the max of the two.** Stable issues end up governed by the standard-deviation bound, spiky ones by the bursty bound.",
      ],
    },
    {
      t: "fig",
      src: escalating,
      alt: "The four steps of the escalation forecast, with both clamps marked",
      caption: "Both clamps exist because the unclamped version shipped and misbehaved. You can read the scars.",
    },
    {
      t: "p",
      text: "All five thresholds live in one `ThresholdVariables` dataclass with a named default set, so the whole calibration is visible and overridable in one place rather than scattered as magic numbers. That is a small structural choice that makes the difference between a heuristic you can tune and one you are afraid of.",
    },
    {
      t: "p",
      text: "And here is the convergence. PostHog samples time-of-week slices in its baseline query. Sentry doubles the weight on matching weekdays. Two teams, two languages, one answer: **compare like-for-like time slices, never a flat window.** I am treating that as settled and I am not going to re-derive it.",
    },

    { t: "h", text: "Detecting and reacting are separate pipelines" },
    {
      t: "p",
      text: "`src/sentry/workflow_engine/README.md`. The two halves deliberately do not call each other. Detector output goes through Kafka and re-enters as an issue event.",
    },
    {
      t: "p",
      text: "Detection: a `DataPacket` into a `DetectorHandler`, producing one of **three** outcomes, not two. Triggered gives an `IssueOccurrence`. Resolved gives a `StatusChangeMessage`. **No change emits nothing at all.**",
    },
    {
      t: "p",
      text: "That third outcome only exists because there is durable transition state. Without it, \"no change\" is not knowable, and a flapping signal produces a stream of identical events that some poor consumer has to dedupe.",
    },
    {
      t: "p",
      text: "Workflow processing: WHEN conditions, then IF filters, then dispatch actions. **Fast and slow conditions are split.** A condition answerable from the event alone runs inline. A condition needing a query, like \"seen more than 100 times in the last hour\", goes to a delayed buffer and is evaluated **in bulk for many issues at once**.",
    },
    {
      t: "pull",
      text: "That is the third independent version of the same principle as PostHog's byte-budgeted scan: never let per-event work do unbounded queries.",
    },

    { t: "h", text: "Seer: graded autonomy, and the biggest single upgrade over PostHog" },
    {
      t: "p",
      text: "`src/sentry/tasks/seer/night_shift/models.py`. PostHog's gate is binary: is this actionable or not. Sentry's is three-way.",
    },
    {
      t: "fig",
      src: seer,
      alt: "Skip, root cause only, and autofix",
      caption: "The middle verdict is where most of the value sits, and it is the one people skip building.",
    },
    {
      t: "list",
      items: [
        "`SKIP`, below a medium fixability score. Nothing happens, suppressed for a week.",
        "`ROOT_CAUSE_ONLY`, between medium and high. **Investigate and explain, and stop before writing a fix.**",
        "`AUTOFIX`, above high. All the way to a pull request.",
      ],
    },
    {
      t: "p",
      text: "The middle one is the whole idea. Most of the time I do not want a machine editing my repository. I want to not read a stack trace at midnight. Those are different requests and a two-valued gate cannot express the second one.",
    },
    {
      t: "p",
      text: "`TriageAction.from_fixability_score` is documented as a three-way collapse of the stopping-point thresholds, *so a fixability score can be compared against an agent verdict on equal footing*. A numeric heuristic and an LLM opinion reduce to the same three-valued type, which means they can be compared, can disagree, and can be measured against each other over time.",
    },
    {
      t: "mine",
      text: "My own agent gate is a boolean and I now understand why it feels wrong. It forces every run into either doing nothing or opening a pull request, so I set the threshold high and it mostly does nothing. A ROOT_CAUSE_ONLY tier would have it earning its keep on every issue instead of the few I trust it with.",
    },

    {
      t: "open",
      items: [
        "How the fixability score is calibrated in the first place. The three-way collapse is clean, but the number going into it is doing all the work and I could not find where its accuracy is checked against outcomes.",
        "Whether `archived until escalating` ever gets stuck. The escalation forecast needs 14 days of history, so a brand new issue archived on day one has no baseline to escalate against, and I could not find what happens in that window.",
        "Why the detector and workflow halves communicate through Kafka rather than a direct call, when both are in the same monolith. The README says it is deliberate. It does not say what broke the last time they were coupled, and that is the paragraph I actually wanted.",
      ],
    },

    { t: "h", text: "What I am taking" },
    {
      t: "list",
      items: [
        "Emit the reason as a field at the moment of the judgement. This is the single biggest idea in the file and it has nothing to do with errors.",
        "Three verdicts for any agent gate. Skip, explain, act.",
        "Separate the state axis from the priority axis, and record the actor on every change including when it was the system.",
        "Compare like-for-like time slices. Settled by two independent codebases, no further thought required.",
        "Clamp every heuristic threshold, and keep them all in one visible place. Both of Sentry's clamps are scar tissue and I would rather inherit the scar than earn it.",
      ],
    },
    {
      t: "p",
      text: "Read next to the PostHog write-up, the useful thing is not either system. It is the four places they agree, arrived at separately. Those four are the parts I have stopped arguing with.",
    },
  ],
};

export default sentry;
