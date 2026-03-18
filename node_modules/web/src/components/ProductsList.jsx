
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import ProductCard from './ProductCard.jsx';

const ProductsList = ({ categoryFilter = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const options = { 
          $autoCancel: false,
          sort: '-created',
          expand: 'brand' // Expand brand para obter nome da marca
        };

        if (categoryFilter) {
          options.filter = `category="${categoryFilter}"`;
        }

        // Usando getFullList para garantir que TODOS os produtos sejam retornados sem limite de paginação
        const records = await pb.collection('products').getFullList(options);
        
        setProducts(records);
      } catch (err) {
        console.error('[ProductsList] Erro ao buscar produtos:', err);
        setError('Não foi possível carregar a lista de produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-amber-500 bg-zinc-900/50 rounded-2xl border border-amber-900/30">
        <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
        <p className="text-lg font-light text-center px-4">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-amber-100/60">
        <p>Nenhum produto encontrado{categoryFilter ? ` para a categoria "${categoryFilter}"` : ''}.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
