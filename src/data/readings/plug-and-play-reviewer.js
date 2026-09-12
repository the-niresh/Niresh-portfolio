import firstFind from "../../assets/readings/reviewer-first-find.png";

const plugAndPlayReviewer = {
  slug: "plug-and-play-reviewer",
  name: "Plug and Play Reviewer",
  published: "12 September 2026",
  minutes: 9,
  excerpt:
    "I built an AI code reviewer that never gets to see my code. Here is how the split works, and the four bugs that all looked like everything was fine.",
  owner: "Niresh",
  repo: "https://github.com/the-niresh/plug-and-play-reviewer",
  dates: "Built and shipped, September 2026",
  tagline: "Every other AI reviewer wants your code on their server. This one does not get it.",
  whatItIs:
    "It reads your pull request, finds bugs, and writes a comment on GitHub. The difference is where it runs. The part that reads your code runs on your own laptop. The part on the internet never sees a single line.",
  hero: {
    src: firstFind,
    alt: "The bot finds a divide by zero bug, suggests a wrong fix, and I correct it",
    caption:
      "The first real bug it caught. It was right about the bug and wrong about the fix. That is why a human has to press approve.",
  },
  headline: { value: "0", label: "lines of your code the server ever sees" },

  body: [
    {
      t: "p",
      text: "I wanted an AI reviewer for my own pull requests. Every one I looked at asked me to give a company full read access to my private repos. Then my code sits on their server. I did not want that.",
    },
    {
      t: "p",
      text: "So I built one where that cannot happen. Not because I promise not to look. Because the part on the internet is never handed the code in the first place.",
    },

    { t: "h", text: "Two parts, one line between them" },
    {
      t: "p",
      text: "The whole idea is a split. There are two programs and one rule about what may cross between them.",
    },
    {
      t: "list",
      items: [
        "**The server.** It lives on the internet. GitHub tells it \"someone opened a pull request\". It writes that down. That is all it does.",
        "**The runner.** This runs on your laptop. It asks the server if there is work. It downloads the code itself, straight from GitHub. It calls the AI model with your own API key. Then it waits for you to say yes before posting anything.",
      ],
    },
    {
      t: "p",
      text: "So your code goes from GitHub to your laptop and back. It never stops anywhere I own. Your model key never leaves your machine either. It sits in your laptop's keychain, the same place your other passwords live.",
    },
    {
      t: "note",
      text: "A promise is not a guarantee. Anyone can say \"we never store your code\". The question is what stops it happening by accident six months later.",
    },

    { t: "h", text: "The rule is a test, not a promise" },
    {
      t: "p",
      text: "This is the part I am most happy with. There is a test that looks at the real database on the server and checks every single column. If any column could hold your source code, a diff, or an API key, the test fails and nothing ships.",
    },
    {
      t: "code",
      file: "src/pr_reviewer/control_plane/boundary.py",
      lang: "python",
      code: `# Runs against the live schema, not a copy of it.
# HOSTED_EXEMPTIONS is empty, and a test checks it stays empty.
assert_no_private_columns(connection)`,
    },
    {
      t: "p",
      text: "So if I add a column one day without thinking, the build stops. I do not have to remember the rule. The rule remembers itself.",
    },
    {
      t: "pull",
      text: "A promise you can break by accident is not a promise. A test you cannot get past is.",
    },

    { t: "h", text: "It found a real bug. Its fix was wrong." },
    {
      t: "p",
      text: "The picture at the top is the first real bug it caught, on my own code. I wrote a function that divides by the number of scores. If the list is empty, that crashes. The bot spotted it.",
    },
    {
      t: "p",
      text: "Then it wrote a fix, and the fix was wrong. It added a new line instead of replacing the broken one. I replied and said so.",
    },
    {
      t: "p",
      text: "I put that screenshot on the front page on purpose. Not the clean one. This is the honest version of what these tools do today. They are good at spotting. They are not good enough to trust with the edit. So nothing gets posted to GitHub until a human presses approve, and there is no setting to turn that off.",
    },

    { t: "h", text: "Four bugs that all said everything is fine" },
    {
      t: "p",
      text: "Launch night taught me more than the month before it. Four things were broken. Not one of them showed an error. Every one reported success.",
    },
    {
      t: "list",
      items: [
        "**The database was never set up.** The host I picked runs a \"before you deploy\" step, but only if you pay. On the free plan it skips it and says nothing. So the app started, said it was healthy, and had no tables at all.",
        "**The wrong thing got built.** That host builds whatever is last in your build file. Last in mine was the website, not the server. On my laptop it worked, because on my laptop I always said which part to build.",
        "**A stray settings file took over.** The app looked for settings by searching upward from whatever folder you were in. Run it inside another project that has its own settings file, and it quietly pointed at the wrong server. Setup saved the right one. Starting it used the wrong one.",
        "**The help said to do something impossible.** When sign in broke, the message said \"sign in again\". But the sign in screen only shows up when you are signed out. So it told you to press a button that was not on the screen.",
      ],
    },
    {
      t: "p",
      text: "The same mistake sits under all four. I was checking that things start. I was not checking that they work.",
    },
    {
      t: "pull",
      text: "A health check that cannot fail is not a health check.",
    },
    {
      t: "p",
      text: "The health check said 200 OK. It did not touch the database, so it had no idea the database was empty. Now, for each part, I write the one test that fails if that part is there but doing nothing. Those tests are worth more than all the rest.",
    },

    { t: "h", text: "Things I got wrong on a Mac" },
    {
      t: "p",
      text: "I built the whole thing on Linux. Then I tried it on a MacBook and two things did not work.",
    },
    {
      t: "p",
      text: "Press `o` to open the sign in link in a browser. Nothing happened. My code checked for a setting called `DISPLAY` to decide if a browser existed. That setting is a Linux thing. Macs do not have it. So on every Mac my code decided there was no browser and gave up before trying.",
    },
    {
      t: "p",
      text: "Press `c` to copy the link. It said \"Link copied\". Nothing was copied. I was using a special terminal code to copy, and the Mac terminal ignores it. Worse, my code said it worked either way. It lied.",
    },
    {
      t: "p",
      text: "I fixed both. Then I did the better fix: I made sign in work without the fancy terminal screen at all. Now it just prints the link as normal text, and you copy it the way you copy anything else.",
    },
    {
      t: "code",
      file: "reviewer login --no-tui",
      lang: "bash",
      code: `Open this link to sign in:

https://plugandplayreviewer.online/api/auth/github/sign-in?pairing_code=7iSySG...

Pairing code: 7iSySGEeVPW38YRILtuklpT9C9mDKPnxLn7toIfebM4
Waiting for you to finish in the browser. Ctrl-C to stop.`,
    },
    {
      t: "p",
      text: "No clipboard code. No guessing whether you have a browser. Nothing that can break on a Mac. The lesson: when something is hard to get right, check whether you need it at all.",
    },

    { t: "h", text: "What I would tell myself a month ago" },
    {
      t: "list",
      items: [
        "Write the test that fails when a part is present but useless. Not the test that checks it starts.",
        "Keep the prompts you send the model in one place, with a version number. When results change, you want to know which prompt did it.",
        "If the model gets to decide whether something is safe to post, you have no safety at all. That decision has to be a field the model cannot write to.",
        "Do not publish a number you did not measure. My code raises an error rather than print a score from the wrong data set.",
        "Try it on a machine that is not yours. Two of my bugs only existed on a Mac.",
      ],
    },

    { t: "h", text: "What is not done" },
    {
      t: "p",
      text: "A write up that only lists wins is not a write up.",
    },
    {
      t: "open",
      items: [
        "I have not measured how often it is right. I have a small test set and it is not big enough to claim a number, so I do not claim one.",
        "The free server goes to sleep after 15 minutes. GitHub gives up after 10 seconds. So a pull request opened against a sleeping server can be missed. Start the runner first and it keeps the server awake.",
        "Full mode needs a local database, and right now that only starts if you run as root. Found it this week. Not fixed yet.",
        "The end to end tests for the website were written for an older version of the pages and need rewriting.",
      ],
    },

    { t: "h", text: "Try it" },
    {
      t: "p",
      text: "It is free and the code is open. The site is `plugandplayreviewer.online`. The code is at `github.com/the-niresh/plug-and-play-reviewer`, and the repo link is in the header of this page. If something breaks, there is a form on the site, and it reaches me and not a queue.",
    },
  ],
};

export default plugAndPlayReviewer;
