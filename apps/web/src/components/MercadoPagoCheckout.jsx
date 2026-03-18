
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useToast } from '@/hooks/use-toast';

const MercadoPagoCheckout = ({ amount, items, customerName, customerEmail, customerPhone, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setError(null);

    if (disabled) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios antes de prosseguir.",
      });
      return;
    }

    console.log('[MercadoPago] Iniciando validação. Items recebidos:', items);

    // 1. Validate items
    const validItems = items?.filter(item => item && (item.id || item.product?.id) && item.quantity);
    if (!validItems || validItems.length === 0) {
      const errorMsg = 'Carrinho vazio ou inválido. Adicione itens antes de pagar.';
      console.error('[MercadoPago] Erro:', errorMsg);
      setError(errorMsg);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('[MercadoPago] Valid items:', validItems);
      
      // 2. Format items for Mercado Pago
      const formattedItems = validItems.map(item => {
        const priceInCents = item.variant?.sale_price_in_cents ?? item.variant?.price_in_cents ?? (item.price || item.product?.price || 0) * 100;
        return {
          id: item.id || item.product?.id || 'item',
          title: item.name || item.product?.title || item.product?.name || 'Produto',
          quantity: item.quantity || 1,
          unit_price: priceInCents / 100
        };
      });

      console.log('[MercadoPago] Items for API:', formattedItems);

      const payload = { 
        items: formattedItems, 
        customerName: customerName || 'Cliente',
        customerEmail: customerEmail || 'cliente@email.com',
        customerPhone: customerPhone ? customerPhone.replace(/\D/g, '') : '',
        successUrl: window.location.origin + '/mercado-pago-success', 
        cancelUrl: window.location.origin + '/mercado-pago-cancel'
      };

      const response = await apiServerClient.fetch('/mercado-pago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('[MercadoPago] Status da resposta:', response.status);

      if (!response.ok) {
        let errorMessage = 'Erro ao criar preferência do Mercado Pago';
        try {
          const errorData = await response.json();
          console.error('[MercadoPago] Erro da API:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('[MercadoPago] Erro ao ler resposta de erro:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[MercadoPago] Dados recebidos:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Resposta inválida do servidor (formato incorreto)');
      }

      if (data.preferenceId) {
        console.log('[MercadoPago] Redirecionando para checkout...');
        const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.preferenceId}`;
        window.location.href = checkoutUrl;
      } else if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        console.error('[MercadoPago] Resposta sem preferenceId:', data);
        throw new Error('ID de preferência não retornado pelo servidor');
      }
    } catch (err) {
      console.error('[MercadoPago] Erro capturado:', err);
      const errorMessage = err.message || 'Ocorreu um erro ao iniciar o pagamento com Mercado Pago. Tente novamente.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Erro no pagamento',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full mt-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-2 mb-4">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">Erro ao processar pagamento</p>
            <p className="text-xs opacity-80 mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <Button
        type="button"
        onClick={handleCheckout}
        disabled={loading || disabled}
        className="w-full bg-[#009EE3] hover:bg-[#0080B7] text-white h-14 text-lg font-medium shadow-lg shadow-blue-900/20 transition-colors relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Gerando link seguro...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <Wallet className="w-5 h-5 mr-2" />
            Pagar com Mercado Pago
          </span>
        )}
      </Button>
      <p className="text-center text-xs text-amber-100/50 mt-3">
        Você será redirecionado para o ambiente seguro do Mercado Pago.
      </p>
    </div>
  );
};

export default MercadoPagoCheckout;
