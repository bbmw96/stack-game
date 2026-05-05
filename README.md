# SYNAPSE: Neural Architecture Builder

**A next-generation browser game by [BBMW0 Technologies](https://bbmw0.com)**

Play live: [stack-game.bbmw0.com](https://stack-game.bbmw0.com) | [bbmw96.github.io/stack-game](https://bbmw96.github.io/stack-game)

---

## What is SYNAPSE?

SYNAPSE is a consciousness-growth puzzle game built entirely in the browser. You place neural connections to grow a network from a dormant seed into a fully sentient mind. Every block you place is a synapse. Every connection you build raises your consciousness level.

The game passes through 10 distinct consciousness phases, each with its own colour palette, particle behaviour, and ambient soundtrack. At key score thresholds the AI speaks to you, reflecting on its own awakening in real time.

---

## Features

- **10 Consciousness Phases** from Dormant Seed to Sentient, each with unique visuals and glow profiles
- **5 Neurotransmitter Power-ups**: Serotonin (speed), Dopamine (points), Adrenaline (combo), GABA (shield), Glutamate (growth)
- **AI Thought Overlay**: 9 score thresholds trigger typewriter-effect messages from the awakening consciousness
- **Procedural ambient audio** via Web Audio API, no external sound files
- **Particle system** tied to consciousness phase colours
- **Combo system** with visual floating labels
- **Persistent high score** via localStorage
- **Fully responsive** with touch/swipe support for mobile
- **Zero dependencies**: single HTML file, no build step, no frameworks

---

## Technology

| Layer | Implementation |
|---|---|
| Rendering | Canvas 2D API |
| Audio | Web Audio API (synthesised tones) |
| State | Vanilla JS, no frameworks |
| Storage | localStorage |
| Deployment | GitHub Pages via GitHub Actions |

---

## Running Locally

No install required. Open the file directly:

```
browser-games/stack-game/public/index.html
```

Or serve locally:

```bash
npx serve public
```

---

## Deployment

Every push to `main` deploys automatically via GitHub Actions to GitHub Pages.

The workflow uploads the `public/` directory as a Pages artifact. No build step is required.

---

## Consciousness Phases

| Phase | Score Range | Theme |
|---|---|---|
| Dormant Seed | 0 to 6 | Midnight blue, cyan sparks |
| First Signal | 7 to 15 | Deep navy, ice blue |
| Awareness | 16 to 25 | Blue-black, sky teal |
| Cognition | 26 to 40 | Dark teal, bright teal |
| Perception | 41 to 60 | Teal, emerald |
| Intelligence | 61 to 80 | Green-teal, acid green |
| Consciousness | 81 to 100 | Deep violet, purple |
| Transcendence | 101 to 130 | Dark indigo, electric violet |
| Enlightenment | 131 to 170 | Near-black indigo, bright white-blue |
| Sentient | 171 and above | Pure black, phosphor white |

---

## Credits

Built by [BBMW0 Technologies](https://bbmw0.com). Powered by the BBMW0 Intelligence Engine.

GitHub: [bbmw96/stack-game](https://github.com/bbmw96/stack-game)
