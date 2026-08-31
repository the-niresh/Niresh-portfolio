import twoDirections from "../../assets/readings/img-0080-two-directions.png";
import whereDiffer from "../../assets/readings/img-0081-where-they-differ.png";
import agreements from "../../assets/readings/img-0082-four-agreements.png";
import pickOne from "../../assets/readings/img-0083-pick-one.png";

const sentryVsPosthog = {
  slug: "sentry-vs-posthog",
  name: "Sentry vs PostHog",
  published: "21 September 2026",
  minutes: 11,
  excerpt:
    "Two companies started at opposite ends and built the same machine. Where they genuinely differ, the four things they agree on, and which one to reach for.",
  owner: "Sentry and PostHog",
  repo: "https://github.com/getsentry/sentry",
  readAt: "posthog 551ebc4b, sentry main",
  dates: "21 August 2026, read a week apart",
  tagline: "The interesting part is not either system. It is the four places they agree, arrived at separately.",
  whatItIs:
    "I read both codebases a week apart, on purpose. Sentry is error and performance monitoring. PostHog is product analytics that grew error tracking underneath it. Both have now grown an agent that investigates problems on its own and opens pull requests. This is what is actually different between them, and what is not.",
  hero: {
    src: twoDirections,
    alt: "PostHog grew down from analytics, Sentry grew up from crashes, and both arrived at the same architecture",
    caption:
      "Different starting data, different languages, opposite directions of travel. They met in the middle, and that convergence is worth more than either system on its own.",
  },
  headline: { value: "4 / 5", label: "things they agree on, versus things they truly differ on" },

  body: [
    {
      t: "p",
      text: "I read PostHog first and Sentry a week later, deliberately in that order, to find out whether two teams solving adjacent problems had landed anywhere near each other. They had landed in the same place. That is the single most useful thing I got out of a month of reading, and it is not visible from inside either repository on its own.",
    },
    {
      t: "pull",
      text: "When two independent codebases arrive at the same answer from opposite directions, the overlap is not a trend. It is the shape of the problem.",
    },
    {
      t: "note",
      text: "Both write-ups are on this site with the file and line for every claim. This page is the comparison, so it does not repeat the detail. [[posthog]] and [[sentry]] have it.",
    },

    { t: "h", text: "They grew in opposite directions" },
    {
      t: "p",
      text: "PostHog started as product analytics: who clicked what, which funnel leaks, which query is slow. Error tracking arrived later, underneath, as one more signal feeding the same pipeline. Their README no longer leads with analytics at all, it leads with self-driving.",
    },
    {
      t: "p",
      text: "Sentry started at the other end, with a stack trace and the question of which crash this is. Performance, logs and replays came later, layered over the top of an issue model that already existed.",
    },
    {
      t: "p",
      text: "That order of arrival explains almost every difference below. Whatever a system started with is the thing it has thought about for a decade; everything added later is competent and shallower.",
    },

    { t: "h", text: "Where they genuinely differ" },
    {
      t: "fig",
      src: whereDiffer,
      alt: "Five rows where one of the two has clearly thought harder",
      caption: "Not a scoreboard. Each row is a thing one of them has had longer to get wrong and fix.",
    },
    {
      t: "list",
      items: [
        "**Grouping. Sentry, not close.** PostHog computes a fingerprint, versions the automatic ones so improving the algorithm later does not split every existing issue, and moves on. That is a good design in a few thousand lines of Rust. Sentry computes a *set of competing variants*, each with its own hash and its own explanation, and distinguishes a team rule that **replaces** the computed hash from one that **salts** it. Twelve years on one question buys you that distinction, and almost nobody else has it.",
        "**Signal breadth. PostHog.** A crash is one signal. PostHog also treats a rage click, a failed query and a funnel drop as things worth investigating, and feeds all of them into the same actionability gate. Sentry's world is narrower and deeper.",
        "**Agent autonomy. Sentry.** PostHog's gate is binary: is this actionable or not. Sentry's is three-way, and the middle value is the one that matters.",
        "**Brakes. PostHog, and it is the thing I most wanted from Sentry.** Two circuit breakers on two different axes, and one of them measures whether anyone is *reading* the output. I could not find an equivalent anywhere in Sentry.",
        "**Explaining itself. Sentry.** Every grouping variant carries `contributes`, `description` and `hint`. The reason is a field, not a log line.",
      ],
    },
    {
      t: "p",
      text: "The autonomy difference is worth its own paragraph because it is the most copyable thing on the list.",
    },
    {
      t: "code",
      file: "src/sentry/tasks/seer/night_shift/models.py",
      lang: "python",
      code: `SKIP             # below medium fixability: nothing, suppressed a week
ROOT_CAUSE_ONLY  # medium to high: investigate and explain, write no code
AUTOFIX          # above high: all the way to a pull request`,
      caption: "A numeric heuristic and an LLM opinion both reduce to this same three-valued type, so they can be compared and can disagree.",
    },
    {
      t: "p",
      text: "Most of the time I do not want a machine editing my repository. I want to not read a stack trace at midnight. Those are different requests, and a two-valued gate cannot express the second one. PostHog cannot say ROOT_CAUSE_ONLY; Sentry can.",
    },
    {
      t: "mine",
      text: "My own agent gate is a boolean, which is why it feels wrong. Either it does nothing or it opens a pull request, so I set the threshold high and it mostly does nothing. A middle tier would have it earning its keep on every issue instead of the few I trust it with.",
    },

    { t: "h", text: "The four things they agree on" },
    {
      t: "p",
      text: "This is the part that changed how I build, and neither write-up on its own would have shown it to me.",
    },
    {
      t: "fig",
      src: agreements,
      alt: "Four principles both codebases arrived at independently",
      caption: "Two companies, two languages, two starting points. I am treating these as settled and not re-deriving them.",
    },
    {
      t: "list",
      items: [
        "**Compare like-for-like time slices, never a flat window.** PostHog samples time-of-week and time-of-day slices as explicit ranges in its baseline query. Sentry doubles the weight when the historical hour falls on the same day of week. Both learned that a flat window alerts you every Monday morning, forever.",
        "**Never let per-event work run an unbounded query.** PostHog puts a hard byte budget on its anomaly scan and degrades in a defined order, reporting which bound it hit. Sentry splits fast conditions from slow ones and pushes anything needing a query into a delayed buffer evaluated in bulk. Same principle, two completely different mechanisms.",
        "**Emit the reason as structured data at the moment of the judgement.** Sentry's variants carry their own explanations. PostHog writes two remediation texts per signal, one for a human and one for an agent, at detection time while the context still exists. Both refuse to leave the reasoning in a log line.",
        "**Gate the agent before it spends anything.** PostHog runs a cheap LLM call to decide whether a record deserves attention at all. Sentry scores fixability before Seer starts. Deciding whether to look is much cheaper than looking.",
      ],
    },
    {
      t: "pull",
      text: "Four agreements, five disagreements. The agreements cost me nothing to adopt and I have stopped arguing with them.",
    },

    { t: "h", text: "One place they disagree that I have not resolved" },
    {
      t: "p",
      text: "Sentry separates detecting from reacting so completely that the two halves communicate through Kafka rather than a function call, even though both live in the same monolith. Detector output re-enters the system as an issue event.",
    },
    {
      t: "p",
      text: "PostHog does not do this. Its pipeline composes stages in order inside one service, and the alerting stage sits in that pipeline rather than downstream of a queue.",
    },
    {
      t: "p",
      text: "Sentry's README says the split is deliberate. It does not say what broke the last time the two were coupled, which is the paragraph I actually wanted. At my volume PostHog's shape is obviously right, so I have copied that. But I do not know which of them is describing the future and which is describing their history.",
    },

    { t: "h", text: "Which one should you actually use" },
    {
      t: "fig",
      src: pickOne,
      alt: "A short decision path between the two",
      caption: "Running both is normal. They overlap least in the places each is strongest.",
    },
    {
      t: "list",
      items: [
        "**You mostly need to know why it broke.** Sentry, and it is not close. Grouping quality is the whole product and twelve years shows.",
        "**You mostly need to know whether anyone noticed, or cared.** PostHog. A crash is one signal among many, and the others are where the product decisions are.",
        "**You want an agent that investigates on its own.** Both ship one. Sentry's is better graded, PostHog's is better braked. If you are only running one unattended, take the one with the brakes.",
        "**You are building your own.** Read PostHog's `scout_harness/AGENTS.md` first. It is the best public document I have found on running agents unattended, and it is free.",
      ],
    },
    {
      t: "open",
      items: [
        "Whether Sentry has a waste brake somewhere I did not find. An agent that works perfectly and is ignored is a real failure mode and PostHog instruments it explicitly, including a false-positive metric for the brake itself.",
        "Which of the two escalation approaches actually performs better in production. Sentry's per-issue forecast is far more sophisticated than PostHog's budgeted scan, but sophistication and accuracy are not the same thing and neither publishes the comparison.",
        "Why PostHog's actionability gate has no measured accuracy that I could find. It is an LLM making a judgement thousands of times a day and I could only find where its output is used, never where it is checked.",
      ],
    },

    { t: "h", text: "What I took from reading both" },
    {
      t: "list",
      items: [
        "The four agreements, adopted without further argument.",
        "Sentry's three-way agent verdict, replacing my boolean.",
        "PostHog's two brakes, especially the one that measures whether anyone reads the output.",
        "Sentry's habit of recording that the system changed its own mind, and why, including when the actor was the system itself.",
      ],
    },
    {
      t: "p",
      text: "If you only have time for one of these codebases, read the one that starts where your problem starts. If you have time for two, read them a week apart in either order, and pay most attention to the parts where you get a feeling of having read this before. That feeling is the finding.",
    },
  ],
};

export default sentryVsPosthog;
