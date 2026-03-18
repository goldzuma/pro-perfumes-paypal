import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const FinalCTABanner = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Gradient & Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-amber-950 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay z-0"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-black/40 backdrop-blur-sm border border-amber-600/30 p-10 md:p-16 rounded-3xl shadow-2xl shadow-amber-900/20"
        >
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wide">
            Encontre a Sua <span className="text-amber-400 font-medium">Assinatura</span>
          </h2>
          <p className="text-amber-100/80 text-lg md:text-xl mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Explore nosso catálogo completo e descubra a fragrância perfeita que expressa a sua verdadeira essência.
          </p>
          
          <Link to="/catalog">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-7 text-lg rounded-full shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-all duration-300 hover:-translate-y-1"
            >
              Explorar Todos os Perfumes
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTABanner;