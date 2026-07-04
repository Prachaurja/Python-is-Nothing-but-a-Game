# 🐍 THE COMPLETE PYTHON MASTERY ROADMAP
### Python (A–Z) → DSA (A–Z) → Competitive Programming (A–Z) → FastAPI (A–Z)

> 🎮 **This roadmap is now an interactive, playable website.** Open `index.html` (or the deployed GitHub Pages site) to run every example as real Python in your browser, watch algorithms animate, use the FastAPI Lab, and tick off progress as you go. See the [README](./README.md) for how to run & deploy it.

**Built for:** Prach — 3 hours/day, code-review loop, project-per-topic learning
**Total duration:** 32 weeks (~224 days) — deliberately paced, zero rushing
**Philosophy:** Every topic → exercise ladder (Easy → Medium → Hard) → mini-project → phase mega-project → code review before advancing

---

## 📅 MASTER TIMELINE

| Phase | Weeks | Focus | Mega Project |
|-------|-------|-------|--------------|
| 1 | 1–4 | Python Core Foundations | CLI Grade Manager |
| 2 | 5–7 | OOP + Intermediate Python | OOP Bank System |
| 3 | 8–9 | Advanced Python | Plugin-Based Automation Engine |
| 4 | 10–16 | DSA A–Z | DSA Visualiser CLI |
| 5 | 17–21 | Competitive Programming A–Z | Codeforces Rating Grind (target: Pumpkin → Specialist) |
| 6 | 22–28 | FastAPI + Databases A–Z | Production Task Manager REST API |
| 7 | 29–31 | Testing, Deployment, DevOps Basics | Deployed Full API with CI/CD |
| 8 | 32 | Capstone + Portfolio Polish | Full-Stack Capstone |

---

## 🗂️ MASTER REPOSITORY ARCHITECTURE

Create ONE GitHub repo on Day 1. This becomes portfolio evidence of your entire journey.

```
python-mastery/
│
├── README.md                  # Journey log — update weekly
├── .gitignore
│
├── phase-1-core-python/
│   ├── week-01-basics/
│   │   ├── notes.md           # Your own explanations (Feynman technique)
│   │   ├── exercises/
│   │   │   ├── easy/
│   │   │   ├── medium/
│   │   │   └── hard/
│   │   └── mini-project/
│   ├── week-02-control-flow/
│   ├── week-03-functions-collections/
│   ├── week-04-files-errors/
│   └── PROJECT-grade-manager/
│
├── phase-2-oop/
│   ├── week-05-oop-basics/
│   ├── week-06-oop-advanced/
│   ├── week-07-pythonic-patterns/
│   └── PROJECT-bank-system/
│
├── phase-3-advanced-python/
│   ├── week-08-internals/
│   ├── week-09-concurrency/
│   └── PROJECT-automation-engine/
│
├── phase-4-dsa/
│   ├── week-10-complexity-arrays/
│   ├── week-11-linked-lists-stacks-queues/
│   ├── week-12-recursion-sorting/
│   ├── week-13-searching-hashing/
│   ├── week-14-trees/
│   ├── week-15-graphs/
│   ├── week-16-dp-greedy/
│   └── PROJECT-dsa-visualiser/
│
├── phase-5-competitive-programming/
│   ├── templates/             # Your CP code templates
│   ├── contests/              # One folder per contest
│   ├── upsolving/             # Problems you failed, then solved
│   └── patterns.md            # Your personal pattern cheatsheet
│
├── phase-6-fastapi/
│   ├── week-22-http-basics/
│   ├── week-23-fastapi-core/
│   ├── week-24-databases-sql/
│   ├── week-25-sqlalchemy-orm/
│   ├── week-26-auth-security/
│   ├── week-27-advanced-fastapi/
│   ├── week-28-architecture/
│   └── PROJECT-task-manager-api/
│
├── phase-7-production/
│   ├── week-29-testing/
│   ├── week-30-docker-deploy/
│   └── week-31-cicd-monitoring/
│
└── phase-8-capstone/
    └── PROJECT-capstone/
```

---

