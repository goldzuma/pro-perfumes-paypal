import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from '@/components/PayPalButton.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { useCart } from '@/hooks/useCart.jsx';

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

  return (
    <PayPalButton
      clientId={clientId}
      currency="BRL"
      amount={amountStr}
      description={description || 'Pedido Velour Perfumes'}
      onApprove={async ({ orderId, captureId }) => {
        clearCart();
        navigate('/paypal-success', {
          state: {
            orderId,
            captureId,
            amount: amountStr,
            status: 'approved',
          },
        });
      }}
      onError={(m) =>
        toast({
          title: 'Erro no PayPal',
          description: m,
          variant: 'destructive',
        })
      }
      onCancel={() =>
        toast({
          title: 'Pagamento cancelado',
          description: 'Você pode tentar novamente quando quiser.',
        })
      }
      disabled={disabled}
    />
  );
}
