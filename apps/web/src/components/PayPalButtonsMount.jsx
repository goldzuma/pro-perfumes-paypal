import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast.js';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button.jsx';
import apiServerClient from '@/lib/apiServerClient.js';

/**
 * Mounts PayPal Smart Buttons (contest-system style).
 * Uses VITE_PAYPAL_CLIENT_ID. On approval, calls API to verify/capture then navigates to success.
 */
export default function PayPalButtonsMount({ amount, disabled, description }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.paypal) {
      console.log('[paypal] env client id present:', !!clientId);
    }
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="text-xs sm:text-sm text-red-400 text-center sm:text-left p-3 bg-red-950/20 rounded-lg border border-red-900/30">
        Configure VITE_PAYPAL_CLIENT_ID no .env do frontend para exibir o botão PayPal.
      </div>
    );
  }

  const amountStr = amount != null && amount !== '' ? String(Number(amount).toFixed(2)) : '0.00';
  const handleRedirectCheckout = async () => {
    try {
      const returnUrl = `${window.location.origin}/paypal-success`;
      const cancelUrl = `${window.location.origin}/paypal-cancel`;
      const response = await apiServerClient.fetch('/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountStr,
          currency: 'BRL',
          description: description || 'Pedido Velour Perfumes',
          returnUrl,
          cancelUrl,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao criar pedido PayPal');
      }

      const approveLink =
        payload?.approvalUrl
        || payload?.links?.find((l) =>
          l?.rel === 'approve'
          || l?.rel === 'payer-action'
          || l?.rel === 'approval_url'
        )?.href;
      if (!approveLink) {
        throw new Error('URL de aprovação do PayPal não encontrada');
      }

      window.location.href = approveLink;
    } catch (e) {
      toast({
        title: 'Erro no PayPal',
        description: e?.message || 'Falha ao iniciar pagamento',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handleRedirectCheckout}
      disabled={disabled}
      className="w-full h-10 bg-[#0070ba] hover:bg-[#005ea6] text-white font-medium"
    >
      Pay with Paypal
    </Button>
  );
}
