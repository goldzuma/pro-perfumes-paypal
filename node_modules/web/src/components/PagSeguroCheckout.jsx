
import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const PagSeguroCheckout = ({ cartItems, customerName, customerEmail, customerPhone, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (disabled) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios do endereço e contato.",
      });
      return;
    }

    setLoading(true);

    try {
      // Format items for the backend
      const items = cartItems.map(item => {
        const priceInCents = item.variant?.sale_price_in_cents ?? item.variant?.price_in_cents ?? item.product.price * 100;
        return {
          name: item.product.title || item.product.name,
          quantity: item.quantity,
          unit_amount: priceInCents / 100 // Convert to Reais for the backend
        };
      });

      // Calculate total amount in Reais
      const amount = items.reduce((acc, item) => acc + (item.unit_amount * item.quantity), 0);

      const payload = {
        items,
        amount,
        customerName,
        customerEmail,
        successUrl: window.location.origin + '/pagseguro-success',
        cancelUrl: window.location.origin + '/pagseguro-cancel'
      };

      const response = await apiServerClient.fetch('/pagseguro/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao processar pagamento');
      }

      const data = await response.json();
      
      toast({
        title: 'Redirecionando para o PagSeguro...',
        description: 'Você será redirecionado para concluir o pagamento de forma segura.',
      });

      if (data.checkoutUrl) {
        // Redirect user to PagSeguro hosted checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Link de pagamento não retornado pelo PagSeguro.');
      }

    } catch (err) {
      console.error('PagSeguro Error:', err);
      setError(err.message || 'Ocorreu um erro ao processar o pagamento. Tente novamente.');
      toast({
        variant: 'destructive',
        title: 'Erro no pagamento',
        description: err.message || 'Não foi possível concluir a transação.',
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
            <p className="font-medium text-sm">Erro ao iniciar pagamento</p>
            <p className="text-xs opacity-80 mt-1">{error}</p>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white h-14 text-lg font-medium shadow-lg shadow-amber-900/20 transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Conectando ao PagSeguro...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar com Cartão (PagSeguro)
          </span>
        )}
      </Button>
      <p className="text-center text-xs text-amber-100/50 mt-3">
        Você será redirecionado para o ambiente seguro do PagSeguro para inserir os dados do seu cartão.
      </p>
    </div>
  );
};

export default PagSeguroCheckout;
