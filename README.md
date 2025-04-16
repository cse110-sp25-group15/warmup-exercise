# Simple Card Game

This is a WARMUP assignment, below you will find the project structure and stylistic guides that you should stick to. Deviations/suggestions is welcome ONLY if you notify me.

---

## Project Structure

```
card-app/
├── index.html                  # Entry point of the app
├── README.md                   # Instructions and structure
│
├── /components/                # One folder per Web Component
│   ├── /playing-card/
│   │   ├── playing-card.js     # Component logic (custom element definition)
│   │   ├── playing-card.css    # Shadow DOM styles
│   │   └── playing-card.html   # HTML template
│   │
│   └── /card-deck/             # Similare to above
│   
├── /state/                     # Shared logic files
│   └── state.js                # Persistent state helpers (localStorage)
│   
├── /assets/                    # Static assets
│   ├── cards/                  # Card face images
│   └── style.css               # Optional global variables or resets
│
└── /tests/                     # Manual or automated test files
```

---

## Component Design

Each Web Component lives in its own folder and follows this pattern:

- `component-name.js` – defines and registers the custom element
- `component-name.html` – holds a `<template>` for structure
- `component-name.css` – scoped styles for Shadow DOM

Components use Shadow DOM for encapsulation. Styles and layout do not leak into or out of the component.

---

## Styling Guidelines

- Each component loads its own CSS into its shadow root.
- You should only use `<link rel="stylesheet">`, do not embed `<style>` tags in the template.
- Global CSS (like colors or resets) can go into `assets/style.css`. However, these shouldn't penetrate into the components.

---

## State Management

State is handled using the browser’s `localStorage` API via `state/state.js`.

Example usage:

```
TODO
```

State should be used to:
- Track the deck between sessions
- Persist player progress or money in Blackjack
- Restore game state after reload

---

## Testing Strategy

TODO

---

## Workflow & Git Guidelines

- Use descriptive commit messages:
  ```
  feat(deck): add shuffle logic
  fix(card): ensure card face resets on redraw
  ```
- Push frequently with isolated commits (think about it like this, if its good enough to ctrl+s, its probably good enough to commit)
- Document any decisions in the `README.md` or post issues on slack.

---

## Getting Started

1. Clone the repo
2. Open with a local static server VSCode Live Server, etc.
3. Edit files in `/components/`
4. Load the page via `index.html`
5. Track progress and issues in GitHub

---

Let us know if you have questions or ideas — open a GitHub issue or reach out to the team!
