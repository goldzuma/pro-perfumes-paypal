
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import ProductCard from './ProductCard.jsx';
import { Button } from '@/components/ui/button';

const ArabicPerfumesSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Removido o limite de getList(1, 50). Agora usa getFullList para trazer TODOS os produtos.
        const result = await pb.collection('products').getFullList({
          filter: 'category="Fragrâncias Árabe"',
          sort: '-created',
          expand: 'brand', // Expand brand para obter nome da marca
          $autoCancel: false
        });
        
        console.log(`[ArabicPerfumesSection] SUCESSO: ${result.length} produtos árabes carregados sem limite.`);
        setProducts(result);
      } catch (err) {
        console.error('[ArabicPerfumesSection] Error fetching Arabic perfumes:', err);
        setError('Não foi possível carregar a coleção de fragrâncias árabes.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-zinc-950 border-t border-amber-900/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-amber-100 mb-4">
              Fragrâncias Árabe
            </h2>
            <div className="w-24 h-1 bg-amber-600 mb-4 rounded-full"></div>
            <p className="text-amber-100/70 text-lg max-w-xl font-light">
              Descubra a essência do luxo oriental com nossa coleção exclusiva.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/catalog?category=Fragrâncias Árabe">
              <Button variant="outline" className="border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white transition-colors">
                Ver Todas <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-amber-500 bg-zinc-900/50 rounded-2xl border border-amber-900/30">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <p className="text-lg font-light text-center px-4">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-xl h-[400px] animate-pulse border border-amber-900/20"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-amber-100/60">
            <p>Nenhuma fragrância árabe encontrada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
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

export default ArabicPerfumesSection;
