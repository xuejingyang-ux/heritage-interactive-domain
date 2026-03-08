import 'dotenv/config';
import express from 'express';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import healthRouter from './routes/health.mjs';
import poetryRouter from './routes/poetry.mjs';
import { requestLogger } from './middleware/requestLogger.mjs';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.mjs';
import { config } from './config.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const distIndex = path.join(distDir, 'index.html');

app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

app.use('/api/health', healthRouter);
app.use('/api/poetry', poetryRouter);

// In production deployment, serve built frontend from this same server.
if (existsSync(distDir) && existsSync(distIndex)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(distIndex);
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
