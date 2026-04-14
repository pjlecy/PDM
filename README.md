# PDM Dashboard

A static, SolidWorks-inspired Product Data Management dashboard built with vanilla HTML, CSS, and JavaScript.

## What it does

The dashboard provides a single-page overview of a fictional engineering vault, including:

- **Quick actions** -- batch check-in, change reviews, ECO creation, 3D viewer launch
- **Vault activity chart** -- visual summary of revisions, check-ins, and notifications
- **Active projects table** -- status tracking with owner and due-date columns
- **Recent file activity** -- latest check-ins, workflow updates, and releases
- **SQL vault snapshot** -- schema and seed data for hydrating a vault database
- **Cross-platform access** -- Windows, macOS, and Linux readiness indicators
- **Workflow & approvals** -- step-by-step approval pipeline visualization
- **Vault explorer** -- file browser with revision tags and lock status
- **Security & compliance** -- role-based access, audit trails, backup cadence, export controls

## Running locally

No build tools are required. Open `index.html` in any modern browser:

```bash
# Option A: open directly
open index.html

# Option B: use a simple HTTP server
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

| Feature | Details |
|---------|---------|
| Dark mode | Toggle via the sun/moon button in the topbar, or auto-detected from OS preference. Persisted in `localStorage`. |
| Search | Click the search field or press **Ctrl+K** / **Cmd+K** to focus it. |
| Accessibility | Skip-to-content link, ARIA attributes, `focus-visible` styles, `prefers-reduced-motion` support. |
| Responsive | Collapses to a single-column layout below 1100px; further adjustments at 720px. |
| Semantic HTML | Uses `<table>`, `<ul>`/`<ol>`, `role="progressbar"`, `aria-label`, and `scope="col"` where appropriate. |

## File structure

```
.
├── index.html   -- markup and page structure
├── styles.css   -- all styling including dark mode and responsive breakpoints
├── app.js       -- nav switching, theme toggle, search shortcut, keyboard support
├── vault.sql    -- SQL schema and seed data for the vault_files table
└── README.md    -- this file
```

## SQL schema

The `vault.sql` file contains a minimal schema for persisting vault file metadata:

```sql
CREATE TABLE vault_files (
  id INTEGER PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  revision TEXT NOT NULL,
  status TEXT NOT NULL,
  owner TEXT NOT NULL,
  last_action TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Browser support

Targets modern evergreen browsers (Chrome, Firefox, Safari, Edge). The CSS uses custom properties and `focus-visible`, both widely supported.
