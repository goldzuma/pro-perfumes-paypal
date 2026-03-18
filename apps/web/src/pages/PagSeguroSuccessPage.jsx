
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const PagSeguroSuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the user successfully completes a payment
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Helmet>
        <title>Pagamento Confirmado - Velour Perfumes</title>
      </Helmet>
      <div className="min-h-screen bg-black pt-32 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="bg-zinc-900 border border-amber-900/30 rounded-2xl p-8 shadow-2xl shadow-amber-900/10">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-light text-amber-100 mb-4">Pedido Confirmado!</h1>
            
            <p className="text-amber-100/70 mb-8 leading-relaxed">
              Obrigado por comprar na Velour Perfumes. Seu pagamento foi processado com sucesso pelo PagSeguro. 
              Você receberá um e-mail com os detalhes do seu pedido em breve.
            </p>
            
            <div className="space-y-4">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-base">
                <Link to="/catalog">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Continuar Comprando
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-amber-900/50 text-amber-100 hover:bg-amber-900/20 h-12 text-base">
                <Link to="/">
                  Voltar para o Início
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagSeguroSuccessPage;
