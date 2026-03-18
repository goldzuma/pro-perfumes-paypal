
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, ShoppingBag, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import apiServerClient from '@/lib/apiServerClient';

const PayPalSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const payerId = searchParams.get('PayerID') || searchParams.get('payerId');
  
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { clearCart } = useCart();
  const hasExecuted = useRef(false);

  const executePayment = async () => {
    if (!paymentId || !payerId) {
      setStatus('error');
      setError('Parâmetros de pagamento ausentes na URL. Não foi possível confirmar a transação.');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await apiServerClient.fetch('/paypal/execute-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, payerId })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Falha ao capturar pagamento no servidor');
      }
      
      const data = await response.json();
      console.log('[PayPalSuccess] Captura concluída:', data);
      
      setPaymentDetails(data);
      setStatus('success');
      clearCart();
    } catch (err) {
      console.error('[PayPalSuccess] Erro ao processar:', err);
      setStatus('error');
      setError(err.message || 'Ocorreu um erro ao confirmar seu pagamento.');
    }
  };

  useEffect(() => {
    if (!hasExecuted.current) {
      hasExecuted.current = true;
      executePayment();
    }
  }, [paymentId, payerId]);

  return (
    <>
      <Helmet>
        <title>Pagamento Confirmado - Velour Perfumes</title>
      </Helmet>
      
      <div className="min-h-screen bg-black pt-32 pb-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-amber-900/30 rounded-2xl p-8 text-center shadow-2xl shadow-amber-900/10">
          
          {status === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
              <h2 className="text-2xl font-light text-amber-100 mb-3">Finalizando Pagamento...</h2>
              <p className="text-amber-100/60 font-light">Aguarde um momento enquanto confirmamos seu pagamento com o PayPal.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-4">
              <AlertCircle className="w-16 h-16 text-red-500 mb-6 opacity-90" />
              <h2 className="text-2xl font-light text-amber-100 mb-3">Aviso de Verificação</h2>
              <p className="text-amber-100/60 mb-8 font-light">
                {error || 'Não foi possível confirmar o status exato do seu pagamento no momento.'}
              </p>
              <Button 
                onClick={executePayment}
                variant="outline" 
                className="w-full border-amber-900/50 text-amber-100 hover:bg-amber-900/20 h-12 mb-3"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Tentar Novamente
              </Button>
              <Link to="/payment" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg">
                  Voltar para Pagamento
                </Button>
              </Link>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-light text-amber-100 mb-3">Pagamento Aprovado!</h2>
              <p className="text-amber-100/70 mb-8 font-light">
                Seu pedido foi processado com sucesso via PayPal e já estamos preparando o envio.
              </p>
              
              {paymentDetails && (
                <div className="bg-black/50 rounded-xl p-5 w-full mb-8 text-left border border-amber-900/20 space-y-3">
                  <div className="flex justify-between items-center border-b border-amber-900/20 pb-3">
                    <span className="text-sm text-amber-100/60">ID do Pagamento</span>
                    <span className="text-sm font-medium text-amber-400 break-all">{paymentDetails.id || paymentId}</span>
                  </div>
                  {paymentDetails.amount && (
                    <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 pt-1">
                      <span className="text-sm text-amber-100/60">Valor</span>
                      <span className="text-sm font-medium text-amber-100">R$ {paymentDetails.amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-amber-100/60">Status</span>
                    <span className="text-sm font-medium text-green-400 uppercase bg-green-500/10 px-2 py-1 rounded">
                      {paymentDetails.status === 'approved' ? 'Aprovado' : paymentDetails.status}
                    </span>
                  </div>
                </div>
              )}

              <Link to="/" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg shadow-lg shadow-amber-900/20">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PayPalSuccessPage;
