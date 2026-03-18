
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import ProductCard from './ProductCard.jsx';

const FeaturedPerfumesSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Removido o limite de getList(1, 6). Agora usa getFullList para trazer TODOS os produtos.
        const result = await pb.collection('products').getFullList({
          $autoCancel: false,
          sort: '-created',
          expand: 'brand' // Expand brand para obter nome da marca
        });
        
        console.log(`[FeaturedPerfumesSection] SUCESSO: ${result.length} produtos carregados sem limite.`);
        setProducts(result);
      } catch (err) {
        console.error('[FeaturedPerfumesSection] Error fetching featured products:', err);
        setError('Não foi possível carregar os destaques no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-amber-500/80 text-sm uppercase tracking-[0.3em] font-semibold mb-4 block">Seleção Exclusiva</span>
          <h2 className="text-4xl md:text-6xl font-light text-amber-50 mb-6 tracking-tight">
            Destaques Velour
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8 rounded-full"></div>
          <p className="text-amber-100/70 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Descubra as fragrâncias mais desejadas do momento. Uma curadoria perfeita entre a delicadeza feminina e a presença marcante masculina.
          </p>
        </motion.div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-amber-500 bg-zinc-900/50 rounded-2xl border border-amber-900/30">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <p className="text-lg font-light text-center px-4">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-xl h-[450px] animate-pulse border border-amber-900/20"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-amber-100/60">
            <p>Nenhum produto em destaque encontrado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.15, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPerfumesSection;
