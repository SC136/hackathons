# Hackathon Logbook

A personal record of hackathons — wins, losses, and everything in between.

**Live:** [sc.is-a.dev/hackathons](https://sc.is-a.dev/hackathons/)

## Overview

A static timeline site that tracks every hackathon I've participated in. Entries are color-coded by result (win / finalist / loss), filterable by year, result, and location, and include team member links, dates, and background images on hover.

## Stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- Dark theme with glassmorphism-style cards

## Project Structure

```
├── index.html      # Page shell — header, filters, timeline container, footer
├── style.css       # Design system — dark theme, timeline layout, card styles
├── app.js          # Fetches data.json and renders the timeline + stats
├── data.json       # All hackathon data (entries + team members)
└── assets/         # Hackathon images
```

## Data API

All hackathon data lives in a single `data.json` file, which doubles as a public JSON API:

```
https://sc.is-a.dev/hackathons/data.json
```

### Schema

```json
{
  "members": {
    "<key>": { "name": "string", "url": "string" }
  },
  "entries": [
    {
      "year": 2026,
      "date": "28-1-2026",
      "name": "Hackathon Name",
      "result": "Top 5 Finalist",
      "description": "Short note.",
      "location": "Mumbai - Malad",
      "duration": "6 hours",
      "projectUrl": "https://github.com/...",
      "images": ["assets/img.jpg"],
      "team": ["sc", "sherv"]
    }
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `year` | number | ✅ | |
| `name` | string | ✅ | |
| `result` | string | ✅ | `"loss"`, `"Finalists"`, `"2nd Runner Up"`, etc. |
| `description` | string | ✅ | |
| `date` | string | ❌ | Format: `DD-M-YYYY` |
| `location` | string | ❌ | |
| `duration` | string | ❌ | e.g. `"6 hours"`, `"48 hours"` |
| `projectUrl` | string | ❌ | Link to source code |
| `images` | string[] | ❌ | Relative paths to images |
| `team` | string[] | ❌ | Keys from `members` object |

### Usage from another site

```javascript
const res = await fetch("https://sc.is-a.dev/hackathons/data.json");
const { entries, members } = await res.json();
```

## Adding a new hackathon

Edit `data.json` and add an entry to the `entries` array. The site and any consuming apps will pick it up automatically.

## Running locally

Any static file server works. For example:

```bash
npx http-server . -p 8080
```

Then open [http://localhost:8080](http://localhost:8080).
