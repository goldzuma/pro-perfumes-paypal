
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CancelPage = () => {
  return (
    <>
      <Helmet>
        <title>Pagamento Cancelado - Velour Perfumes</title>
      </Helmet>
      <div className="min-h-screen bg-black pt-32 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-light text-amber-100 mb-4">Pagamento Cancelado</h1>
          <p className="text-amber-100/70 mb-8">
            O seu pagamento foi cancelado ou ocorreu um erro durante o processamento. Nenhuma cobrança foi efetuada.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white w-full h-12">
            <Link to="/payment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CancelPage;
