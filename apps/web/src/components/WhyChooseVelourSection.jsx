import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, MessageCircle } from 'lucide-react';

const WhyChooseVelourSection = () => {
  const benefits = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-amber-400" />,
      title: 'Perfumes 100% Originais',
      description: 'Garantimos a autenticidade de todos os nossos produtos importados diretamente das marcas.'
    },
    {
      icon: <Truck className="w-10 h-10 text-amber-400" />,
      title: 'Frete Grátis',
      description: 'Aproveite frete grátis para todo o Brasil em compras acima de R$ 400,00.'
    },
    {
      icon: <Clock className="w-10 h-10 text-amber-400" />,
      title: 'Entrega Rápida',
      description: 'Receba seus produtos com segurança no prazo estimado de 10 a 25 dias úteis.'
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-amber-400" />,
      title: 'Suporte Premium',
      description: 'Atendimento personalizado via WhatsApp para tirar todas as suas dúvidas.'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-zinc-950 to-black border-t border-amber-900/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-amber-100 mb-4">
            Por que escolher a Velour?
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto font-light">
            Compromisso com a excelência e a sua satisfação em cada detalhe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-900/40 border border-amber-900/30 p-8 rounded-2xl hover:bg-zinc-900/80 hover:border-amber-600/50 transition-all duration-300 group text-center"
            >
              <div className="w-20 h-20 mx-auto bg-amber-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-medium text-amber-100 mb-3">{benefit.title}</h3>
              <p className="text-amber-100/60 font-light leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseVelourSection;