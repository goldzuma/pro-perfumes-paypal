import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import logger from './utils/logger.js';

const app = express();

function buildCorsOriginOption(rawValue) {
  const value = (rawValue || '*').trim();
  if (value === '*') {
    // Reflect request origin. This is safer than literal '*' when credentials are enabled.
    return true;
  }

  const allowlist = value
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  return (origin, callback) => {
    if (!origin || allowlist.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  };
}

const corsOriginOption = buildCorsOriginOption(process.env.CORS_ORIGIN);

logger.info('\n--- MIDDLEWARE INITIALIZATION ---');
app.use(helmet());
app.use(cors({
  origin: corsOriginOption,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
logger.info('✓ Middleware loaded');

logger.info('\n--- ROUTE INITIALIZATION ---');
app.use('/', routes());
logger.info('✓ Routes mounted');

logger.info('\n--- ERROR MIDDLEWARE INITIALIZATION ---');
app.use(errorMiddleware);
logger.info('✓ Error middleware loaded');

logger.info('\n--- 404 HANDLER INITIALIZATION ---');
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
logger.info('✓ 404 handler loaded');

export default app;