# 🔵 PHASE 1 — PYTHON CORE FOUNDATIONS (Weeks 1–4)

## Week 1 — Absolute Basics
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 1 | Variables, data types, `print()`, `input()`, comments | **Personal Intro Card** — prints a formatted profile card from user input |
| 2 | Strings deep-dive: indexing, slicing, methods, f-strings | **Username Generator** — builds usernames from full name + birth year |
| 3 | Numbers: int, float, operators, `math` module, rounding traps | **Tip & Bill Splitter** — real restaurant calculator |
| 4 | Type conversion, truthiness, `None`, booleans | **Unit Converter** — km↔miles, kg↔lbs, °C↔°F |
| 5 | Operators: comparison, logical, identity (`is` vs `==`), membership | **Eligibility Checker** — visa/loan eligibility from multiple conditions |
| 6 | Review + Easy/Medium/Hard exercise ladder (15 problems) | — |
| 7 | **Weekly build:** **Receipt Generator** — takes items+prices, prints a formatted shop receipt with GST (Australian 10%!) | — |

## Week 2 — Control Flow
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 8 | `if/elif/else`, nesting, guard clauses | **Grade Classifier** — La Trobe grade bands (N/P/C/D/HD) |
| 9 | `while` loops, `break`, `continue`, infinite loop patterns | **Number Guessing Game** with attempt limits |
| 10 | `for` loops, `range()`, loop patterns (accumulator, counter, flag) | **Times-Table Trainer** — quizzes you, tracks score |
| 11 | Nested loops, loop `else`, common pitfalls | **Pattern Printer** — pyramids, diamonds (secret DSA warm-up) |
| 12 | `match/case` (structural pattern matching) | **Text Adventure Menu** — mini dungeon navigator |
| 13 | Exercise ladder (15 problems) | — |
| 14 | **Weekly build:** **ATM Simulator** — PIN attempts, balance, deposit/withdraw loop | — |

## Week 3 — Functions & Collections
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 15 | Functions: def, return, parameters vs arguments, scope, docstrings | **Password Strength Checker** as reusable function |
| 16 | Default args, keyword args, `*args`, `**kwargs` | **Flexible Invoice Builder** — accepts any number of items |
| 17 | Lists A–Z: methods, slicing, copying traps (shallow!), list comprehension | **To-Do List (in-memory)** — add/remove/mark done |
| 18 | Tuples, sets, set operations (union/intersection) | **Duplicate Email Cleaner** — dedupe a contact list |
| 19 | Dictionaries A–Z: methods, nesting, dict comprehension, `.get()` | **Contact Book** — nested dict CRUD |
| 20 | `lambda`, `map`, `filter`, `sorted` with `key=`, `zip`, `enumerate` | **Leaderboard Sorter** — multi-key sorting of players |
| 21 | **Weekly build:** **Quiz Engine** — questions stored in dicts, scoring, review of wrong answers | — |

## Week 4 — Files, Errors, Modules
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 22 | File I/O: read/write/append, `with`, paths, `pathlib` | **Daily Journal App** — timestamped entries to file |
| 23 | CSV & JSON handling | **Expense Tracker** — persists to JSON, monthly summary |
| 24 | Exceptions: try/except/else/finally, raising, custom messages | **Bulletproof Calculator** — cannot crash no matter the input |
| 25 | Modules & packages, `import` styles, `__name__ == "__main__"`, stdlib tour (`datetime`, `random`, `os`, `sys`) | **Password Vault CLI** — multi-file program |
| 26 | Virtual environments, `pip`, `requirements.txt` | Set up first proper project env |
| 27–28 | 🏆 **MEGA PROJECT: CLI Grade Manager** — students, subjects, weighted grades, JSON persistence, search, stats, error-proof menus | — |

**✅ Phase 1 exit test:** Build a small CLI app from a spec *without looking anything up*.

---

# 🟣 PHASE 2 — OOP + INTERMEDIATE PYTHON (Weeks 5–7)

