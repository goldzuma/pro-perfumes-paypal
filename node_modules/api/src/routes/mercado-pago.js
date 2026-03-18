import 'dotenv/config';
import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// INITIALIZATION & VALIDATION
// ============================================================================

logger.info('\n========== MERCADO PAGO MODULE INITIALIZATION ==========');

const accessToken = (process.env.MERCADO_PAGO_ACCESS_TOKEN || '').trim();
const publicKey = (process.env.MERCADO_PAGO_PUBLIC_KEY || '').trim();

logger.info('Loading credentials from .env file...');
logger.info(`✓ MERCADO_PAGO_ACCESS_TOKEN loaded: ${!!accessToken}`);
if (accessToken) {
  logger.info(`  - Length: ${accessToken.length} characters`);
  logger.info(`  - Preview: ${accessToken.substring(0, 30)}...`);
}
logger.info(`✓ MERCADO_PAGO_PUBLIC_KEY loaded: ${!!publicKey}`);
if (publicKey) {
  logger.info(`  - Length: ${publicKey.length} characters`);
  logger.info(`  - Preview: ${publicKey.substring(0, 30)}...`);
}

if (!accessToken) {
  logger.error('❌ CRITICAL: MERCADO_PAGO_ACCESS_TOKEN is not set or empty in .env');
  throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured in .env');
}

if (!publicKey) {
  logger.error('❌ CRITICAL: MERCADO_PAGO_PUBLIC_KEY is not set or empty in .env');
  throw new Error('MERCADO_PAGO_PUBLIC_KEY not configured in .env');
}

let client;
let preference;
let payment;

try {
  logger.info('\nInitializing MercadoPagoConfig...');
  client = new MercadoPagoConfig({
    accessToken: accessToken,
  });
  logger.info('✓ MercadoPagoConfig initialized successfully');
  logger.info(`  - Client created with access token: ${accessToken.substring(0, 20)}...`);
  logger.info(`  - Access token is valid: ${typeof client === 'object' && client !== null}`);

  logger.info('\nInitializing Preference class...');
  preference = new Preference(client);
  logger.info('✓ Preference class initialized');
  logger.info(`  - Preference instance created: ${typeof preference === 'object' && preference !== null}`);
  logger.info(`  - Preference has create method: ${typeof preference.create === 'function'}`);
  logger.info(`  - Preference has get method: ${typeof preference.get === 'function'}`);

  logger.info('\nInitializing Payment class...');
  payment = new Payment(client);
  logger.info('✓ Payment class initialized');
  logger.info(`  - Payment instance created: ${typeof payment === 'object' && payment !== null}`);
  logger.info(`  - Payment has get method: ${typeof payment.get === 'function'}`);

  logger.info('\n✓✓✓ Mercado Pago SDK fully initialized successfully');
  logger.info('========== INITIALIZATION COMPLETE ==========\n');
} catch (error) {
  logger.error('\n❌ CRITICAL: Failed to initialize Mercado Pago SDK');
  logger.error(`Error message: ${error.message}`);
  logger.error(`Error stack: ${error.stack}`);
  throw new Error(`Mercado Pago initialization failed: ${error.message}`);
}

// ============================================================================
// GET /mercado-pago/test
// Test endpoint to verify credentials are loaded and backend is connected
// ============================================================================

router.get('/test', async (req, res) => {
  logger.info('\n=== TEST ENDPOINT CALLED ===');
  logger.info('Checking if credentials are loaded...');

  const testResponse = {
    status: 'ok',
    message: 'Mercado Pago backend is connected',
    timestamp: new Date().toISOString(),
    hasAccessToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
    hasPublicKey: !!process.env.MERCADO_PAGO_PUBLIC_KEY,
    accessTokenLength: (process.env.MERCADO_PAGO_ACCESS_TOKEN || '').length,
    publicKeyLength: (process.env.MERCADO_PAGO_PUBLIC_KEY || '').length,
    sdkInitialized: {
      client: typeof client === 'object' && client !== null,
      preference: typeof preference === 'object' && preference !== null,
      payment: typeof payment === 'object' && payment !== null,
    },
  };

  logger.info(`Test response: ${JSON.stringify(testResponse, null, 2)}`);
  res.json(testResponse);
});

// ============================================================================
// POST /mercado-pago/create-preference
// Creates a Mercado Pago preference and returns checkout URL
// Request body: { items, customerName, customerEmail, customerPhone, successUrl, cancelUrl }
// Response: { preferenceId: string }
// ============================================================================

