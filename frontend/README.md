# Frontend — ChainScope

Vite + React + Tailwind UI. Distinct dark theme with an "analyst console"
aesthetic — deliberately different from the light SDG-green look of the
original *Sourced* prototype.

## Routes (planned)

- `/` — Upload → classification → components → risk dashboard
- `/metrics` — Live model metrics + confusion matrix + latency
- `/about` — Story, credits, data cards

## Setup

```bash
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000` in `.env` to point at the backend.