## Week 5 — OOP Foundations
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 29 | Classes, objects, `__init__`, `self`, attributes vs methods | **Student Class** — GPA calculator per instance |
| 30 | Instance vs class attributes, class methods, static methods | **Library Book System** — tracks total books via class attribute |
| 31 | Encapsulation: `_protected`, `__private`, properties (`@property`) | **Temperature Sensor** — validation via setters |
| 32 | Inheritance, `super()`, method overriding | **Employee → Manager → Executive** payroll hierarchy |
| 33 | Multiple inheritance, MRO | **Smart Device System** — mixins for WiFi/Bluetooth |
| 34 | Polymorphism, duck typing, abstract base classes (`abc`) | **Shape Area Calculator** — enforced interface |
| 35 | **Weekly build:** **Zoo Management System** — animal hierarchy, feeding schedules, polymorphic sounds | — |

## Week 6 — OOP Advanced
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 36 | Dunder methods: `__str__`, `__repr__`, `__eq__`, `__lt__`, `__len__` | **Money Class** — comparable, printable currency |
| 37 | `__add__`, `__getitem__`, operator overloading, `__contains__` | **Vector Math Class** — v1 + v2 works naturally |
| 38 | Composition vs inheritance ("has-a" vs "is-a") | **Car Builder** — Engine, Wheels as composed objects |
| 39 | Dataclasses, `__slots__`, `Enum` | **Order System** — clean dataclass models with status enums |
| 40 | Exceptions as classes: custom exception hierarchies | **Banking Errors** — InsufficientFunds, AccountLocked |
| 41 | SOLID principles in Python (all 5, with refactoring exercises) | Refactor Week 5 zoo project to SOLID |
| 42 | **Weekly build:** **Inventory Management System** — products, suppliers, stock alerts, full OOP design | — |

## Week 7 — Pythonic Patterns
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 43 | Iterators & the iterator protocol (`__iter__`, `__next__`) | **Countdown Iterator** + custom range clone |
| 44 | Generators, `yield`, generator expressions, lazy evaluation | **Log File Streamer** — processes 1GB file with tiny memory |
| 45 | Decorators A–Z: closures → decorators → decorators with args → `functools.wraps` | **@timer, @retry, @login_required** decorator toolkit |
| 46 | Context managers: `with`, `__enter__/__exit__`, `contextlib` | **Database Connection Simulator** — auto-cleanup |
| 47 | Type hints A–Z: `typing`, `Optional`, `Union`, generics, `mypy` | Add full type coverage to Week 6 project |
| 48–49 | 🏆 **MEGA PROJECT: OOP Bank System** — accounts, transactions, interest engine, custom exceptions, decorators for auth, JSON persistence, full type hints | — |

---

# 🟠 PHASE 3 — ADVANCED PYTHON (Weeks 8–9)

## Week 8 — Python Internals
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 50 | Memory model: references, mutability, `id()`, interning, garbage collection | **Memory Detective** — script proving copy vs reference traps |
| 51 | Shallow vs deep copy, `copy` module | **Save-Game Cloner** — game state snapshots |
| 52 | `*args/**kwargs` mastery, unpacking, argument forwarding | **Universal Wrapper** — proxies any function |
| 53 | Functional tools: `functools` (partial, reduce, lru_cache, cached_property) | **Fibonacci Benchmark** — cache vs no cache timing |
| 54 | Regular expressions A–Z | **Log Parser** — extract IPs, emails, timestamps from server logs |
| 55 | `collections` module: Counter, defaultdict, deque, namedtuple, OrderedDict | **Word Frequency Analyser** for any text file |
| 56 | `itertools`: chain, product, permutations, combinations, groupby | **Password Cracker Simulator** (educational brute-force on your own test data) |

## Week 9 — Concurrency & Ecosystem
| Day | Topics | Mini-Project |
|-----|--------|--------------|
| 57 | Threading, GIL explained honestly, `threading` module | **Multi-file Downloader Simulator** |
| 58 | Multiprocessing, `concurrent.futures` | **Image Batch Processor** (parallel CPU work) |
| 59 | `asyncio` A–Z: coroutines, `await`, tasks, `gather` — *critical FastAPI prep* | **Async Web Checker** — pings 50 URLs concurrently |
| 60 | Working with APIs: `requests`, `httpx`, status codes, headers | **Weather CLI** — real API consumption |
| 61 | Logging (`logging` module properly, not print), config files, env vars | Add production logging to Bank System |
| 62–63 | 🏆 **MEGA PROJECT: Plugin-Based Automation Engine** — file organiser + scheduled tasks + async API fetcher, loaded via a plugin architecture (decorators + dynamic imports) | — |

