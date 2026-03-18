import React from 'react';
import { Helmet } from 'react-helmet';
import { Package, Truck, Clock, Shield } from 'lucide-react';

const ReturnPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Devolução e Troca - Velour Perfumes</title>
        <meta
          name="description"
          content="Conheça nossa política de devolução, troca e informações sobre entrega."
        />
      </Helmet>

      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-light text-amber-100 mb-4">
                Política de Devolução e Troca
              </h1>
              <p className="text-amber-100/70 text-lg">
                Sua satisfação é nossa prioridade
              </p>
            </div>

            {/* Shipping Info */}
            <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Truck className="w-8 h-8 text-amber-400" />
                <h2 className="text-2xl font-light text-amber-100">Informações de Entrega</h2>
              </div>
              <div className="space-y-4 text-amber-100/80">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-100 mb-1">Prazo de Entrega</p>
                    <p>10 a 25 dias úteis após a confirmação do pagamento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-100 mb-1">Frete Grátis</p>
                    <p>Para compras acima de R$ 400,00 em todo o Brasil</p>
                    <p className="text-sm text-amber-100/60 mt-1">
                      Compras abaixo deste valor: taxa de frete de R$ 30,00
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-100 mb-1">Rastreamento</p>
                    <p>
                      Todos os pedidos incluem código de rastreamento enviado por email após o
                      despacho
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-light text-amber-100 mb-6">
                Política de Devolução e Troca
              </h2>
              <div className="space-y-6 text-amber-100/80">
                <div>
                  <h3 className="text-lg text-amber-100 font-semibold mb-2">
                    Prazo para Devolução
                  </h3>
                  <p>
                    Você tem até 7 dias corridos, a partir do recebimento do produto, para
                    solicitar a devolução ou troca, conforme o Código de Defesa do Consumidor.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg text-amber-100 font-semibold mb-2">
                    Condições para Devolução
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Produto sem uso, com embalagem original intacta e lacrada</li>
                    <li>Nota fiscal e todos os acessórios que acompanham o produto</li>
                    <li>Produto sem sinais de violação ou uso</li>
                    <li>
                      Perfumes não podem ser devolvidos se o lacre de segurança estiver rompido
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg text-amber-100 font-semibold mb-2">Como Solicitar</h3>
                  <p className="mb-2">
                    Para solicitar devolução ou troca, entre em contato conosco através do
                    WhatsApp:
                  </p>
                  <a
                    href="https://wa.me/5554999768543"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    WhatsApp: (54) 99976-8543
                  </a>
                </div>

                <div>
                  <h3 className="text-lg text-amber-100 font-semibold mb-2">
                    Reembolso e Estorno
                  </h3>
                  <p>
                    Após a aprovação da devolução, o reembolso será processado em até 7 dias
                    úteis. O prazo para o estorno na fatura do cartão pode variar conforme a
                    operadora.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg text-amber-100 font-semibold mb-2">Trocas</h3>
                  <p>
                    Trocas por outros produtos estão sujeitas à disponibilidade em estoque. O
                    frete para devolução e reenvio será por nossa conta em caso de produto com
                    defeito ou erro no envio.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-6">
              <h3 className="text-lg text-amber-100 font-semibold mb-3">Importante</h3>
              <ul className="space-y-2 text-amber-100/80 text-sm">
                <li>
                  • Produtos em promoção ou com desconto seguem as mesmas regras de devolução
                </li>
                <li>
                  • O frete de devolução é por conta do cliente, exceto em casos de defeito ou
                  erro no envio
                </li>
                <li>
                  • Garantimos a autenticidade de todos os produtos. Qualquer suspeita de
                  falsificação será investigada
                </li>
                <li>
                  • Produtos danificados durante o transporte devem ser reportados em até 48
                  horas após o recebimento
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicyPage;