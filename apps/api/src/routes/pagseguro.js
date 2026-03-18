import 'dotenv/config';
import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// INITIALIZATION & VALIDATION
// ============================================================================

logger.info('\n========== PAGSEGURO MODULE INITIALIZATION ==========');

const accessToken = (process.env.PAGSEGURO_ACCESS_TOKEN || '').trim();
const publicKey = (process.env.PAGSEGURO_PUBLIC_KEY || '').trim();

logger.info('Loading credentials from .env file...');
logger.info(`✓ PAGSEGURO_ACCESS_TOKEN loaded: ${!!accessToken}`);
if (accessToken) {
  logger.info(`  - Length: ${accessToken.length} characters`);
  logger.info(`  - Preview: ${accessToken.substring(0, 30)}...`);
}
logger.info(`✓ PAGSEGURO_PUBLIC_KEY loaded: ${!!publicKey}`);
if (publicKey) {
  logger.info(`  - Length: ${publicKey.length} characters`);
  logger.info(`  - Preview: ${publicKey.substring(0, 30)}...`);
}

if (!accessToken) {
  logger.error('❌ CRITICAL: PAGSEGURO_ACCESS_TOKEN is not set or empty in .env');
  throw new Error('PAGSEGURO_ACCESS_TOKEN not configured in .env');
}

if (!publicKey) {
  logger.error('❌ CRITICAL: PAGSEGURO_PUBLIC_KEY is not set or empty in .env');
  throw new Error('PAGSEGURO_PUBLIC_KEY not configured in .env');
}

logger.info('\n✓✓✓ PagSeguro credentials fully loaded and validated');
logger.info('========== INITIALIZATION COMPLETE ==========\n');

// ============================================================================
// POST /pagseguro/checkout
// Creates a PagSeguro checkout session and returns checkout URL
// ============================================================================

