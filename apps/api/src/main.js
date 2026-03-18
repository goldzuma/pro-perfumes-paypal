import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import logger from './utils/logger.js';

const app = express();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
  logger.info('Interrupted');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received');
  await new Promise(resolve => setTimeout(resolve, 3000));
  logger.info('Exiting');
  process.exit();
});

// ============================================================================
// STARTUP DIAGNOSTICS
// ============================================================================
logger.info('\n' + '='.repeat(80));
logger.info('🚀 EXPRESS.JS API SERVER STARTUP');
logger.info('='.repeat(80));
logger.info(`Timestamp: ${new Date().toISOString()}`);
logger.info(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`Process ID: ${process.pid}`);

// ============================================================================
// MIDDLEWARE INITIALIZATION
// ============================================================================
logger.info('\n--- MIDDLEWARE INITIALIZATION ---');

try {
  logger.info('Loading helmet (security headers)...');
  app.use(helmet());
  logger.info('✓ Helmet middleware loaded');
} catch (error) {
  logger.error('❌ Failed to load helmet middleware:', error.message);
  throw error;
}

try {
  logger.info('Loading CORS middleware...');
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
  logger.info(`✓ CORS middleware loaded (origin: ${process.env.CORS_ORIGIN})`);
} catch (error) {
  logger.error('❌ Failed to load CORS middleware:', error.message);
  throw error;
}

try {
  logger.info('Loading morgan (HTTP request logging)...');
  app.use(morgan('combined'));
  logger.info('✓ Morgan middleware loaded');
} catch (error) {
  logger.error('❌ Failed to load morgan middleware:', error.message);
  throw error;
}

try {
  logger.info('Loading express.json() body parser...');
  app.use(express.json());
  logger.info('✓ express.json() middleware loaded');
} catch (error) {
  logger.error('❌ Failed to load express.json() middleware:', error.message);
  throw error;
}

try {
  logger.info('Loading express.urlencoded() body parser...');
  app.use(express.urlencoded({ extended: true }));
  logger.info('✓ express.urlencoded() middleware loaded');
} catch (error) {
  logger.error('❌ Failed to load express.urlencoded() middleware:', error.message);
  throw error;
}

logger.info('✓✓✓ All middleware loaded successfully');

// ============================================================================
// ROUTE INITIALIZATION
// ============================================================================
logger.info('\n--- ROUTE INITIALIZATION ---');

try {
  logger.info('Importing routes from ./routes/index.js...');
  const routerFunction = routes();
  logger.info('✓ Routes function executed successfully');
  logger.info(`✓ Router object type: ${typeof routerFunction}`);
  
  logger.info('Mounting routes at root path \'/\'...');
  app.use('/', routerFunction);
  logger.info('✓ Routes mounted successfully');
} catch (error) {
  logger.error('❌ Failed to initialize routes:', error.message);
  logger.error(`Error stack: ${error.stack}`);
  throw error;
}

// ============================================================================
// ERROR MIDDLEWARE
// ============================================================================
logger.info('\n--- ERROR MIDDLEWARE INITIALIZATION ---');

try {
  logger.info('Loading error middleware...');
  app.use(errorMiddleware);
  logger.info('✓ Error middleware loaded');
} catch (error) {
  logger.error('❌ Failed to load error middleware:', error.message);
  throw error;
}

// ============================================================================
// 404 HANDLER
// ============================================================================
logger.info('\n--- 404 HANDLER INITIALIZATION ---');

try {
  logger.info('Loading 404 handler...');
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  logger.info('✓ 404 handler loaded');
} catch (error) {
  logger.error('❌ Failed to load 404 handler:', error.message);
  throw error;
}

// ============================================================================
// ENVIRONMENT VARIABLES VERIFICATION
// ============================================================================
logger.info('\n--- ENVIRONMENT VARIABLES VERIFICATION ---');

const requiredEnvVars = [
  'PORT',
  'CORS_ORIGIN',
  'API_BASE_URL',
  'PAGSEGURO_ACCESS_TOKEN',
  'PAGSEGURO_PUBLIC_KEY',
  'MERCADO_PAGO_ACCESS_TOKEN',
  'MERCADO_PAGO_PUBLIC_KEY',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'PAYPAL_MODE',
  'STRIPE_SECRET_KEY',
];

let missingVars = [];
for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  if (value) {
    const preview = value.length > 30 ? value.substring(0, 30) + '...' : value;
    logger.info(`✓ ${varName}: ${preview}`);
  } else {
    logger.warn(`⚠️  ${varName}: NOT SET`);
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  logger.warn(`\n⚠️  WARNING: ${missingVars.length} environment variable(s) not set:`);
  missingVars.forEach(v => logger.warn(`   - ${v}`));
} else {
  logger.info('\n✓ All required environment variables are set');
}

// ============================================================================
// REGISTERED ROUTES
// ============================================================================
logger.info('\n--- REGISTERED ROUTES ---');
logger.info('The following routes are available:');
logger.info('  ✓ GET  /health                          (Health check)');
logger.info('  ✓ GET  /paypal/test                     (PayPal test endpoint)');
logger.info('  ✓ POST /paypal/create-payment           (Create PayPal payment)');
logger.info('  ✓ POST /paypal/execute-payment          (Execute PayPal payment)');
logger.info('  ✓ POST /stripe/create-checkout          (Create Stripe checkout)');
logger.info('  ✓ GET  /stripe/session/:sessionId       (Get Stripe session)');
logger.info('  ✓ POST /mercado-pago/create-preference  (Create Mercado Pago preference)');
logger.info('  ✓ GET  /mercado-pago/payment-status/:id (Get Mercado Pago payment status)');
logger.info('  ✓ POST /mercado-pago/webhook            (Mercado Pago webhook)');
logger.info('  ✓ POST /pagseguro/checkout              (Create PagSeguro checkout)');
logger.info('  ✓ POST /pagseguro/webhook               (PagSeguro webhook)');

// ============================================================================
// SERVER STARTUP
// ============================================================================
logger.info('\n--- SERVER STARTUP ---');

const port = process.env.PORT || 3001;

logger.info(`Starting Express.js server on port ${port}...`);

const server = app.listen(port, () => {
  logger.info('\n' + '='.repeat(80));
  logger.info('✓✓✓ SERVER STARTUP SUCCESSFUL');
  logger.info('='.repeat(80));
  logger.info(`🚀 API Server running on http://localhost:${port}`);
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Process ID: ${process.pid}`);
  logger.info('\nServer is ready to accept requests!');
  logger.info('\nTest the server with:');
  logger.info(`  curl http://localhost:${port}/health`);
  logger.info(`  curl http://localhost:${port}/paypal/test`);
  logger.info('\n' + '='.repeat(80) + '\n');
});

// Handle server errors
server.on('error', (error) => {
  logger.error('\n❌ SERVER ERROR');
  logger.error(`Error message: ${error.message}`);
  logger.error(`Error code: ${error.code}`);
  logger.error(`Error stack: ${error.stack}`);
  
  if (error.code === 'EADDRINUSE') {
    logger.error(`\n❌ CRITICAL: Port ${port} is already in use!`);
    logger.error('Please stop the process using this port or use a different PORT.');
  }
  
  process.exit(1);
});

// Handle server close
server.on('close', () => {
  logger.info('Server closed');
});

export default app;
