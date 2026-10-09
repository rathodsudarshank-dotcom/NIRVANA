# NIRVANA

NIRVANA is a Vite + React application for structural health monitoring and anomaly reporting for infrastructure assets. The project currently demonstrates a bridge monitoring dashboard, AI-style analysis UI, report history, and contact system while clearly labeling any non-production data as simulated.

## Architecture overview

- Frontend: React 19 + Vite + React Router
- Styling: custom CSS design system in `src/index.css`
- Simulation layer: `src/hooks/useSimulation.js` keeps the demo experience usable without a backend
- Backend: Vercel serverless functions in `api/`
- Persistence: optional durable database via `DATABASE_URL` when a connected deployment is configured
- Local dev: Vite frontend with API proxy to `http://localhost:3000` for `vercel dev`

## Current data flow

The app originally used a purely client-side simulation in `src/hooks/useSimulation.js` and static demo data in `src/data/bridgeData.js` and `src/data/reportData.js`. This remains the fallback path when no backend or database is configured.

The backend layer adds a thin API surface for:

- `GET /api/health`
- `GET /api/monitoring/summary`
- `GET /api/monitoring/readings`
- `GET /api/monitoring/anomalies`
- `GET /api/reports`
- `POST /api/contact`

These APIs are designed to run on Vercel, and they explicitly return demo-mode responses when no durable database or live telemetry source is available.

## Simulated vs connected mode

The app distinguishes the state clearly in the UI banner.

- Demo mode: displays simulated readings, simulated AI findings, and report history that are clearly labeled as demo data
- Connected mode: would be enabled when `DATABASE_URL` and the required telemetry/AI services are configured

No part of this project is presented as a real-time live sensor feed or production AI model unless you intentionally connect the required services and credentials.

## API routes

### Health
`GET /api/health`

Returns service health and whether the backend is in `demo` or `connected` mode.

### Monitoring summary
`GET /api/monitoring/summary`

Returns a summary payload for bridge health, risk state, and AI analysis snapshots.

### Sensor readings
`GET /api/monitoring/readings`

Returns the current sensor values and trends for the bridge dashboard.

### Anomaly results
`GET /api/monitoring/anomalies`

Returns anomaly status metadata for the current operational state.

### Reports
`GET /api/reports`

Returns historical or demo reports as structured JSON.

### Contact form
`POST /api/contact`

Validates submissions server-side and accepts them only from trusted app origins or with a configured API key. It rate-limits submissions and does not log message contents.

## Security boundaries

- No private credentials are stored in `VITE_*` variables
- Secret configuration remains server-side in Vercel environment variables
- write and ingestion endpoints use a bounded in-memory rate limiter; production-wide enforcement requires a shared rate-limit store
- CORS is restricted to known local and deployed origins
- security headers are added through `vercel.json` and serverless function headers
- contact and API routes reject invalid payloads before persistence or storage logic is invoked

## Local development setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the frontend dev server:
   ```bash
   npm run dev
   ```

3. For API routes, use Vercel local dev so the serverless functions are reachable:
   ```bash
   npx vercel dev
   ```

4. The Vite config proxies `/api` requests to `http://localhost:3000` during local development.

## Required environment variables

These are optional and only needed for a connected deployment:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
CONTACT_API_KEY=replace-with-server-side-secret
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
```

Notes:

- `DATABASE_URL` is required for durable persistence
- `CONTACT_API_KEY` is optional but recommended for external, non-browser callers
- `ALLOWED_ORIGINS` must list exact frontend origins; add each Vercel preview origin separately if it needs API access
- Do not place these values in a browser bundle or `VITE_*` variables

## Deployment on Vercel

1. Push this repository to GitHub
2. Import it in Vercel
3. Add the required environment variables in the Vercel Project Settings
4. Deploy the project
5. Ensure the SPA rewrite handles frontend routes correctly via `vercel.json`

## Current implementation status

### Working now without additional services

- Vite frontend and React Router pages
- visual dashboard and reports experience
- demo simulation UI
- API layer returning demo responses
- secure contact validation and rate limiting
- Vercel headers and SPA routing fallback

### Requires real services to become fully connected

- real sensor ingestion pipeline
- real AI service or inference layer
- durable database with persistent storage
- production email or notification system if contact form must persist or notify staff

## Files changed

Key files include:

- `src/App.jsx`
- `src/hooks/useSimulation.js`
- `src/components/Contact.jsx`
- `src/lib/api.js`
- `src/index.css`
- `vite.config.js`
- `vercel.json`
- `api/health.js`
- `api/monitoring/summary.js`
- `api/monitoring/readings.js`
- `api/monitoring/anomalies.js`
- `api/reports/index.js`
- `api/contact.js`
- `api/_lib/security.js`
- `api/_lib/demoData.js`

## Final note

This project remains a demo-ready monitoring platform until real sensor or AI infrastructure is connected. The current implementation intentionally does not claim live telemetry or a production AI model is running. It is designed to be a secure, maintainable foundation that can be upgraded to connected mode without replacing the app�s current stack.
-
This project remains a demo-ready monitoring platform until real sensor or AI infrastructure is connected. The current implementation intentionally does not claim live telemetry or a production AI model is running. It is designed to be a secure, maintainable foundation that can be upgraded to connected mode without replacing the app's current stack.
