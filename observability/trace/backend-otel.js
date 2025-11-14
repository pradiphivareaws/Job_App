// OpenTelemetry bootstrap for Job_App backend
// Install in backend: npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-jaeger prom-client

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

// When running monitoring in Docker Compose alongside the backend, use the `jaeger` service name.
const jaegerEndpoint = process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces';

const jaegerExporter = new JaegerExporter({ endpoint: jaegerEndpoint });

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

try {
  await sdk.start();
  console.log('OTel SDK started (traces ->', jaegerEndpoint, ')');
} catch (err) {
  console.error('Error starting OTel SDK', err);
}

// Note: prom-client metrics are enabled from the backend app itself (optional). This file focuses on tracing.