---

# 🔴 PHASE 4 — DSA A–Z (Weeks 10–16)

> **Daily rhythm changes here:** 1hr new theory + 1.5hr problems + 30min review of yesterday's fails.
> **Platform:** LeetCode (primary) + NeetCode 150 as the problem spine.

## Week 10 — Complexity + Arrays + Strings
- Big-O A–Z: time, space, amortized, best/avg/worst, analysing your own code
- Arrays: traversal, in-place ops, prefix sums, **two pointers**, **sliding window**
- Strings: reversal, anagrams, palindromes, string builder pattern
- **Problems:** 20 (Two Sum, Best Time to Buy Stock, Longest Substring Without Repeating…)
- 🛠 **Project:** **Stock Analyzer CLI** — max profit windows over real CSV price data using sliding window

## Week 11 — Linked Lists, Stacks, Queues
- Singly/doubly linked lists built from scratch, fast/slow pointers, cycle detection, reversal
- Stacks: implementation, valid parentheses, monotonic stack
- Queues, deques, circular queues
- **Problems:** 18 (Reverse Linked List, Merge Two Lists, Min Stack, Daily Temperatures…)
- 🛠 **Project:** **Browser History Manager** — back/forward with doubly linked list + **Undo/Redo Text Editor** with stacks

## Week 12 — Recursion + Sorting
- Recursion A–Z: base cases, call stack visualisation, tree recursion, backtracking intro
- Sorting from scratch: bubble, selection, insertion, **merge, quick**, counting; stability; when Python's Timsort wins
- **Problems:** 15 + implement every sort blind
- 🛠 **Project:** **Sorting Race Visualiser** — terminal animation comparing algorithms on the same data

## Week 13 — Searching + Hashing + Heaps
- Binary search A–Z: classic, on answers, rotated arrays, first/last occurrence
- Hash tables: how dicts work internally, collision handling, design problems
- Heaps: `heapq`, top-K pattern, two-heap median pattern
- **Problems:** 18 (Search Rotated Array, Koko Eating Bananas, Top K Frequent, Find Median from Stream…)
- 🛠 **Project:** **Autocomplete Engine** — hash-based prefix suggestions ranked by frequency heap

## Week 14 — Trees
- Binary trees: all 4 traversals (recursive + iterative), BFS/DFS
- BSTs: insert/delete/search/validate
- Advanced: LCA, diameter, serialize/deserialize, **Tries**
- **Problems:** 20 (Invert Tree, Level Order, Validate BST, Word Search II…)
- 🛠 **Project:** **File System Tree Explorer** — models directories as a tree, sizes via DFS, search via trie

## Week 15 — Graphs
- Representations: adjacency list/matrix; BFS, DFS on graphs
- Topological sort, cycle detection, Union-Find (DSU)
- Shortest paths: Dijkstra, BFS-shortest, intro Bellman-Ford
- **Problems:** 18 (Number of Islands, Course Schedule, Clone Graph, Network Delay Time…)
- 🛠 **Project:** **Melbourne Tram Route Planner** — real stops as nodes, Dijkstra for fastest route

## Week 16 — DP + Greedy + Backtracking
- DP A–Z: memoization → tabulation → space optimisation; 1D DP, 2D DP, knapsack family, LCS family
- Greedy: interval scheduling, proofs of correctness intuition
- Backtracking: subsets, permutations, N-Queens, Sudoku
- **Problems:** 22 (Climbing Stairs → House Robber → Coin Change → Longest Common Subsequence → Edit Distance)
- 🏆 **MEGA PROJECT: DSA Visualiser CLI** — pick any structure/algorithm, watch it execute step-by-step in the terminal (your whole phase in one artefact)

