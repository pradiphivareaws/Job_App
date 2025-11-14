Observability for Job_App (root)
================================

This folder contains a minimal, local observability scaffold for traces, metrics and logs.

Structure
- `trace/` - OpenTelemetry bootstrap for backend and trace-related notes
- `metrics/` - Prometheus scrape config
- `logs/` - Promtail config for shipping logs to Loki
- `grafana/` - Grafana dashboard placeholders
- `docker-compose.monitor.yml` - Compose file to run Prometheus, Grafana, Jaeger and Loki locally

Quick start (PowerShell)
1. From the project root run:
```powershell
cd .\Job_App
docker-compose -f .\observability\docker-compose.monitor.yml up -d
```
2. Open UIs:
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090
- Jaeger: http://localhost:16686
- Loki query: http://localhost:3100

3. Instrument backend: require the trace bootstrap early in your backend process:
```js
// in backend/src/server.js (as early as possible)
require('../../observability/trace/backend-otel');
// then start app
```

Notes
- This is for local development and demonstration only. For production use an OpenTelemetry Collector and managed backends.
