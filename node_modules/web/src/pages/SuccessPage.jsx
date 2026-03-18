
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient';
import { useCart } from '@/hooks/useCart';
import { CheckCircle2, Loader2, XCircle, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [details, setDetails] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      apiServerClient.fetch(`/stripe/session/${sessionId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch session');
          return res.json();
        })
        .then(data => {
          setDetails(data);
          setStatus('success');
          clearCart();
        })
        .catch(err => {
          console.error('Error verifying session:', err);
          setStatus('error');
        });
    } else {
      // Fallback if accessed directly without session ID
      setStatus('success');
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-lg w-full bg-zinc-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-amber-900/30 text-center shadow-2xl">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-amber-100 mb-3">Verificando pagamento...</h1>
            <p className="text-amber-100/60">Aguarde um momento enquanto confirmamos seu pedido com a operadora.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-amber-100 mb-4">Pagamento Confirmado!</h1>
            <p className="text-amber-100/80 mb-8 text-lg">
              Seu pedido foi processado com sucesso. Agradecemos a preferência!
            </p>
            
            {details && (
              <div className="w-full bg-black/60 rounded-2xl p-6 mb-8 text-left border border-amber-900/20">
                <div className="flex items-center gap-2 mb-4 border-b border-amber-900/30 pb-3">
                  <Package className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Detalhes do Pedido</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/60">Status:</span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                      {details.status === 'paid' ? 'Pago' : details.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/60">Valor Total:</span>
                    <span className="text-amber-100 font-bold text-lg">R$ {(details.amountTotal / 100).toFixed(2)}</span>
                  </div>
                  {details.customerEmail && (
                    <div className="flex justify-between items-center pt-2 border-t border-amber-900/20">
                      <span className="text-amber-100/60">Email do recibo:</span>
                      <span className="text-amber-100 font-medium truncate ml-4">{details.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Link to="/catalog" className="w-full">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold h-14 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02]">
                Continuar Comprando <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-amber-100 mb-4">Erro na Verificação</h1>
            <p className="text-amber-100/80 mb-8">
              Não foi possível confirmar os detalhes do seu pagamento no momento. Se o valor foi debitado, entre em contato com o nosso suporte.
            </p>
            <div className="flex gap-4 w-full">
              <Link to="/catalog" className="flex-1">
                <Button variant="outline" className="w-full border-amber-900/50 text-amber-100 hover:bg-amber-900/20 h-12">
                  Voltar à Loja
                </Button>
              </Link>
              <a href="https://wa.me/5554999768543" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12">
                  Falar com Suporte
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
