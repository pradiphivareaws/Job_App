import './backend-otel.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import savedJobRoutes from './routes/savedJobs.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Mount development helper routes when explicitly enabled
if (process.env.DEV_ALLOW_DEV_ROUTES === 'true') {
  const devRoutes = (await import('./routes/dev.js')).default;
  app.use('/api/dev', devRoutes);
  console.log('Dev routes enabled at /api/dev');
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Try to enable prom-client metrics endpoint if the package is available
(async () => {
  try {
    const promClient = await import('prom-client');
    promClient.collectDefaultMetrics();
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', promClient.register.contentType);
      res.end(await promClient.register.metrics());
    });
    console.log('Prometheus metrics endpoint enabled at /metrics');
  } catch (e) {
    console.log('prom-client not installed; /metrics endpoint disabled');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
