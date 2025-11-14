// OpenTelemetry bootstrap (Node) - require this as early as possible in your backend entrypoint
// Example usage: require('../../deployment/observability/otel/backend-otel');
// Note: install the following packages in `backend/` first:
// npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-jaeger prom-client

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

// Setup Jaeger exporter that will send traces to the Jaeger agent (collector endpoint)
const jaegerExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces'
});

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
  .then(() => console.log('OpenTelemetry SDK started'))
  .catch((err) => console.error('Error starting OpenTelemetry SDK', err));

// Optional: expose Prometheus metrics via prom-client
try {
  const client = require('prom-client');
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();
  // Expose /metrics in your Express app (example):
  // app.get('/metrics', async (req, res) => { res.set('Content-Type', client.register.contentType); res.end(await client.register.metrics()); });
} catch (e) {
  // prom-client not installed; it's optional
}
