
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { formatCurrency } from '@/api/EcommerceApi';
import { AlertCircle } from 'lucide-react';
import { getProductImageUrl } from '@/lib/imageUtils';

const AutoScrollCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await pb.collection('products').getList(1, 10, {
          $autoCancel: false,
          sort: '-created'
        });
        setProducts(result.items);
      } catch (err) {
        console.error('Error fetching products for carousel:', err);
        setError('Não foi possível carregar os produtos do carrossel.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getLowestPrice = (product) => {
    const sp = product?.sizePrices || {};
    const prices = [];
    if (sp.size30ml > 0) prices.push(sp.size30ml);
    if (sp.size50ml > 0) prices.push(sp.size50ml);
    if (sp.size60ml > 0) prices.push(sp.size60ml); // Legacy support
    if (sp.size100ml > 0) prices.push(sp.size100ml);
    
    if (prices.length === 0 && product?.price > 0) prices.push(product.price);
    return prices.length > 0 ? Math.min(...prices) : product?.price;
  };

  if (loading) {
    return (
      <div className="w-full py-16 flex justify-center items-center bg-zinc-950">
        <div className="text-amber-500/50 animate-pulse">Carregando coleção...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 flex flex-col justify-center items-center bg-zinc-950 text-amber-500/80">
        <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-16 flex justify-center items-center bg-zinc-950">
        <p className="text-amber-100/60 font-light">Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  // Duplicate the products array to create a seamless infinite loop
  const duplicatedProducts = [...products, ...products, ...products];

  return (
    <section className="py-16 bg-zinc-950 overflow-hidden border-y border-amber-900/20">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-light text-amber-100 tracking-wide mb-4">
          Nossos Perfumes
        </h2>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full opacity-50"></div>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Gradient masks for smooth fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee gap-6 px-6">
          {duplicatedProducts.map((product, index) => {
            const lowestPrice = getLowestPrice(product);
            const formattedPrice = lowestPrice > 0 
              ? `A partir de ${formatCurrency(lowestPrice * 100)}` 
              : 'Preço Indisponível';

            return (
              <Link
                key={`${product.id}-${index}`}
                to={`/product/${product.id}`}
                className="group relative flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] bg-black border border-amber-900/30 rounded-xl overflow-hidden shadow-lg hover:shadow-amber-900/40 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[4/5] overflow-hidden bg-zinc-900 relative">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-amber-500/80 text-xs uppercase tracking-wider mb-1 font-medium">
                    {product.brand || 'Exclusivo'}
                  </p>
                  <h3 className="text-amber-50 font-medium text-lg line-clamp-1 mb-1 group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-amber-300 font-light text-md">
                    {formattedPrice}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AutoScrollCarousel;
