# Python is Nothing but a Game

A free, interactive web app to learn **Python, Data Structures & Algorithms, Competitive Programming, and FastAPI** from the very basics to production -- by building, not just reading.

This site turns three roadmaps into one playable, project-based learning platform:
- **Python / DSA / FastAPI**: [PYTHON_MASTERY_ROADMAP.md](./PYTHON_MASTERY_ROADMAP.md) (the original 32-week plan)
- **DSA structure**: [roadmap.sh/datastructures-and-algorithms](https://roadmap.sh/datastructures-and-algorithms)
- **FastAPI structure**: the dev.to "Mastering FastAPI" roadmap (Foundational -> Core -> Intermediate -> Advanced)
- **Competitive Programming**: the attached 10-phase CP roadmap PDF, with Phase 0 fully authored and Phases 1-9 scaffolded for you to fill in with the Dev Tool

**Live demo:** enable GitHub Pages (see Deploy below) and it publishes automatically.

---

## What makes it special

| Feature | What you get |
|--------|--------------|
| Real Python in the browser | Every code example is a live editor powered by Pyodide (CPython compiled to WebAssembly). Edit it, run it, break it -- no install, no backend. |
| Live algorithm visualizers | Watch sorting (5 algorithms), binary search, graph BFS/DFS, and binary-tree traversals animate step by step with tunable speed and size. |
| FastAPI Lab | An interactive REST simulator -- pick an endpoint, edit the JSON body, and see the exact status codes and validation errors FastAPI would return. |
| Dev Tool | A full in-browser CMS: edit every track, phase, week, lesson, and content block live, with autosave, export/import JSON, and reset to default. This is how you fill in the empty Competitive Programming phases. |
| A project for every topic | 100+ lessons across six tracks, each with an explanation, a runnable code demo, and a project. |
| Progress tracking | Tick off lessons; progress is saved in your browser and shown per phase, week, and track. |
| Restrained design | Monochrome dark/light theme with one accent color; color is reserved for status, syntax, and visualizer states -- not decoration. No emoji anywhere in the UI. Sans-serif UI font (Inter), monospace for all code (JetBrains Mono). |

---

## The six tracks

| Track | Focus | Status |
|------|-------|--------|
| Python | Core foundations -> OOP -> advanced (async, internals) | Fully authored, 3 phases |
| Data Structures & Algorithms | Complexity through graphs and DP, structured against roadmap.sh | Fully authored, 9 modules |
| Competitive Programming | Python foundations for CP through expert topics and contest craft | Phase 0 fully authored; Phases 1-9 scaffolded (title, milestone, reference outline) -- fill in with the Dev Tool |
| FastAPI & Databases | Foundational prerequisites through production architecture, following the dev.to roadmap phases | Fully authored, 8 modules |
| Production & DevOps | Testing, Docker, CI/CD | Fully authored |
| Capstone | Portfolio-grade final project | Fully authored |

Full original Python/DSA/FastAPI breakdown: **[PYTHON_MASTERY_ROADMAP.md](./PYTHON_MASTERY_ROADMAP.md)**.

---

## Run it locally

It's a zero-build, dependency-free static site. Any static server works:

```bash
# clone, then from the project root:
python3 -m http.server 8000
# open http://localhost:8000
```

> The interactive Python engine (Pyodide), code editor (CodeMirror), and fonts load from public CDNs at runtime, so an internet connection is needed for those features. Everything else -- routing, curriculum, visualizers, API Lab, Dev Tool -- is fully local.

---

## Deploy

This repo ships a GitHub Actions workflow ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) that publishes to GitHub Pages on every push.

1. Push to `main` (or the dev branch).
2. In Settings -> Pages -> Build and deployment -> Source, choose GitHub Actions.
3. The workflow deploys the site and gives you a public URL.

---

## Architecture

```
index.html              app shell: nav, CDN libs, mounts the SPA
css/styles.css           full design system (dark + light themes, motion utilities)
js/
  icons.js               hand-rolled inline SVG icon set (no emoji, no icon font)
  data/curriculum.js      seed content: tracks, phases, weeks, lessons (data-driven)
  content.js              editable data layer -- localStorage override on top of the seed data
  playground.js           Pyodide engine + reusable code-runner widget
  visualizers.js          sorting / searching / graph / tree animations
  devtool.js               the in-browser CMS
  app.js                  hash router, view rendering, progress (localStorage)
PYTHON_MASTERY_ROADMAP.md
.github/workflows/deploy.yml
```

**Design choices**
- No framework, no build step -- pure HTML/CSS/vanilla JS.
- Data-driven content -- lessons are declarative blocks in `curriculum.js`, so adding a lesson is just adding data.
- Editable at runtime -- `content.js` clones the seed data into a localStorage-backed working copy. Every view reads through `Content.get()`, so edits made in the Dev Tool apply everywhere immediately, with no rebuild.
- Graceful degradation -- if CodeMirror can't load, the editor falls back to a plain textarea.

---

## Using the Dev Tool

Open the **Dev Tool** from the nav on any page (or `#/devtool`). It's a tree on the left (Tracks -> Phases -> Weeks -> Lessons) and a form editor on the right.

- Click any node to edit its fields. Click "Add track / Add phase / Add week / Add lesson" to create new ones.
- Lessons have a block editor: add, reorder, or delete Heading, Paragraph, List, Callout, Runnable code, Quiz, Objectives, and API request/response blocks.
- Every edit autosaves to your browser's localStorage and is reflected on the live pages immediately -- no save button, no rebuild.
- **Export** downloads your working copy as JSON (back it up, or hand it to someone else).
- **Import** loads a JSON file as your new working copy.
- **Reset** discards all edits and restores the built-in curriculum.

This is how you fill in Competitive Programming Phases 1-9: open the phase's "Reference outline" on the track page for the topic list pulled from the roadmap PDF, then use the Dev Tool to add weeks and lessons following the same pattern as Phase 0.

---

## Adding a lesson directly in code

In `js/data/curriculum.js`, drop a lesson object into the right week using the block helpers:

```js
{ day: 99, title: 'My Topic', project: 'Cool Thing', tags: ['python'],
  content: [
    OBJ('Learn X', 'Do Y'),
    H2('Section'),
    P('Explanation with `code` and **bold**.'),
    PLAY('print("runnable python!")'),
    QUIZ('Question?', ['A', 'B'], 1, 'Why B is right.'),
  ] }
```

Available blocks: `OBJ`, `H2`, `H3`, `P`, `UL`, `OL`, `TIP`, `WARN`, `INFO`, `PLAY`, `QUIZ`, and an `apisim` block for request/response demos -- the same block types the Dev Tool edits.

---

## Credits

Built for Prach's mastery journey across Python, DSA, Competitive Programming, and FastAPI. Learn by building.
