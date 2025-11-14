// OpenTelemetry bootstrap for Job_App backend
// Install in backend: npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-jaeger prom-client

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const jaegerEndpoint = process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces';

const jaegerExporter = new JaegerExporter({ endpoint: jaegerEndpoint });

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
  .then(() => console.log('OTel SDK started (traces ->', jaegerEndpoint, ')'))
  .catch((err) => console.error('Error starting OTel SDK', err));

// Prometheus metrics helper (optional)
try {
  const client = require('prom-client');
  client.collectDefaultMetrics();
  console.log('prom-client default metrics enabled');
} catch (e) {
  // prom-client not installed
}