**✅ Phase 4 exit test:** Solve 3 unseen LeetCode mediums in 90 minutes.

---

# 🟡 PHASE 5 — COMPETITIVE PROGRAMMING A–Z (Weeks 17–21)

> CP is a *sport*. It's DSA under time pressure with adversarial inputs. This phase converts knowledge into speed.

## Week 17 — CP Bootcamp
- Codeforces + AtCoder account setup, how ratings/divisions work
- **Fast I/O in Python** (`sys.stdin.readline`), input parsing patterns, when Python is too slow (and PyPy)
- Build your **template file**: fast IO, common imports, debug helpers
- Solve 15 Codeforces Div 2 A problems
- 🛠 **Project:** **Personal CP Template + Testing Harness** — script that runs your solution against sample inputs automatically

## Week 18 — Math for CP
- Modular arithmetic, fast exponentiation, GCD/LCM, primes (sieve), factorisation
- Combinatorics: nCr with mod, inclusion-exclusion basics
- Number theory problem set (15 problems)
- 🛠 **Project:** **Number Theory Toolkit** — importable module with sieve, modpow, nCr — used in every future contest

## Week 19 — CP Patterns I
- Prefix sums 2.0, difference arrays, coordinate compression
- Binary search on answer (CP's favourite trick), two pointers under pressure
- Greedy with exchange arguments, sorting-based tricks
- 15 problems (Div 2 A/B level)

## Week 20 — CP Patterns II
- Bit manipulation A–Z: masks, subsets via bits, XOR tricks
- Constructive algorithms, interactive problems, game theory basics (Nim)
- String algorithms: string hashing, Z-function intro
- 15 problems (Div 2 B/C level)

## Week 21 — Contest Mode
- **3 live/virtual contests this week** (Codeforces Div 3/4, AtCoder Beginner)
- Upsolving discipline: every unsolved contest problem gets solved within 48h
- Editorial reading technique, time management strategy (skip order, penalty math)
- 🏆 **MEGA GOAL:** Established contest routine + `patterns.md` cheatsheet of every trick you've learned. Ongoing target after this phase: 1 contest/week alongside later phases → climb to Specialist (1400+)

---

# 🟢 PHASE 6 — FASTAPI + DATABASES A–Z (Weeks 22–28)

## Week 22 — Web Fundamentals (don't skip!)
- How the internet works: HTTP A–Z (methods, status codes, headers, cookies), request/response cycle
- REST principles, JSON APIs, what a server actually is
- URLs, query params vs path params vs body
- 🛠 **Project:** **Raw HTTP Server** — build a tiny server with Python's `http.server` to demystify frameworks

## Week 23 — FastAPI Core
- Install, first app, `uvicorn`, auto docs (Swagger/ReDoc)
- Path & query parameters, request bodies, **Pydantic models A–Z** (validation, nested models, field constraints)
- Response models, status codes, error handling (`HTTPException`)
- 🛠 **Project:** **Movie Catalogue API** — full CRUD in memory, validated with Pydantic

## Week 24 — SQL & Databases A–Z
- Relational concepts: tables, keys, relationships, normalisation (1NF→3NF)
- SQL A–Z: SELECT/WHERE/JOIN/GROUP BY/HAVING, subqueries, indexes, transactions
- PostgreSQL setup + `psql`
- 🛠 **Project:** **University Database** — design & query a La Trobe-style enrolment schema in raw SQL

## Week 25 — SQLAlchemy + Alembic
- SQLAlchemy 2.0 ORM: models, sessions, relationships (1-many, many-many), querying
- Alembic migrations A–Z
- Connecting FastAPI ↔ PostgreSQL, dependency injection (`Depends`)
- 🛠 **Project:** **Blog API** — users, posts, comments with real relationships and migrations

## Week 26 — Auth & Security A–Z
- Password hashing (bcrypt), JWT tokens (access + refresh), OAuth2 password flow
- Role-based access control, protected routes
- Security essentials: SQL injection, CORS, rate limiting, env secrets
- 🛠 **Project:** **Secure Notes API** — signup/login/JWT, users only see their own notes

## Week 27 — Advanced FastAPI
- Async endpoints properly (when async helps, when it hurts)
- Background tasks, WebSockets, file uploads/downloads
- Middleware, custom exception handlers, pagination, filtering, sorting patterns
- 🛠 **Project:** **Live Chat + File Share API** — WebSocket rooms with upload support

## Week 28 — Architecture + Mega Project
- Project structure: routers, services, repositories, schemas vs models
- Settings management (`pydantic-settings`), 12-factor principles
- 🏆 **MEGA PROJECT: Production Task Manager REST API**
  - Users, teams, projects, tasks, comments
  - JWT auth + roles, pagination, filtering, search
  - PostgreSQL + Alembic, layered architecture
  - This is your **flagship portfolio piece**

```
task-manager-api/
├── app/
│   ├── main.py
│   ├── core/          # config, security
│   ├── api/routes/    # endpoint routers
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # business logic
│   ├── repositories/  # DB access layer
│   └── db/            # session, migrations
├── tests/
├── alembic/
├── .env.example
├── requirements.txt
└── README.md
```

---

# 🔵 PHASE 7 — PRODUCTION READINESS (Weeks 29–31)

## Week 29 — Testing A–Z
- `pytest` fundamentals, fixtures, parametrize, mocking
- Testing FastAPI: `TestClient`, test DB, auth in tests, coverage
- 🛠 **Project:** 80%+ test coverage on the Task Manager API

## Week 30 — Docker + Deployment
- Docker A–Z: images, containers, Dockerfile, docker-compose (API + Postgres)
- Deploy to a real host (Railway/Render/Fly.io), env management, HTTPS
- 🛠 **Project:** **Task Manager live on the internet** with a public URL

## Week 31 — CI/CD + Polish
- Git properly: branching, PRs, meaningful commits, GitHub Actions (test on push, deploy on merge)
- Monitoring basics, structured logging in production, API versioning
- README/documentation craft — recruiters read READMEs, not code first
- 🛠 **Project:** Full pipeline: push → tests run → auto-deploy

---

# 🟣 PHASE 8 — CAPSTONE (Week 32+)

🏆 **CAPSTONE: pick one, build it end-to-end**
1. **StudyMate** — spaced-repetition study API + task scheduling for uni students (very La Trobe-relatable in interviews)
2. **SplitSmart** — expense splitting for share houses with settlement algorithms (graph theory in production!)
3. **JobTrackr** — internship application tracker with reminder engine and stats

Requirements: FastAPI + PostgreSQL + JWT + Docker + tests + CI/CD + deployed + brilliant README.

Then: resume, LinkedIn, GitHub profile polish, and start applying for internships **while** you continue into your Data Science phases (NumPy/Pandas onwards) — this roadmap hands over exactly where your DS plan begins.

---

## ⚙️ THE DAILY SYSTEM (3 hours)

| Block | Time | What |
|-------|------|------|
| 1 | 45 min | New theory — read/watch, take notes in `notes.md` in your own words |
| 2 | 90 min | Code — exercises ladder or project work |
| 3 | 30 min | Review — re-attempt yesterday's hardest problem *blind* |
| 4 | 15 min | Commit + push + one-line journal entry in README |

**Non-negotiable rules:**
1. **Code review loop stays** — paste your code to me before advancing. Every day.
2. **No copy-paste learning** — type everything, even examples.
3. **Blind rebuild rule** — every mega project's core must be rebuildable from memory.
4. **Stuck > 30 min?** Ask for a hint (not the answer).
5. **Miss a day?** Don't double up. Just continue. Consistency beats intensity.

---

## 📊 WEEKLY CHECKPOINT (every Sunday)

- [ ] All exercises attempted (Easy 100%, Medium 80%+, Hard 50%+)
- [ ] Mini-projects complete and pushed to GitHub
- [ ] `notes.md` written in my own words
- [ ] One concept explained out loud (Feynman test)
- [ ] Weekly reflection: what was hardest? what clicked?

---

*Roadmap v2.0 — built for Prach's 3hr/day system. Phases 4–5 assume Phase 1–3 fluency; contests continue weekly forever after Week 21.*
