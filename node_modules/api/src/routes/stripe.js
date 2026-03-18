import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// INITIALIZATION & VALIDATION
// ============================================================================

logger.info('\n========== STRIPE MODULE INITIALIZATION ==========');

const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();

logger.info('Loading credentials from .env file...');
logger.info(`✓ STRIPE_SECRET_KEY loaded: ${!!secretKey}`);
if (secretKey) {
  logger.info(`  - Length: ${secretKey.length} characters`);
  logger.info(`  - Preview: ${secretKey.substring(0, 30)}...`);
}

if (!secretKey) {
  logger.error('❌ CRITICAL: STRIPE_SECRET_KEY is not set or empty in .env');
  throw new Error('STRIPE_SECRET_KEY not configured in .env');
}

let stripe;

try {
  logger.info('\nInitializing Stripe SDK...');
  stripe = new Stripe(secretKey);
  logger.info('✓ Stripe SDK initialized successfully');
  logger.info(`  - Secret key: ${secretKey.substring(0, 20)}...`);
  logger.info(`  - Stripe instance created: ${typeof stripe === 'object' && stripe !== null}`);
  logger.info(`  - checkout.sessions available: ${typeof stripe.checkout === 'object' && typeof stripe.checkout.sessions === 'object'}`);
  logger.info(`  - checkout.sessions.create available: ${typeof stripe.checkout === 'object' && typeof stripe.checkout.sessions.create === 'function'}`);
  logger.info(`  - checkout.sessions.retrieve available: ${typeof stripe.checkout === 'object' && typeof stripe.checkout.sessions.retrieve === 'function'}`);
  logger.info('\n✓✓✓ Stripe module fully initialized successfully');
  logger.info('========== INITIALIZATION COMPLETE ==========\n');
} catch (error) {
  logger.error('\n❌ CRITICAL: Failed to initialize Stripe SDK');
  logger.error(`Error message: ${error.message}`);
  logger.error(`Error stack: ${error.stack}`);
  throw new Error(`Stripe initialization failed: ${error.message}`);
}

// ============================================================================
// POST /stripe/create-checkout
// Creates a Stripe Checkout Session and returns checkout URL
// Request body: { amount, productName, successUrl, cancelUrl }
// Response: { url: string }
// ============================================================================

