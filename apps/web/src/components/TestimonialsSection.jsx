import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Mariana Silva',
      role: 'Cliente Verificada',
      text: 'Comprei o Chanel No. 5 e a experiência foi incrível. O perfume é 100% original, veio super bem embalado e a entrega foi dentro do prazo. Recomendo muito a Velour!',
      rating: 5
    },
    {
      name: 'Carlos Eduardo',
      role: 'Cliente Verificado',
      text: 'Atendimento impecável pelo WhatsApp. Me ajudaram a escolher o Creed Aventus e não me arrependo. Fixação absurda e projeção fantástica. Ganharam um cliente fiel.',
      rating: 5
    },
    {
      name: 'Ana Beatriz',
      role: 'Cliente Verificada',
      text: 'Amei a facilidade de comprar e o desconto no Pix valeu muito a pena. Meu Tom Ford Black Orchid chegou perfeito. A caixa é linda, puro luxo!',
      rating: 5
    }
  ];

  return (
    <section className="py-24 px-4 bg-zinc-950 border-t border-amber-900/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-amber-100 mb-4">
            O que dizem nossos clientes
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto font-light">
            A satisfação de quem já viveu a experiência Velour.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-black border border-amber-900/30 p-8 rounded-2xl relative hover:border-amber-600/50 transition-colors duration-300 shadow-lg shadow-black/50"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-amber-900/20" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              
              <p className="text-amber-100/80 font-light italic mb-8 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-amber-900/30 pt-6">
                <div className="w-12 h-12 bg-amber-900/40 rounded-full flex items-center justify-center text-amber-400 font-medium text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-amber-100 font-medium">{testimonial.name}</h4>
                  <p className="text-amber-100/50 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;