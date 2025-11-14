// OpenTelemetry bootstrap for Job_App backend
// This file will attempt to dynamically import OpenTelemetry packages at runtime.
// If the packages are not installed, the script logs a message and continues.

// When running monitoring in Docker Compose alongside the backend, use the `jaeger` service name.
const jaegerEndpoint = process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces';

(async () => {
  try {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { JaegerExporter } = await import('@opentelemetry/exporter-jaeger');

    const jaegerExporter = new JaegerExporter({ endpoint: jaegerEndpoint });

    const sdk = new NodeSDK({
      traceExporter: jaegerExporter,
      instrumentations: [getNodeAutoInstrumentations()]
    });

    try {
      await sdk.start();
      console.log('OTel SDK started (traces ->', jaegerEndpoint, ')');
    } catch (startErr) {
      console.error('Error starting OTel SDK', startErr);
    }
  } catch (err) {
    console.log('OpenTelemetry packages not installed; tracing disabled.');
  }
})();
