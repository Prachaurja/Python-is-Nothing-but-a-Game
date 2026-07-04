/* =========================================================================
   CURRICULUM DATA (v2) — no emoji, data-driven, editable via the Dev Tool.
   window.CURRICULUM_BASE = { TRACKS, PHASES } — read-only seed data.
   The Content layer (content.js) clones this into an editable working copy.

   Lesson `content` blocks (rendered by app.js renderBlocks):
     {t:'h2'|'h3', x}
     {t:'p', x}                          supports **bold**, *em*, `code`
     {t:'ul'|'ol', items:[...]}
     {t:'callout', kind:'tip'|'warn'|'info', x}
     {t:'play', code, title}             runnable Python (Pyodide)
     {t:'quiz', q, options:[], answer, explain}
     {t:'obj', items:[...]}              learning-objectives banner
     {t:'apisim', method, path, req, status, res}
   ========================================================================= */
(function () {

const P   = x => ({ t:'p', x });
const H2  = x => ({ t:'h2', x });
const H3  = x => ({ t:'h3', x });
const UL  = (...items) => ({ t:'ul', items });
const OL  = (...items) => ({ t:'ol', items });
const TIP  = x => ({ t:'callout', kind:'tip', x });
const WARN = x => ({ t:'callout', kind:'warn', x });
const INFO = x => ({ t:'callout', kind:'info', x });
const PLAY = (code, title='main.py') => ({ t:'play', code, title });
const QUIZ = (q, options, answer, explain) => ({ t:'quiz', q, options, answer, explain });
const OBJ  = (...items) => ({ t:'obj', items });

/* ============================================================
   TRACKS
   ============================================================ */
const TRACKS = [
  { id:'python',   name:'Python',                         badge:'PY',  blurb:'From your first variable to decorators, generators, async and concurrency.' },
  { id:'dsa',      name:'Data Structures & Algorithms',   badge:'DSA', blurb:'Complexity to graphs to dynamic programming — with live visualizers, structured on roadmap.sh.' },
  { id:'cp',       name:'Competitive Programming',        badge:'CP',  blurb:'A 10-phase contest-rating roadmap. Phase 0 is fully built; the rest is scaffolded for you to fill in with the Dev Tool.' },
  { id:'fastapi',  name:'FastAPI & Databases',            badge:'API', blurb:'Foundational prerequisites through production architecture — Pydantic, SQL, auth, testing, deployment.' },
  { id:'prod',     name:'Production & DevOps',             badge:'OPS', blurb:'Testing, Docker, CI/CD — ship it to the real internet.' },
  { id:'capstone', name:'Capstone',                        badge:'CAP', blurb:'One flagship full-stack project. Portfolio-grade finish.' },
];

/* ============================================================
   PHASE 1-3 — PYTHON
   ============================================================ */
const PHASE_1 = {
  id:'p1', num:1, track:'python', title:'Python Core Foundations', weeks:'Weeks 1-4',
  mega:'CLI Grade Manager',
  desc:'The bedrock. Variables, control flow, functions, collections, files and errors — each concept paired with a small real-world build.',
  weeksList:[
    { id:'w1', num:1, title:'Absolute Basics', lessons:[
      { day:1, title:'Variables, Data Types, print() and input()', project:'Personal Intro Card', tags:['basics'],
        content:[
          OBJ('Store data in variables','Know the core built-in types','Read input and format output'),
          H2('Your first program'),
          P("In Python a **variable** is just a name pointing at a value. No type declarations, no semicolons — you assign with `=` and Python figures out the type."),
          PLAY(`name = "Prach"        # str
age = 21             # int
height = 1.78        # float
is_learning = True   # bool

print("Name:", name)
print("Age:", age)
print(f"Height: {height} m")
print("Learning Python?", is_learning)`),
          P("`f-strings` (the `f\"...\"` prefix) are the modern way to build strings — drop any expression inside `{ }`."),
          H2('Reading input safely in a sandboxed demo'),
          P("`input()` always returns a **string**; convert with `int()`/`float()` when you need numbers. This playground has no real keyboard stream, so examples that need input simulate it by redirecting `sys.stdin` — the exact pattern real competitive-programming judges use for testing, too."),
          PLAY(`import sys, io
sys.stdin = io.StringIO("Prach\\n2026\\n")

name = input("What's your name? ")
year = int(input("Birth year? "))
print(f"Hi {name}! You'll turn {2026 - year + 1} next year.")`),
          H2('Mini-project: Personal Intro Card'),
          P("Build a program that prints a formatted profile card. Try adding a favourite language and a one-line bio."),
          QUIZ('What does `type(3 / 2)` return in Python 3?',
            ['int','float','str','error'], 1,
            "`/` is true division and always returns a float — `3 / 2` is `1.5`. Use `//` for integer (floor) division."),
        ]},
      { day:2, title:'Strings Deep-Dive: indexing, slicing, methods, f-strings', project:'Username Generator', tags:['strings'],
        content:[
          OBJ('Index and slice strings','Use essential string methods','Build strings with f-strings'),
          H2('Strings are sequences'),
          P("Every character has an index starting at `0`. Negative indexes count from the end. **Slicing** `s[start:stop:step]` grabs a range (stop is exclusive)."),
          PLAY(`s = "Python"
print(s[0], s[-1])      # P n
print(s[0:3])           # Pyt
print(s[::-1])          # nohtyP  (reverse)
print(len(s))            # 6`),
          H2('Handy methods'),
          PLAY(`name = "  Ada Lovelace  "
print(name.strip())
print(name.strip().lower())
print(name.strip().title())
print("a,b,c".split(","))
print("-".join(["2026","07","02"]))`),
          H2('Mini-project: Username Generator'),
          P("Turn a full name and birth year into a username, e.g. *Ada Lovelace, 1815 -> ada_l1815*."),
          PLAY(`def make_username(full_name, year):
    first, last = full_name.lower().split()
    return f"{first}_{last[0]}{year}"

print(make_username("Ada Lovelace", 1815))
print(make_username("Grace Hopper", 1906))`),
          QUIZ('What is `"banana".count("a")`?', ['2','3','4','1'], 1, "There are three `a` characters in banana."),
        ]},
      { day:3, title:'Numbers: int, float, operators, the math module', project:'Tip and Bill Splitter', tags:['numbers'],
        content:[
          OBJ('Use arithmetic and the math module','Understand float rounding traps','Round money correctly'),
          H2('Operators'),
          PLAY(`print(7 + 2, 7 - 2, 7 * 2)
print(7 / 2)     # 3.5  true division
print(7 // 2)    # 3    floor division
print(7 % 2)     # 1    remainder (modulo)
print(2 ** 10)   # 1024 power`),
          WARN("Floats are binary approximations: `0.1 + 0.2` is `0.30000000000000004`. For money, round with `round(x, 2)` or use the `decimal` module."),
          PLAY(`import math
print(math.sqrt(144))
print(math.ceil(4.1))
print(math.floor(4.9))
print(round(3.14159, 2))`),
          H2('Mini-project: Tip and Bill Splitter'),
          PLAY(`bill = 84.50
tip_pct = 15
people = 3

tip = bill * tip_pct / 100
total = bill + tip
per_person = total / people

print(f"Tip:        \${tip:.2f}")
print(f"Total:      \${total:.2f}")
print(f"Per person: \${per_person:.2f}")`),
          QUIZ('What is `17 % 5`?', ['3','2','3.4','1'], 1, "17 = 5x3 + 2, so the remainder is 2."),
        ]},
      { day:4, title:'Type Conversion, Truthiness, None, Booleans', project:'Unit Converter', tags:['types'],
        content:[
          OBJ('Convert between types safely','Understand truthiness','Use None correctly'),
          H2('Casting'),
          PLAY(`print(int("42") + 1)
print(float("3.14"))
print(str(100) + "%")
print(bool(0), bool(""), bool([]))
print(bool(1), bool("hi"), bool([0]))`),
          INFO("Falsy values: `0`, `0.0`, `\"\"`, `None`, `[]`, `{}`, `()`, `set()`. Everything else is truthy."),
          H2('Mini-project: Unit Converter'),
          PLAY(`def km_to_miles(km):  return km * 0.621371
def c_to_f(c):        return c * 9/5 + 32
def kg_to_lbs(kg):    return kg * 2.20462

print(f"10 km = {km_to_miles(10):.2f} mi")
print(f"25 C  = {c_to_f(25):.1f} F")
print(f"70 kg = {kg_to_lbs(70):.1f} lbs")`),
          QUIZ('What is `bool([])`?', ['True','False','None','error'], 1, "An empty list is falsy, so `bool([])` is `False`."),
        ]},
      { day:5, title:'Operators: comparison, logical, identity, membership', project:'Eligibility Checker', tags:['operators'],
        content:[
          OBJ('Combine conditions with and/or/not','Know `is` vs `==`','Use `in` for membership'),
          H2('`is` vs `==`'),
          P("`==` compares values. `is` compares identity (same object in memory). Use `is` only with `None`, `True`, `False`."),
          PLAY(`a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  (same values)
print(a is b)   # False (different objects)
x = None
print(x is None)`),
          H2('Mini-project: Eligibility Checker'),
          PLAY(`age = 22
income = 55000
credit_ok = True

loan_ok = age >= 18 and income > 40000 and credit_ok
print("Loan approved" if loan_ok else "Declined")

country = "AU"
print("Visa-free" if country in ("AU", "NZ", "UK") else "Needs visa")`),
          QUIZ('Which is the correct way to check for None?', ['x == None','x is None','x = None','None(x)'], 1, "Always use `is None` — it's faster and unambiguous."),
        ]},
      { day:6, title:'Review and Exercise Ladder (Easy / Medium / Hard)', project:'15-problem set', tags:['practice'],
        content:[
          OBJ('Consolidate week 1','Practise across difficulty'),
          H2('The exercise ladder'),
          P("Work these in the playground. Don't peek — struggle first, that's where learning happens."),
          H3('Easy'),
          UL('Print the numbers 1-10 on one line.','Swap two variables without a temp variable.','Check if a string is a palindrome.'),
          H3('Medium'),
          UL('Count the vowels in a sentence.','Given a price, print it with GST (10%) added.','Reverse the words in a sentence (`"a b c"` becomes `"c b a"`).'),
          H3('Hard'),
          UL('FizzBuzz 1-100.','Format a phone number `0412345678` as `0412 345 678`.','Given a name, print an ASCII initials monogram.'),
          PLAY(`sentence = "the quick brown fox"
print(" ".join(sentence.split()[::-1]))`),
        ]},
      { day:7, title:'Weekly Build: Receipt Generator', project:'Shop receipt with 10% GST', tags:['project'],
        content:[
          OBJ('Combine everything from week 1','Format tabular output','Compute Australian GST'),
          H2('Weekly build'),
          P("Take a list of items and prices and print a formatted receipt including 10% GST."),
          PLAY(`items = [("Coffee", 4.50), ("Muffin", 3.20), ("Juice", 5.00)]

print(f"{'ITEM':<12}{'PRICE':>8}")
print("-" * 20)
subtotal = 0
for name, price in items:
    print(f"{name:<12}{price:>8.2f}")
    subtotal += price

gst = subtotal * 0.10
print("-" * 20)
print(f"{'Subtotal':<12}{subtotal:>8.2f}")
print(f"{'GST (10%)':<12}{gst:>8.2f}")
print(f"{'TOTAL':<12}{subtotal+gst:>8.2f}")`),
          TIP("`:<12` left-aligns in a 12-wide field and `:>8.2f` right-aligns a 2-decimal float. Master formatting early — it makes every CLI look professional."),
        ]},
    ]},
    { id:'w2', num:2, title:'Control Flow', lessons:[
      { day:8, title:'if / elif / else, nesting, guard clauses', project:'Grade Classifier', tags:['control'],
        content:[
          OBJ('Branch with if/elif/else','Flatten nesting with guard clauses'),
          PLAY(`def grade(score):
    if score >= 80:   return "HD"
    elif score >= 70: return "D"
    elif score >= 60: return "C"
    elif score >= 50: return "P"
    else:             return "N"

for s in [95, 74, 62, 51, 33]:
    print(s, "->", grade(s))`),
          TIP("Guard clauses — return early on edge cases — beat deep nesting. Flat is better than nested."),
          QUIZ('For score 70, what does the classifier return?', ['HD','D','C','P'], 1, "70 fails `>= 80` but passes `>= 70`, so it returns D."),
        ]},
      { day:9, title:'while loops, break, continue', project:'Number Guessing Game', tags:['control'],
        content:[
          OBJ('Loop with while','Control flow with break/continue'),
          PLAY(`import random
secret = random.randint(1, 20)
guesses = [10, 15, 12, 13]
tries = 0
for g in guesses:
    tries += 1
    if g == secret:
        print(f"Got it in {tries} tries")
        break
    print("Too high" if g > secret else "Too low")
else:
    print(f"Out of guesses. It was {secret}.")`),
          INFO("A for/while loop can have an `else` that runs only if the loop finished without `break`. Useful for search patterns."),
        ]},
      { day:10, title:'for loops, range(), accumulator patterns', project:'Times-Table Trainer', tags:['control'],
        content:[ OBJ('Iterate with for/range','Recognise accumulator/counter/flag patterns'),
          PLAY(`total = 0
for n in range(1, 11):
    total += n
print("Sum 1..10 =", total)

n = 7
for i in range(1, 11):
    print(f"{n} x {i:>2} = {n*i}")`),
          QUIZ('How many numbers does `range(2, 10, 2)` produce?', ['5','4','8','2'], 1, "It yields 2,4,6,8 — four numbers (stop is exclusive)."),
        ]},
      { day:11, title:'Nested loops, loop else, pitfalls', project:'Pattern Printer', tags:['control'],
        content:[ OBJ('Compose nested loops','Print shapes (a DSA index-math warm-up)'),
          PLAY(`rows = 5
for i in range(1, rows+1):
    print(" " * (rows-i) + "*" * (2*i-1))`),
        ]},
      { day:12, title:'match / case (structural pattern matching)', project:'Text Adventure Menu', tags:['control'],
        content:[ OBJ('Use match/case (Python 3.10+)','Destructure with patterns'),
          PLAY(`def move(cmd):
    match cmd.split():
        case ["go", direction]:
            return f"You walk {direction}."
        case ["take", *items]:
            return f"You grab: {', '.join(items)}"
        case ["quit"]:
            return "Bye."
        case _:
            return "I don't understand."

print(move("go north"))
print(move("take sword shield"))
print(move("dance"))`),
        ]},
      { day:13, title:'Exercise Ladder (15 problems)', project:'Practice set', tags:['practice'],
        content:[ OBJ('Drill control-flow fluency'),
          UL('Print all primes under 50.','Sum of digits of a number.','Draw a diamond of height 7.','Collatz sequence from any n.'),
          PLAY(`for n in range(2, 50):
    if all(n % d for d in range(2, int(n**0.5)+1)):
        print(n, end=" ")`),
        ]},
      { day:14, title:'Weekly Build: ATM Simulator', project:'PIN, balance, deposit/withdraw', tags:['project'],
        content:[ OBJ('State plus loops plus validation together'),
          PLAY(`balance = 500
pin = "1234"
attempts = ["0000", "1234"]

for i, entry in enumerate(attempts, 1):
    if entry == pin:
        print("Access granted.")
        balance -= 100
        print(f"Withdrew \$100. Balance: \${balance}")
        break
    print(f"Wrong PIN ({3-i} left)")
else:
    print("Card locked.")`),
        ]},
    ]},
    { id:'w3', num:3, title:'Functions and Collections', lessons:[
      { day:15, title:'Functions: def, return, scope, docstrings', project:'Password Strength Checker', tags:['functions'],
        content:[ OBJ('Define reusable functions','Understand scope','Write docstrings'),
          PLAY(`def strength(pw):
    """Rate a password 0-4 by simple rules."""
    score = 0
    score += len(pw) >= 8
    score += any(c.isdigit() for c in pw)
    score += any(c.isupper() for c in pw)
    score += any(c in "!@#$%" for c in pw)
    return ["Very weak","Weak","Okay","Good","Strong"][score]

for pw in ["abc", "abcdefgh", "Abcdef12", "Abcdef12!"]:
    print(f"{pw:<12} -> {strength(pw)}")`),
          TIP("`any()` and `all()` with a generator expression are the Pythonic way to ask 'does any/every element satisfy X?'"),
        ]},
      { day:16, title:'Default, keyword, *args, **kwargs', project:'Flexible Invoice Builder', tags:['functions'],
        content:[ OBJ('Use flexible argument forms'),
          PLAY(`def invoice(customer, *items, tax=0.10, **meta):
    total = sum(items)
    print(f"Invoice for {customer}")
    for i, amt in enumerate(items, 1):
        print(f"  Item {i}: \${amt}")
    print(f"  Tax: {tax:.0%}")
    print(f"  TOTAL: \${total*(1+tax):.2f}")
    for k, v in meta.items():
        print(f"  {k}: {v}")

invoice("Acme", 20, 35, 15, po="PO-99")`),
          WARN("Never use a mutable default like `def f(x=[])`. The list is created once and shared across calls. Use `x=None` then `x = x or []` inside."),
        ]},
      { day:17, title:'Lists A-Z: methods, slicing, comprehensions', project:'To-Do List', tags:['collections'],
        content:[ OBJ('Master list methods','Copy safely','Write comprehensions'),
          PLAY(`nums = [4, 1, 7, 3]
nums.append(9); nums.sort()
print(nums)
print([n*n for n in nums])
print([n for n in nums if n % 2])

a = [[0]*3]*3       # rows share the same list object
a[0][0] = 9
print(a)             # every row changed
b = [[0]*3 for _ in range(3)]  # correct way`),
          QUIZ('What does `[x*2 for x in range(3)]` produce?', ['[0,1,2]','[0,2,4]','[2,4,6]','[1,2,3]'], 1, "x is 0,1,2, doubled gives [0,2,4]."),
        ]},
      { day:18, title:'Tuples, sets, set operations', project:'Duplicate Email Cleaner', tags:['collections'],
        content:[ OBJ('Use immutable tuples','Deduplicate with sets'),
          PLAY(`emails = ["a@x.com","b@x.com","a@x.com","c@x.com","b@x.com"]
unique = list(set(emails))
print(f"{len(emails)} -> {len(unique)} unique")

a = {1,2,3,4}; b = {3,4,5,6}
print(a & b)
print(a | b)
print(a - b)`),
        ]},
      { day:19, title:'Dictionaries A-Z: methods, nesting, comprehensions', project:'Contact Book', tags:['collections'],
        content:[ OBJ('CRUD with dicts','Use .get() safely','Nest and comprehend'),
          PLAY(`book = {
    "ada":  {"phone": "0400", "city": "Melbourne"},
    "alan": {"phone": "0411", "city": "London"},
}
book["grace"] = {"phone": "0422", "city": "NYC"}
print(book["ada"]["city"])
print(book.get("bob", "not found"))

sq = {n: n*n for n in range(1,6)}
print(sq)`),
        ]},
      { day:20, title:'lambda, map, filter, sorted(key=), zip, enumerate', project:'Leaderboard Sorter', tags:['collections'],
        content:[ OBJ('Use functional tools','Multi-key sort'),
          PLAY(`players = [("Ada",95),("Alan",95),("Grace",88)]
ranked = sorted(players, key=lambda p: (-p[1], p[0]))
for rank, (name, score) in enumerate(ranked, 1):
    print(f"{rank}. {name:<6} {score}")

print(list(map(lambda x: x*2, [1,2,3])))
print(list(filter(lambda x: x>2, [1,2,3,4])))`),
        ]},
      { day:21, title:'Weekly Build: Quiz Engine', project:'Dict-driven scoring', tags:['project'],
        content:[ OBJ('Model data with dicts','Score and review'),
          PLAY(`questions = [
    {"q":"Capital of Australia?","a":"Canberra"},
    {"q":"2 ** 5 = ?","a":"32"},
]
answers = ["Sydney", "32"]
score, wrong = 0, []
for i, item in enumerate(questions):
    if answers[i].lower() == item["a"].lower():
        score += 1
    else:
        wrong.append(item["q"])
print(f"Score: {score}/{len(questions)}")
print("Review:", wrong)`),
        ]},
    ]},
    { id:'w4', num:4, title:'Files, Errors, Modules', lessons:[
      { day:22, title:'File I/O: read/write/append, with, pathlib', project:'Daily Journal App', tags:['files'],
        content:[ OBJ('Read/write files safely','Use context managers'),
          PLAY(`from datetime import datetime
entry = f"[{datetime.now():%H:%M}] Learned file I/O.\\n"
with open("journal.txt", "a") as f:
    f.write(entry)
    f.write("[--:--] Second line.\\n")

with open("journal.txt") as f:
    print(f.read())`),
          TIP("Always use `with open(...) as f:` — it auto-closes the file even if an error occurs."),
        ]},
      { day:23, title:'CSV and JSON handling', project:'Expense Tracker', tags:['files'],
        content:[ OBJ('Serialize with json','Parse csv'),
          PLAY(`import json
expenses = [{"item":"Coffee","amt":4.5}, {"item":"Books","amt":60}]
with open("exp.json","w") as f:
    json.dump(expenses, f, indent=2)
with open("exp.json") as f:
    data = json.load(f)
print("Total:", sum(e["amt"] for e in data))`),
        ]},
      { day:24, title:'Exceptions: try/except/else/finally, raising', project:'Bulletproof Calculator', tags:['errors'],
        content:[ OBJ('Handle errors gracefully','Raise your own'),
          PLAY(`def safe_div(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except TypeError:
        return "Numbers only, please"
    else:
        return result
    finally:
        pass

print(safe_div(10, 2))
print(safe_div(10, 0))
print(safe_div(10, "x"))`),
          QUIZ('When does the `else` block of a try run?', ['Always','Only if an exception occurred','Only if NO exception occurred','Never'], 2, "`else` runs only when the try body completed without raising."),
        ]},
      { day:25, title:'Modules and packages, __name__, stdlib tour', project:'Password Vault CLI', tags:['modules'],
        content:[ OBJ('Structure multi-file programs','Tour the standard library'),
          PLAY(`import random, string
from datetime import datetime

def gen_password(n=12):
    chars = string.ascii_letters + string.digits + "!@#$"
    return "".join(random.choice(chars) for _ in range(n))

if __name__ == "__main__":
    print("Generated at", datetime.now().strftime("%Y-%m-%d"))
    for _ in range(3):
        print(gen_password())`),
          INFO("`if __name__ == \"__main__\":` means 'only run this when the file is executed directly, not when imported'. Put your entry point here."),
        ]},
      { day:26, title:'Virtual environments, pip, requirements.txt', project:'Project env setup', tags:['tooling'],
        content:[ OBJ('Isolate dependencies','Pin requirements'),
          P("Each project gets its own isolated set of packages so versions never clash. This runs in your real terminal, not the browser."),
          UL('`python -m venv .venv` — create it','`source .venv/bin/activate` (mac/linux) or `.venv\\\\Scripts\\\\activate` (windows)','`pip install fastapi` — install a package','`pip freeze > requirements.txt` — pin exact versions','`pip install -r requirements.txt` — reproduce elsewhere'),
          TIP("Commit `requirements.txt`, never the `.venv/` folder. Add `.venv/` to `.gitignore`."),
        ]},
      { day:27, title:'Mega Project: CLI Grade Manager (Part 1)', project:'Students, subjects, weighted grades', tags:['mega'],
        content:[ OBJ('Design a real CLI app','Weighted grade calc','JSON persistence'),
          P("Manage students and their weighted subject grades, persist to JSON, search and show stats — all crash-proof."),
          PLAY(`students = {}

def add_grade(name, subject, mark, weight):
    students.setdefault(name, {})[subject] = (mark, weight)

def weighted_avg(name):
    grades = students[name].values()
    total_w = sum(w for _, w in grades)
    return sum(m*w for m, w in grades) / total_w

add_grade("Prach", "Python", 92, 0.5)
add_grade("Prach", "Maths",  85, 0.5)
print(f"Prach average: {weighted_avg('Prach'):.1f}")`),
        ]},
      { day:28, title:'Mega Project: CLI Grade Manager (Part 2)', project:'Search, stats, error-proof menus', tags:['mega'],
        content:[ OBJ('Build a menu loop','Add stats and search'),
          PLAY(`import statistics
grades = {"Prach":88, "Ada":95, "Alan":72, "Grace":90}

def stats(g):
    vals = list(g.values())
    return {
        "count": len(vals),
        "mean": round(statistics.mean(vals),1),
        "median": statistics.median(vals),
        "top": max(g, key=g.get),
    }
print(stats(grades))`),
          TIP("Phase exit test: rebuild a small CLI app from a spec without looking anything up. If you can, you've internalised the fundamentals."),
        ]},
    ]},
  ],
};

const PHASE_2 = {
  id:'p2', num:2, track:'python', title:'OOP and Intermediate Python', weeks:'Weeks 5-7', mega:'OOP Bank System',
  desc:'Think in objects. Classes, inheritance, dunder methods, dataclasses, SOLID — then Pythonic patterns: iterators, generators, decorators, context managers, type hints.',
  weeksList:[
    { id:'w5', num:5, title:'OOP Foundations', lessons:[
      { day:29, title:'Classes, objects, __init__, self', project:'Student Class', tags:['oop'],
        content:[ OBJ('Define classes','Understand self and instances'),
          PLAY(`class Student:
    def __init__(self, name, gpa=0.0):
        self.name = name
        self.gpa = gpa
    def honor_roll(self):
        return self.gpa >= 3.5

s = Student("Prach", 3.8)
print(s.name, "honor roll?", s.honor_roll())`),
          INFO("`__init__` is the constructor. `self` is the instance — the first parameter of every method, passed automatically."),
        ]},
      { day:30, title:'Instance vs class attributes, classmethod, staticmethod', project:'Library Book System', tags:['oop'],
        content:[ OBJ('Share state across instances','Use @classmethod and @staticmethod'),
          PLAY(`class Book:
    total = 0
    def __init__(self, title):
        self.title = title
        Book.total += 1
    @classmethod
    def count(cls):
        return cls.total

Book("Dune"); Book("1984")
print("Books:", Book.count())`),
        ]},
      { day:31, title:'Encapsulation: _protected, __private, @property', project:'Temperature Sensor', tags:['oop'],
        content:[ OBJ('Encapsulate state','Validate via property setters'),
          PLAY(`class Sensor:
    def __init__(self, c=0):
        self._c = c
    @property
    def celsius(self): return self._c
    @celsius.setter
    def celsius(self, v):
        if v < -273.15: raise ValueError("below absolute zero")
        self._c = v
    @property
    def fahrenheit(self): return self._c * 9/5 + 32

s = Sensor()
s.celsius = 25
print(s.fahrenheit)`),
        ]},
      { day:32, title:'Inheritance, super(), overriding', project:'Payroll hierarchy', tags:['oop'],
        content:[ OBJ('Extend classes','Call super()'),
          PLAY(`class Employee:
    def __init__(self, name, base):
        self.name, self.base = name, base
    def pay(self): return self.base

class Manager(Employee):
    def __init__(self, name, base, bonus):
        super().__init__(name, base)
        self.bonus = bonus
    def pay(self): return super().pay() + self.bonus

print(Manager("Prach", 5000, 1500).pay())`),
        ]},
      { day:33, title:'Multiple inheritance, MRO, mixins', project:'Smart Device System', tags:['oop'],
        content:[ OBJ('Compose behaviour with mixins','Read the MRO'),
          PLAY(`class WiFi:
    def connect(self): return "WiFi connected"
class Bluetooth:
    def pair(self): return "BT paired"
class Phone(WiFi, Bluetooth):
    pass

p = Phone()
print(p.connect(), "|", p.pair())
print([c.__name__ for c in Phone.__mro__])`),
        ]},
      { day:34, title:'Polymorphism, duck typing, ABCs', project:'Shape Area Calculator', tags:['oop'],
        content:[ OBJ('Use polymorphism','Enforce interfaces with abc'),
          PLAY(`from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self): ...
class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r**2
class Square(Shape):
    def __init__(self, s): self.s = s
    def area(self): return self.s**2

for shape in [Circle(2), Square(3)]:
    print(type(shape).__name__, round(shape.area(),2))`),
          QUIZ('What happens if a subclass of an ABC does not implement an @abstractmethod?', ['Nothing','It runs but returns None','You cannot instantiate it','Python deletes the class'], 2, "Instantiating a concrete class that leaves abstract methods unimplemented raises TypeError."),
        ]},
      { day:35, title:'Weekly Build: Zoo Management System', project:'Animal hierarchy, polymorphic sounds', tags:['project'],
        content:[ OBJ('Design a class hierarchy','Polymorphic behaviour'),
          PLAY(`class Animal:
    def __init__(self, name): self.name = name
    def speak(self): return "..."
class Dog(Animal):
    def speak(self): return "Woof"
class Cat(Animal):
    def speak(self): return "Meow"

zoo = [Dog("Rex"), Cat("Milo"), Animal("Mystery")]
for a in zoo:
    print(f"{a.name}: {a.speak()}")`),
        ]},
    ]},
    { id:'w6', num:6, title:'OOP Advanced', lessons:[
      { day:36, title:'Dunder methods: __str__, __repr__, __eq__, __lt__', project:'Money Class', tags:['oop'],
        content:[ OBJ('Make objects printable and comparable'),
          PLAY(`class Money:
    def __init__(self, cents): self.cents = cents
    def __repr__(self): return f"Money({self.cents})"
    def __str__(self): return f"\${self.cents/100:.2f}"
    def __eq__(self, o): return self.cents == o.cents
    def __lt__(self, o): return self.cents < o.cents

a, b = Money(500), Money(1200)
print(str(a), "<", str(b), "?", a < b)
print(sorted([b, a]))`),
        ]},
      { day:37, title:'__add__, __getitem__, operator overloading', project:'Vector Math Class', tags:['oop'],
        content:[ OBJ('Overload operators'),
          PLAY(`class Vec:
    def __init__(self, *c): self.c = list(c)
    def __add__(self, o): return Vec(*(a+b for a,b in zip(self.c,o.c)))
    def __getitem__(self, i): return self.c[i]
    def __repr__(self): return f"Vec{tuple(self.c)}"

print(Vec(1,2,3) + Vec(4,5,6))`),
        ]},
      { day:38, title:'Composition vs inheritance', project:'Car Builder', tags:['oop'],
        content:[ OBJ('Prefer "has-a" over "is-a" when it fits'),
          PLAY(`class Engine:
    def start(self): return "Vroom"
class Car:
    def __init__(self): self.engine = Engine()
    def drive(self): return self.engine.start() + " -> moving"

print(Car().drive())`),
          TIP("Rule of thumb: model 'is-a' with inheritance, 'has-a' with composition. Composition is usually more flexible."),
        ]},
      { day:39, title:'Dataclasses, __slots__, Enum', project:'Order System', tags:['oop'],
        content:[ OBJ('Cut boilerplate with @dataclass','Use Enum for states'),
          PLAY(`from dataclasses import dataclass
from enum import Enum

class Status(Enum):
    NEW = "new"; PAID = "paid"; SHIPPED = "shipped"

@dataclass
class Order:
    id: int
    total: float
    status: Status = Status.NEW

o = Order(1, 99.9)
print(o)
o.status = Status.PAID
print(o.status.value)`),
        ]},
      { day:40, title:'Custom exception hierarchies', project:'Banking Errors', tags:['oop'],
        content:[ OBJ('Design exception classes'),
          PLAY(`class BankError(Exception): pass
class InsufficientFunds(BankError): pass
class AccountLocked(BankError): pass

def withdraw(balance, amount, locked=False):
    if locked: raise AccountLocked("Account is locked")
    if amount > balance: raise InsufficientFunds(f"Need \${amount-balance} more")
    return balance - amount

try:
    withdraw(100, 250)
except BankError as e:
    print(type(e).__name__, "->", e)`),
        ]},
      { day:41, title:'SOLID principles in Python', project:'Refactor the zoo to SOLID', tags:['design'],
        content:[ OBJ('Understand all five SOLID principles'),
          UL('Single Responsibility — one reason to change per class','Open/Closed — open to extension, closed to modification','Liskov Substitution — subtypes must be swappable','Interface Segregation — small focused interfaces','Dependency Inversion — depend on abstractions'),
          TIP("You don't need to memorise SOLID as rules — feel them as smells. 'This class does four things' means SRP. 'I keep editing this switch' means OCP."),
        ]},
      { day:42, title:'Weekly Build: Inventory Management System', project:'Products, suppliers, stock alerts', tags:['project'],
        content:[ OBJ('Full OOP design'),
          PLAY(`from dataclasses import dataclass
@dataclass
class Product:
    name: str; qty: int; reorder: int = 5
    def low(self): return self.qty <= self.reorder

inv = [Product("USB-C", 3), Product("Mouse", 20)]
for p in inv:
    flag = "REORDER" if p.low() else "ok"
    print(f"{p.name:<8} qty={p.qty:<3} {flag}")`),
        ]},
    ]},
    { id:'w7', num:7, title:'Pythonic Patterns', lessons:[
      { day:43, title:'Iterators and the iterator protocol', project:'Countdown Iterator', tags:['patterns'],
        content:[ OBJ('Implement __iter__ and __next__'),
          PLAY(`class Countdown:
    def __init__(self, n): self.n = n
    def __iter__(self): return self
    def __next__(self):
        if self.n <= 0: raise StopIteration
        self.n -= 1
        return self.n + 1

print(list(Countdown(5)))`),
        ]},
      { day:44, title:'Generators, yield, lazy evaluation', project:'Log File Streamer', tags:['patterns'],
        content:[ OBJ('Write generators','Process big data lazily'),
          PLAY(`def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

g = fib()
print([next(g) for _ in range(10)])`),
          INFO("Generators produce values lazily, one at a time, using almost no memory. Perfect for streaming a huge log file line by line."),
        ]},
      { day:45, title:'Decorators A-Z: closures to decorators with arguments', project:'Timer and retry toolkit', tags:['patterns'],
        content:[ OBJ('Build decorators','Preserve metadata with functools.wraps'),
          PLAY(`import functools, time
def timer(fn):
    @functools.wraps(fn)
    def wrap(*a, **k):
        t = time.perf_counter()
        r = fn(*a, **k)
        print(f"{fn.__name__} took {time.perf_counter()-t:.4f}s")
        return r
    return wrap

@timer
def slow_sum(n): return sum(range(n))
slow_sum(100000)`),
          TIP("A decorator is a function that takes a function and returns a new one. `@timer` is sugar for `slow_sum = timer(slow_sum)`."),
        ]},
      { day:46, title:'Context managers: with, __enter__/__exit__', project:'DB Connection Simulator', tags:['patterns'],
        content:[ OBJ('Build context managers','Auto-cleanup resources'),
          PLAY(`from contextlib import contextmanager
@contextmanager
def db_conn(name):
    print(f"OPEN {name}")
    try:
        yield {"name": name}
    finally:
        print(f"CLOSE {name}")

with db_conn("prod") as conn:
    print("query on", conn["name"])`),
        ]},
      { day:47, title:'Type hints A-Z: typing, Optional, Union, generics', project:'Add types to week 6 project', tags:['types'],
        content:[ OBJ('Annotate code','Think like mypy'),
          PLAY(`from typing import Optional
def greet(name: str, times: int = 1) -> str:
    return (f"Hi {name}! " * times).strip()

def find(users: list[str], q: str) -> Optional[str]:
    for u in users:
        if q in u: return u
    return None

print(greet("Prach", 2))
print(find(["ada","alan"], "al"))`),
          TIP("Type hints don't change runtime behaviour — they're for humans and tools (mypy, IDEs, FastAPI). FastAPI uses them to auto-validate requests."),
        ]},
      { day:48, title:'Mega Project: OOP Bank System (Part 1)', project:'Accounts, transactions, interest', tags:['mega'],
        content:[ OBJ('Design the domain','Custom exceptions plus decorators'),
          PLAY(`from dataclasses import dataclass, field
@dataclass
class Account:
    owner: str
    balance: float = 0.0
    log: list = field(default_factory=list)
    def deposit(self, amt):
        self.balance += amt
        self.log.append(("deposit", amt))
    def withdraw(self, amt):
        if amt > self.balance: raise ValueError("Insufficient funds")
        self.balance -= amt
        self.log.append(("withdraw", amt))

a = Account("Prach")
a.deposit(500); a.withdraw(120)
print(a.balance, a.log)`),
        ]},
      { day:49, title:'Mega Project: OOP Bank System (Part 2)', project:'Auth decorators, JSON persistence, types', tags:['mega'],
        content:[ OBJ('Add auth, persistence, full type coverage'),
          PLAY(`import functools
def require_pin(fn):
    @functools.wraps(fn)
    def wrap(self, *a, pin=None, **k):
        if pin != self._pin: raise PermissionError("Bad PIN")
        return fn(self, *a, **k)
    return wrap

class SecureAccount:
    def __init__(self, pin): self._pin = pin; self.bal = 0
    @require_pin
    def withdraw(self, amt): self.bal -= amt; return self.bal

acc = SecureAccount("1234")
print(acc.withdraw(50, pin="1234"))
try: acc.withdraw(50, pin="0000")
except PermissionError as e: print("Blocked:", e)`),
        ]},
    ]},
  ],
};

const PHASE_3 = {
  id:'p3', num:3, track:'python', title:'Advanced Python', weeks:'Weeks 8-9', mega:'Plugin-Based Automation Engine',
  desc:'Python internals and the ecosystem: memory model, functools, regex, collections, itertools, threading, multiprocessing, and asyncio — your FastAPI launchpad.',
  weeksList:[
    { id:'w8', num:8, title:'Python Internals', lessons:[
      { day:50, title:'Memory model: references, mutability, id(), GC', project:'Memory Detective', tags:['internals'],
        content:[ OBJ('Reason about references vs copies'),
          PLAY(`a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(a is b, id(a) == id(b))

c = a.copy()
c.append(99)
print(a, c)`),
          WARN("Assignment never copies — it binds another name to the same object. This trips up every beginner. `is` and `id()` reveal the truth."),
        ]},
      { day:51, title:'Shallow vs deep copy, copy module', project:'Save-Game Cloner', tags:['internals'],
        content:[ OBJ('Distinguish shallow and deep copy'),
          PLAY(`import copy
state = {"hp": 100, "items": ["sword"]}
shallow = copy.copy(state)
deep = copy.deepcopy(state)
state["items"].append("shield")
print("shallow:", shallow["items"])
print("deep:   ", deep["items"])`),
        ]},
      { day:52, title:'*args/**kwargs mastery, unpacking, forwarding', project:'Universal Wrapper', tags:['internals'],
        content:[ OBJ('Unpack and forward arguments'),
          PLAY(`def log_call(fn):
    def wrap(*args, **kwargs):
        print(f"calling {fn.__name__}{args}{kwargs}")
        return fn(*args, **kwargs)
    return wrap

@log_call
def area(w, h, unit="cm"): return f"{w*h} {unit}2"
print(area(3, 4, unit="m"))

a, *rest = [1,2,3,4]
print(a, rest)`),
        ]},
      { day:53, title:'functools: partial, reduce, lru_cache', project:'Fibonacci Benchmark', tags:['functools'],
        content:[ OBJ('Cache and compose functions'),
          PLAY(`from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

print(fib(40))
print(fib.cache_info())`),
          TIP("`@lru_cache` memoises automatically. Fib(40) without it takes about 1.6 billion calls; with it, about 40."),
        ]},
      { day:54, title:'Regular expressions A-Z', project:'Log Parser', tags:['regex'],
        content:[ OBJ('Match patterns with re'),
          PLAY(`import re
log = "ERROR 2026-07-02 10:15 user=ada ip=10.0.0.5"
ip = re.search(r"ip=(\\d+\\.\\d+\\.\\d+\\.\\d+)", log)
date = re.search(r"\\d{4}-\\d{2}-\\d{2}", log)
print("IP:", ip.group(1))
print("Date:", date.group())
print(re.findall(r"\\w+=\\w+", log))`),
        ]},
      { day:55, title:'collections: Counter, defaultdict, deque, namedtuple', project:'Word Frequency Analyser', tags:['collections'],
        content:[ OBJ('Reach for the right container'),
          PLAY(`from collections import Counter, defaultdict, deque
text = "the cat sat on the mat the cat ran"
freq = Counter(text.split())
print(freq.most_common(2))

groups = defaultdict(list)
for w in text.split():
    groups[len(w)].append(w)
print(dict(groups))

dq = deque([1,2,3]); dq.appendleft(0); dq.append(4)
print(dq)`),
        ]},
      { day:56, title:'itertools: chain, product, permutations, groupby', project:'Password Space Explorer', tags:['itertools'],
        content:[ OBJ('Compose iterators lazily'),
          PLAY(`from itertools import product, permutations, combinations
attempts = ["".join(p) for p in product("0123", repeat=2)]
print(len(attempts), "combos:", attempts[:5], "...")
print(list(permutations("abc", 2)))
print(list(combinations([1,2,3,4], 2)))`),
        ]},
    ]},
    { id:'w9', num:9, title:'Concurrency and Ecosystem', lessons:[
      { day:57, title:'Threading, the GIL explained honestly', project:'Multi-file Downloader Sim', tags:['concurrency'],
        content:[ OBJ('Use threads for I/O','Understand the GIL'),
          PLAY(`from concurrent.futures import ThreadPoolExecutor
import time
def download(name):
    time.sleep(0.01)
    return f"{name} done"
with ThreadPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(download, ["a","b","c","d"]))
print(results)`),
          INFO("The GIL lets only one thread run Python bytecode at a time — threads help with I/O-bound work (waiting on network/disk) but not CPU-bound work. For CPU work, use multiprocessing."),
        ]},
      { day:58, title:'Multiprocessing, concurrent.futures', project:'Image Batch Processor', tags:['concurrency'],
        content:[ OBJ('Parallelise CPU-bound work'),
          PLAY(`def heavy(n): return sum(i*i for i in range(n))
chunks = [100000, 100000, 100000]
print([heavy(c) for c in chunks])`),
          WARN("Browser Python cannot spawn OS processes, so this concept demo runs sequentially. On your machine, swap in `ProcessPoolExecutor` for true parallelism."),
        ]},
      { day:59, title:'asyncio A-Z: coroutines, await, tasks, gather', project:'Async Web Checker', tags:['async'],
        content:[ OBJ('Write coroutines','Run concurrently with gather — critical FastAPI prep'),
          PLAY(`import asyncio
async def check(url, delay):
    await asyncio.sleep(delay)
    return f"{url}: OK"

async def main():
    results = await asyncio.gather(
        check("site-a", 0.03),
        check("site-b", 0.01),
        check("site-c", 0.02),
    )
    for r in results: print(r)

asyncio.run(main())`),
          TIP("`async`/`await` is the foundation of FastAPI's speed. `gather` runs coroutines concurrently — many checks take as long as the slowest one, not the sum."),
        ]},
      { day:60, title:'Working with APIs: requests, httpx, status codes', project:'Weather CLI', tags:['ecosystem'],
        content:[ OBJ('Consume real HTTP APIs'),
          P("On your machine: `pip install requests`, then:"),
          PLAY(`example = '''
import requests
r = requests.get("https://api.example.com/weather",
                 params={"city": "Melbourne"})
r.raise_for_status()
data = r.json()
print(data["temp"])
'''
print(example)`),
          INFO("Status codes you will meet constantly: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error."),
        ]},
      { day:61, title:'Logging properly, config files, env vars', project:'Add logging to Bank System', tags:['ecosystem'],
        content:[ OBJ('Replace print with logging','Read config from env'),
          PLAY(`import logging
logging.basicConfig(level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("bank")
log.info("Account opened")
log.warning("Low balance")
log.error("Withdrawal failed")`),
        ]},
      { day:62, title:'Mega Project: Plugin-Based Automation Engine (Part 1)', project:'File organiser plus plugin registry', tags:['mega'],
        content:[ OBJ('Build a plugin architecture with decorators'),
          PLAY(`PLUGINS = {}
def plugin(name):
    def reg(fn):
        PLUGINS[name] = fn
        return fn
    return reg

@plugin("greet")
def greet(x): return f"Hello {x}"
@plugin("shout")
def shout(x): return x.upper() + "!"

def run(name, arg): return PLUGINS[name](arg)
print(run("greet", "Prach"))
print(run("shout", "python"))
print("Registered:", list(PLUGINS))`),
        ]},
      { day:63, title:'Mega Project: Automation Engine (Part 2)', project:'Scheduled tasks plus async fetcher', tags:['mega'],
        content:[ OBJ('Combine plugins, async, and dynamic dispatch'),
          PLAY(`import asyncio
tasks_run = []
async def scheduled(name, every):
    for _ in range(2):
        await asyncio.sleep(0.01)
        tasks_run.append(f"{name} tick")
async def main():
    await asyncio.gather(scheduled("backup",1), scheduled("sync",2))
    print(tasks_run)
asyncio.run(main())`),
        ]},
    ]},
  ],
};

/* ============================================================
   DSA TRACK — structured against roadmap.sh/datastructures-and-algorithms
   9 modules, foundations through graphs and DP.
   ============================================================ */
const PHASE_DSA = {
  id:'p4', num:4, track:'dsa', title:'Data Structures and Algorithms', weeks:'9 modules',
  mega:'DSA Visualiser CLI',
  desc:'Structured against the roadmap.sh Data Structures & Algorithms path: complexity, linear structures, searching and sorting, recursion, trees, heaps and hashing, graphs, and dynamic programming — with a live visualizer for every family.',
  weeksList:[
    { id:'m1', num:1, title:'Foundations: Complexity and Big-O', lessons:[
      { day:'M1.1', title:'Asymptotic notation and Big-O', project:'Analyse your own code', tags:['complexity'],
        content:[ OBJ('Reason about time and space complexity','Read Big-O, Big-Omega, Big-Theta'),
          H2('Why complexity analysis matters'),
          P("Before you can compare two solutions, you need a language for describing how their cost grows as input size `n` grows. That language is asymptotic notation."),
          UL('O(1) constant — a dict lookup','O(log n) — binary search','O(n) linear — one pass','O(n log n) — good sorts','O(n squared) — nested loops','O(2 to the n) — naive recursive subsets','O(n factorial) — brute-force permutations'),
          PLAY(`def has_dup_slow(a):            # O(n^2)
    for i in range(len(a)):
        for j in range(i+1, len(a)):
            if a[i]==a[j]: return True
    return False

def has_dup_fast(a):            # O(n)
    return len(set(a)) != len(a)

print(has_dup_fast([1,2,3,2]))`),
          INFO("Big-O describes the **upper bound** (worst case). Big-Omega describes the lower bound. Big-Theta describes a tight bound where both match. In practice, interviewers and judges mean Big-O when they say complexity."),
          QUIZ('What is the time complexity of binary search?', ['O(n)','O(log n)','O(n log n)','O(1)'], 1, "Each step halves the search space, giving a logarithmic bound."),
        ]},
      { day:'M1.2', title:'Time vs space complexity, amortized analysis', project:'Reading constraints', tags:['complexity'],
        content:[ OBJ('Trade time for space and back','Deduce intended complexity from constraints'),
          P("Competitive judges give you `n` — you can reverse-engineer the intended algorithm from it. This intuition also matters for interviews."),
          UL('n <= 10 — brute force / bitmask over subsets is fine (O(2^n))','n <= 500 — O(n cubed) is fine','n <= 10^5 — need O(n log n)','n <= 10^7 to 10^8 — need O(n) or close to it'),
          PLAY(`# Appending to a Python list is O(1) *amortized* — occasionally
# the underlying array resizes (O(n)), but spread across many
# appends the average cost per append is still O(1).
import time
lst = []
t0 = time.perf_counter()
for i in range(200000):
    lst.append(i)
print("appended 200k items in", round(time.perf_counter()-t0, 4), "s")`),
        ]},
      { day:'M1.3', title:'Arrays and strings: the base structures', project:'Stock Analyzer CLI', tags:['arrays'],
        content:[ OBJ('Traverse and mutate arrays in place','See why string concatenation in a loop is O(n squared)'),
          PLAY(`def max_profit(prices):
    lo, best = prices[0], 0
    for p in prices:
        lo = min(lo, p)
        best = max(best, p - lo)
    return best
print(max_profit([7,1,5,3,6,4]))  # 5`),
          WARN("`s += char` inside a loop is O(n) per append because strings are immutable — the whole string is copied each time, making the loop O(n squared) overall. Build a list and `''.join(...)` once instead."),
        ]},
    ]},
    { id:'m2', num:2, title:'Searching and Sorting', lessons:[
      { day:'M2.1', title:'Linear and binary search', project:'Autocomplete-style lookup', tags:['search'],
        content:[ OBJ('Implement binary search correctly (the boundary math is the hard part)'),
          PLAY(`def bsearch(a, target):
    lo, hi = 0, len(a)-1
    while lo <= hi:
        mid = (lo+hi)//2
        if a[mid] == target: return mid
        if a[mid] < target: lo = mid+1
        else: hi = mid-1
    return -1
print(bsearch([1,3,5,7,9,11], 7))`),
          INFO("Watch binary search highlight lo, mid, hi live in the Visualizer tab, under Searching."),
        ]},
      { day:'M2.2', title:'Sorting from scratch: bubble, selection, insertion', project:'Implement every sort blind', tags:['sorting'],
        content:[ OBJ('Understand quadratic sorts mechanically'),
          PLAY(`def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]; j = i-1
        while j >= 0 and a[j] > key:
            a[j+1] = a[j]; j -= 1
        a[j+1] = key
    return a
print(insertion_sort([5,2,9,1,7]))`),
        ]},
      { day:'M2.3', title:'Merge sort and quick sort', project:'Sorting Race Visualiser', tags:['sorting'],
        content:[ OBJ('Implement O(n log n) sorts','Know when Timsort (Python\'s built-in sort) wins'),
          PLAY(`def merge_sort(a):
    if len(a) <= 1: return a
    mid = len(a)//2
    l, r = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i<len(l) and j<len(r):
        if l[i]<=r[j]: out.append(l[i]); i+=1
        else: out.append(r[j]); j+=1
    return out + l[i:] + r[j:]
print(merge_sort([5,2,9,1,7,3]))`),
          TIP("Watch merge sort, quicksort, bubble, and insertion race side by side in the Visualizer tab, under Sorting."),
        ]},
      { day:'M2.4', title:'Custom sorting: key=, cmp_to_key, and stability', project:'Multi-key leaderboard', tags:['sorting'],
        content:[ OBJ('Sort by custom criteria','Understand what a stable sort guarantees'),
          PLAY(`from functools import cmp_to_key
players = [("Ada",95),("Alan",95),("Grace",88)]
by_score_then_name = sorted(players, key=lambda p: (-p[1], p[0]))
print(by_score_then_name)

def cmp(a, b): return (a[1] > b[1]) - (a[1] < b[1])
print(sorted(players, key=cmp_to_key(cmp), reverse=True))`),
          INFO("A stable sort preserves the relative order of equal elements. Python's `sorted()` is always stable — this matters when sorting by one key after already having sorted by another."),
        ]},
    ]},
    { id:'m3', num:3, title:'Two Pointers, Sliding Window and Prefix Sums', lessons:[
      { day:'M3.1', title:'Two pointers', project:'Pair-sum patterns', tags:['patterns'],
        content:[ OBJ('Use opposite-direction and same-direction pointers'),
          PLAY(`def two_sum_sorted(a, target):
    lo, hi = 0, len(a)-1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target: return (lo, hi)
        if s < target: lo += 1
        else: hi -= 1
    return None
print(two_sum_sorted([1,2,4,7,11], 15))`),
        ]},
      { day:'M3.2', title:'Sliding window (fixed and variable size)', project:'Longest substring problems', tags:['patterns'],
        content:[ OBJ('Grow and shrink a window to maintain a property'),
          PLAY(`def longest_unique_substr(s):
    seen, lo, best = {}, 0, 0
    for hi, ch in enumerate(s):
        if ch in seen and seen[ch] >= lo:
            lo = seen[ch] + 1
        seen[ch] = hi
        best = max(best, hi - lo + 1)
    return best
print(longest_unique_substr("abcabcbb"))  # 3`),
          TIP("Sliding window and two pointers together crack a huge fraction of array and string problems in O(n) instead of the naive O(n squared)."),
        ]},
      { day:'M3.3', title:'Prefix sums and difference arrays', project:'Range-sum queries in O(1)', tags:['patterns'],
        content:[ OBJ('Answer range queries in O(1) after O(n) preprocessing'),
          PLAY(`a = [3, 1, 4, 1, 5, 9]
pre = [0]
for x in a: pre.append(pre[-1]+x)
def range_sum(l, r): return pre[r+1]-pre[l]
print(range_sum(1, 3))  # 1+4+1 = 6

# difference array: apply +val to [l, r] in O(1), then prefix-sum once
diff = [0]*(len(a)+1)
def add_range(l, r, val):
    diff[l] += val; diff[r+1] -= val
add_range(1, 3, 10)
result, run = [], 0
for d in diff[:-1]:
    run += d; result.append(run)
print(result)`),
        ]},
    ]},
    { id:'m4', num:4, title:'Linked Lists, Stacks and Queues', lessons:[
      { day:'M4.1', title:'Linked lists from scratch', project:'Browser History Manager', tags:['linkedlist'],
        content:[ OBJ('Build and reverse a singly linked list','Detect a cycle with fast/slow pointers'),
          PLAY(`class Node:
    def __init__(self, val, nxt=None):
        self.val, self.next = val, nxt

def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev

head = Node(1, Node(2, Node(3)))
r = reverse(head)
while r: print(r.val, end=" "); r = r.next`),
          INFO("Open the Visualizer tab, under Linked List, to watch reversal and cycle detection animate node by node."),
        ]},
      { day:'M4.2', title:'Stacks: monotonic stack', project:'Next Greater Element', tags:['stack'],
        content:[ OBJ('Use stacks for matching and lookback problems'),
          PLAY(`def valid(s):
    pairs = {")":"(", "]":"[", "}":"{"}
    stack = []
    for c in s:
        if c in "([{": stack.append(c)
        elif not stack or stack.pop() != pairs[c]:
            return False
    return not stack
print(valid("({[]})"), valid("(]"))

def next_greater(a):
    res, stack = [-1]*len(a), []
    for i, v in enumerate(a):
        while stack and a[stack[-1]] < v:
            res[stack.pop()] = v
        stack.append(i)
    return res
print(next_greater([2,1,2,4,3]))`),
        ]},
      { day:'M4.3', title:'Queues, deques, monotonic deque', project:'Sliding Window Maximum', tags:['queue'],
        content:[ OBJ('Use FIFO structures','Maintain a monotonic deque for O(n) window max'),
          PLAY(`from collections import deque
def sliding_max(a, k):
    dq, res = deque(), []
    for i, v in enumerate(a):
        while dq and a[dq[-1]] <= v: dq.pop()
        dq.append(i)
        if dq[0] <= i - k: dq.popleft()
        if i >= k - 1: res.append(a[dq[0]])
    return res
print(sliding_max([1,3,-1,-3,5,3,6,7], 3))`),
        ]},
    ]},
    { id:'m5', num:5, title:'Recursion, Backtracking and Divide and Conquer', lessons:[
      { day:'M5.1', title:'Recursion mechanics and the call stack', project:'Problem set', tags:['recursion'],
        content:[ OBJ('Think recursively','See the call stack'),
          PLAY(`def factorial(n):
    if n <= 1: return 1
    return n * factorial(n-1)
print(factorial(6))`),
        ]},
      { day:'M5.2', title:'Backtracking: subsets, permutations, N-Queens', project:'Constraint search', tags:['backtracking'],
        content:[ OBJ('Generate all subsets/permutations','Prune with constraints'),
          PLAY(`def subsets(nums):
    if not nums: return [[]]
    first, rest = nums[0], subsets(nums[1:])
    return rest + [[first]+s for s in rest]
print(subsets([1,2,3]))

def nqueens(n):
    def solve(row, cols, d1, d2):
        if row == n: return 1
        total = 0
        for c in range(n):
            if c in cols or (row-c) in d1 or (row+c) in d2:
                continue
            total += solve(row+1, cols|{c}, d1|{row-c}, d2|{row+c})
        return total
    return solve(0, set(), set(), set())
print("8-queens solutions:", nqueens(8))`),
        ]},
      { day:'M5.3', title:'Divide and conquer', project:'Merge sort revisited as D&C', tags:['recursion'],
        content:[ OBJ('Recognise the divide/conquer/combine shape'),
          P("Divide and conquer splits a problem into independent subproblems, solves them recursively, then combines the results. Merge sort (Module 2) and binary search are the canonical examples — you already know two."),
          PLAY(`def max_subarray(a, lo=None, hi=None):
    if lo is None: lo, hi = 0, len(a)-1
    if lo == hi: return a[lo]
    mid = (lo+hi)//2
    left = max_subarray(a, lo, mid)
    right = max_subarray(a, mid+1, hi)
    # cross-boundary case
    l_sum = s = a[mid]
    for i in range(mid-1, lo-1, -1):
        s += a[i]; l_sum = max(l_sum, s)
    r_sum = s = a[mid+1]
    for i in range(mid+2, hi+1):
        s += a[i]; r_sum = max(r_sum, s)
    return max(left, right, l_sum + r_sum)
print(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # 6`),
        ]},
    ]},
    { id:'m6', num:6, title:'Trees', lessons:[
      { day:'M6.1', title:'Binary trees: all four traversals', project:'File System Tree Explorer', tags:['trees'],
        content:[ OBJ('Traverse trees every way'),
          PLAY(`class T:
    def __init__(self, v, l=None, r=None):
        self.v, self.l, self.r = v, l, r
def inorder(n):
    if not n: return []
    return inorder(n.l) + [n.v] + inorder(n.r)
root = T(4, T(2, T(1), T(3)), T(6, T(5)))
print(inorder(root))  # sorted, because this is a BST`),
          INFO("The Visualizer tab, under Binary Tree, animates inorder, preorder, postorder and level-order traversal."),
        ]},
      { day:'M6.2', title:'Binary search trees: insert, search, validate', project:'BST from scratch', tags:['trees'],
        content:[ OBJ('Build a BST and validate the ordering invariant'),
          PLAY(`def insert(node, v):
    if not node: return T(v)
    if v < node.v: node.l = insert(node.l, v)
    else: node.r = insert(node.r, v)
    return node

def is_valid_bst(node, lo=float('-inf'), hi=float('inf')):
    if not node: return True
    if not (lo < node.v < hi): return False
    return is_valid_bst(node.l, lo, node.v) and is_valid_bst(node.r, node.v, hi)

root = None
for v in [5,3,8,1,4]: root = insert(root, v)
print(is_valid_bst(root))`),
        ]},
      { day:'M6.3', title:'Balanced trees (concept): AVL, 2-3, B-trees', project:'Why balance matters', tags:['trees'],
        content:[ OBJ('Understand why unbalanced BSTs degrade to O(n)'),
          P("A BST built from already-sorted input degenerates into a linked list — every operation becomes O(n) instead of O(log n). Self-balancing trees fix this by re-shaping after insert/delete."),
          UL('AVL trees — rebalance via rotations, keep left/right subtree heights within 1 of each other','2-3 trees — every node has 2 or 3 children, always perfectly balanced by construction','B-trees — generalise 2-3 trees to many children per node; the structure behind most database indexes'),
          PLAY(`# demonstrate the degenerate case
def build_chain(values):
    root = None
    for v in values: root = insert(root, v)
    depth = 0
    node = root
    while node: depth += 1; node = node.r
    return depth
print("depth for sorted input 1..100:", build_chain(range(1, 101)))  # 100, not ~7`),
          WARN("Python's stdlib has no built-in balanced BST. In practice, use `sortedcontainers.SortedList` or just a plain sorted array with `bisect` for most needs — hand-rolling AVL/2-3 trees is mainly an interview and CP exercise."),
        ]},
      { day:'M6.4', title:'Tries (prefix trees)', project:'Autocomplete Engine', tags:['trees'],
        content:[ OBJ('Store strings by shared prefix for O(word length) lookups'),
          PLAY(`class Trie:
    def __init__(self): self.root = {}
    def add(self, w):
        node = self.root
        for c in w: node = node.setdefault(c, {})
        node["#"] = True
    def has(self, w):
        node = self.root
        for c in w:
            if c not in node: return False
            node = node[c]
        return "#" in node
t = Trie(); t.add("cat"); t.add("car")
print(t.has("cat"), t.has("can"))`),
        ]},
    ]},
    { id:'m7', num:7, title:'Heaps and Hashing', lessons:[
      { day:'M7.1', title:'Heaps and priority queues', project:'Top-K and running median', tags:['heap'],
        content:[ OBJ('Use heapq for top-K and the two-heap median trick'),
          PLAY(`import heapq
nums = [5,1,8,3,9,2]
print(heapq.nlargest(3, nums))
print(heapq.nsmallest(2, nums))

h = []
for n in nums: heapq.heappush(h, n)
print([heapq.heappop(h) for _ in range(3)])`),
          INFO("Python's `heapq` is a min-heap only. To simulate a max-heap, push negated values and negate again on pop."),
        ]},
      { day:'M7.2', title:'Hash tables: how they work', project:'Word frequency and anagram grouping', tags:['hashing'],
        content:[ OBJ('Understand average O(1) lookup and collision handling'),
          PLAY(`from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        key = "".join(sorted(w))
        groups[key].append(w)
    return list(groups.values())
print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))`),
          WARN("Hash table lookups are O(1) on **average**, not worst case — a bad hash function or adversarial input can cause collisions that degrade to O(n). Competitive judges sometimes construct 'anti-hash' tests specifically to break naive hashing; when that's a risk, randomize the hash seed or fall back to a sorted structure."),
        ]},
      { day:'M7.3', title:'Disjoint Set Union (Union-Find)', project:'Connectivity and cycle detection', tags:['dsu'],
        content:[ OBJ('Implement DSU with path compression and union by size'),
          PLAY(`class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1]*n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.size[ra] < self.size[rb]: ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True

dsu = DSU(6)
for a, b in [(0,1),(1,2),(3,4)]: dsu.union(a, b)
print(dsu.find(0) == dsu.find(2), dsu.find(0) == dsu.find(3))`),
          TIP("DSU with path compression and union by size runs in nearly O(1) amortized per operation. It is the backbone of Kruskal's MST algorithm and offline connectivity queries."),
        ]},
    ]},
    { id:'m8', num:8, title:'Graphs', lessons:[
      { day:'M8.1', title:'Representations, BFS and DFS', project:'Melbourne Tram Route Planner', tags:['graphs'],
        content:[ OBJ('Represent graphs as adjacency lists','Traverse breadth-first and depth-first'),
          PLAY(`from collections import deque
graph = {"A":["B","C"], "B":["D"], "C":["D"], "D":[]}
def bfs(start):
    seen, q, order = {start}, deque([start]), []
    while q:
        node = q.popleft(); order.append(node)
        for nb in graph[node]:
            if nb not in seen:
                seen.add(nb); q.append(nb)
    return order
print(bfs("A"))`),
          INFO("Watch BFS and DFS flood a graph in the Visualizer tab, under Graph."),
        ]},
      { day:'M8.2', title:'Shortest paths: Dijkstra, Bellman-Ford, Floyd-Warshall', project:'Weighted route planning', tags:['graphs'],
        content:[ OBJ('Pick the right shortest-path algorithm for the constraints'),
          PLAY(`import heapq
def dijkstra(graph, start):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, float('inf')): continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist
g = {"A":[("B",1),("C",4)], "B":[("C",2)], "C":[]}
print(dijkstra(g, "A"))`),
          UL('BFS — unweighted graphs, O(V+E)','Dijkstra — non-negative weights, O(E log V) with a heap','Bellman-Ford — handles negative weights and detects negative cycles, O(V*E)','Floyd-Warshall — all-pairs shortest paths, O(V cubed), fine for V up to a few hundred'),
        ]},
      { day:'M8.3', title:'Minimum Spanning Tree: Kruskal and Prim', project:'Network design', tags:['graphs'],
        content:[ OBJ('Build an MST with DSU-based Kruskal'),
          PLAY(`def kruskal(n, edges):
    dsu = DSU(n)
    total = 0
    for w, u, v in sorted(edges):
        if dsu.union(u, v):
            total += w
    return total

class DSU:
    def __init__(self, n): self.p = list(range(n))
    def find(self, x):
        while self.p[x] != x: self.p[x] = self.p[self.p[x]]; x = self.p[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        self.p[ra] = rb; return True

edges = [(4,0,1),(2,1,2),(3,0,2),(1,2,3)]
print(kruskal(4, edges))`),
        ]},
      { day:'M8.4', title:'Topological sort and cycle detection', project:'Course prerequisite scheduling', tags:['graphs'],
        content:[ OBJ("Order a DAG with Kahn's algorithm"),
          PLAY(`from collections import deque
def topo_sort(n, edges):
    adj = {i: [] for i in range(n)}
    indeg = [0]*n
    for u, v in edges:
        adj[u].append(v); indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == n else None  # None means a cycle exists

print(topo_sort(4, [(0,1),(0,2),(1,3),(2,3)]))`),
        ]},
    ]},
    { id:'m9', num:9, title:'Dynamic Programming and Greedy', lessons:[
      { day:'M9.1', title:'DP fundamentals: memoization to tabulation', project:'Climbing stairs, coin change', tags:['dp'],
        content:[ OBJ('Recognise and solve DP problems'),
          PLAY(`def climb(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a
print([climb(n) for n in range(1, 8)])

def coin_change(coins, amt):
    dp = [0] + [float('inf')]*amt
    for a in range(1, amt+1):
        for c in coins:
            if c <= a: dp[a] = min(dp[a], dp[a-c]+1)
    return dp[amt]
print(coin_change([1,2,5], 11))`),
          TIP("DP is recursion plus memory. Start with the recursive brute force, add memoization (top-down), then flip to tabulation (bottom-up), then shrink the table if you can."),
        ]},
      { day:'M9.2', title:'Classic DP ladder: LIS, LCS, knapsack, grid paths', project:'Problem set', tags:['dp'],
        content:[ OBJ('Solve the canonical DP families'),
          PLAY(`def lis_length(a):
    import bisect
    tails = []
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)
print(lis_length([10,9,2,5,3,7,101,18]))  # 4, O(n log n)`),
        ]},
      { day:'M9.3', title:'Greedy algorithms', project:'Interval scheduling', tags:['greedy'],
        content:[ OBJ('Recognise when a greedy choice is provably optimal'),
          PLAY(`def max_non_overlapping(intervals):
    intervals.sort(key=lambda iv: iv[1])
    count, end = 0, float('-inf')
    for s, e in intervals:
        if s >= end:
            count += 1; end = e
    return count
print(max_non_overlapping([(1,3),(2,4),(3,5),(6,8)]))`),
          WARN("Greedy is not always correct — it works when the problem has the 'greedy choice property' (a locally optimal choice leads to a globally optimal solution). Always test a greedy idea against a brute-force solution on small random cases before trusting it."),
        ]},
      { day:'M9.4', title:'Mega Project: DSA Visualiser CLI', project:'Pick any structure or algorithm and watch it run', tags:['mega'],
        content:[ OBJ('Bring an entire module together in one artefact'),
          P("Build a terminal tool: the user picks a data structure or algorithm, supplies input, and the program prints each step as it executes — the text version of the visualizers on this site."),
          PLAY(`def traced_bubble_sort(a):
    steps = []
    for i in range(len(a)):
        for j in range(len(a)-i-1):
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
                steps.append(list(a))
    return steps

for step in traced_bubble_sort([4,2,5,1]):
    print(step)`),
          TIP("Exit test for this track: solve three unseen medium-difficulty problems in 90 minutes. When you can, you are interview-ready."),
        ]},
    ]},
  ],
};

/* ============================================================
   FASTAPI TRACK — structured against the dev.to "Mastering FastAPI"
   roadmap: Foundational -> Core Concepts -> Intermediate -> Advanced.
   ============================================================ */
const PHASE_FASTAPI = {
  id:'p6', num:6, track:'fastapi', title:'FastAPI and Databases', weeks:'8 modules',
  mega:'Production Task Manager REST API',
  desc:'Follows a four-phase arc — Foundational prerequisites, Core Concepts, Intermediate (the bulk of real API work), and Advanced protocols/orchestration — ending in a layered, tested, deployed REST API.',
  weeksList:[
    { id:'f1', num:1, title:'Foundational Prerequisites', lessons:[
      { day:'F1.1', title:'Type hints as an API contract', project:'Annotate a small service', tags:['foundational'],
        content:[ OBJ('See why FastAPI leans entirely on type hints'),
          P("FastAPI's core trick is reading your Python type hints at runtime to generate validation, serialization, and docs. Everything from here on assumes the type-hints fluency you built in Phase 2."),
          PLAY(`from typing import Optional

def create_user(name: str, age: int, bio: Optional[str] = None) -> dict:
    return {"name": name, "age": age, "bio": bio}

print(create_user("Ada", 30))`),
          INFO("When FastAPI sees `age: int` on a route parameter, it doesn't just document it — it actively converts and validates incoming data against it, rejecting anything that doesn't fit with a clean 422 response."),
        ]},
      { day:'F1.2', title:'async/await for I/O-bound work', project:'Concurrent request simulation', tags:['foundational'],
        content:[ OBJ('Know when async helps and when it does nothing'),
          PLAY(`import asyncio
async def fetch(id):
    await asyncio.sleep(0.02)
    return {"id": id, "status": "ok"}

async def main():
    results = await asyncio.gather(*(fetch(i) for i in range(5)))
    print(results)
asyncio.run(main())`),
          WARN("async only helps for I/O-bound work (network, disk, database). A CPU-heavy `async def` route still blocks the single event loop — offload CPU work to a background task or worker process instead."),
        ]},
      { day:'F1.3', title:'Generators and context managers for dependencies', project:'A yield-based dependency', tags:['foundational'],
        content:[ OBJ('Recognise the yield-based pattern FastAPI dependencies use'),
          PLAY(`from contextlib import contextmanager
@contextmanager
def db_session():
    print("open session")
    try:
        yield {"connected": True}
    finally:
        print("close session")

with db_session() as s:
    print("using", s)`),
          INFO("FastAPI's `Depends()` system uses exactly this yield pattern: code before `yield` runs on request start, code after runs on cleanup — even if the route raised an exception. This is why `Depends(get_db)` reliably opens and closes a database session per request."),
        ]},
      { day:'F1.4', title:'Packaging: venv, pip, poetry, uv', project:'Set up a FastAPI project skeleton', tags:['foundational'],
        content:[ OBJ('Choose and use a dependency manager'),
          UL('`venv` + `pip` — built in, universal, manual `requirements.txt`','`poetry` — lockfile, dependency resolution, packaging in one tool','`uv` — a newer, very fast drop-in for pip/venv/poetry-style workflows'),
          PLAY(`setup = '''
python -m venv .venv
source .venv/bin/activate
pip install "fastapi[standard]"
fastapi dev main.py
'''
print(setup)`),
        ]},
    ]},
    { id:'f2', num:2, title:'Core Concepts', lessons:[
      { day:'F2.1', title:'HTTP fundamentals and REST', project:'Raw HTTP server', tags:['core'],
        content:[ OBJ('Understand the request/response cycle before the framework hides it'),
          P("A client sends a request: method, path, headers, optional body. A server returns a response: status code, headers, body. REST maps CRUD to methods."),
          UL('GET — read (safe, idempotent)','POST — create','PUT/PATCH — update','DELETE — remove'),
          { t:'apisim', method:'GET', path:'/users/42', req:'GET /users/42 HTTP/1.1\nHost: api.example.com\nAccept: application/json', status:200, res:'{\n  "id": 42,\n  "name": "Prach",\n  "role": "learner"\n}' },
          TIP("Try the request simulator above, and see the full simulator in the API Lab tab."),
        ]},
      { day:'F2.2', title:'Your first FastAPI app: routing', project:'Hello, FastAPI', tags:['core'],
        content:[ OBJ('Write route handlers with @app.get/@app.post'),
          P("On your machine: `pip install \"fastapi[standard]\"` then `fastapi dev main.py`. Auto-docs appear at `/docs`."),
          PLAY(`example = '''
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, FastAPI"}

@app.get("/health")
def health():
    return {"status": "ok"}
'''
print(example)`),
        ]},
      { day:'F2.3', title:'Path and query parameters', project:'Movie lookup by id and filters', tags:['core'],
        content:[ OBJ('Declare and validate path/query params with types'),
          PLAY(`example = '''
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    return {"movie_id": movie_id}

@app.get("/movies")
def list_movies(year: int | None = Query(default=None, ge=1888), limit: int = 10):
    return {"year": year, "limit": limit}
'''
print(example)`),
          INFO("Path parameters are part of the URL (`/movies/{movie_id}`); query parameters come after `?` (`/movies?year=2020&limit=5`). FastAPI infers which is which from whether the name appears in the path."),
        ]},
    ]},
    { id:'f3', num:3, title:'Pydantic and Data Validation', lessons:[
      { day:'F3.1', title:'Pydantic models A-Z', project:'Movie Catalogue API', tags:['pydantic'],
        content:[ OBJ('Model request/response bodies with Pydantic', 'Use Field constraints'),
          PLAY(`example = '''
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Movie(BaseModel):
    title: str
    year: int = Field(ge=1888, le=2100)
    rating: float = Field(ge=0, le=10)

db: list[Movie] = []

@app.post("/movies", status_code=201)
def add_movie(movie: Movie):
    db.append(movie)
    return movie
'''
print(example)`),
          INFO("Send a bad `year` and FastAPI returns a clean 422 error automatically — you write zero validation code by hand."),
          { t:'apisim', method:'POST', path:'/movies', req:'POST /movies HTTP/1.1\nContent-Type: application/json\n\n{\n  "title": "Inception",\n  "year": 2010,\n  "rating": 8.8\n}', status:201, res:'{\n  "title": "Inception",\n  "year": 2010,\n  "rating": 8.8\n}' },
        ]},
      { day:'F3.2', title:'Nested models, validators, response models', project:'Structured payloads', tags:['pydantic'],
        content:[ OBJ('Nest models','Write custom field validators','Separate input vs output schemas'),
          PLAY(`example = '''
from pydantic import BaseModel, field_validator

class Address(BaseModel):
    city: str
    country: str

class UserIn(BaseModel):
    name: str
    address: Address

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v):
        if not v.strip():
            raise ValueError("name cannot be blank")
        return v

class UserOut(BaseModel):
    id: int
    name: str
    # note: no password field here, even if UserIn had one
'''
print(example)`),
          TIP("A separate response_model (like `UserOut` above) is how you guarantee sensitive fields (password hashes, internal flags) never leak into an API response, regardless of what the internal object holds."),
        ]},
      { day:'F3.3', title:'Settings management with pydantic-settings', project:'Typed environment config', tags:['pydantic'],
        content:[ OBJ('Load and validate environment variables as a typed object'),
          PLAY(`example = '''
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    debug: bool = False
    secret_key: str

    class Config:
        env_file = ".env"

settings = Settings()
'''
print(example)`),
        ]},
    ]},
    { id:'f4', num:4, title:'Building a Real CRUD API', lessons:[
      { day:'F4.1', title:'Full CRUD, status codes, HTTPException', project:'Movie Catalogue API (complete)', tags:['crud'],
        content:[ OBJ('Wire up GET/POST/PUT/DELETE with correct status codes'),
          PLAY(`example = '''
from fastapi import FastAPI, HTTPException

app = FastAPI()
movies = {}

@app.get("/movies/{id}")
def get_movie(id: int):
    if id not in movies:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movies[id]

@app.delete("/movies/{id}", status_code=204)
def delete_movie(id: int):
    movies.pop(id, None)
'''
print(example)`),
          { t:'apisim', method:'GET', path:'/movies/999', req:'GET /movies/999 HTTP/1.1', status:404, res:'{\n  "detail": "Movie not found"\n}' },
        ]},
      { day:'F4.2', title:'Dependency injection with Depends', project:'Shared query params and DB sessions', tags:['crud'],
        content:[ OBJ('Factor out shared logic with Depends'),
          PLAY(`example = '''
from fastapi import Depends, FastAPI

app = FastAPI()

def pagination(skip: int = 0, limit: int = 20):
    return {"skip": skip, "limit": limit}

@app.get("/movies")
def list_movies(page: dict = Depends(pagination)):
    return page
'''
print(example)`),
          INFO("Depends is FastAPI's dependency injection system — the same yield-based lifecycle you saw in Foundational Prerequisites applies here for anything that needs setup and teardown, like a database session."),
        ]},
    ]},
    { id:'f5', num:5, title:'SQL Databases: SQLAlchemy and Alembic', lessons:[
      { day:'F5.1', title:'Relational concepts and SQL A-Z', project:'University Database', tags:['sql'],
        content:[ OBJ('Design normalised schemas','Write JOINs and aggregates'),
          PLAY(`sql = '''
SELECT s.name, COUNT(e.course_id) AS courses
FROM students s
JOIN enrolments e ON e.student_id = s.id
WHERE s.year = 2026
GROUP BY s.name
HAVING COUNT(e.course_id) >= 3
ORDER BY courses DESC;
'''
print(sql)`),
          UL('Normalisation 1NF to 3NF removes redundancy.','Primary keys uniquely identify rows; foreign keys link tables.','Indexes make lookups fast; transactions keep data consistent (ACID).'),
        ]},
      { day:'F5.2', title:'SQLAlchemy 2.0 ORM: models and relationships', project:'Blog API', tags:['orm'],
        content:[ OBJ('Map classes to tables','Model one-to-many relationships'),
          PLAY(`example = '''
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase): pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped[User] = relationship(back_populates="posts")
'''
print(example)`),
        ]},
      { day:'F5.3', title:'Async SQLAlchemy and Alembic migrations', project:'Wire FastAPI to PostgreSQL', tags:['orm'],
        content:[ OBJ('Use an async engine/session','Manage schema changes with Alembic'),
          PLAY(`example = '''
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine("postgresql+asyncpg://user:pass@host/db")

async def get_db():
    async with AsyncSession(engine) as session:
        yield session

# Alembic (CLI, run in your terminal):
#   alembic init alembic
#   alembic revision --autogenerate -m "create users table"
#   alembic upgrade head
'''
print(example)`),
        ]},
    ]},
    { id:'f6', num:6, title:'Authentication and Security', lessons:[
      { day:'F6.1', title:'Password hashing and JWT', project:'Secure Notes API', tags:['auth'],
        content:[ OBJ('Hash passwords','Issue and verify JWTs'),
          PLAY(`example = '''
from passlib.context import CryptContext
pwd = CryptContext(schemes=["bcrypt"])

hashed = pwd.hash("super-secret")
pwd.verify("super-secret", hashed)  # True on login

import jwt
token = jwt.encode({"sub": user_id, "role": "admin"}, SECRET, "HS256")
'''
print(example)`),
        ]},
      { day:'F6.2', title:'OAuth2 password flow and role-based access', project:'Protected routes', tags:['auth'],
        content:[ OBJ('Implement the OAuth2 password flow','Gate routes by role'),
          PLAY(`example = '''
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_and_lookup(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

def require_admin(user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return user
'''
print(example)`),
        ]},
      { day:'F6.3', title:'Security essentials', project:'Harden the API', tags:['auth'],
        content:[ OBJ('Recognise and prevent common web vulnerabilities'),
          WARN("Security essentials to internalise: never trust input (SQL injection — the ORM's parameterised queries protect you, raw string SQL does not), configure CORS deliberately, rate-limit auth endpoints, and keep secrets in environment variables, never in code."),
        ]},
    ]},
    { id:'f7', num:7, title:'Background Tasks, WebSockets and Testing', lessons:[
      { day:'F7.1', title:'BackgroundTasks, then Celery', project:'Send a welcome email without blocking', tags:['advanced'],
        content:[ OBJ('Offload work from the request/response cycle'),
          PLAY(`example = '''
from fastapi import BackgroundTasks, FastAPI
app = FastAPI()

def send_email(to: str): ...  # slow I/O

@app.post("/signup")
def signup(email: str, tasks: BackgroundTasks):
    tasks.add_task(send_email, email)
    return {"status": "signed up"}
'''
print(example)`),
          INFO("`BackgroundTasks` is fine for quick fire-and-forget work tied to a single request. For anything that needs retries, scheduling, or to survive a server restart, graduate to a real task queue like Celery with Redis or RabbitMQ as the broker."),
        ]},
      { day:'F7.2', title:'WebSockets', project:'Live Chat API', tags:['advanced'],
        content:[ OBJ('Build a WebSocket endpoint'),
          PLAY(`example = '''
@app.websocket("/ws/{room}")
async def chat(ws: WebSocket, room: str):
    await ws.accept()
    rooms[room].append(ws)
    try:
        while True:
            msg = await ws.receive_text()
            for peer in rooms[room]:
                await peer.send_text(msg)
    except WebSocketDisconnect:
        rooms[room].remove(ws)
'''
print(example)`),
        ]},
      { day:'F7.3', title:'Testing with pytest and TestClient', project:'80%+ coverage on your endpoints', tags:['testing'],
        content:[ OBJ('Write real tests against FastAPI routes'),
          PLAY(`def add(a, b): return a + b
def test_add():
    assert add(2, 3) == 5
cases = [(1,1,2), (0,0,0), (-1,1,0)]
for a, b, expected in cases:
    assert add(a, b) == expected
print("All tests passed")`),
          INFO("FastAPI ships `TestClient` — spin your app up in-memory and assert on real responses, no live server needed. Full pytest depth (fixtures, mocking, coverage) lives in the Production track."),
        ]},
    ]},
    { id:'f8', num:8, title:'Advanced Protocols and Production Architecture', lessons:[
      { day:'F8.1', title:'GraphQL, gRPC and streaming (concept)', project:'Know when REST is not the answer', tags:['advanced'],
        content:[ OBJ('Recognise when to reach for GraphQL, gRPC, or streaming instead of plain REST'),
          UL('GraphQL — clients request exactly the fields they need in one round trip; good for complex, nested, client-driven data needs (Strawberry or Ariadne integrate with FastAPI).','gRPC — binary, strongly-typed, high-performance service-to-service calls; common in internal microservice meshes.','Streaming responses — `StreamingResponse` lets you send large files or generated content incrementally instead of buffering it all in memory.'),
        ]},
      { day:'F8.2', title:'CI/CD with GitHub Actions', project:'Test on push, deploy on merge', tags:['advanced'],
        content:[ OBJ('Automate testing and deployment'),
          PLAY(`gh_actions = '''
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest --cov=app
'''
print(gh_actions)`),
        ]},
      { day:'F8.3', title:'Kubernetes (concept): orchestrating at scale', project:'Know the vocabulary', tags:['advanced'],
        content:[ OBJ('Understand what Kubernetes solves, at a conceptual level'),
          P("Docker packages your app into a container; Kubernetes runs many containers across many machines, restarting failed ones, scaling under load, and routing traffic. You do not need it for a portfolio project — you need to recognise the vocabulary."),
          UL('Pod — the smallest deployable unit, one or more containers','Deployment — declares how many replicas of a pod should be running','Service — a stable network address in front of a set of pods','Ingress — routes external HTTP traffic into the cluster'),
        ]},
      { day:'F8.4', title:'Layered architecture and Mega Project', project:'Production Task Manager REST API', tags:['mega'],
        content:[ OBJ('Structure a real API','Separate concerns cleanly'),
          PLAY(`structure = '''
task-manager-api/
  app/
    main.py
    core/          # config, security
    api/routes/    # endpoint routers (thin)
    models/        # SQLAlchemy models
    schemas/       # Pydantic schemas
    services/      # business logic
    repositories/  # DB access layer
    db/            # session, migrations
  tests/
  alembic/
  .env.example
  requirements.txt
'''
print(structure)`),
          UL('Routers stay thin — parse the request, call a service.','Services hold business logic — no HTTP, no SQL.','Repositories own DB access — swappable, testable.','Schemas are not Models: Pydantic validates the API boundary; SQLAlchemy maps the database.'),
          TIP("Users, teams, projects, tasks, comments, plus JWT auth with roles, pagination, filtering, and search — this is your flagship portfolio piece."),
        ]},
    ]},
  ],
};

/* ============================================================
   PHASE 7 - PRODUCTION READINESS
   ============================================================ */
const PHASE_7 = {
  id:'p7', num:7, track:'prod', title:'Production Readiness', weeks:'Weeks 29-31', mega:'Deployed API with CI/CD',
  desc:'Make it real: pytest to 80%+ coverage, Docker plus docker-compose, deploy to a live URL, and a GitHub Actions pipeline that tests on push and deploys on merge.',
  weeksList:[
    { id:'w29', num:29, title:'Testing A-Z', lessons:[
      { day:'W29', title:'pytest, fixtures, parametrize, TestClient', project:'80%+ coverage on Task Manager', tags:['testing'],
        content:[ OBJ('Write real tests','Test FastAPI endpoints'),
          PLAY(`def add(a, b): return a + b
def test_add(): assert add(2, 3) == 5
cases = [(1,1,2), (0,0,0), (-1,1,0)]
for a, b, expected in cases:
    assert add(a, b) == expected
print("All tests passed")`),
        ]},
    ]},
    { id:'w30', num:30, title:'Docker and Deployment', lessons:[
      { day:'W30', title:'Docker A-Z, docker-compose, deploy live', project:'Task Manager on the internet', tags:['docker'],
        content:[ OBJ('Containerise the app','Deploy to a real host'),
          PLAY(`dockerfile = '''
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
'''
compose = '''
services:
  api:
    build: .
    ports: ["8000:8000"]
    depends_on: [db]
  db:
    image: postgres:16
    environment: { POSTGRES_PASSWORD: secret }
'''
print(dockerfile); print(compose)`),
        ]},
    ]},
    { id:'w31', num:31, title:'CI/CD and Polish', lessons:[
      { day:'W31', title:'GitHub Actions, monitoring, README craft', project:'push then test then auto-deploy', tags:['cicd'],
        content:[ OBJ('Automate testing and deploy','Write a recruiter-grade README'),
          TIP("Recruiters read your README before your code. Lead with what it does, a screenshot or GIF, quickstart, architecture, and the live URL."),
        ]},
    ]},
  ],
};

/* ============================================================
   PHASE 8 - CAPSTONE
   ============================================================ */
const PHASE_8 = {
  id:'p8', num:8, track:'capstone', title:'Capstone and Portfolio Polish', weeks:'Week 32+', mega:'Full-Stack Capstone',
  desc:'Pick one idea and build it end to end: FastAPI plus PostgreSQL plus JWT plus Docker plus tests plus CI/CD plus deployed plus a strong README. Then: resume, LinkedIn, apply.',
  weeksList:[
    { id:'w32', num:32, title:'Capstone', lessons:[
      { day:'W32.1', title:'Choose your capstone', project:'StudyMate / SplitSmart / JobTrackr', tags:['capstone'],
        content:[ OBJ('Pick a project that shows range'),
          UL('StudyMate — spaced-repetition study API plus task scheduling for students.','SplitSmart — expense splitting for share houses with settlement algorithms (graph theory in production).','JobTrackr — internship application tracker with a reminder engine and stats.'),
          P("Requirements: FastAPI plus PostgreSQL plus JWT plus Docker plus tests plus CI/CD plus deployed plus a strong README."),
        ]},
      { day:'W32.2', title:'Portfolio polish and applying', project:'Resume, LinkedIn, GitHub profile', tags:['career'],
        content:[ OBJ('Package everything','Start applying'),
          UL('Pin your best repos with clean READMEs.','Write a GitHub profile README with your journey.','Turn each mega-project into a resume bullet: action, tech, impact.','Apply for internships while continuing into data science (NumPy/Pandas next).'),
        ]},
    ]},
  ],
};

/* ============================================================
   COMPETITIVE PROGRAMMING TRACK
   10 phases (0-9) from "The Complete Competitive Programming
   Roadmap (Python)". Phase 0 is fully authored, following the
   attached README pattern: concept -> code -> printed output,
   explicit gotcha callouts, and a hints-only practice block.
   Phases 1-9 are intentionally scaffolded empty (title, blurb,
   outline, milestone) for you to fill in with the Dev Tool.
   ============================================================ */

const CP_PRACTICE_NOTE = INFO('Practice problems are listed with hints only, on purpose — write your solutions in a separate scratch file or directly on Codeforces/CSES. Do not let a solved answer live next to its problem, or you will not resist peeking next time.');

const CP_PHASE_0 = {
  id:'cp0', num:0, track:'cp', title:'Python Foundations (for CP)', weeks:'2-4 weeks',
  mega:'Personal template file',
  desc:"You cannot compete in a language you don't know cold. Five topic-cluster lessons, each concept explained then demonstrated then printed, with every Python-specific gotcha called out before it costs you contest time.",
  milestone:'You can solve FizzBuzz-tier and simple string/list manipulation problems in under 10 minutes without looking anything up.',
  weeksList:[
    { id:'cpw0', num:0, title:'Phase 0', lessons:[
      { day:'0.1', title:'Basics and Control Flow', project:'01_basics_and_control_flow.py', tags:['cp-foundations'],
        content:[
          OBJ('Use variables, operators and type conversion fluently','Know exactly how Python floor division and modulo behave with negatives','Write conditionals and loops the way contest code actually looks'),
          H2('Why this matters for CP'),
          P("Competitive programming has zero tolerance for syntax hesitation. Every second spent recalling how a loop works is a second not spent thinking about the algorithm. This lesson is the demo version of `01_basics_and_control_flow.py` from the Phase 0 file pattern — read the concept, run the code, watch the gotchas."),
          H3('Variables, types, operators'),
          PLAY(`n = 17
pi = 3.14159
name = "contestant"
is_ac = True

print(type(n), type(pi), type(name), type(is_ac))
print(n + 1, pi * 2, name.upper())`),
          H3('Integer division and modulo — the gotcha that bites everyone from C++/Java'),
          P("In C++ and Java, integer division truncates toward zero, so `-7 / 2` is `-3`. Python's `//` **floors** toward negative infinity instead, so `-7 // 2` is `-4`. Modulo follows the same rule and always has the sign of the divisor."),
          PLAY(`print(-7 // 2, -7 % 2)   # -4  1   (Python floors)
print(7 // -2, 7 % -2)   # -4 -1
print(divmod(-7, 2))     # (-4, 1) - quotient and remainder together
print(pow(3, 5, 7))      # modular exponentiation: (3**5) % 7, fast`),
          WARN("If you ever port a C++/Java solution that relies on truncating division, `-7 // 2` will silently give you `-4` instead of the `-3` you expect. When you need C-style truncation in Python, use `int(a / b)` or `math.trunc(a / b)` deliberately."),
          H3('Conditionals'),
          PLAY(`def classify(x):
    if x < 0:
        return "negative"
    elif x == 0:
        return "zero"
    else:
        return "positive"

for v in [-5, 0, 5]:
    print(v, "->", classify(v))`),
          H3('for, while, break, continue, and the for-else search pattern'),
          PLAY(`target = 23
nums = [4, 11, 23, 7]
for i, v in enumerate(nums):
    if v == target:
        print(f"found at index {i}")
        break
else:
    print("not found")

# while with an explicit counter — the CP default for "N times"
i = 0
while i < 3:
    print("tick", i)
    i += 1`),
          H2('Practice'),
          CP_PRACTICE_NOTE,
          OL(
            'Given an integer n, print whether it is even or odd without using `%` (hint: `n & 1`).',
            'Print all integers from 1 to n that are divisible by 3 or 5, using a single for loop.',
            'Read two integers a and b; print `a // b` and `a % b`, then verify `b * (a // b) + a % b == a` for both positive and negative a.',
            'Write a loop that finds the first Fibonacci number greater than 10,000, using while and break.',
            'Simulate a 6-sided die roll loop that stops as soon as three consecutive 6s appear (use `random.randint(1,6)` and a counter).',
          ),
        ]},
      { day:'0.2', title:'Functions', project:'02_functions.py', tags:['cp-foundations'],
        content:[
          OBJ('Write functions with default args, *args and **kwargs','Understand scope and the global keyword','Recognise basic recursion and its limits'),
          H2('Why this matters for CP'),
          P("Contest code is throwaway, but the handful of helper functions you reuse across every problem — a fast-power function, a gcd, an I/O reader — need to be muscle memory. This lesson builds that muscle."),
          H3('def, return, default and keyword arguments'),
          PLAY(`def power(base, exp=2):
    return base ** exp

print(power(5))          # exp defaults to 2
print(power(2, exp=10))  # keyword argument`),
          H3('*args and **kwargs'),
          PLAY(`def total(*nums, **opts):
    s = sum(nums)
    if opts.get("double"):
        s *= 2
    return s

print(total(1, 2, 3))
print(total(1, 2, 3, double=True))`),
          H3('Scope and global'),
          PLAY(`counter = 0
def tick():
    global counter
    counter += 1

for _ in range(5): tick()
print(counter)`),
          WARN("Reaching for `global` inside a hot loop works, but it is a common source of bugs when you copy-paste a function between problems and forget the variable it mutates no longer exists. Prefer returning a new value and reassigning at the call site when you can."),
          H3('lambda and basic recursion'),
          PLAY(`square = lambda x: x * x
print(square(9))

def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)
print(fact(10))`),
          WARN("Python's default recursion limit is 1000 frames (`sys.getrecursionlimit()`). Deep recursive DFS on a large graph or tree can crash with `RecursionError` well before it would in C++. Phase 1 covers `sys.setrecursionlimit()` and converting to iterative DFS — file this away now."),
          H2('Practice'),
          CP_PRACTICE_NOTE,
          OL(
            'Write a function `nCr(n, r)` using only loops (no `math.comb`) and verify it against `math.comb` for a few values.',
            'Write a function that accepts any number of lists via `*args` and returns their merged, sorted result.',
            'Write a recursive function for the Collatz sequence length starting from n; test it for n up to 10,000 — at what point does it fail without raising the recursion limit?',
            'Write a decorator-free memoizing wrapper for a recursive Fibonacci function using a plain dict (do not use functools yet — that is Phase 1).',
          ),
        ]},
      { day:'0.3', title:'Strings and Containers', project:'03_strings_and_containers.py', tags:['cp-foundations'],
        content:[
          OBJ('Use strings, lists, tuples, sets and dicts fluently','Know which container to reach for and why'),
          H2('Why this matters for CP'),
          P("Almost every problem is secretly a container-choice problem in disguise. Picking the wrong one turns an O(n) solution into an accidental O(n squared)."),
          H3('Strings: slicing and methods'),
          PLAY(`s = "Competitive Programming"
print(s.lower())
print(s.split())
print(s.replace("Programming", "Coding"))
print(s[:11], "|", s[-11:])`),
          H3('The decision guide: list vs tuple vs set vs dict'),
          UL(
            '**list** — ordered, mutable, allows duplicates. Default choice for a sequence you will modify.',
            '**tuple** — ordered, immutable. Use for fixed records (coordinates, a fixed-size return value) and as dict keys when a list would not be hashable.',
            '**set** — unordered, unique elements, O(1) average membership test. Use for "have I seen this before" and set algebra (union, intersection).',
            '**dict** — key to value mapping, O(1) average lookup. Use whenever you are counting, grouping, or need a fast lookup by some identifier.',
          ),
          PLAY(`points = [(0,0), (1,1), (0,0), (2,3)]
unique_points = set(points)   # tuples are hashable, lists are not
print(unique_points)

try:
    bad = {[1,2]: "x"}
except TypeError as e:
    print("can't hash a list:", e)`),
          H3('Sets and dicts in practice'),
          PLAY(`nums = [1, 2, 2, 3, 3, 3]
freq = {}
for n in nums:
    freq[n] = freq.get(n, 0) + 1
print(freq)

seen = set()
for n in nums:
    if n in seen:
        print("duplicate:", n)
    seen.add(n)`),
          H2('Practice'),
          CP_PRACTICE_NOTE,
          OL(
            'Given a string, return True if it is a palindrome, ignoring case and spaces.',
            'Given a list of words, return the ones that are anagrams of each other, grouped (hint: sorted tuple of letters as a dict key).',
            'Given two lists, use set operations to find elements in the first but not the second, in O(n).',
            'Count the frequency of every character in a string and print the most common one without using `collections.Counter` (that is Phase 1).',
          ),
        ]},
      { day:'0.4', title:'Comprehensions and Builtins', project:'04_comprehensions_and_builtins.py', tags:['cp-foundations'],
        content:[
          OBJ('Write list/dict/set comprehensions and generator expressions','Use sorted, enumerate, zip, map, any, all, reversed fluently','Recognise the classic 2D-list aliasing bug before it bites you'),
          H2('Why this matters for CP'),
          P("Comprehensions are not just shorter syntax — they run faster than an equivalent manual loop in CPython, because the loop runs in C rather than interpreted bytecode. In a language where every millisecond fights the time limit, that is not a style choice."),
          H3('List, dict and set comprehensions'),
          PLAY(`squares = [x*x for x in range(10)]
evens_only = [x for x in range(20) if x % 2 == 0]
lookup = {x: x*x for x in range(5)}
uniq_lengths = {len(w) for w in ["a", "bb", "cc", "ddd"]}

print(squares)
print(evens_only)
print(lookup)
print(uniq_lengths)`),
          H3('Generator expressions — lazy, memory-cheap'),
          PLAY(`total = sum(x*x for x in range(1_000_000))  # no intermediate list built
print(total)`),
          H3('The builtins you will type in almost every problem'),
          PLAY(`nums = [5, 2, 8, 1]
names = ["ada", "alan", "grace"]

print(sorted(nums, reverse=True))
print(list(enumerate(names)))
print(list(zip(nums, names)))
print(list(map(lambda x: x*2, nums)))
print(any(x > 6 for x in nums), all(x > 0 for x in nums))
print(list(reversed(nums)))`),
          H3('The classic 2D-list aliasing bug'),
          P("`[[0] * cols] * rows` looks like it creates a fresh grid, but it creates `rows` references to the *same* inner list."),
          PLAY(`grid_wrong = [[0] * 3] * 3
grid_wrong[0][0] = 9
print("wrong:", grid_wrong)   # every row changed

grid_right = [[0] * 3 for _ in range(3)]
grid_right[0][0] = 9
print("right:", grid_right)`),
          WARN("This exact bug — mutating one row and watching every row change — is one of the highest-frequency Python-specific bugs in competitive programming grid problems. Always build 2D grids with a comprehension over `range(rows)`, never with `* rows`."),
          H2('Practice'),
          CP_PRACTICE_NOTE,
          OL(
            'Build a multiplication table (10x10) as a nested list using a comprehension, no `* rows` aliasing.',
            'Given a list of (name, score) tuples, use `sorted` with a `key=` to rank by score descending, then name ascending.',
            'Use `zip` to transpose a matrix (list of lists) without writing an explicit nested loop.',
            'Use a generator expression with `sum(...)` to compute the sum of squares of only the even numbers from 1 to 10^6, and confirm it runs fast.',
          ),
        ]},
      { day:'0.5', title:'Mutability, Exceptions and Input Patterns', project:'05_mutability_exceptions_and_input.py', tags:['cp-foundations'],
        content:[
          OBJ('Distinguish shallow vs deep copies','Avoid the mutable-default-argument trap','Read every shape of contest input correctly'),
          H2('Why this matters for CP'),
          P("Every judge on earth feeds your program input through stdin in one of a handful of shapes. Getting the read-pattern wrong wastes contest minutes on a problem you had already solved on paper."),
          H3('Shallow vs deep copies'),
          PLAY(`import copy
original = {"scores": [1, 2, 3]}
shallow = original.copy()
deep = copy.deepcopy(original)

original["scores"].append(4)
print("shallow sees the change:", shallow["scores"])
print("deep is isolated:       ", deep["scores"])`),
          H3('The mutable default argument trap'),
          PLAY(`def add_item(item, bucket=[]):   # BUG: bucket is created ONCE, at def time
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))   # you'd expect ['b'], you get ['a', 'b']

def add_item_fixed(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print(add_item_fixed("a"))
print(add_item_fixed("b"))`),
          WARN("A mutable default argument (a list, dict, or set as a default) is created exactly once when the function is defined, not once per call. Every call that doesn't override it shares and mutates the same object. Always default to `None` and create the mutable object inside the function body."),
          H3('Exception types you will actually hit'),
          PLAY(`try:
    x = int("not a number")
except ValueError as e:
    print("ValueError:", e)

try:
    a = [1, 2, 3]
    print(a[10])
except IndexError as e:
    print("IndexError:", e)

try:
    d = {"a": 1}
    print(d["missing"])
except KeyError as e:
    print("KeyError:", e)`),
          H3('Every input-reading pattern you will reuse constantly'),
          P("The real judge reads from a real keyboard/pipe. In this browser sandbox we simulate stdin with `io.StringIO` — the exact technique real testing harnesses use too."),
          PLAY(`import sys, io
sys.stdin = io.StringIO("5\\n3 7 2 9 4\\n")

n = int(input())                       # single integer on its own line
arr = list(map(int, input().split()))  # a line of space-separated integers
print(n, arr)`),
          PLAY(`import sys, io
sys.stdin = io.StringIO("3\\n1 2\\n3 4\\n5 6\\n")

t = int(input())                       # T test cases
for _ in range(t):
    a, b = map(int, input().split())   # unpack exactly two ints per line
    print(a + b)`),
          PLAY(`import sys, io
sys.stdin = io.StringIO("1 2 3\\n4 5 6\\n7 8 9\\n")

# read everything at once and walk it with a pointer -- the fastest
# pattern, and the one Phase 1's sys.stdin.read() formalises
data = sys.stdin.read().split()
ptr = 0
grid = []
for _ in range(3):
    row = [int(data[ptr + i]) for i in range(3)]
    ptr += 3
    grid.append(row)
print(grid)`),
          H2('Practice'),
          CP_PRACTICE_NOTE,
          OL(
            'Write a function that deep-copies a list of lists and prove with `is`/`id()` that mutating the copy never touches the original.',
            'Trigger and catch a `ZeroDivisionError`, printing a friendly message instead of crashing.',
            'Simulate reading "n\\nthen n integers on the next line" with `io.StringIO`, for three different values of n.',
            'Simulate reading a graph in the common CP format: first line is `n m` (nodes, edges), followed by m lines of `u v` edges; build an adjacency list from it.',
          ),
        ]},
    ]},
  ],
};

/* Phase 1-9 — intentionally empty scaffolding. Fill these in with the
   Dev Tool: each already has an id/title/weeks/desc/milestone/outline
   pulled from the roadmap PDF, but weeksList is empty on purpose. */
function cpStub(id, num, title, weeks, desc, milestone, outline) {
  return { id, num, track:'cp', title, weeks, mega:'', desc, milestone, outline, weeksList:[] };
}

const CP_PHASE_1 = cpStub('cp1', 1, 'CP Fundamentals and Python-Specific Setup', '3-5 weeks',
  "Competitive programming has its own dialect of Python. Learn it before bad habits form: fast I/O, the CP toolbelt, and platform setup.",
  'You can solve most Codeforces 800-rated problems within 15 minutes, and you know instantly which library tool fits a task.',
  ['Fast I/O: sys.stdin.readline, sys.stdin.read().split() with a pointer, batched output with join',
   'The CP toolbelt: collections (deque, Counter, defaultdict), heapq, itertools, math (gcd, isqrt, comb), bisect, functools (lru_cache, cmp_to_key)',
   'Python pitfalls: recursion limit, no integer overflow but slow big-int math, float precision, O(n squared) string concatenation, PyPy vs CPython',
   'Complexity analysis: reading constraints to deduce intended complexity',
   'Platform setup: Codeforces, AtCoder, LeetCode, CSES; judge verdicts AC/WA/TLE/MLE/RE; a personal template file',
   'Practice: Codeforces Div 3/4 A-B (rating 800-1000), ~50 problems; AtCoder ABC A-B']);

const CP_PHASE_2 = cpStub('cp2', 2, 'Core Techniques and Basic Algorithms', '2-3 months',
  'The backbone of everything that follows. Sorting and searching, two pointers, sliding window, prefix sums, greedy, basic recursion and complete search, and basic math for CP.',
  'Codeforces rating around 1100-1200 (Pupil). You can identify "this is two pointers" / "this is binary search on answer" / "this is greedy" straight from the statement.',
  ['Sorting mechanics (merge/quick/counting), custom sort with key= and cmp_to_key, stability',
   'Binary search: on arrays and on the answer space, lo/hi boundary handling, bisect mastery, ternary search',
   'Two pointers and sliding window (fixed and variable size)',
   'Prefix sums, 2D prefix sums, difference arrays, prefix XOR/products',
   'Greedy: exchange argument intuition, interval scheduling, activity selection, fractional knapsack',
   'Basic recursion and complete search: subsets, permutations, backtracking (N-Queens, Sudoku), pruning, meet in the middle',
   'Basic math: GCD/LCM, Euclidean algorithm, Sieve of Eratosthenes, modular arithmetic, fast exponentiation, basic combinatorics',
   'Practice: 120-150 problems - CSES Introductory Problems (all), Codeforces 900-1200 rated']);

const CP_PHASE_3 = cpStub('cp3', 3, 'Data Structures', '2-3 months',
  'Deep mastery of the structures that show up in almost every mid-difficulty problem: stacks, queues, heaps, hashing, DSU, trees, and a first pass at range-query structures.',
  'Codeforces rating around 1300-1400 (Specialist). You can implement DSU, a Fenwick tree, and a basic segment tree from memory in under 10 minutes each.',
  ['Monotonic stack (next greater element, largest rectangle in histogram), monotonic deque (sliding window maximum)',
   'Heaps/priority queues: k-th largest, merging k sorted lists, lazy deletion, two-heap running median',
   'Hashing: how hash tables work, anti-hash tests, coordinate compression',
   'Disjoint Set Union: path compression, union by size/rank, applications (connectivity, Kruskal, offline queries), DSU with rollback',
   'Trees: adjacency-list representation, DFS/BFS traversal (iterative to dodge recursion limits), BST concept, diameter, subtree sizes',
   'Range query structures (first pass): sparse table, Fenwick tree (point update + prefix sum), segment tree (build/update/query)',
   'Practice: 100-120 problems - CSES Sorting and Searching (complete), Codeforces 1200-1400 tagged data structures']);

const CP_PHASE_4 = cpStub('cp4', 4, 'Graph Algorithms', '2-3 months',
  'Representations, traversal, shortest paths, spanning trees, topological structure, and special techniques on implicit and grid graphs.',
  'Codeforces rating around 1400-1500. Given any graph problem rated 1500 or below, you can classify which algorithm applies within minutes.',
  ['Representations (adjacency list/matrix/edge list), iterative BFS/DFS, connected components, flood fill, bipartite checking, cycle detection',
   'Shortest paths: BFS for unweighted, 0-1 BFS with deque, Dijkstra with heapq, Bellman-Ford, Floyd-Warshall, path reconstruction',
   'Trees on graphs: MST via Kruskal (DSU) and Prim, LCA via binary lifting, rerooting technique (intro)',
   'Directed graphs: topological sort (Kahn and DFS-based), Strongly Connected Components (Kosaraju/Tarjan), condensation graph',
   'Undirected structure: bridges and articulation points, biconnected components (concept)',
   'Special techniques: multi-source BFS, BFS/DFS on implicit graphs (word ladders, knight moves), functional graphs, grid graph patterns',
   'Practice: 100 problems - CSES Graph Algorithms (complete), Codeforces 1300-1600 graph problems']);

const CP_PHASE_5 = cpStub('cp5', 5, 'Dynamic Programming', '3-4 months',
  'DP is the single biggest rating gatekeeper. Memoization vs tabulation, then the classic ladder from Fibonacci-style problems through bitmask, digit, tree, and game DP.',
  'Codeforces rating around 1600 (Expert). You can define states for an unseen DP problem and reason about transition correctness before coding.',
  ['DP fundamentals: memoization (@cache) vs tabulation and why tabulation is usually necessary for speed in Python; identifying states, transitions, base cases; push vs pull DP',
   'The classic ladder in order: climbing stairs -> knapsack (0/1, unbounded, bounded) -> coin change -> LIS (O(n^2) then O(n log n)) -> LCS/edit distance -> grid DP -> subset sum/partition -> interval DP -> DP on strings -> bitmask DP (TSP) -> digit DP -> DP on trees (rerooting) -> DP on DAGs -> probability/expected value DP -> game DP',
   'Python-specific DP performance: 1D rolling arrays instead of 2D, avoiding function-call overhead in hot loops, converting @cache to iterative when it hits recursion limits',
   'Practice: 150+ problems - CSES Dynamic Programming (all 19+, non-negotiable), AtCoder DP Contest (all 26, A-Z, the gold standard), Codeforces 1400-1800 DP problems']);

const CP_PHASE_6 = cpStub('cp6', 6, 'Strings, Advanced Math and Combinatorics', '2-3 months',
  'String algorithms (hashing, KMP, Z-function, Manacher, tries, Aho-Corasick, suffix structures), full number theory, combinatorics, probability, game theory, and matrix exponentiation.',
  'Codeforces rating around 1700. Modular arithmetic and counting arguments feel routine.',
  ['String algorithms: polynomial rolling hash (double hashing), prefix function/KMP, Z-function, Rabin-Karp, Manacher, Trie (including bitwise tries for XOR), Aho-Corasick, suffix array with LCP, suffix automaton (concept)',
   'Number theory: extended Euclidean algorithm and modular inverse, linear sieve, Euler totient, Chinese Remainder Theorem, Mobius/inclusion-exclusion, Miller-Rabin primality, Pollard rho, discrete log (concept)',
   'Combinatorics: nCr under modulo (factorial precompute + modular inverse), stars and bars, inclusion-exclusion, derangements, Catalan numbers, Burnside (concept)',
   'Probability and expected value: linearity of expectation as the workhorse trick',
   'Game theory: Nim, Sprague-Grundy numbers, game DP on states',
   'Matrix exponentiation: fast linear recurrences (Fibonacci in O(log n)), adjacency-matrix path counting',
   'Practice: 100 problems - CSES String Algorithms + Mathematics, Codeforces 1500-1800 math/strings/combinatorics']);

const CP_PHASE_7 = cpStub('cp7', 7, 'Advanced Data Structures and Techniques', '3-4 months',
  'Segment trees and Fenwick trees at full power, sqrt decomposition and Mo\'s algorithm, advanced tree techniques, offline tricks, and advanced graph algorithms (flow, matching, 2-SAT).',
  'Codeforces rating around 1900 (Candidate Master territory). You choose between segment tree, Fenwick, sqrt, or offline approaches based on constraints instinctively.',
  ['Segment trees (full power): lazy propagation, merged-node tricks (max subarray sum), tree walking/descent, merge sort tree, persistent segment trees (concept)',
   'Fenwick tree (full power): range-update/point-query and range-update/range-query, 2D Fenwick, order statistics',
   'Sqrt techniques: sqrt decomposition on arrays, Mo\'s algorithm for offline range queries, heavy/light heuristics',
   'Advanced tree techniques: Euler tour + segment/Fenwick tree for subtree queries, Heavy-Light Decomposition, small-to-large merging (DSU on tree), centroid decomposition, full rerooting',
   'Offline techniques: query sorting, sweep line on arrays/events, divide and conquer on queries (CDQ, concept)',
   'Advanced graph: max flow (Ford-Fulkerson/Edmonds-Karp then Dinic), min-cut, bipartite matching (Hopcroft-Karp), min-cost max-flow, Euler paths (Hierholzer), 2-SAT',
   'Python balanced-BST substitutes: sortedcontainers.SortedList, Treap (concept)',
   'Practice: 100-120 problems - CSES Range Queries + Tree Algorithms (both complete), Codeforces 1700-2000']);

const CP_PHASE_8 = cpStub('cp8', 8, 'Expert Topics', 'ongoing, 4-6+ months',
  'What separates advanced competitors from everyone else: DP optimisations, polynomial and bitwise math, geometry, advanced strings, advanced structures, and randomized/heuristic techniques. Learn these as you meet them in Div 1 problems.',
  'Codeforces rating 2100+ (Master). At this level growth comes from contests and upsolving, not from a new-topic checklist.',
  ['DP optimisations: Convex Hull Trick, Li Chao tree, D&C DP optimisation, Knuth optimisation, slope trick (concept), Aliens trick (concept), SOS DP',
   'Polynomial and bitwise math: FFT/NTT for polynomial multiplication (trusted template), XOR basis, Gaussian elimination',
   'Geometry: points/vectors/cross-dot products, orientation tests, line/segment intersection, polygon area (shoelace), convex hull (monotone chain), closest pair, rotating calipers (concept), sweep line geometry',
   'Advanced strings: suffix automaton (full), suffix tree (concept), palindromic tree/Eertree (concept), Lyndon words/Duval\'s algorithm (concept)',
   'Advanced structures: persistent data structures (full), link-cut trees (concept), wavelet tree (concept)',
   'Randomized and heuristic techniques: random pivots/hashing salts, simulated annealing/hill climbing, interactive problem technique, constructive-algorithms mindset',
   'Practice: Codeforces 2000+, AtCoder Regular/Grand Contest, past ICPC regionals']);

const CP_PHASE_9 = cpStub('cp9', 9, 'Contest Craft', 'runs in parallel from Phase 2 onward',
  'The meta-skill: contest routine, debugging and testing discipline, speed and accuracy training, and Python-specific contest strategy. This is where most rating growth actually happens.',
  'A durable weekly-contest habit, a personal template library, and the judgement to know when Python itself is the wrong tool for a specific problem.',
  ['Contest routine: every Codeforces Div 2/3/4 you can, weekly AtCoder ABC, virtual contests when you miss live ones, religious upsolving (1-2 problems you could not solve live, after every contest)',
   'Debugging and testing discipline: stress testing (brute force + random generator + comparison script), an edge-case checklist (n=1, all-equal values, max constraints, negatives), reading the problem twice',
   'Speed and accuracy training: timed sets (5 problems / 2 hours below your level), one stretch problem above your level per day, cutting losses after 30+ minutes stuck',
   'Python contest strategy: always check for PyPy, know which algorithms are risky even under PyPy (heavy recursion, 10^8+ ops, deep segment trees with lazy propagation)',
   'Personal template library: fast I/O, DSU, iterative segment tree, Fenwick, Dijkstra, sieve, nCr mod p, string hashing, LCA - tested, trusted, versioned',
   'Rating milestones: 800-1199 Newbie/Pupil (Phases 0-2), 1200-1399 Specialist (Phase 3), 1400-1599 Specialist+ (Phase 4), 1600-1899 Expert (Phases 5-6), 1900-2099 Candidate Master (Phase 7), 2100+ Master and beyond (Phase 8 + contest volume)']);

const CP_PHASES = [CP_PHASE_0, CP_PHASE_1, CP_PHASE_2, CP_PHASE_3, CP_PHASE_4, CP_PHASE_5, CP_PHASE_6, CP_PHASE_7, CP_PHASE_8, CP_PHASE_9];

/* ============================================================ */
const PHASES = [PHASE_1, PHASE_2, PHASE_3, PHASE_DSA, ...CP_PHASES, PHASE_FASTAPI, PHASE_7, PHASE_8];

window.CURRICULUM_BASE = { TRACKS, PHASES };
window.CURRICULUM_HELPERS = { P, H2, H3, UL, OL, TIP, WARN, INFO, PLAY, QUIZ, OBJ };

})();
