import { Router } from 'express';
import healthCheck from './health-check.js';
import pagseguroRouter from './pagseguro.js';
import mercadoPagoRouter from './mercado-pago.js';
import paypalRouter from './paypal.js';
import stripeRouter from './stripe.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/pagseguro', pagseguroRouter);
  router.use('/mercado-pago', mercadoPagoRouter);
  router.use('/paypal', paypalRouter);
  router.use('/stripe', stripeRouter);

  return router;
};
