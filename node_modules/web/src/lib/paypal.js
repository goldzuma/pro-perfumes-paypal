/**
 * Lightweight PayPal JS SDK loader (contest-system style).
 * Loads https://www.paypal.com/sdk/js and exposes a promise to access window.paypal.
 */

let paypalLoadPromise = null;

/**
 * @param {Object} options
 * @param {string} options.clientId - PayPal REST app client id (from developer.paypal.com)
 * @param {string} [options.currency='BRL'] - Currency code
 * @param {'capture'|'authorize'} [options.intent='capture']
 */
export function loadPayPalSdk(options) {
  if (paypalLoadPromise) return paypalLoadPromise;

  const {
    clientId,
    currency = 'BRL',
    intent = 'capture',
  } = options;

  paypalLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('PayPal SDK can only be loaded in browser'));
      return;
    }

    const existing = window.paypal;
    if (existing?.Buttons) {
      resolve(existing);
      return;
    }
    if (existing && !existing.Buttons) {
      const script = document.createElement('script');
      const base = 'https://www.paypal.com/sdk/js';
      const params = new URLSearchParams({
        'client-id': clientId,
        currency,
        intent,
        components: 'buttons',
      });
      script.src = `${base}?${params.toString()}`;
      script.async = true;
      script.onload = () => {
        const check = () => {
          const wp = window.paypal;
          if (wp?.Buttons) resolve(wp);
          else setTimeout(check, 50);
        };
        check();
      };
      script.onerror = () => reject(new Error('Failed to load PayPal SDK (buttons)'));
      document.body.appendChild(script);
      return;
    }

    const script = document.createElement('script');
    const base = 'https://www.paypal.com/sdk/js';
    const params = new URLSearchParams({
      'client-id': clientId,
      currency,
      intent,
      components: 'buttons',
    });
    script.src = `${base}?${params.toString()}`;
    script.async = true;
    const start = Date.now();
    script.onload = () => {
      const check = () => {
        const wp = window.paypal;
        if (wp?.Buttons) {
          resolve(wp);
        } else if (Date.now() - start > 8000) {
          paypalLoadPromise = null;
          reject(new Error('PayPal SDK loaded but Buttons component not available'));
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    };
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.body.appendChild(script);
  });

  return paypalLoadPromise;
}
