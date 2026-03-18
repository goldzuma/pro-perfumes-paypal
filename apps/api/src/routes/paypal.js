import 'dotenv/config';
import express from 'express';
import paypal from 'paypal-rest-sdk';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// INITIALIZATION & VALIDATION
// ============================================================================

logger.info('\n========== PAYPAL MODULE INITIALIZATION ==========');

const clientId = (process.env.PAYPAL_CLIENT_ID || '').trim();
const clientSecret = (process.env.PAYPAL_CLIENT_SECRET || '').trim();
const paypalMode = (process.env.PAYPAL_MODE || 'sandbox').trim();

logger.info('Loading credentials from .env file...');
logger.info(`✓ PAYPAL_CLIENT_ID loaded: ${!!clientId}`);
if (clientId) {
  logger.info(`  - Length: ${clientId.length} characters`);
  logger.info(`  - Preview: ${clientId.substring(0, 10)}...`);
  logger.info(`  - Trimmed correctly: ${clientId === clientId.trim()}`);
}
logger.info(`✓ PAYPAL_CLIENT_SECRET loaded: ${!!clientSecret}`);
if (clientSecret) {
  logger.info(`  - Length: ${clientSecret.length} characters`);
  logger.info(`  - Preview: ${clientSecret.substring(0, 10)}...`);
  logger.info(`  - Trimmed correctly: ${clientSecret === clientSecret.trim()}`);
}
logger.info(`✓ PAYPAL_MODE loaded: ${paypalMode}`);

if (!clientId) {
  logger.error('❌ CRITICAL: PAYPAL_CLIENT_ID is not set or empty in .env');
  throw new Error('PAYPAL_CLIENT_ID not configured in .env');
}

if (!clientSecret) {
  logger.error('❌ CRITICAL: PAYPAL_CLIENT_SECRET is not set or empty in .env');
  throw new Error('PAYPAL_CLIENT_SECRET not configured in .env');
}

// ============================================================================
// VALIDATE PAYPAL MODE
// ============================================================================
if (paypalMode !== 'live' && paypalMode !== 'sandbox') {
  logger.error(`❌ CRITICAL: PAYPAL_MODE must be 'live' or 'sandbox', got: ${paypalMode}`);
  throw new Error(`Invalid PAYPAL_MODE: ${paypalMode}. Must be 'live' or 'sandbox'.`);
}

if (paypalMode === 'live') {
  logger.warn('\n⚠️  WARNING: PayPal is configured in PRODUCTION MODE (live)');
  logger.warn('   - API calls will use REAL PayPal production environment');
  logger.warn('   - Transactions will be REAL and will charge actual payment methods');
  logger.warn('   - Ensure credentials are valid production credentials');
  logger.warn('   - Ensure all URLs are HTTPS and production-ready');
} else {
  logger.info('\n✓ PayPal is configured in SANDBOX MODE (testing)');
  logger.info('   - API calls will use PayPal sandbox environment');
  logger.info('   - Transactions are simulated and will NOT charge payment methods');
}

logger.info('\nConfiguring PayPal SDK...');
logger.info(`  - Mode: ${paypalMode}`);
logger.info(`  - Client ID: ${clientId.substring(0, 10)}...`);
logger.info(`  - Client Secret: ${clientSecret.substring(0, 10)}...`);

try {
  paypal.configure({
    mode: paypalMode,
    client_id: clientId,
    client_secret: clientSecret,
  });
  logger.info('✓ PayPal SDK configured successfully');
  logger.info(`  - Configuration object created: ${typeof paypal === 'object' && paypal !== null}`);
  logger.info(`  - payment.create method available: ${typeof paypal.payment === 'object' && typeof paypal.payment.create === 'function'}`);
  logger.info(`  - payment.execute method available: ${typeof paypal.payment === 'object' && typeof paypal.payment.execute === 'function'}`);
  logger.info('\n✓✓✓ PayPal module fully initialized successfully');
  logger.info('========== INITIALIZATION COMPLETE ==========\n');
} catch (error) {
  logger.error('\n❌ CRITICAL: Failed to configure PayPal SDK');
  logger.error(`Error message: ${error.message}`);
  logger.error(`Error stack: ${error.stack}`);
  throw new Error(`PayPal SDK configuration failed: ${error.message}`);
}

// ============================================================================
// HELPER: Create timeout promise
// ============================================================================
function createTimeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`PayPal API call timeout after ${ms}ms`));
    }, ms);
  });
}

// ============================================================================
// HELPER: Validate URL format
// ============================================================================
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// HELPER: Format error response with context
// ============================================================================
function formatPayPalError(error) {
  const errorDetails = {
    message: error.message || 'Unknown error',
    name: error.name || 'Error',
    code: error.code || null,
    status: error.status || null,
    statusCode: error.statusCode || null,
  };

  if (error.response && error.response.data) {
    errorDetails.responseData = error.response.data;
  }

  return errorDetails;
}

// ============================================================================
// GET /paypal/debug
// Debug endpoint to verify PayPal configuration and credentials
// ============================================================================