router.post('/checkout', async (req, res) => {
  logger.info('\n========== CREATE CHECKOUT REQUEST ==========');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Request method: ${req.method}`);
  logger.info(`Request path: ${req.path}`);

  // ========== LOG INCOMING REQUEST ==========
  logger.info('\n--- STEP 1: LOG INCOMING REQUEST BODY ---');
  logger.info(`Raw request body: ${JSON.stringify(req.body, null, 2)}`);

  const { items, amount, customerEmail, customerName, successUrl, cancelUrl } = req.body;

  logger.info('Extracted parameters:');
  logger.info(`  - items: ${JSON.stringify(items)}`);
  logger.info(`  - amount: ${amount}`);
  logger.info(`  - customerEmail: ${customerEmail}`);
  logger.info(`  - customerName: ${customerName}`);
  logger.info(`  - successUrl: ${successUrl}`);
  logger.info(`  - cancelUrl: ${cancelUrl}`);

  // ========== VALIDATE CREDENTIALS ==========
  logger.info('\n--- STEP 2: VALIDATE CREDENTIALS ---');
  logger.info(`Checking if ACCESS_TOKEN is loaded from .env...`);
  logger.info(`  - process.env.PAGSEGURO_ACCESS_TOKEN exists: ${!!process.env.PAGSEGURO_ACCESS_TOKEN}`);
  logger.info(`  - process.env.PAGSEGURO_ACCESS_TOKEN length: ${(process.env.PAGSEGURO_ACCESS_TOKEN || '').length}`);
  logger.info(`  - process.env.PAGSEGURO_ACCESS_TOKEN preview: ${(process.env.PAGSEGURO_ACCESS_TOKEN || '').substring(0, 30)}...`);

  if (!process.env.PAGSEGURO_ACCESS_TOKEN || !process.env.PAGSEGURO_ACCESS_TOKEN.trim()) {
    logger.error('❌ PAGSEGURO_ACCESS_TOKEN is undefined or empty');
    throw new Error('PAGSEGURO_ACCESS_TOKEN not configured in .env');
  }
  logger.info('✓ ACCESS_TOKEN validation passed');

  // ========== VALIDATE REQUEST DATA ==========
  logger.info('\n--- STEP 3: VALIDATE REQUEST DATA ---');

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    logger.warn('❌ Validation failed: items array is required and must not be empty');
    return res.status(400).json({
      error: 'Items array is required and must not be empty',
      received: { items },
    });
  }
  logger.info(`✓ Items array validation passed: ${items.length} item(s)`);

  // Validate each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    logger.info(`  Item ${i + 1}:`);
    logger.info(`    - name: ${item.name}`);
    logger.info(`    - quantity: ${item.quantity}`);
    logger.info(`    - unit_amount: ${item.unit_amount}`);

    if (!item.name) {
      logger.warn(`❌ Item ${i + 1} missing name`);
      return res.status(400).json({
        error: `Item ${i + 1} is missing required field: name`,
      });
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      logger.warn(`❌ Item ${i + 1} has invalid quantity: ${item.quantity}`);
      return res.status(400).json({
        error: `Item ${i + 1} quantity must be a positive number`,
      });
    }

    if (typeof item.unit_amount !== 'number' || item.unit_amount < 0) {
      logger.warn(`❌ Item ${i + 1} has invalid unit_amount: ${item.unit_amount}`);
      return res.status(400).json({
        error: `Item ${i + 1} unit_amount must be a non-negative number`,
      });
    }
  }
  logger.info('✓ All items validation passed');

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    logger.warn(`❌ Validation failed: invalid amount: ${amount}`);
    return res.status(400).json({
      error: 'Amount must be a positive number',
      received: { amount },
    });
  }
  logger.info(`✓ Amount validation passed: ${amount}`);

  // Validate customer email
  if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
    logger.warn(`❌ Validation failed: invalid customer email: ${customerEmail}`);
    return res.status(400).json({
      error: 'Valid customer email is required',
      received: { customerEmail },
    });
  }
  logger.info(`✓ Customer email validation passed: ${customerEmail}`);

  // Validate customer name
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    logger.warn(`❌ Validation failed: invalid customer name`);
    return res.status(400).json({
      error: 'Customer name is required and must be a non-empty string',
      received: { customerName },
    });
  }
  logger.info(`✓ Customer name validation passed: ${customerName}`);

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

  // ========== FORMAT ITEMS FOR PAGSEGURO ==========
  logger.info('\n--- STEP 4: FORMAT ITEMS FOR PAGSEGURO API ---');
  const formattedItems = items.map((item, index) => {
    const formatted = {
      name: item.name,
      quantity: item.quantity,
      unit_amount: Math.round(item.unit_amount * 100), // Convert to cents
    };
    if (item.description) {
      formatted.description = item.description;
    }
    logger.info(`  Item ${index + 1} formatted: ${JSON.stringify(formatted)}`);
    return formatted;
  });
  logger.info('✓ All items formatted successfully');

  // ========== CALCULATE TOTALS ==========
  logger.info('\n--- STEP 5: CALCULATE TOTALS ---');
  const totalAmount = formattedItems.reduce((sum, item) => sum + (item.unit_amount * item.quantity), 0);
  logger.info(`Total amount calculated (in cents): ${totalAmount}`);

  // ========== BUILD CHECKOUT OBJECT ==========
  logger.info('\n--- STEP 6: BUILD CHECKOUT OBJECT ---');
  const checkoutData = {
    reference_id: `checkout_${Date.now()}`,
    customer: {
      name: customerName,
      email: customerEmail,
    },
    items: formattedItems,
    amount: totalAmount,
    return_url: successUrl,
    cancel_url: cancelUrl,
    notification_urls: [
      `${process.env.API_BASE_URL || 'http://localhost:3001'}/pagseguro/webhook`,
    ],
  };

  logger.info('Checkout object structure:');
  logger.info(`  - Reference ID: ${checkoutData.reference_id}`);
  logger.info(`  - Items count: ${checkoutData.items.length}`);
  logger.info(`  - Total amount (cents): ${checkoutData.amount}`);
  logger.info(`  - Customer name: ${checkoutData.customer.name}`);
  logger.info(`  - Customer email: ${checkoutData.customer.email}`);
  logger.info(`  - Return URL: ${checkoutData.return_url}`);
  logger.info(`  - Cancel URL: ${checkoutData.cancel_url}`);
  logger.info(`  - Notification URL: ${checkoutData.notification_urls[0]}`);
  logger.info(`\nFull checkout object being sent to PagSeguro API:`);
  logger.info(`${JSON.stringify(checkoutData, null, 2)}`);

  // ========== CALL PAGSEGURO API ==========
  logger.info('\n--- STEP 7: CALL PAGSEGURO API ---');
  logger.info(`Using access token: ${process.env.PAGSEGURO_ACCESS_TOKEN.substring(0, 20)}...`);
  logger.info(`Access token length: ${process.env.PAGSEGURO_ACCESS_TOKEN.length}`);
  logger.info('Calling PagSeguro API at https://api.pagseguro.com/checkouts...');

  const response = await fetch('https://api.pagseguro.com/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAGSEGURO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkoutData),
  });

  logger.info(`Response status: ${response.status}`);
  logger.info(`Response status text: ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('\n❌ PAGSEGURO API CALL FAILED');
    logger.error(`Status: ${response.status} ${response.statusText}`);
    logger.error(`Response body: ${errorText}`);
    throw new Error(`PagSeguro API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  logger.info('✓ PagSeguro API call successful');

  // ========== PARSE RESPONSE ==========
  logger.info('\n--- STEP 8: PARSE PAGSEGURO RESPONSE ---');
  const checkoutResponse = await response.json();
  logger.info(`Response type: ${typeof checkoutResponse}`);
  logger.info(`Response keys: ${Object.keys(checkoutResponse || {}).join(', ')}`);
  logger.info(`Full response object: ${JSON.stringify(checkoutResponse, null, 2)}`);

  if (!checkoutResponse) {
    logger.error('❌ Checkout response is null or undefined');
    throw new Error('PagSeguro API returned empty response');
  }

  const checkoutId = checkoutResponse.id;
  const checkoutUrl = checkoutResponse.redirect_url;

  logger.info(`\nExtracted from response:`);
  logger.info(`  - Checkout ID: ${checkoutId}`);
  logger.info(`  - Checkout URL: ${checkoutUrl}`);

  if (!checkoutId) {
    logger.error('❌ PagSeguro response missing checkout ID');
    logger.error(`Full response: ${JSON.stringify(checkoutResponse)}`);
    throw new Error('PagSeguro API response missing checkout ID');
  }

  if (!checkoutUrl) {
    logger.error('❌ PagSeguro response missing redirect_url (checkout URL)');
    logger.error(`Full response: ${JSON.stringify(checkoutResponse)}`);
    throw new Error('PagSeguro API response missing redirect_url - cannot generate checkout URL');
  }

  logger.info('✓ Response validation passed');

  // ========== BUILD RESPONSE ==========
  logger.info('\n--- STEP 9: BUILD RESPONSE ---');
  const responseData = {
    checkoutUrl: checkoutUrl,
  };

  logger.info(`Response structure:`);
  logger.info(`  - checkoutUrl: ${responseData.checkoutUrl}`);
  logger.info(`Full response: ${JSON.stringify(responseData, null, 2)}`);

  logger.info('\n✓✓✓ CREATE CHECKOUT REQUEST COMPLETED SUCCESSFULLY');
  logger.info('========== REQUEST COMPLETE ==========\n');

  res.json(responseData);
});

// ============================================================================
// POST /pagseguro/webhook
// Handles PagSeguro payment notifications
// ============================================================================

router.post('/webhook', async (req, res) => {
  logger.info('\n=== PAGSEGURO WEBHOOK RECEIVED ===');
  logger.info(`Timestamp: ${new Date().toISOString()}`);
  logger.info(`Webhook payload: ${JSON.stringify(req.body, null, 2)}`);

  // ========== VERIFY WEBHOOK AUTHENTICITY ==========
  logger.info('\n--- STEP 1: VERIFY WEBHOOK AUTHENTICITY ---');
  const authHeader = req.headers.authorization;
  logger.info(`Authorization header: ${authHeader ? authHeader.substring(0, 30) + '...' : 'missing'}`);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('❌ Invalid webhook: missing or malformed Authorization header');
    return res.status(401).json({ error: 'Unauthorized: Invalid authorization header' });
  }

  const tokenFromHeader = authHeader.substring(7);
  const expectedToken = process.env.PAGSEGURO_ACCESS_TOKEN;

  if (tokenFromHeader !== expectedToken) {
    logger.warn('❌ Invalid webhook: Authorization token does not match');
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  logger.info('✓ Webhook authenticity verified');

  // ========== PARSE NOTIFICATION BODY ==========
  logger.info('\n--- STEP 2: PARSE NOTIFICATION BODY ---');
  const { id: checkoutId, status, reference_id } = req.body;

  logger.info(`Extracted notification data:`);
  logger.info(`  - Checkout ID: ${checkoutId}`);
  logger.info(`  - Status: ${status}`);
  logger.info(`  - Reference ID: ${reference_id}`);

  if (!checkoutId || !status) {
    logger.warn('❌ Invalid webhook payload: checkoutId and status are required');
    return res.status(400).json({ error: 'Invalid webhook payload: missing checkoutId or status' });
  }

  logger.info('✓ Notification body parsed successfully');

  // ========== MAP STATUS ==========
  logger.info('\n--- STEP 3: MAP PAYMENT STATUS ---');
  let paymentStatus = 'pending';

  switch (status) {
    case 'PAID':
      paymentStatus = 'approved';
      break;
    case 'DECLINED':
      paymentStatus = 'rejected';
      break;
    case 'CANCELED':
      paymentStatus = 'cancelled';
      break;
    case 'PENDING':
      paymentStatus = 'pending';
      break;
    case 'WAITING_PAYMENT':
      paymentStatus = 'pending';
      break;
    default:
      paymentStatus = status.toLowerCase();
  }

  logger.info(`Status mapping: ${status} -> ${paymentStatus}`);

  // ========== UPDATE ORDER IN DATABASE ==========
  logger.info('\n--- STEP 4: UPDATE ORDER IN DATABASE ---');
  logger.info(`TODO: Update order in 'orders' collection`);
  logger.info(`  - Checkout ID: ${checkoutId}`);
  logger.info(`  - Reference ID: ${reference_id}`);
  logger.info(`  - New payment status: ${paymentStatus}`);
  logger.info(`  - Original PagSeguro status: ${status}`);
  logger.info(`  - Timestamp: ${new Date().toISOString()}`);

  // In a real implementation, you would update the database here:
  // const db = getDatabase();
  // await db.collection('orders').updateOne(
  //   { checkoutId: checkoutId },
  //   { $set: { paymentStatus: paymentStatus, updatedAt: new Date() } }
  // );

  logger.info('✓ Order update queued (database integration needed)');

  // ========== SEND RESPONSE ==========
  logger.info('\n--- STEP 5: SEND RESPONSE ---');
  logger.info('Sending 200 OK response to PagSeguro');
  logger.info('✓ Webhook processed successfully\n');

  res.status(200).json({ success: true, message: 'Webhook processed successfully' });
});

export default router;
