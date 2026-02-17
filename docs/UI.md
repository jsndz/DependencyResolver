# 📄 UI DOCUMENT

## Workflow Dependency Engine — User Interface Design

### 1. UI Goal

The UI should be **simple, calm, and instructional**.

It should guide the user through a workflow definition without overwhelming them or exposing internal complexity.

---

### 2. UI Structure (Single Page)

The interface is divided into **five clear sections**, arranged top to bottom.

---

### Section 1 — Steps

**Purpose:** Define executable actions.

**UI Elements:**

* Text input: Step name
* Text input: Command
* Text input: Working folder
* “Add Step” button
* List of defined steps

**Design Notes:**

* Keep inputs minimal
* Validate immediately
* Show steps as a readable list

---

### Section 2 — Order Rules

**Purpose:** Define execution constraints.

**UI Elements:**

* Dropdown: Step A
* Dropdown: Step B
* Static text:

  > “Step B can run only after Step A finishes”
* “Add Rule” button
* List of rules

**Design Notes:**

* Use dropdowns to prevent invalid input
* Direction must be explicit and readable

---

### Section 3 — Goal Selection

**Purpose:** Capture user intent.

**UI Elements:**

* Dropdown:

  * Run everything
  * Run selected step
* “Preview Plan” button
* “Run” button

**Design Notes:**

* This section answers *why* the workflow exists
* Buttons should be visually prominent

---

### Section 4 — Execution Plan (Read-Only)

**Purpose:** Build user confidence before execution.

**UI Elements:**

* Text-based plan display
* Grouped by execution step
* Parallel steps clearly labeled

**Example Display:**

```
Step 1 (parallel):
- build
- lint

Step 2:
- test

Step 3:
- run
```

**Design Notes:**

* No editing here
* Purely informational

---

### Section 5 — Live Execution Output

**Purpose:** Show real-time execution feedback.

**UI Elements:**

* One output panel per active branch
* Panel title reflects workflow context
* Streaming logs
* Status indicators:

  * running
  * success
  * failed
  * skipped

**Design Notes:**

* Panels open and close dynamically
* Logs stream in real time
* Errors are highlighted but not overwhelming

---

### 3. Visual Design Guidelines

* Minimal color palette
* Clear spacing between sections
* Status colors used sparingly
* No animations that distract from execution

---

### 4. UI Non-Goals

The UI does NOT:

* visualize the graph
* show node/edge diagrams
* expose internal IDs
* show raw JSON by default

These may exist in a hidden debug mode, but not in the main flow.

---

### 5. UI Success Criteria

The UI is successful if:

* A first-time user can run a workflow in under 2 minutes
* The user never asks “what does this mean?”
* The user understands *why* a step is running or blocked

---

## Final Note

The UI is intentionally **simple and opinionated**.

Complexity lives in the engine.
The interface exists only to express intent and display results.

