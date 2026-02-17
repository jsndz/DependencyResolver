# 📄 UX DOCUMENT

## Workflow Dependency Engine — User Experience Design

### 1. UX Goal

The goal of the UX is to let users **define and run workflows** without requiring them to understand graphs, dependencies, or scheduling algorithms.

The system should feel like:

> “I describe what actions exist, how they relate, and what I want to run.”

Not:

> “I am building a graph.”

---

### 2. Core UX Principles

1. **Intent before structure**
   Users should start with _what they want to achieve_, not how it is implemented.

2. **Plain language over technical terms**
   Avoid exposing internal concepts such as DAGs, nodes, or edges.

3. **Predictability before execution**
   Users must see _what will happen_ before it happens.

4. **Safe by default**
   Execution should not feel risky or irreversible.

5. **Progress visibility**
   Users must always know:
   - what is running
   - what is blocked
   - what failed and why

---

### 3. User Mental Model

The user thinks in terms of:

- **Steps** — actions the system can perform
- **Order rules** — which steps must happen before others
- **Goal** — what they want to run
- **Plan** — how the system will execute
- **Result** — live feedback while it runs

The user never needs to think about graphs.

---

### 4. Primary User Flow

1. **Define steps**
   The user describes executable steps using:
   - name
   - command
   - working folder

2. **Define order rules**
   The user describes constraints such as:

   > “Step B can run only after Step A finishes.”

3. **Choose a goal**
   The user selects:
   - run everything, or
   - run a specific step (and its prerequisites)

4. **Preview execution plan**
   The system shows:
   - execution order
   - parallel steps
   - blocked relationships

5. **Execute workflow**
   The system runs the workflow and streams output.

---

### 5. Error & Failure UX

Errors are explained in **human terms**, not technical terms.

Examples:

- “These steps depend on each other in a loop.”
- “This step failed, so the following steps were skipped.”

Failure is **isolated**:

- Independent workflows continue running
- Only affected steps are stopped

---

### 6. UX Scope Boundaries

The UX intentionally does NOT:

- expose graph structure
- require the user to understand scheduling
- allow unsafe execution without preview

Advanced details may exist in a **debug view**, but are hidden by default.

---

### 7. UX Outcome

A user should be able to explain the system as:

> “I define steps, describe their order, choose what I want to run, and the system executes everything safely and in the right order.”

If the user can say that, the UX is successful.

---
