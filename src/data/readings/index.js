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

import allAgree from "../../assets/readings/img-0024-all-agree.png";
import codex from "./codex";
import archon from "./archon";
import t3code from "./t3code";

export const READINGS = [codex, archon, t3code];

export const CONCLUSION = {
  image: { src: allAgree, alt: "Codex, Archon and t3code all spend most of their code on isolation" },
  title: "What all three agree on",
  body: "Codex spends eleven crates on sandboxes and policy. Archon gives every run its own copy of the repository, and keeps it when the run fails. t3code isolates each agent's working state and runs the same agent twice under different home directories. Three teams, three problems, one answer underneath: make sure the model cannot reach past the thing you handed it. That is not the conversation happening in public, where it is all about which model and how big the context window is. Inside these repositories almost none of the code is about that. The model is the cheap part now. The box around it is the work.",
};

export const getReading = (slug) => READINGS.find((r) => r.slug === slug);