router.post('/create-checkout', async (req, res) => {
  logger.info('\n========== CREATE CHECKOUT REQUEST ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Request method: ${req.method}`);
  logger.info(`Request path: ${req.path}`);

  // ========== LOG INCOMING REQUEST ==========
  logger.info('\n--- STEP 1: LOG INCOMING REQUEST BODY ---');
  logger.info(`Raw request body: ${JSON.stringify(req.body, null, 2)}`);

  const { amount, productName, successUrl, cancelUrl } = req.body;

  logger.info('Extracted parameters:');
  logger.info(`  - amount: ${amount}`);
  logger.info(`  - productName: ${productName}`);
  logger.info(`  - successUrl: ${successUrl}`);
  logger.info(`  - cancelUrl: ${cancelUrl}`);

  // ========== VALIDATE SDK INITIALIZATION ==========
  logger.info('\n--- STEP 2: VALIDATE SDK INITIALIZATION ---');
  logger.info('Checking if Stripe SDK is properly initialized...');
  logger.info(`  - stripe object exists: ${typeof stripe === 'object' && stripe !== null}`);
  logger.info(`  - stripe.checkout exists: ${typeof stripe.checkout === 'object' && stripe.checkout !== null}`);
  logger.info(`  - stripe.checkout.sessions exists: ${typeof stripe.checkout === 'object' && typeof stripe.checkout.sessions === 'object'}`);
  logger.info(`  - stripe.checkout.sessions.create is function: ${typeof stripe.checkout === 'object' && typeof stripe.checkout.sessions.create === 'function'}`);

  if (!stripe || typeof stripe !== 'object') {
    logger.error('❌ Stripe SDK is not initialized');
    throw new Error('Stripe SDK not initialized');
  }

  if (!stripe.checkout || typeof stripe.checkout !== 'object') {
    logger.error('❌ Stripe checkout module is not initialized');
    throw new Error('Stripe checkout module not initialized');
  }

  if (!stripe.checkout.sessions || typeof stripe.checkout.sessions !== 'object') {
    logger.error('❌ Stripe checkout.sessions is not initialized');
    throw new Error('Stripe checkout.sessions not initialized');
  }

  if (typeof stripe.checkout.sessions.create !== 'function') {
    logger.error('❌ Stripe checkout.sessions.create method is not available');
    throw new Error('Stripe checkout.sessions.create method not available');
  }

  logger.info('✓ SDK initialization validation passed');

  // ========== VALIDATE CREDENTIALS ==========
  logger.info('\n--- STEP 3: VALIDATE CREDENTIALS ---');
  logger.info(`Checking if SECRET_KEY is loaded from .env...`);
  logger.info(`  - process.env.STRIPE_SECRET_KEY exists: ${!!process.env.STRIPE_SECRET_KEY}`);
  logger.info(`  - process.env.STRIPE_SECRET_KEY length: ${(process.env.STRIPE_SECRET_KEY || '').length}`);
  logger.info(`  - process.env.STRIPE_SECRET_KEY preview: ${(process.env.STRIPE_SECRET_KEY || '').substring(0, 30)}...`);

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.trim()) {
    logger.error('❌ STRIPE_SECRET_KEY is undefined or empty');
    throw new Error('STRIPE_SECRET_KEY not configured in .env');
  }
  logger.info('✓ SECRET_KEY validation passed');

  // ========== VALIDATE REQUEST DATA ==========
  logger.info('\n--- STEP 4: VALIDATE REQUEST DATA ---');

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    logger.warn(`❌ Validation failed: invalid amount: ${amount}`);
    return res.status(400).json({
      error: 'Amount must be a positive number',
      received: { amount },
    });
  }
  logger.info(`✓ Amount validation passed: ${amount}`);

  // Validate product name
  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    logger.warn(`❌ Validation failed: invalid product name`);
    return res.status(400).json({
      error: 'Product name is required and must be a non-empty string',
      received: { productName },
    });
  }
  logger.info(`✓ Product name validation passed: ${productName}`);

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

  // ========== CONVERT AMOUNT TO CENTS ==========
  logger.info('\n--- STEP 5: CONVERT AMOUNT TO CENTS ---');
  const amountInCents = Math.round(amount * 100);
  logger.info(`Amount in cents: ${amountInCents}`);

  // ========== BUILD CHECKOUT SESSION OBJECT ==========
  logger.info('\n--- STEP 6: BUILD CHECKOUT SESSION OBJECT ---');
  const sessionData = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: productName,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  logger.info('Checkout session object structure:');
  logger.info(`  - Payment method types: ${sessionData.payment_method_types.join(', ')}`);
  logger.info(`  - Line items count: ${sessionData.line_items.length}`);
  logger.info(`  - Currency: ${sessionData.line_items[0].price_data.currency}`);
  logger.info(`  - Product name: ${sessionData.line_items[0].price_data.product_data.name}`);
  logger.info(`  - Unit amount (cents): ${sessionData.line_items[0].price_data.unit_amount}`);
  logger.info(`  - Mode: ${sessionData.mode}`);
  logger.info(`  - Success URL: ${sessionData.success_url}`);
  logger.info(`  - Cancel URL: ${sessionData.cancel_url}`);
  logger.info(`\nFull session object being sent to Stripe API:`);
  logger.info(`${JSON.stringify(sessionData, null, 2)}`);

  // ========== CALL STRIPE API ==========
  logger.info('\n--- STEP 7: CALL STRIPE API ---');
  logger.info(`Using secret key: ${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...`);
  logger.info(`Secret key length: ${process.env.STRIPE_SECRET_KEY.length}`);
  logger.info('Calling stripe.checkout.sessions.create() method...');

  let session;
  try {
    logger.info(`Sending request body: ${JSON.stringify(sessionData)}`);
    session = await stripe.checkout.sessions.create(sessionData);
    logger.info('✓ Stripe API call successful');
  } catch (error) {
    logger.error('\n❌ STRIPE API CALL FAILED');
    logger.error(`Error message: ${error.message}`);
    logger.error(`Error name: ${error.name}`);
    logger.error(`Error code: ${error.code}`);
    logger.error(`Error status: ${error.status}`);
    logger.error(`Error statusCode: ${error.statusCode}`);
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

    throw new Error(`Stripe API error: ${error.message}`);
  }

  // ========== VALIDATE RESPONSE ==========
  logger.info('\n--- STEP 8: VALIDATE STRIPE RESPONSE ---');
  logger.info(`Response type: ${typeof session}`);
  logger.info(`Response keys: ${Object.keys(session || {}).join(', ')}`);
  logger.info(`Full response object: ${JSON.stringify(session, null, 2)}`);

  if (!session) {
    logger.error('❌ Session response is null or undefined');
    throw new Error('Stripe API returned empty response');
  }

  const sessionId = session.id;
  const checkoutUrl = session.url;

  logger.info(`\nExtracted from response:`);
  logger.info(`  - Session ID: ${sessionId}`);
  logger.info(`  - Checkout URL: ${checkoutUrl}`);

  if (!sessionId) {
    logger.error('❌ Stripe response missing session ID');
    logger.error(`Full response: ${JSON.stringify(session)}`);
    throw new Error('Stripe API response missing session ID');
  }

  if (!checkoutUrl) {
    logger.error('❌ Stripe response missing checkout URL');
    logger.error(`Full response: ${JSON.stringify(session)}`);
    throw new Error('Stripe API response missing checkout URL');
  }

  logger.info('✓ Response validation passed');

  // ========== BUILD RESPONSE ==========
  logger.info('\n--- STEP 9: BUILD RESPONSE ---');
  const responseData = {
    url: checkoutUrl,
  };

  logger.info(`Response structure:`);
  logger.info(`  - url: ${responseData.url}`);
  logger.info(`  - Response is OBJECT (not array): ${typeof responseData === 'object' && !Array.isArray(responseData)}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n✓✓✓ CREATE CHECKOUT REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

// ============================================================================
// GET /stripe/session/:sessionId
// Retrieves Stripe Checkout Session details
// Response: { id, status, amountTotal, customerEmail }
// ============================================================================

router.get('/session/:sessionId', async (req, res) => {
  logger.info('\n========== GET SESSION REQUEST ==========');
  const { sessionId } = req.params;
  logger.info(`Session ID: ${sessionId}`);

  if (!sessionId) {
    logger.warn('❌ Validation failed: session ID is required');
    return res.status(400).json({ error: 'Session ID is required' });
  }

  logger.info('\n--- STEP 1: RETRIEVE SESSION FROM STRIPE API ---');
  logger.info('Retrieving session from Stripe API...');
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
    logger.info('✓ Session data retrieved successfully');
  } catch (error) {
    logger.error(`❌ Failed to retrieve session: ${error.message}`);
    logger.error(`Error details: ${JSON.stringify(error, null, 2)}`);
    throw new Error(`Failed to retrieve session: ${error.message}`);
  }

  if (!session) {
    logger.error(`❌ Session not found: ${sessionId}`);
    throw new Error(`Session not found: ${sessionId}`);
  }

  logger.info(`\nSession data: ${JSON.stringify(session, null, 2)}`);

  // ========== STEP 2: EXTRACT SESSION DATA ==========
  logger.info('\n--- STEP 2: EXTRACT SESSION DATA ---');
  const id = session.id;
  const paymentStatus = session.payment_status;
  const amountTotal = session.amount_total;
  const customerEmail = session.customer_details?.email;

  logger.info(`ID: ${id}`);
  logger.info(`Payment status: ${paymentStatus}`);
  logger.info(`Amount total: ${amountTotal}`);
  logger.info(`Customer email: ${customerEmail}`);

  // ========== STEP 3: BUILD RESPONSE ==========
  logger.info('\n--- STEP 3: BUILD RESPONSE ---');
  const responseData = {
    id: id,
    status: paymentStatus,
    amountTotal: amountTotal,
    customerEmail: customerEmail,
  };

  logger.info(`Response structure:`);
  logger.info(`  - id: ${responseData.id}`);
  logger.info(`  - status: ${responseData.status}`);
  logger.info(`  - amountTotal: ${responseData.amountTotal}`);
  logger.info(`  - customerEmail: ${responseData.customerEmail}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n✓✓✓ GET SESSION REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

export default router;