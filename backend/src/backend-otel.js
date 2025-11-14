// Backend-local OpenTelemetry bootstrap (dynamic imports)
// This file is included inside the backend image so containers can optionally enable tracing.

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