router.get('/debug', async (req, res) => {
  logger.info('\n========== PAYPAL DEBUG ENDPOINT ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);

  const debugInfo = {
    status: 'ok',
    message: 'PayPal configuration debug information',
    timestamp: new Date().toISOString(),
    environment: {
      paypalMode: paypalMode,
      nodeEnv: process.env.NODE_ENV || 'development',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    },
    credentials: {
      clientIdLoaded: !!process.env.PAYPAL_CLIENT_ID,
      clientIdLength: (process.env.PAYPAL_CLIENT_ID || '').length,
      clientIdPreview: (process.env.PAYPAL_CLIENT_ID || '').substring(0, 10) + '...',
      clientSecretLoaded: !!process.env.PAYPAL_CLIENT_SECRET,
      clientSecretLength: (process.env.PAYPAL_CLIENT_SECRET || '').length,
      clientSecretPreview: (process.env.PAYPAL_CLIENT_SECRET || '').substring(0, 10) + '...',
      modeLoaded: !!process.env.PAYPAL_MODE,
      modeValue: process.env.PAYPAL_MODE || 'not set',
    },
    sdkStatus: {
      paypalObjectExists: typeof paypal === 'object' && paypal !== null,
      paymentModuleExists: typeof paypal.payment === 'object' && paypal.payment !== null,
      createMethodExists: typeof paypal.payment === 'object' && typeof paypal.payment.create === 'function',
      executeMethodExists: typeof paypal.payment === 'object' && typeof paypal.payment.execute === 'function',
    },
    validation: {
      credentialsValid: !!clientId && !!clientSecret,
      modeValid: paypalMode === 'live' || paypalMode === 'sandbox',
      sdkInitialized: typeof paypal === 'object' && paypal !== null,
      readyForPayments: !!clientId && !!clientSecret && (paypalMode === 'live' || paypalMode === 'sandbox') && typeof paypal === 'object',
    },
    endpoints: {
      testEndpoint: 'GET /paypal/test',
      createPaymentEndpoint: 'POST /paypal/create-payment',
      executePaymentEndpoint: 'POST /paypal/execute-payment',
      debugEndpoint: 'GET /paypal/debug',
    },
  };

  logger.info(`Debug info: ${JSON.stringify(debugInfo, null, 2)}`);
  logger.info('\n✓✓✓ DEBUG ENDPOINT COMPLETED');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(debugInfo);
});

// ============================================================================
// GET /paypal/test
// Test endpoint to verify PayPal credentials and authentication
// ============================================================================

router.get('/test', async (req, res) => {
  logger.info('\n========== PAYPAL TEST ENDPOINT ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`PayPal Mode: ${paypalMode}`);

  // ========== VERIFY CREDENTIALS ARE LOADED ==========
  logger.info('\n--- STEP 1: VERIFY CREDENTIALS ARE LOADED ---');
  logger.info(`PAYPAL_CLIENT_ID exists: ${!!process.env.PAYPAL_CLIENT_ID}`);
  logger.info(`PAYPAL_CLIENT_ID length: ${(process.env.PAYPAL_CLIENT_ID || '').length}`);
  logger.info(`PAYPAL_CLIENT_ID preview: ${(process.env.PAYPAL_CLIENT_ID || '').substring(0, 10)}...`);
  logger.info(`PAYPAL_CLIENT_SECRET exists: ${!!process.env.PAYPAL_CLIENT_SECRET}`);
  logger.info(`PAYPAL_CLIENT_SECRET length: ${(process.env.PAYPAL_CLIENT_SECRET || '').length}`);
  logger.info(`PAYPAL_CLIENT_SECRET preview: ${(process.env.PAYPAL_CLIENT_SECRET || '').substring(0, 10)}...`);
  logger.info(`PAYPAL_MODE: ${process.env.PAYPAL_MODE}`);

  // ========== VERIFY SDK INITIALIZATION ==========
  logger.info('\n--- STEP 2: VERIFY SDK INITIALIZATION ---');
  logger.info(`paypal object exists: ${typeof paypal === 'object' && paypal !== null}`);
  logger.info(`paypal.payment exists: ${typeof paypal.payment === 'object' && paypal.payment !== null}`);
  logger.info(`paypal.payment.create is function: ${typeof paypal.payment === 'object' && typeof paypal.payment.create === 'function'}`);

  // ========== TEST AUTHENTICATION ==========
  logger.info('\n--- STEP 3: TEST AUTHENTICATION ---');
  logger.info('Attempting to authenticate with PayPal...');

  const testPaymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'https://example.com/return',
      cancel_url: 'https://example.com/cancel',
    },
    transactions: [
      {
        amount: {
          total: '0.01',
          currency: 'BRL',
          details: {
            subtotal: '0.01',
            tax: '0',
          },
        },
        description: 'Test Transaction',
      },
    ],
  };

  logger.info(`Test payment data: ${JSON.stringify(testPaymentData, null, 2)}`);

  let testResult = {
    authenticated: false,
    error: null,
    details: {},
  };

  const testPromise = new Promise((resolve) => {
    logger.info('Calling paypal.payment.create() for authentication test...');
    paypal.payment.create(testPaymentData, (error, payment) => {
      logger.info('PayPal callback invoked');
      if (error) {
        logger.error('\n❌ AUTHENTICATION TEST FAILED');
        logger.error(`Error message: ${error.message}`);
        logger.error(`Error name: ${error.name}`);
        logger.error(`Error code: ${error.code}`);
        logger.error(`Error status: ${error.status}`);
        logger.error(`Error statusCode: ${error.statusCode}`);
        logger.error(`Full error object: ${JSON.stringify(error, null, 2)}`);

        if (error.response) {
          logger.error(`\nError response details:`);
          logger.error(`  - Status: ${error.response.status}`);
          logger.error(`  - Status text: ${error.response.statusText}`);
          logger.error(`  - Data: ${JSON.stringify(error.response.data)}`);
        }

        testResult.authenticated = false;
        testResult.error = error.message || 'Unknown error';
        testResult.details = formatPayPalError(error);
      } else {
        logger.info('✓ AUTHENTICATION TEST SUCCESSFUL');
        logger.info(`Payment created: ${payment.id}`);
        testResult.authenticated = true;
        testResult.details = {
          paymentId: payment.id,
          state: payment.state,
        };
      }
      resolve();
    });
  });

  // Race between test and timeout
  try {
    await Promise.race([testPromise, createTimeoutPromise(10000)]);
  } catch (timeoutError) {
    logger.error(`❌ Test timeout: ${timeoutError.message}`);
    testResult.authenticated = false;
    testResult.error = timeoutError.message;
  }

  logger.info('\n--- STEP 4: BUILD TEST RESPONSE ---');
  const responseData = {
    status: 'ok',
    message: 'PayPal test endpoint',
    timestamp: new Date().toISOString(),
    paypalMode: paypalMode,
    credentialsLoaded: {
      clientId: !!process.env.PAYPAL_CLIENT_ID,
      clientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
    },
    sdkInitialized: {
      paypalObject: typeof paypal === 'object' && paypal !== null,
      paymentModule: typeof paypal.payment === 'object' && paypal.payment !== null,
      createMethod: typeof paypal.payment === 'object' && typeof paypal.payment.create === 'function',
    },
    authentication: testResult,
  };

  logger.info(`Test response: ${JSON.stringify(responseData, null, 2)}`);
  logger.info('\n✓✓✓ TEST ENDPOINT COMPLETED');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

// ============================================================================
// POST /paypal/create-payment
// Creates a PayPal payment and returns approval URL
// Request body: { amount, description, returnUrl, cancelUrl, items }
// Response: { success: true, approvalUrl: string, paymentId: string }
// ============================================================================

router.post('/create-payment', async (req, res) => {
  logger.info('\n========== CREATE PAYMENT REQUEST ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Request method: ${req.method}`);
  logger.info(`Request path: ${req.path}`);
  logger.info(`PayPal Mode: ${paypalMode}`);
  logger.info(`Client IP: ${req.ip}`);
  logger.info(`User Agent: ${req.get('user-agent')}`);

  // ========== LOG INCOMING REQUEST ==========
  logger.info('\n--- STEP 1: LOG INCOMING REQUEST BODY ---');
  logger.info(`Raw request body: ${JSON.stringify(req.body, null, 2)}`);
  logger.info(`Request headers: ${JSON.stringify(req.headers, null, 2)}`);

  const { amount, description, returnUrl, cancelUrl, items } = req.body;

  logger.info('Extracted parameters:');
  logger.info(`  - amount: ${amount} (type: ${typeof amount})`);
  logger.info(`  - description: ${description} (type: ${typeof description})`);
  logger.info(`  - returnUrl: ${returnUrl} (type: ${typeof returnUrl})`);
  logger.info(`  - cancelUrl: ${cancelUrl} (type: ${typeof cancelUrl})`);
  logger.info(`  - items: ${JSON.stringify(items)} (type: ${typeof items})`);

  // ========== VALIDATE SDK INITIALIZATION ==========
  logger.info('\n--- STEP 2: VALIDATE SDK INITIALIZATION ---');
  logger.info('Checking if PayPal SDK is properly initialized...');
  logger.info(`  - paypal object exists: ${typeof paypal === 'object' && paypal !== null}`);
  logger.info(`  - paypal.payment exists: ${typeof paypal.payment === 'object' && paypal.payment !== null}`);
  logger.info(`  - paypal.payment.create is function: ${typeof paypal.payment === 'object' && typeof paypal.payment.create === 'function'}`);

  if (!paypal || typeof paypal !== 'object') {
    logger.error('❌ PayPal SDK is not initialized');
    throw new Error('PayPal SDK not initialized');
  }

  if (!paypal.payment || typeof paypal.payment !== 'object') {
    logger.error('❌ PayPal payment module is not initialized');
    throw new Error('PayPal payment module not initialized');
  }

  if (typeof paypal.payment.create !== 'function') {
    logger.error('❌ PayPal payment.create method is not available');
    throw new Error('PayPal payment.create method not available');
  }

  logger.info('✓ SDK initialization validation passed');

  // ========== VALIDATE CREDENTIALS ==========
  logger.info('\n--- STEP 3: VALIDATE CREDENTIALS ---');
  logger.info(`Checking if CLIENT_ID is loaded from .env...`);
  logger.info(`  - process.env.PAYPAL_CLIENT_ID exists: ${!!process.env.PAYPAL_CLIENT_ID}`);
  logger.info(`  - process.env.PAYPAL_CLIENT_ID length: ${(process.env.PAYPAL_CLIENT_ID || '').length}`);
  logger.info(`  - process.env.PAYPAL_CLIENT_ID preview: ${(process.env.PAYPAL_CLIENT_ID || '').substring(0, 10)}...`);
  logger.info(`  - process.env.PAYPAL_MODE: ${process.env.PAYPAL_MODE}`);

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_ID.trim()) {
    logger.error('❌ PAYPAL_CLIENT_ID is undefined or empty');
    throw new Error('Erro de autenticação PayPal - verifique credenciais (CLIENT_ID ausente)');
  }
  logger.info('✓ CLIENT_ID validation passed');

  // ========== VALIDATE REQUEST DATA ==========
  logger.info('\n--- STEP 4: VALIDATE REQUEST DATA ---');

  // Validate amount
  logger.info('Validating amount parameter...');
  if (amount === undefined || amount === null) {
    logger.warn(`❌ Validation failed: amount is undefined or null`);
    return res.status(400).json({
      error: 'Erro de validação - amount é obrigatório',
      details: 'O campo amount deve ser fornecido no corpo da requisição',
      received: { amount },
    });
  }

  if (typeof amount !== 'number') {
    logger.warn(`❌ Validation failed: amount is not a number, received type: ${typeof amount}`);
    return res.status(400).json({
      error: 'Erro de validação - amount deve ser um número',
      details: `Tipo recebido: ${typeof amount}. Esperado: number`,
      received: { amount, type: typeof amount },
    });
  }

  if (amount <= 0) {
    logger.warn(`❌ Validation failed: amount must be positive, received: ${amount}`);
    return res.status(400).json({
      error: 'Erro de validação - amount deve ser maior que zero',
      details: `Valor recebido: ${amount}. Deve ser > 0`,
      received: { amount },
    });
  }

  if (amount > 999999) {
    logger.warn(`❌ Validation failed: amount exceeds maximum, received: ${amount}`);
    return res.status(400).json({
      error: 'Erro de validação - amount excede o valor máximo permitido',
      details: `Valor recebido: ${amount}. Máximo: 999999`,
      received: { amount },
    });
  }

  logger.info(`✓ Amount validation passed: ${amount}`);

  // Validate description
  logger.info('Validating description parameter...');
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    logger.warn(`❌ Validation failed: invalid description`);
    return res.status(400).json({
      error: 'Erro de validação - description é obrigatório',
      details: 'O campo description deve ser uma string não-vazia',
      received: { description },
    });
  }
  logger.info(`✓ Description validation passed: ${description}`);

  // Validate return URL
  logger.info('Validating returnUrl parameter...');
  if (returnUrl === undefined || returnUrl === null) {
    logger.warn(`❌ Validation failed: returnUrl is undefined or null`);
    return res.status(400).json({
      error: 'Erro de validação - returnUrl é obrigatório',
      details: 'O campo returnUrl deve ser fornecido no corpo da requisição',
      received: { returnUrl },
    });
  }

  if (typeof returnUrl !== 'string') {
    logger.warn(`❌ Validation failed: returnUrl is not a string, received type: ${typeof returnUrl}`);
    return res.status(400).json({
      error: 'Erro de validação - returnUrl deve ser uma string',
      details: `Tipo recebido: ${typeof returnUrl}. Esperado: string`,
      received: { returnUrl, type: typeof returnUrl },
    });
  }

  if (returnUrl.trim().length === 0) {
    logger.warn(`❌ Validation failed: returnUrl is empty`);
    return res.status(400).json({
      error: 'Erro de validação - returnUrl não pode estar vazio',
      details: 'Forneça uma URL válida',
      received: { returnUrl },
    });
  }

  if (!isValidUrl(returnUrl)) {
    logger.warn(`❌ Validation failed: returnUrl is not a valid URL: ${returnUrl}`);
    return res.status(400).json({
      error: 'Erro de validação - returnUrl deve ser uma URL válida',
      details: `URL recebida: ${returnUrl}. Deve ser uma URL válida (ex: https://example.com/return)`,
      received: { returnUrl },
    });
  }

  if (!returnUrl.startsWith('https://')) {
    logger.warn(`⚠️  WARNING: returnUrl is not HTTPS: ${returnUrl}`);
  }

  logger.info(`✓ Return URL validation passed: ${returnUrl}`);

  // Validate cancel URL
  logger.info('Validating cancelUrl parameter...');
  if (cancelUrl === undefined || cancelUrl === null) {
    logger.warn(`❌ Validation failed: cancelUrl is undefined or null`);
    return res.status(400).json({
      error: 'Erro de validação - cancelUrl é obrigatório',
      details: 'O campo cancelUrl deve ser fornecido no corpo da requisição',
      received: { cancelUrl },
    });
  }

  if (typeof cancelUrl !== 'string') {
    logger.warn(`❌ Validation failed: cancelUrl is not a string, received type: ${typeof cancelUrl}`);
    return res.status(400).json({
      error: 'Erro de validação - cancelUrl deve ser uma string',
      details: `Tipo recebido: ${typeof cancelUrl}. Esperado: string`,
      received: { cancelUrl, type: typeof cancelUrl },
    });
  }

  if (cancelUrl.trim().length === 0) {
    logger.warn(`❌ Validation failed: cancelUrl is empty`);
    return res.status(400).json({
      error: 'Erro de validação - cancelUrl não pode estar vazio',
      details: 'Forneça uma URL válida',
      received: { cancelUrl },
    });
  }

  if (!isValidUrl(cancelUrl)) {
    logger.warn(`❌ Validation failed: cancelUrl is not a valid URL: ${cancelUrl}`);
    return res.status(400).json({
      error: 'Erro de validação - cancelUrl deve ser uma URL válida',
      details: `URL recebida: ${cancelUrl}. Deve ser uma URL válida (ex: https://example.com/cancel)`,
      received: { cancelUrl },
    });
  }

  if (!cancelUrl.startsWith('https://')) {
    logger.warn(`⚠️  WARNING: cancelUrl is not HTTPS: ${cancelUrl}`);
  }

  logger.info(`✓ Cancel URL validation passed: ${cancelUrl}`);
  logger.info('✓✓✓ All request data validations passed');

  // ========== BUILD PAYPAL PAYMENT OBJECT (REST API v1 COMPLIANT) ==========
  logger.info('\n--- STEP 5: BUILD PAYPAL PAYMENT OBJECT (REST API v1) ---');
  logger.info('Building payment object according to PayPal REST API v1 specification...');

  // Build item list if items provided
  let itemList = null;
  if (items && Array.isArray(items) && items.length > 0) {
    logger.info(`Processing ${items.length} item(s)...`);
    itemList = {
      items: items.map((item, index) => {
        logger.info(`  Item ${index + 1}: ${item.name} x${item.quantity} @ ${item.price}`);
        return {
          name: item.name || 'Item',
          sku: item.sku || `item-${index + 1}`,
          price: item.price.toString(),
          quantity: item.quantity,
          currency: 'BRL',
        };
      }),
    };
    logger.info(`Item list built: ${JSON.stringify(itemList, null, 2)}`);
  } else {
    logger.info('No items provided, using simple transaction');
  }

  // Build the payment object according to PayPal REST API v1 spec
  const paypalPaymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
    transactions: [
      {
        amount: {
          total: amount.toFixed(2),
          currency: 'BRL',
          details: {
            subtotal: amount.toFixed(2),
            tax: '0.00',
            shipping: '0.00',
          },
        },
        description: description,
        ...(itemList && { item_list: itemList }),
      },
    ],
  };

  logger.info('\nPayPal payment object structure (REST API v1):');
  logger.info(`  - Intent: ${paypalPaymentData.intent}`);
  logger.info(`  - Payer method: ${paypalPaymentData.payer.payment_method}`);
  logger.info(`  - Return URL: ${paypalPaymentData.redirect_urls.return_url}`);
  logger.info(`  - Cancel URL: ${paypalPaymentData.redirect_urls.cancel_url}`);
  logger.info(`  - Total amount: ${paypalPaymentData.transactions[0].amount.total}`);
  logger.info(`  - Currency: ${paypalPaymentData.transactions[0].amount.currency}`);
  logger.info(`  - Description: ${paypalPaymentData.transactions[0].description}`);
  logger.info(`  - Has item_list: ${!!paypalPaymentData.transactions[0].item_list}`);
  logger.info(`\nFull payment object being sent to PayPal API:`);
  logger.info(`${JSON.stringify(paypalPaymentData, null, 2)}`);

  // ========== CALL PAYPAL API WITH TIMEOUT ==========
  logger.info('\n--- STEP 6: CALL PAYPAL API WITH TIMEOUT ---');
  logger.info(`Using client ID: ${process.env.PAYPAL_CLIENT_ID.substring(0, 10)}...`);
  logger.info(`Client ID length: ${process.env.PAYPAL_CLIENT_ID.length}`);
  logger.info(`Using mode: ${process.env.PAYPAL_MODE}`);
  if (paypalMode === 'live') {
    logger.warn('⚠️  PRODUCTION MODE: Calling PayPal LIVE API (api.paypal.com)');
  } else {
    logger.info('Calling PayPal SANDBOX API (sandbox.paypal.com)');
  }
  logger.info('Calling paypal.payment.create() method with 10s timeout...');

  let paypalPayment;
  const paypalPromise = new Promise((resolve, reject) => {
    logger.info('PayPal promise created, calling payment.create()...');
    logger.info(`Sending to PayPal: ${JSON.stringify(paypalPaymentData)}`);

    paypal.payment.create(paypalPaymentData, (error, payment) => {
      logger.info('PayPal callback invoked');
      logger.info(`Callback error: ${error ? 'YES' : 'NO'}`);
      logger.info(`Callback payment: ${payment ? 'YES' : 'NO'}`);

      if (error) {
        logger.error('\n❌ PAYPAL API CALLBACK ERROR');
        logger.error(`Error message: ${error.message}`);
        logger.error(`Error name: ${error.name}`);
        logger.error(`Error code: ${error.code}`);
        logger.error(`Error status: ${error.status}`);
        logger.error(`Error statusCode: ${error.statusCode}`);
        logger.error(`Full error object: ${JSON.stringify(error, null, 2)}`);

        // Log error response details if available
        if (error.response) {
          logger.error(`\nError response details:`);
          logger.error(`  - Status: ${error.response.status}`);
          logger.error(`  - Status text: ${error.response.statusText}`);
          logger.error(`  - Headers: ${JSON.stringify(error.response.headers)}`);
          logger.error(`  - Data: ${JSON.stringify(error.response.data)}`);
          logger.error(`  - Full response: ${JSON.stringify(error.response, null, 2)}`);
        }

        // Log error request details if available
        if (error.request) {
          logger.error(`\nError request details:`);
          logger.error(`  - Method: ${error.request.method}`);
          logger.error(`  - URL: ${error.request.url}`);
          logger.error(`  - Headers: ${JSON.stringify(error.request.headers)}`);
        }

        logger.error(`\nError stack trace: ${error.stack}`);
        reject(error);
      } else {
        logger.info('✓ PayPal API callback successful');
        logger.info(`Payment object received: ${JSON.stringify(payment, null, 2)}`);
        resolve(payment);
      }
    });
  });

  // Race between PayPal API call and timeout
  try {
    logger.info('Starting race between PayPal API call and 10s timeout...');
    paypalPayment = await Promise.race([paypalPromise, createTimeoutPromise(10000)]);
    logger.info('✓ PayPal API call completed within timeout');
  } catch (error) {
    logger.error(`\n❌ PayPal API call failed: ${error.message}`);
    logger.error(`Error details: ${JSON.stringify(error, null, 2)}`);

    // Extract specific PayPal error details
    let paypalErrorMessage = 'Erro ao criar pedido do PayPal';
    let paypalErrorDetails = null;

    if (error.message && error.message.includes('timeout')) {
      paypalErrorMessage = 'Erro PayPal: Timeout na requisição (servidor PayPal não respondeu em 10 segundos)';
    } else if (error.response && error.response.data) {
      // PayPal API error response
      const apiError = error.response.data;
      logger.error(`PayPal API error response: ${JSON.stringify(apiError, null, 2)}`);

      if (apiError.name === 'AUTHENTICATION_FAILURE') {
        paypalErrorMessage = 'Erro de autenticação PayPal - Credenciais inválidas ou expiradas';
        paypalErrorDetails = apiError.details;
      } else if (apiError.name === 'INVALID_ACCOUNT') {
        paypalErrorMessage = 'Erro PayPal: Conta inválida ou não autorizada';
        paypalErrorDetails = apiError.details;
      } else if (apiError.message) {
        paypalErrorMessage = `Erro PayPal: ${apiError.message}`;
        paypalErrorDetails = apiError.details;
      } else if (apiError.error_description) {
        paypalErrorMessage = `Erro PayPal: ${apiError.error_description}`;
      }
    } else if (error.message) {
      paypalErrorMessage = `Erro PayPal: ${error.message}`;
    }

    const errorContext = formatPayPalError(error);
    logger.error(`Error context: ${JSON.stringify(errorContext, null, 2)}`);

    throw new Error(`${paypalErrorMessage}${paypalErrorDetails ? ` - Detalhes: ${JSON.stringify(paypalErrorDetails)}` : ''}`);
  }

  // ========== VALIDATE RESPONSE ==========
  logger.info('\n--- STEP 7: VALIDATE PAYPAL RESPONSE ---');
  logger.info(`Response type: ${typeof paypalPayment}`);
  logger.info(`Response keys: ${Object.keys(paypalPayment || {}).join(', ')}`);
  logger.info(`Full response object: ${JSON.stringify(paypalPayment, null, 2)}`);

  if (!paypalPayment) {
    logger.error('❌ PayPal response is null or undefined');
    throw new Error('Erro PayPal: Resposta vazia do servidor');
  }

  const paymentId = paypalPayment.id;
  const paymentState = paypalPayment.state;
  const links = paypalPayment.links || [];

  logger.info(`\nExtracted from response:`);
  logger.info(`  - Payment ID: ${paymentId}`);
  logger.info(`  - Payment State: ${paymentState}`);
  logger.info(`  - Links count: ${links.length}`);
  logger.info(`  - Links: ${JSON.stringify(links)}`);

  if (!paymentId) {
    logger.error('❌ PayPal response missing payment ID');
    logger.error(`Full response: ${JSON.stringify(paypalPayment)}`);
    throw new Error('Erro PayPal: Resposta inválida (ID ausente)');
  }

  if (!links || links.length === 0) {
    logger.error('❌ PayPal response missing links');
    logger.error(`Full response: ${JSON.stringify(paypalPayment)}`);
    throw new Error('Erro PayPal: Resposta inválida (links ausentes)');
  }

  // Find approval URL
  const approvalLink = links.find(link => link.rel === 'approval_url');
  if (!approvalLink || !approvalLink.href) {
    logger.error('❌ PayPal response missing approval_url link');
    logger.error(`Links: ${JSON.stringify(links)}`);
    throw new Error('Erro PayPal: URL de aprovação não encontrada na resposta');
  }

  const approvalUrl = approvalLink.href;
  logger.info(`✓ Approval URL extracted: ${approvalUrl}`);
  logger.info('✓ Response validation passed');

  // ========== BUILD RESPONSE ==========
  logger.info('\n--- STEP 8: BUILD RESPONSE ---');
  const responseData = {
    success: true,
    approvalUrl: approvalUrl,
    paymentId: paymentId,
  };

  logger.info(`Response structure:`);
  logger.info(`  - success: ${responseData.success}`);
  logger.info(`  - approvalUrl: ${responseData.approvalUrl}`);
  logger.info(`  - paymentId: ${responseData.paymentId}`);
  logger.info(`  - Response is OBJECT (not array): ${typeof responseData === 'object' && !Array.isArray(responseData)}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n✓✓✓ CREATE PAYMENT REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

// ============================================================================
// POST /paypal/execute-payment
// Executes a PayPal payment (captures the order)
// Request body: { paymentId, payerId }
// Response: { success: true, status: string, transactionId: string, amount: string }
// ============================================================================

router.post('/execute-payment', async (req, res) => {
  logger.info('\n========== EXECUTE PAYMENT REQUEST ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Request method: ${req.method}`);
  logger.info(`Request path: ${req.path}`);
  logger.info(`PayPal Mode: ${paypalMode}`);

  // ========== LOG INCOMING REQUEST ==========
  logger.info('\n--- STEP 1: LOG INCOMING REQUEST BODY ---');
  logger.info(`Raw request body: ${JSON.stringify(req.body, null, 2)}`);

  const { paymentId, payerId } = req.body;

  logger.info('Extracted parameters:');
  logger.info(`  - paymentId: ${paymentId}`);
  logger.info(`  - payerId: ${payerId}`);

  // ========== VALIDATE REQUEST DATA ==========
  logger.info('\n--- STEP 2: VALIDATE REQUEST DATA ---');

  if (!paymentId || typeof paymentId !== 'string') {
    logger.warn(`❌ Validation failed: invalid payment ID: ${paymentId}`);
    return res.status(400).json({
      error: 'Erro de validação - paymentId é obrigatório',
      received: { paymentId },
    });
  }
  logger.info(`✓ Payment ID validation passed: ${paymentId}`);

  if (!payerId || typeof payerId !== 'string') {
    logger.warn(`❌ Validation failed: invalid payer ID: ${payerId}`);
    return res.status(400).json({
      error: 'Erro de validação - payerId é obrigatório',
      received: { payerId },
    });
  }
  logger.info(`✓ Payer ID validation passed: ${payerId}`);

  logger.info('✓✓✓ All request data validations passed');

  // ========== CALL PAYPAL API TO EXECUTE PAYMENT WITH TIMEOUT ==========
  logger.info('\n--- STEP 3: CALL PAYPAL API TO EXECUTE PAYMENT ---');
  logger.info(`Using payment ID: ${paymentId}`);
  logger.info(`Using payer ID: ${payerId}`);
  if (paypalMode === 'live') {
    logger.warn('⚠️  PRODUCTION MODE: Calling PayPal LIVE API (api.paypal.com)');
  } else {
    logger.info('Calling PayPal SANDBOX API (sandbox.paypal.com)');
  }
  logger.info('Calling paypal.payment.execute() method with 10s timeout...');

  let executedPayment;
  const paypalPromise = new Promise((resolve, reject) => {
    logger.info('PayPal promise created, calling payment.execute()...');
    paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
      logger.info('PayPal callback invoked');
      if (error) {
        logger.error('\n❌ PAYPAL API CALLBACK ERROR');
        logger.error(`Error message: ${error.message}`);
        logger.error(`Error name: ${error.name}`);
        logger.error(`Full error object: ${JSON.stringify(error, null, 2)}`);

        if (error.response) {
          logger.error(`\nError response details:`);
          logger.error(`  - Status: ${error.response.status}`);
          logger.error(`  - Data: ${JSON.stringify(error.response.data)}`);
        }

        reject(error);
      } else {
        logger.info('✓ PayPal API callback successful');
        logger.info(`Payment object received: ${JSON.stringify(payment, null, 2)}`);
        resolve(payment);
      }
    });
  });

  // Race between PayPal API call and timeout
  try {
    executedPayment = await Promise.race([paypalPromise, createTimeoutPromise(10000)]);
  } catch (error) {
    logger.error(`\n❌ PayPal API call failed: ${error.message}`);
    logger.error(`Error details: ${JSON.stringify(error, null, 2)}`);

    let paypalErrorMessage = 'Erro ao executar pagamento do PayPal';

    if (error.message && error.message.includes('timeout')) {
      paypalErrorMessage = 'Erro PayPal: Timeout na requisição (servidor PayPal não respondeu em 10 segundos)';
    } else if (error.response && error.response.data) {
      const apiError = error.response.data;
      if (apiError.message) {
        paypalErrorMessage = `Erro PayPal: ${apiError.message}`;
      } else if (apiError.error_description) {
        paypalErrorMessage = `Erro PayPal: ${apiError.error_description}`;
      }
    } else if (error.message) {
      paypalErrorMessage = `Erro PayPal: ${error.message}`;
    }

    const errorContext = formatPayPalError(error);
    throw new Error(`${paypalErrorMessage} - Response: ${JSON.stringify(errorContext)}`);
  }

  // ========== VALIDATE RESPONSE ==========
  logger.info('\n--- STEP 4: VALIDATE PAYPAL RESPONSE ---');
  logger.info(`Response type: ${typeof executedPayment}`);
  logger.info(`Response keys: ${Object.keys(executedPayment || {}).join(', ')}`);
  logger.info(`Full response object: ${JSON.stringify(executedPayment, null, 2)}`);

  if (!executedPayment) {
    logger.error('❌ PayPal response is null or undefined');
    throw new Error('Erro PayPal: Resposta vazia do servidor');
  }

  const paymentIdResponse = executedPayment.id;
  const paymentState = executedPayment.state;
  const transactions = executedPayment.transactions || [];
  const totalAmount = transactions.length > 0 ? transactions[0].amount.total : '0';
  const relatedResources = transactions.length > 0 ? transactions[0].related_resources || [] : [];
  const sale = relatedResources.length > 0 ? relatedResources[0].sale : null;
  const transactionId = sale ? sale.id : paymentIdResponse;

  logger.info(`\nExtracted from response:`);
  logger.info(`  - Payment ID: ${paymentIdResponse}`);
  logger.info(`  - Payment State: ${paymentState}`);
  logger.info(`  - Total Amount: ${totalAmount}`);
  logger.info(`  - Transactions: ${transactions.length}`);
  logger.info(`  - Transaction ID: ${transactionId}`);

  if (!paymentIdResponse) {
    logger.error('❌ PayPal response missing payment ID');
    logger.error(`Full response: ${JSON.stringify(executedPayment)}`);
    throw new Error('Erro PayPal: Resposta inválida (ID ausente)');
  }

  logger.info('✓ Response validation passed');

  // ========== BUILD RESPONSE ==========
  logger.info('\n--- STEP 5: BUILD RESPONSE ---');
  const responseData = {
    success: true,
    status: paymentState,
    transactionId: transactionId,
    amount: totalAmount,
  };

  logger.info(`Response structure:`);
  logger.info(`  - success: ${responseData.success}`);
  logger.info(`  - status: ${responseData.status}`);
  logger.info(`  - transactionId: ${responseData.transactionId}`);
  logger.info(`  - amount: ${responseData.amount}`);
  logger.info(`  - Response is OBJECT (not array): ${typeof responseData === 'object' && !Array.isArray(responseData)}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n--- STEP 6: SEND RESPONSE TO CLIENT ---');
  logger.info('Calling res.json() with response data...');
  res.json(responseData);
  logger.info('✓ res.json() called successfully');

  logger.info('\n✓✓✓ EXECUTE PAYMENT REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');
});

// ============================================================================
// POST /paypal/verify-capture (Orders v2 – for Smart Payment Buttons flow)
// Client creates order and captures in browser; this endpoint verifies with PayPal and records.
// Request body: { orderId, captureId?, amount, currency }
// ============================================================================

const PP_BASE_SANDBOX = 'https://api-m.sandbox.paypal.com';
const PP_BASE_LIVE = 'https://api-m.paypal.com';

async function getPayPalAccessToken() {
  const base = paypalMode === 'live' ? PP_BASE_LIVE : PP_BASE_SANDBOX;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal OAuth failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getPayPalOrder(accessToken, orderId) {
  const base = paypalMode === 'live' ? PP_BASE_LIVE : PP_BASE_SANDBOX;
  const res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal get order failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function requestPayPalJson(path, { method = 'GET', accessToken, body } = {}) {
  const base = paypalMode === 'live' ? PP_BASE_LIVE : PP_BASE_SANDBOX;
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data?.message ||
      data?.error_description ||
      data?.name ||
      `PayPal request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// ============================================================================
// POST /paypal/create-order (Orders v2)
// Request body: { amount, currency, description }
// Response: PayPal order payload including { id, status }
// ============================================================================
router.post('/create-order', async (req, res) => {
  const {
    amount,
    currency = 'BRL',
    description = 'Pedido Velour Perfumes',
    returnUrl,
    cancelUrl,
  } = req.body || {};
  const normalizedAmount = Number(amount);

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    return res.status(400).json({ error: 'amount deve ser um número maior que zero' });
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          description,
          amount: {
            currency_code: currency,
            value: normalizedAmount.toFixed(2),
          },
        },
      ],
    };

    if (typeof returnUrl === 'string' && typeof cancelUrl === 'string') {
      orderBody.payment_source = {
        paypal: {
          experience_context: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
            user_action: 'PAY_NOW',
          },
        },
      };
    }

    const order = await requestPayPalJson('/v2/checkout/orders', {
      method: 'POST',
      accessToken,
      body: orderBody,
    });
    const links = Array.isArray(order?.links) ? order.links : [];
    const approvalUrlFromLinks =
      links.find((l) => l?.rel === 'approve')?.href
      || links.find((l) => l?.rel === 'payer-action')?.href
      || links.find((l) => l?.rel === 'approval_url')?.href;
    const fallbackApprovalUrl = order?.id
      ? `${paypalMode === 'live' ? 'https://www.paypal.com' : 'https://www.sandbox.paypal.com'}/checkoutnow?token=${order.id}`
      : null;

    res.json({
      ...order,
      approvalUrl: approvalUrlFromLinks || fallbackApprovalUrl,
    });
  } catch (err) {
    logger.error('[paypal/create-order]', err.message);
    res.status(500).json({ error: err.message || 'Falha ao criar ordem no PayPal' });
  }
});

