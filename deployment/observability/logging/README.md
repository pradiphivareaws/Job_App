Logging & Loki
================

This folder includes a simple Promtail config and instructions for shipping logs to Loki.

Notes:
- Promtail must be configured to read logs on your platform. On Linux reading `/var/log/*` works; on Docker Desktop for Windows you may need to adapt paths or use Docker logging drivers.
- The included `promtail-config.yml` is a starting point. If you run your app in Docker Compose, consider configuring Promtail to scrape Docker container logs or use the Docker logging driver to forward logs to Loki.

Example promtail usage (from this repo):
```powershell
docker-compose -f deployment/observability/docker-compose.monitor.yml up -d promtail loki
```

Then configure Grafana to add Loki as a data source (http://loki:3100).
