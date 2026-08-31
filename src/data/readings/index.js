// Source-reading write-ups, one per open-source project, one file each.
//
// These exist so a LinkedIn post has somewhere of Nire's OWN to point at. A fork
// of somebody else's repo is byte-identical to theirs and shows a reader nothing,
// which is exactly the wrong link to hand a hiring manager. This is the analysis;
// the repo link is credit and sits inside the page.
//
// Every post is an ordered list of typed blocks (`body`), not a fixed set of
// sections. That is deliberate: the old shape was heading-plus-one-paragraph
// repeated, which made every finding look the same size, and it had nowhere to
// put code. Rhythm is now the writer's job. See src/Pages/Reading.jsx for the
// block types.
//
// House rule for these pages: every code block carries the file and line it came
// from, and every number has to be re-derivable by a reader. See
// /srv/obsidian/social-media-vault/rules/long-form.md.

import allAgree from "../../assets/readings/img-0079-all-agree-five.png";
import codex from "./codex";
import archon from "./archon";
import t3code from "./t3code";
import posthog from "./posthog";
import sentry from "./sentry";
import baalda from "./baalda";

// Newest first. The three harness readings came first and set the house rules;
// PostHog and Sentry are the observability pair, read a week apart on purpose so
// the overlap between them means something. Baalda is the odd one out and stays
// last in reading order for that reason.
export const READINGS = [baalda, sentry, posthog, codex, archon, t3code];

export const CONCLUSION = {
  image: {
    src: allAgree,
    alt: "Codex, Archon, t3code, PostHog and Sentry all spend most of their code on containment",
  },
  title: "What they all agree on",
  body: "Codex spends eleven crates on sandboxes and policy. Archon gives every run its own copy of the repository, and keeps it when the run fails. t3code isolates each agent's working state and runs the same agent twice under different home directories. PostHog puts two circuit breakers on two different axes and instruments its own brake for false positives. Sentry gives its agent three verdicts so it can investigate without being allowed to write. Five teams, five problems, one answer underneath: make sure the thing cannot reach past what you handed it. That is not the conversation happening in public, where it is all about which model and how big the context window is. Inside these repositories almost none of the code is about that. The model is the cheap part now. The box around it is the work.",
};

export const getReading = (slug) => READINGS.find((r) => r.slug === slug);