// ============================================================================
// POST /paypal/capture-order (Orders v2)
// Request body: { orderID }
// Response: capture payload from PayPal
// ============================================================================
router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body || {};
  if (!orderID || typeof orderID !== 'string') {
    return res.status(400).json({ error: 'orderID é obrigatório' });
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const capture = await requestPayPalJson(`/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      accessToken,
      body: {},
    });

    res.json(capture);
  } catch (err) {
    logger.error('[paypal/capture-order]', err.message);
    res.status(500).json({ error: err.message || 'Falha ao capturar ordem do PayPal' });
  }
});

router.post('/verify-capture', async (req, res) => {
  logger.info('\n========== VERIFY-CAPTURE (Orders v2) ==========');
  const { orderId, captureId, amount, currency } = req.body || {};

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'orderId é obrigatório' });
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const order = await getPayPalOrder(accessToken, orderId);
    const status = order?.status;

    if (status !== 'COMPLETED') {
      logger.warn(`[verify-capture] Order ${orderId} status: ${status}`);
      return res.status(400).json({
        error: `Ordem PayPal não está concluída: ${status || 'desconhecido'}`,
      });
    }

    const unit = order?.purchase_units?.[0];
    const amountValue = unit?.amount?.value != null ? parseFloat(unit.amount.value) : null;
    const currencyCode = unit?.amount?.currency_code || currency;

    if (amount != null && amountValue != null && Math.abs(parseFloat(amount) - amountValue) > 0.01) {
      return res.status(400).json({
        error: 'Valor da ordem não confere com o valor enviado',
      });
    }

    logger.info(`[verify-capture] Order ${orderId} verified, captureId: ${captureId || 'n/a'}`);
    res.json({
      success: true,
      orderId,
      captureId: captureId || unit?.payments?.captures?.[0]?.id,
      amount: String(amountValue ?? amount),
      currency: currencyCode,
      status: 'COMPLETED',
    });
  } catch (err) {
    logger.error('[verify-capture]', err.message);
    res.status(500).json({
      error: err.message || 'Falha ao verificar ordem com PayPal',
    });
  }
});

export default router;