router.post('/create-preference', async (req, res) => {
  logger.info('\n========== CREATE PREFERENCE REQUEST ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Request method: ${req.method}`);
  logger.info(`Request path: ${req.path}`);

  // ========== LOG INCOMING REQUEST ==========
  logger.info('\n--- STEP 1: LOG INCOMING REQUEST BODY ---');
  logger.info(`Raw request body: ${JSON.stringify(req.body, null, 2)}`);

  const { items, customerName, customerEmail, customerPhone, successUrl, cancelUrl } = req.body;

  logger.info('Extracted parameters:');
  logger.info(`  - items: ${JSON.stringify(items)}`);
  logger.info(`  - items type: ${typeof items}`);
  logger.info(`  - items is array: ${Array.isArray(items)}`);
  logger.info(`  - customerName: ${customerName}`);
  logger.info(`  - customerEmail: ${customerEmail}`);
  logger.info(`  - customerPhone: ${customerPhone}`);
  logger.info(`  - successUrl: ${successUrl}`);
  logger.info(`  - cancelUrl: ${cancelUrl}`);

  // ========== VALIDATE SDK INITIALIZATION ==========
  logger.info('\n--- STEP 2: VALIDATE SDK INITIALIZATION ---');
  logger.info('Checking if Mercado Pago SDK is properly initialized...');
  logger.info(`  - client initialized: ${typeof client === 'object' && client !== null}`);
  logger.info(`  - preference initialized: ${typeof preference === 'object' && preference !== null}`);
  logger.info(`  - preference.create is function: ${typeof preference.create === 'function'}`);

  if (!client || typeof client !== 'object') {
    logger.error('❌ Mercado Pago client is not initialized');
    throw new Error('Mercado Pago SDK client not initialized');
  }

  if (!preference || typeof preference !== 'object') {
    logger.error('❌ Mercado Pago Preference class is not initialized');
    throw new Error('Mercado Pago SDK Preference class not initialized');
  }

  if (typeof preference.create !== 'function') {
    logger.error('❌ Mercado Pago Preference.create method is not available');
    throw new Error('Mercado Pago SDK Preference.create method not available');
  }

  logger.info('✓ SDK initialization validation passed');

  // ========== VALIDATE CREDENTIALS ==========
  logger.info('\n--- STEP 3: VALIDATE CREDENTIALS ---');
  logger.info(`Checking if ACCESS_TOKEN is loaded from .env...`);
  logger.info(`  - process.env.MERCADO_PAGO_ACCESS_TOKEN exists: ${!!process.env.MERCADO_PAGO_ACCESS_TOKEN}`);
  logger.info(`  - process.env.MERCADO_PAGO_ACCESS_TOKEN length: ${(process.env.MERCADO_PAGO_ACCESS_TOKEN || '').length}`);
  logger.info(`  - process.env.MERCADO_PAGO_ACCESS_TOKEN preview: ${(process.env.MERCADO_PAGO_ACCESS_TOKEN || '').substring(0, 30)}...`);

  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN || !process.env.MERCADO_PAGO_ACCESS_TOKEN.trim()) {
    logger.error('❌ MERCADO_PAGO_ACCESS_TOKEN is undefined or empty');
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured in .env');
  }
  logger.info('✓ ACCESS_TOKEN validation passed');

  // ========== VALIDATE REQUEST DATA ==========
  logger.info('\n--- STEP 4: VALIDATE REQUEST DATA ---');

  // Validate items - CRITICAL FIX: Check if items exists and is an array BEFORE calling .map()
  logger.info('Validating items parameter...');
  if (!items) {
    logger.warn('❌ Validation failed: items is undefined or null');
    return res.status(400).json({
      error: 'Items array is required',
      received: { items },
    });
  }

  if (!Array.isArray(items)) {
    logger.warn(`❌ Validation failed: items is not an array, received type: ${typeof items}`);
    return res.status(400).json({
      error: 'Items must be an array',
      received: { items, type: typeof items },
    });
  }

  if (items.length === 0) {
    logger.warn('❌ Validation failed: items array is empty');
    return res.status(400).json({
      error: 'Items array must not be empty',
      received: { items },
    });
  }
  logger.info(`✓ Items array validation passed: ${items.length} item(s)`);

  // Validate each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    logger.info(`  Item ${i + 1}:`);
    logger.info(`    - id: ${item.id}`);
    logger.info(`    - title: ${item.title}`);
    logger.info(`    - quantity: ${item.quantity}`);
    logger.info(`    - unit_price: ${item.unit_price}`);

    if (!item.id) {
      logger.warn(`❌ Item ${i + 1} missing id`);
      return res.status(400).json({
        error: `Item ${i + 1} is missing required field: id`,
      });
    }

    if (!item.title) {
      logger.warn(`❌ Item ${i + 1} missing title`);
      return res.status(400).json({
        error: `Item ${i + 1} is missing required field: title`,
      });
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      logger.warn(`❌ Item ${i + 1} has invalid quantity: ${item.quantity}`);
      return res.status(400).json({
        error: `Item ${i + 1} quantity must be a positive number`,
      });
    }

    if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
      logger.warn(`❌ Item ${i + 1} has invalid unit_price: ${item.unit_price}`);
      return res.status(400).json({
        error: `Item ${i + 1} unit_price must be a non-negative number`,
      });
    }
  }
  logger.info('✓ All items validation passed');

  // Validate customer email
  if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
    logger.warn(`❌ Validation failed: invalid customer email: ${customerEmail}`);
    return res.status(400).json({
      error: 'Valid customer email is required',
      received: { customerEmail },
    });
  }
  logger.info(`✓ Customer email validation passed: ${customerEmail}`);

  // Validate URLs
  if (!successUrl || typeof successUrl !== 'string') {
    logger.warn(`❌ Validation failed: invalid success URL`);
    return res.status(400).json({
      error: 'Valid success URL is required',
    });
  }
  logger.info(`✓ Success URL validation passed: ${successUrl}`);

  if (!cancelUrl || typeof cancelUrl !== 'string') {
    logger.warn(`❌ Validation failed: invalid cancel URL`);
    return res.status(400).json({
      error: 'Valid cancel URL is required',
    });
  }
  logger.info(`✓ Cancel URL validation passed: ${cancelUrl}`);

  logger.info('✓✓✓ All request data validations passed');

  // ========== FORMAT ITEMS FOR MERCADO PAGO ==========
  logger.info('\n--- STEP 5: FORMAT ITEMS FOR MERCADO PAGO API ---');
  const formattedItems = items.map((item, index) => {
    const formatted = {
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
    };
    logger.info(`  Item ${index + 1} formatted: ${JSON.stringify(formatted)}`);
    return formatted;
  });
  logger.info('✓ All items formatted successfully');

  // ========== CALCULATE TOTALS ==========
  logger.info('\n--- STEP 6: CALCULATE TOTALS ---');
  const totalAmount = formattedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  logger.info(`Total amount calculated: ${totalAmount}`);

  // ========== BUILD PREFERENCE OBJECT ==========
  logger.info('\n--- STEP 7: BUILD PREFERENCE OBJECT ---');
  const preferenceData = {
    items: formattedItems,
    payer: {
      name: customerName || 'Customer',
      email: customerEmail,
    },
    back_urls: {
      success: successUrl,
      failure: cancelUrl,
      pending: cancelUrl,
    },
    auto_return: 'approved',
    notification_url: `${process.env.API_BASE_URL || 'http://localhost:3001'}/mercado-pago/webhook`,
  };

  // Add phone if provided
  if (customerPhone) {
    preferenceData.payer.phone = {
      area_code: customerPhone.substring(0, 2),
      number: customerPhone.substring(2),
    };
    logger.info(`  - Phone added: ${customerPhone}`);
  }

  logger.info('Preference object structure:');
  logger.info(`  - Items count: ${preferenceData.items.length}`);
  logger.info(`  - Total amount: ${totalAmount}`);
  logger.info(`  - Payer name: ${preferenceData.payer.name}`);
  logger.info(`  - Payer email: ${preferenceData.payer.email}`);
  logger.info(`  - Has phone: ${!!preferenceData.payer.phone}`);
  logger.info(`  - Success URL: ${preferenceData.back_urls.success}`);
  logger.info(`  - Failure URL: ${preferenceData.back_urls.failure}`);
  logger.info(`  - Notification URL: ${preferenceData.notification_url}`);
  logger.info(`\nFull preference object being sent to Mercado Pago API:`);
  logger.info(`${JSON.stringify(preferenceData, null, 2)}`);

  // ========== CALL MERCADO PAGO API ==========
  logger.info('\n--- STEP 8: CALL MERCADO PAGO API ---');
  logger.info(`Using access token: ${process.env.MERCADO_PAGO_ACCESS_TOKEN.substring(0, 20)}...`);
  logger.info(`Access token length: ${process.env.MERCADO_PAGO_ACCESS_TOKEN.length}`);
  logger.info('Calling preference.create() method...');

  let preferenceResponse;
  try {
    logger.info(`Sending request body: ${JSON.stringify(preferenceData)}`);
    preferenceResponse = await preference.create({ body: preferenceData });
    logger.info('✓ Mercado Pago API call successful');
  } catch (error) {
    logger.error('\n❌ MERCADO PAGO API CALL FAILED');
    logger.error(`Error message: ${error.message}`);
    logger.error(`Error name: ${error.name}`);
    logger.error(`Error code: ${error.code}`);
    logger.error(`Error status: ${error.status}`);
    logger.error(`Error statusCode: ${error.statusCode}`);

    // Log full error object
    logger.error(`Full error object: ${JSON.stringify(error, null, 2)}`);

    // Log error.response if available (API error details)
    if (error.response) {
      logger.error(`\nError response details:`);
      logger.error(`  - Status: ${error.response.status}`);
      logger.error(`  - Status text: ${error.response.statusText}`);
      logger.error(`  - Headers: ${JSON.stringify(error.response.headers)}`);
      logger.error(`  - Data: ${JSON.stringify(error.response.data)}`);
      logger.error(`  - Full response: ${JSON.stringify(error.response, null, 2)}`);
    }

    // Log error.request if available
    if (error.request) {
      logger.error(`\nError request details:`);
      logger.error(`  - Method: ${error.request.method}`);
      logger.error(`  - URL: ${error.request.url}`);
      logger.error(`  - Headers: ${JSON.stringify(error.request.headers)}`);
    }

    logger.error(`\nError stack trace: ${error.stack}`);

    throw new Error(`Mercado Pago API error: ${error.message}`);
  }

  // ========== VALIDATE RESPONSE ==========
  logger.info('\n--- STEP 9: VALIDATE MERCADO PAGO RESPONSE ---');
  logger.info(`Response type: ${typeof preferenceResponse}`);
  logger.info(`Response keys: ${Object.keys(preferenceResponse || {}).join(', ')}`);
  logger.info(`Full response object: ${JSON.stringify(preferenceResponse, null, 2)}`);

  if (!preferenceResponse) {
    logger.error('❌ Preference response is null or undefined');
    throw new Error('Mercado Pago API returned empty response');
  }

  const preferenceId = preferenceResponse.id;
  const initPoint = preferenceResponse.init_point;

  logger.info(`\nExtracted from response:`);
  logger.info(`  - Preference ID: ${preferenceId}`);
  logger.info(`  - Init Point (checkout URL): ${initPoint}`);

  if (!preferenceId) {
    logger.error('❌ Mercado Pago response missing preference ID');
    logger.error(`Full response: ${JSON.stringify(preferenceResponse)}`);
    throw new Error('Mercado Pago API response missing preference ID');
  }

  if (!initPoint) {
    logger.error('❌ Mercado Pago response missing init_point (checkout URL)');
    logger.error(`Full response: ${JSON.stringify(preferenceResponse)}`);
    throw new Error('Mercado Pago API response missing init_point - cannot generate checkout URL');
  }

  logger.info('✓ Response validation passed');

  // ========== BUILD RESPONSE ==========
  logger.info('\n--- STEP 10: BUILD RESPONSE ---');
  const responseData = {
    preferenceId: preferenceId,
  };

  logger.info(`Response structure:`);
  logger.info(`  - preferenceId: ${responseData.preferenceId}`);
  logger.info(`  - Response is OBJECT (not array): ${typeof responseData === 'object' && !Array.isArray(responseData)}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n✓✓✓ CREATE PREFERENCE REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

// ============================================================================
// GET /mercado-pago/payment-status/:preferenceId
// Retrieves payment status for a preference
// Response: { preference_id, status, paymentStatus, items, totalAmount }
// ============================================================================

router.get('/payment-status/:preferenceId', async (req, res) => {
  logger.info('\n========== GET PAYMENT STATUS REQUEST ==========');
  const { preferenceId } = req.params;
  logger.info(`Preference ID: ${preferenceId}`);

  if (!preferenceId) {
    logger.warn('❌ Validation failed: preference ID is required');
    return res.status(400).json({ error: 'Preference ID is required' });
  }

  logger.info('\n--- STEP 1: RETRIEVE PREFERENCE FROM MERCADO PAGO API ---');
  logger.info('Retrieving preference from Mercado Pago API...');
  let preferenceData;
  try {
    preferenceData = await preference.get({ id: preferenceId });
    logger.info('✓ Preference data retrieved successfully');
  } catch (error) {
    logger.error(`❌ Failed to retrieve preference: ${error.message}`);
    logger.error(`Error details: ${JSON.stringify(error, null, 2)}`);
    throw new Error(`Failed to retrieve preference: ${error.message}`);
  }

  if (!preferenceData) {
    logger.error(`❌ Preference not found: ${preferenceId}`);
    throw new Error(`Preference not found: ${preferenceId}`);
  }

  logger.info(`\nPreference data: ${JSON.stringify(preferenceData, null, 2)}`);

  // ========== STEP 2: EXTRACT PAYMENT STATUS ==========
  logger.info('\n--- STEP 2: EXTRACT PAYMENT STATUS ---');
  const status = preferenceData.status || 'pending';
  const statusDetail = preferenceData.status_detail || 'pending';
  const items = preferenceData.items || [];
  const totalAmount = preferenceData.total_amount || 0;

  logger.info(`Status: ${status}`);
  logger.info(`Status detail: ${statusDetail}`);
  logger.info(`Items count: ${items.length}`);
  logger.info(`Total amount: ${totalAmount}`);

  // ========== STEP 3: MAP STATUS TO PAYMENT STATUS ==========
  logger.info('\n--- STEP 3: MAP STATUS TO PAYMENT STATUS ---');
  let paymentStatus = 'pending';

  switch (status) {
    case 'approved':
      paymentStatus = 'approved';
      break;
    case 'pending':
      paymentStatus = 'pending';
      break;
    case 'rejected':
      paymentStatus = 'rejected';
      break;
    case 'cancelled':
      paymentStatus = 'cancelled';
      break;
    default:
      paymentStatus = status.toLowerCase();
  }

  logger.info(`Payment status mapped: ${status} -> ${paymentStatus}`);

  // ========== STEP 4: BUILD RESPONSE ==========
  logger.info('\n--- STEP 4: BUILD RESPONSE ---');
  const responseData = {
    preference_id: preferenceId,
    status: status,
    paymentStatus: paymentStatus,
    items: items,
    totalAmount: totalAmount,
  };

  logger.info(`Response structure:`);
  logger.info(`  - preference_id: ${responseData.preference_id}`);
  logger.info(`  - status: ${responseData.status}`);
  logger.info(`  - paymentStatus: ${responseData.paymentStatus}`);
  logger.info(`  - items count: ${responseData.items.length}`);
  logger.info(`  - totalAmount: ${responseData.totalAmount}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n✓✓✓ GET PAYMENT STATUS REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

// ============================================================================
// POST /mercado-pago/webhook
// Handles Mercado Pago payment notifications
// ============================================================================

router.post('/webhook', async (req, res) => {
  logger.info('\n=== WEBHOOK RECEIVED ===');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Webhook payload: ${JSON.stringify(req.body, null, 2)}`);

  const { type, data } = req.body;

  if (!type || !data) {
    logger.warn('❌ Invalid webhook payload: type and data are required');
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  logger.info(`Webhook type: ${type}`);
  logger.info(`Webhook data ID: ${data.id}`);

  if (type === 'payment') {
    const paymentId = data.id;
    logger.info(`Processing payment notification for payment ID: ${paymentId}`);

    let paymentData;
    try {
      paymentData = await payment.get({ id: paymentId });
      logger.info(`✓ Payment data retrieved: ${JSON.stringify(paymentData)}`);
    } catch (error) {
      logger.error(`❌ Failed to retrieve payment: ${error.message}`);
      throw new Error(`Failed to retrieve payment: ${error.message}`);
    }

    if (!paymentData) {
      logger.error(`❌ Payment not found: ${paymentId}`);
      throw new Error(`Payment not found: ${paymentId}`);
    }

    const paymentStatus = paymentData.status;
    const preferenceId = paymentData.preference_id;

    logger.info(`Payment ${paymentId} status: ${paymentStatus}`);
    logger.info(`Associated preference ID: ${preferenceId}`);

    let orderStatus = 'Pendente';
    if (paymentStatus === 'approved') {
      orderStatus = 'Processando';
    } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
      orderStatus = 'Cancelado';
    } else if (paymentStatus === 'pending') {
      orderStatus = 'Pendente';
    }

    logger.info(`Order status mapped: ${paymentStatus} -> ${orderStatus}`);
    logger.info(`TODO: Update order in database with status: ${orderStatus}`);
  } else {
    logger.info(`Webhook type '${type}' is not 'payment', skipping processing`);
  }

  logger.info('✓ Webhook processed successfully\n');
  res.json({ success: true });
});

export default router;