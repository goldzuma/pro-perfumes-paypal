
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const MercadoPagoSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const preferenceId = searchParams.get('preference_id');
  const paymentId = searchParams.get('payment_id');
  const mpStatus = searchParams.get('status');
  
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    console.log('[MPSuccess] Params:', { preferenceId, paymentId, mpStatus });

    if (!preferenceId && !paymentId) {
      setStatus('error');
      setErrorMsg('Parâmetros de pagamento ausentes na URL.');
      return;
    }

    // If Mercado Pago already tells us it's approved via URL, we can trust it initially
    // but we still verify with backend if possible.
    if (mpStatus === 'approved') {
      setStatus('success');
      clearCart();
    } else if (mpStatus === 'pending' || mpStatus === 'in_process') {
      setStatus('pending');
    } else if (mpStatus === 'rejected' || mpStatus === 'null') {
      setStatus('error');
      setErrorMsg('O pagamento foi recusado pelo Mercado Pago.');
      return;
    }

    // Verify with backend if we have a preferenceId
    const checkStatus = async () => {
      if (!preferenceId) return;
      
      try {
        console.log(`[MPSuccess] Verificando status para preferenceId: ${preferenceId}`);
        const response = await apiServerClient.fetch(`/mercado-pago/payment-status/${preferenceId}`);
        
        if (!response.ok) {
          throw new Error('Falha ao buscar status do pagamento no servidor');
        }
        
        const data = await response.json();
        console.log('[MPSuccess] Dados recebidos:', data);
        setPaymentData(data);
        
        if (data.paymentStatus === 'approved') {
          setStatus('success');
          clearCart();
        } else if (data.paymentStatus === 'pending') {
          setStatus('pending');
        } else if (data.paymentStatus === 'rejected' || data.paymentStatus === 'cancelled') {
          setStatus('error');
          setErrorMsg(`Pagamento ${data.paymentStatus === 'rejected' ? 'recusado' : 'cancelado'}.`);
        }
      } catch (error) {
        console.error('[MPSuccess] Erro ao verificar status:', error);
        // If we already set success based on URL params, keep it. Otherwise show error.
        if (status !== 'success' && status !== 'pending') {
          setStatus('error');
          setErrorMsg('Não foi possível confirmar o status com o servidor, mas seu pedido pode ter sido processado.');
        }
      }
    };

    checkStatus();
  }, [preferenceId, paymentId, mpStatus, clearCart]);

  return (
    <>
      <Helmet>
        <title>Status do Pagamento - Velour Perfumes</title>
      </Helmet>
      
      <div className="min-h-screen bg-black pt-32 pb-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-amber-900/30 rounded-2xl p-8 text-center shadow-2xl shadow-amber-900/10">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
              <h2 className="text-2xl font-light text-amber-100 mb-3">Verificando Pagamento...</h2>
              <p className="text-amber-100/60 font-light">Aguarde um momento enquanto confirmamos seu pagamento com o Mercado Pago.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-4">
              <AlertCircle className="w-16 h-16 text-red-500 mb-6 opacity-90" />
              <h2 className="text-2xl font-light text-amber-100 mb-3">Aviso de Verificação</h2>
              <p className="text-amber-100/60 mb-8 font-light">
                {errorMsg || 'Não foi possível confirmar o status exato do seu pagamento no momento.'}
              </p>
              <Link to="/payment" className="w-full mb-3">
                <Button variant="outline" className="w-full border-amber-900/50 text-amber-100 hover:bg-amber-900/20 h-12">
                  Tentar Novamente
                </Button>
              </Link>
              <Link to="/" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg">
                  Voltar para a Loja
                </Button>
              </Link>
            </div>
          )}

          {status === 'pending' && (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
              <h2 className="text-2xl font-light text-amber-100 mb-3">Pagamento Pendente</h2>
              <p className="text-amber-100/60 mb-8 font-light">
                Seu pagamento está sendo processado pelo Mercado Pago. Você receberá um e-mail assim que for aprovado.
              </p>
              <Link to="/" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg">
                  Voltar para a Loja
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
                Seu pedido foi processado com sucesso e já estamos preparando o envio.
              </p>
              
              <div className="bg-black/50 rounded-xl p-5 w-full mb-8 text-left border border-amber-900/20 space-y-3">
                <div className="flex justify-between items-center border-b border-amber-900/20 pb-3">
                  <span className="text-sm text-amber-100/60">ID do Pedido</span>
                  <span className="text-sm font-medium text-amber-400 break-all">
                    {paymentId || paymentData?.preference_id || preferenceId}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-amber-900/20 pb-3">
                  <span className="text-sm text-amber-100/60">Status</span>
                  <span className="text-sm font-medium text-green-400 uppercase bg-green-500/10 px-2 py-1 rounded">
                    Aprovado
                  </span>
                </div>
                {paymentData?.totalAmount && (
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-amber-100/60">Valor Total</span>
                    <span className="text-lg font-medium text-amber-400">
                      R$ {Number(paymentData.totalAmount).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
              </div>

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

export default MercadoPagoSuccessPage;
