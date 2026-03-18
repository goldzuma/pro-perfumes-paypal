
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import ProductCard from '@/components/ProductCard';

const FemininePage = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const records = await pb.collection('brands').getFullList({
          sort: 'name',
          $autoCancel: false
        });
        setBrands(records);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // Fetch products when selectedBrand changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let filterStr = 'category="Feminino"';
        if (selectedBrand !== 'All') {
          filterStr += ` && brand="${selectedBrand}"`;
        }
        
        const records = await pb.collection('products').getFullList({
          filter: filterStr,
          sort: '-created',
          expand: 'brand',
          $autoCancel: false
        });
        
        setProducts(records);
      } catch (error) {
        console.error('[FemininePage] Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedBrand]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Perfumes Femininos | Velour Perfumes</title>
        <meta name="description" content="Descubra nossa coleção exclusiva de perfumes femininos. Fragrâncias marcantes das melhores marcas do mundo." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-amber-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-background to-background pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 mb-6 tracking-tight">
              Perfumes <span className="text-amber-500">Femininos</span>
            </h1>
            <p className="text-lg md:text-xl text-amber-100/70 leading-relaxed max-w-2xl">
              Descubra fragrâncias que expressam sua essência. Uma seleção cuidadosa das marcas mais desejadas do mundo para mulheres inesquecíveis.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Brands Filter Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar">
            <button
              onClick={() => setSelectedBrand('All')}
              className={`filter-btn ${selectedBrand === 'All' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
            >
              Todas as Marcas
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.name)}
                className={`filter-btn ${selectedBrand === brand.name ? 'filter-btn-active' : 'filter-btn-inactive'}`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <p className="text-amber-100/60">Buscando fragrâncias...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/30 rounded-2xl border border-amber-900/20">
            <Sparkles className="w-16 h-16 text-amber-500/30 mb-4" />
            <h3 className="text-2xl font-medium text-amber-100 mb-2">Nenhum perfume encontrado</h3>
            <p className="text-amber-100/60 max-w-md">
              Não encontramos perfumes femininos para a marca selecionada no momento. Tente selecionar outra marca.
            </p>
            <button 
              onClick={() => setSelectedBrand('All')}
              className="mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors"
            >
              Ver todas as marcas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FemininePage;
