
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MercadoPagoCancelPage = () => {
  return (
    <>
      <Helmet>
        <title>Pagamento Cancelado - Velour Perfumes</title>
      </Helmet>
      <div className="min-h-screen bg-black pt-32 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-8 shadow-2xl shadow-red-900/10">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-light text-amber-100 mb-4">Pagamento Cancelado</h1>
            
            <p className="text-amber-100/70 mb-8 leading-relaxed">
              O seu pagamento foi cancelado ou ocorreu um erro durante o processamento no Mercado Pago. 
              Nenhuma cobrança foi efetuada no seu cartão.
            </p>
            
            <div className="space-y-4">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-base">
                <Link to="/payment">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Tentar Novamente
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-amber-900/50 text-amber-100 hover:bg-amber-900/20 h-12 text-base">
                <Link to="/catalog">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar para a Loja
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MercadoPagoCancelPage;
