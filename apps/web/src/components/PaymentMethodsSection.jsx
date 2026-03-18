import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CreditCard, Wallet } from 'lucide-react';

const PaymentMethodsSection = () => {
  const methods = [
    {
      icon: <Smartphone className="w-10 h-10 text-amber-400" />,
      title: 'Pix',
      badge: '10% de Desconto',
      description: 'Aprovação imediata. Ganhe 10% de desconto em toda a loja pagando com Pix.'
    },
    {
      icon: <CreditCard className="w-10 h-10 text-amber-400" />,
      title: 'Cartão de Crédito',
      badge: 'Até 12x',
      description: 'Parcele suas compras em até 12x no cartão de crédito com total segurança.'
    },
    {
      icon: <Wallet className="w-10 h-10 text-amber-400" />,
      title: 'Mercado Pago',
      badge: 'Compra Garantida',
      description: 'Pague com saldo do Mercado Pago, boleto ou cartões com a proteção do Mercado Pago.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-zinc-950 border-t border-amber-900/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-amber-100 mb-4">
            Formas de Pagamento
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto font-light">
            Escolha a melhor opção para você com total segurança e praticidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-black border border-amber-900/30 p-8 rounded-2xl relative hover:border-amber-600/50 transition-all duration-300 shadow-lg shadow-black/50 group"
            >
              <div className="absolute -top-4 right-6 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-900/50">
                {method.badge}
              </div>
              
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-amber-900/30">
                {method.icon}
              </div>
              
              <h3 className="text-2xl font-medium text-amber-100 mb-3">{method.title}</h3>
              <p className="text-amber-100/60 font-light leading-relaxed">
                {method.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;