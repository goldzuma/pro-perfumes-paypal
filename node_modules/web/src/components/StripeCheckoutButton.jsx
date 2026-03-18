
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useToast } from '@/hooks/use-toast';

const StripeCheckoutButton = ({ amount, items, productName, className, onClick, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (disabled) return;
    if (onClick) onClick();
    
    setLoading(true);
    setError(null);
    
    console.log('[StripeCheckout] Iniciando validação. Items recebidos:', items);
    
    // 1. Validate items
    const validItems = items?.filter(item => item && (item.id || item.product?.id) && item.quantity);
    if (!validItems || validItems.length === 0) {
      const errorMsg = 'Carrinho vazio ou inválido. Adicione itens antes de pagar.';
      console.error('[StripeCheckout] Erro:', errorMsg);
      setError(errorMsg);
      toast({ title: 'Erro de validação', description: errorMsg, variant: 'destructive' });
      setLoading(false);
      return;
    }

    // 2. Calculate total manually to ensure accuracy
    const calculatedTotal = validItems.reduce((sum, item) => {
      const price = parseFloat(item.price || (item.variant?.price_in_cents / 100) || item.product?.price || 0);
      return sum + (price * item.quantity);
    }, 0);

    const amountInCents = Math.round(calculatedTotal * 100);
    console.log('[StripeCheckout] Valid items:', validItems);
    console.log('[StripeCheckout] Calculated Total:', calculatedTotal, 'Cents:', amountInCents);
    
    if (isNaN(amountInCents) || amountInCents < 100) {
      const errorMsg = 'Total inválido (mínimo R$ 1,00)';
      console.error('[StripeCheckout] Falha na validação:', errorMsg);
      setError(errorMsg);
      toast({ title: 'Erro de validação', description: errorMsg, variant: 'destructive' });
      setLoading(false);
      return;
    }
    
    try {
      console.log('[StripeCheckout] Enviando requisição para criar sessão...');
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          items: validItems, // Sending items for backend validation if needed
          productName: productName || 'Pedido Velour Perfumes',
          successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/cancel'
        })
      });

      console.log('[StripeCheckout] Status da resposta:', response.status);

      if (!response.ok) {
        let errorMessage = 'Falha ao criar sessão de checkout';
        try {
          const errorData = await response.json();
          console.error('[StripeCheckout] Erro da API:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('[StripeCheckout] Erro ao ler resposta:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[StripeCheckout] Resposta recebida:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Resposta inválida do servidor (formato incorreto)');
      }

      if (!data.url) {
        throw new Error('URL de checkout não retornada pela API');
      }

      console.log('[StripeCheckout] Sessão criada com sucesso, redirecionando para:', data.url);
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('[StripeCheckout] Erro capturado:', error);
      const errorMessage = error.message || 'Não foi possível iniciar o pagamento com Stripe.';
      setError(errorMessage);
      toast({
        title: 'Erro no pagamento',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-400 mb-2 bg-red-950/30 p-3 rounded-lg border border-red-900/50">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={handleCheckout}
        disabled={loading || disabled}
        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5 mr-2" />
        )}
        {loading ? 'Processando...' : 'Pagar com Stripe'}
      </Button>
    </div>
  );
};

export default StripeCheckoutButton;
