import React, { useEffect, useRef, useState } from 'react';
import { loadPayPalSdk } from '@/lib/paypal.js';
import { Button } from '@/components/ui/button.jsx';

/**
 * Props for PayPal Smart Payment Buttons (contest-system style).
 * Parent is responsible for persisting/verifying on onApprove.
 */
export default function PayPalButton({
  clientId,
  currency = 'BRL',
  amount,
  description,
  onApprove,
  onCancel,
  onError,
  disabled,
  style = { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'paypal', tagline: false },
}) {
  const containerRef = useRef(null);
  const buttonsRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);

  const amountRef = useRef(amount);
  const currencyRef = useRef(currency);
  const descriptionRef = useRef(description);
  const disabledRef = useRef(!!disabled);
  const onApproveRef = useRef(onApprove);
  const onCancelRef = useRef(onCancel);
  const onErrorRef = useRef(onError);

  useEffect(() => { amountRef.current = amount; }, [amount]);
  useEffect(() => { currencyRef.current = currency; }, [currency]);
  useEffect(() => { descriptionRef.current = description; }, [description]);
  useEffect(() => { disabledRef.current = !!disabled; }, [disabled]);
  useEffect(() => { onApproveRef.current = onApprove; }, [onApprove]);
  useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadPayPalSdk({ clientId, currency, intent: 'capture' });
        if (!cancelled) setReady(true);
      } catch (e) {
        onErrorRef.current?.(e?.message || 'Falha ao carregar PayPal');
      }
    })();
    return () => { cancelled = true; };
  }, [clientId, currency]);

  useEffect(() => {
    if (!ready || !containerRef.current || rendered) return;
    const paypal = window.paypal;
    if (!paypal?.Buttons) return;

    const buttons = paypal.Buttons({
      style,
      onInit(_data, actions) {
        if (disabledRef.current && actions?.disable) actions.disable();
        if (!disabledRef.current && actions?.enable) actions.enable();
      },
      createOrder(_data, actions) {
        const amt = amountRef.current;
        const cur = currencyRef.current;
        const desc = descriptionRef.current || 'Pedido Velour Perfumes';
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: String(amt), currency_code: cur },
              description: desc,
            },
          ],
          intent: 'CAPTURE',
        });
      },
      onApprove: async (_data, actions) => {
        try {
          const details = await actions.order.capture();
          const orderId = details?.id;
          const captureId = details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
          await onApproveRef.current?.({ orderId, captureId });
        } catch (e) {
          console.error('[paypal] capture failed', e);
          onErrorRef.current?.(e?.message || 'Falha ao capturar pagamento');
        }
      },
      onCancel: () => { onCancelRef.current?.(); },
      onError: (err) => { onErrorRef.current?.(err?.message || 'Erro no PayPal'); },
    });

    buttonsRef.current = buttons;

    if (typeof buttons.isEligible === 'function' && !buttons.isEligible()) {
      onErrorRef.current?.('PayPal não disponível para este contexto.');
      return;
    }

    buttons
      .render(containerRef.current)
      .then(() => setRendered(true))
      .catch((err) => {
        onErrorRef.current?.(err?.message || 'Falha ao exibir botão PayPal');
      });

    return () => {
      const container = containerRef.current;
      const stillInDom = container && document.body.contains(container);
      if (!stillInDom && buttonsRef.current) {
        try { buttonsRef.current.close(); } catch (_) {}
        buttonsRef.current = null;
      }
    };
  }, [ready, rendered]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
      {!ready && (
        <Button disabled size="sm" className="w-full sm:w-auto">
          <span className="text-xs sm:text-sm">Carregando PayPal…</span>
        </Button>
      )}
      <div
        ref={containerRef}
        className="w-full sm:w-auto"
        style={{
          minHeight: 40,
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );
}
