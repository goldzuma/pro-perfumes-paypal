import React from 'react';
import { motion } from 'framer-motion';

const PartnerBrandsSection = () => {
  const brands = [
    { name: 'Chanel', image: 'https://images.unsplash.com/photo-1631701368016-dfb7bd2fbd59' },
    { name: 'Dior', image: 'https://images.unsplash.com/photo-1689574715339-787a393e19e8' },
    { name: 'Guerlain', image: 'https://images.unsplash.com/photo-1689574715211-af4afe6a6da8' },
    { name: 'Tom Ford', image: 'https://images.unsplash.com/photo-1593418874217-8596085282e4' },
    { name: 'Creed', image: 'https://images.unsplash.com/photo-1591348278900-019a8a2a8b1d' }
  ];

  return (
    <section className="py-24 px-4 bg-black border-t border-amber-900/20 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-amber-100 mb-4">
            Marcas Parceiras
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-amber-100/70 text-lg max-w-2xl mx-auto font-light">
            Trabalhamos apenas com as casas de perfumaria mais prestigiadas do mundo.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer border border-amber-900/30 hover:border-amber-500/50 transition-colors"
            >
              <img 
                src={brand.image} 
                alt={`${brand.name} Perfumes`} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-center pb-6">
                <h3 className="text-amber-100 text-xl font-light tracking-widest uppercase transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {brand.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerBrandsSection;