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
- `POST /api/monitoring/ingest`
- `GET /api/reports`
- `POST /api/contact`

These APIs are designed to run on Vercel, and they explicitly return demo-mode responses when no durable database or live telemetry source is available.

## Simulated vs connected mode

The app distinguishes the state clearly in the UI banner.

- Demo mode: displays illustrative readings, simulated findings, and sample report history
- Connected mode: requires a reachable PostgreSQL database and recent readings from all six supported sensors

Connected risk screening uses fixed trend thresholds. It is not a trained AI model. The UI labels this distinction; demo AI-style findings are illustrative only.

## API routes

### Health
`GET /api/health`

Checks database reachability and requires fresh readings from all supported sensors before returning `connected`. Readings older than 10 minutes leave the app in demo mode.

### Monitoring summary
`GET /api/monitoring/summary`

Returns a summary computed from the latest stored sensor readings, including rule-based risk thresholds.

### Sensor readings
`GET /api/monitoring/readings`

Returns the latest stored value for each supported sensor.

### Anomaly results
`GET /api/monitoring/anomalies`

Returns rule-based screening alerts derived from elevated sensor trends. It does not call an AI model.

### Reports
`GET /api/reports`

Returns persisted JSON reports or the sample reports used in demo mode.

### Sensor ingestion
`POST /api/monitoring/ingest`

Requires `INGEST_API_KEY` as `Authorization: Bearer <key>` or `X-API-Key`. Accepts batches of up to 100 readings for the supported sensor IDs, validates timestamps and numeric values, and writes them to PostgreSQL.

```json
{
   "readings": [
      { "sensorId": "ACC-01", "value": 0.16, "trend": 2.5 },
      { "sensorId": "SG-01", "value": 145, "trend": 1.2 },
      { "sensorId": "LVDT-01", "value": 2.4, "trend": 2 },
      { "sensorId": "TILT-01", "value": 0.04, "trend": 0 },
      { "sensorId": "TEMP-01", "value": 28.4, "trend": -1 },
      { "sensorId": "HUM-01", "value": 62, "trend": -1 }
   ]
}
```

### Contact form
`POST /api/contact`

Validates submissions server-side and stores them in `contact_submissions`. Requests must come from a trusted app origin or include a configured API key.

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
INGEST_API_KEY=replace-with-a-long-random-secret
CONTACT_API_KEY=replace-with-server-side-secret
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
```

Notes:

- `DATABASE_URL` is required for durable persistence
- `INGEST_API_KEY` is required to accept sensor readings
- `CONTACT_API_KEY` is optional but recommended for external, non-browser callers
- `ALLOWED_ORIGINS` must list exact frontend origins; add each Vercel preview origin separately if it needs API access
- Do not place these values in a browser bundle or `VITE_*` variables

Initialize the database after setting `DATABASE_URL`:

```bash
psql "$DATABASE_URL" -f api/_lib/schema.sql
```

Send a recent reading for each supported sensor at least once every 10 minutes before the health endpoint reports connected mode.

Run the checks locally with:

```bash
npm test
npm run lint
npm run build
```

## Deployment on Vercel

1. Push this repository to GitHub
2. Import it in Vercel
3. Add the environment variables in Vercel Project Settings
4. Apply `api/_lib/schema.sql` to the configured PostgreSQL database
5. Configure the sensor collector to post all six sensor IDs using `INGEST_API_KEY`
6. Deploy the project and ensure the SPA rewrite handles frontend routes correctly via `vercel.json`

## Current implementation status

### Working now without additional services

- Vite frontend and React Router pages
- visual dashboard and reports experience
- demo simulation UI
- API layer with demo fallback and PostgreSQL-backed telemetry/contact/report queries
- authenticated, validated sensor ingestion endpoint
- contact submission persistence and rate limiting
- Vercel headers and SPA routing fallback

### Requires real services to become fully connected

- physical sensor devices and an upstream collector that sends readings to the ingestion endpoint
- real AI service or inference layer
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
- `api/_lib/database.js`
- `api/_lib/schema.sql`
- `api/_lib/sensorData.js`
- `api/_lib/demoData.js`

## Final note

This project remains in demo mode until a database is initialized and fresh sensor readings are ingested. Connected risk screening is rule-based; a production AI model is not included.
