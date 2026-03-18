
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import ProductCard from '@/components/ProductCard.jsx';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Helper for timeout handling
const fetchWithTimeout = async (promise, ms = 10000) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('A requisição demorou muito para responder (Timeout).')), ms);
  });
  return Promise.race([promise, timeout]);
};

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Data states
  const [products, setProducts] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  // ONLY main categories allowed
  const categories = ['Feminino', 'Masculino'];

  const selectedCategory = searchParams.get('category') || '';

  // 1. Reset products when filters change
  useEffect(() => {
    setProducts([]); // Clear products immediately for better UX
  }, [selectedCategory, sortBy]);

  // 2. Fetch ALL products without pagination
  const fetchProducts = useCallback(async () => {
    let isMounted = true;
    
    setLoading(true);
    setError(null);

    try {
      const filters = [];
      // Filter ONLY by main category
      if (selectedCategory && selectedCategory !== 'all') {
        filters.push(`category = "${selectedCategory}"`);
      }
      const filterStr = filters.join(' && ');

      const sortStr = sortBy === 'price-asc' ? 'price' : sortBy === 'price-desc' ? '-price' : 'name';

      // Fetch ALL products without limit using getFullList
      const result = await fetchWithTimeout(
        pb.collection('products').getFullList({
          filter: filterStr,
          sort: sortStr,
          expand: 'brand',
          $autoCancel: false,
        }),
        10000
      );

      if (isMounted) {
        setProducts(result);
      }
    } catch (err) {
      console.error('[ProductCatalog] Erro ao buscar produtos:', err);
      if (isMounted) {
        setError(`Falha ao carregar o catálogo. Detalhes: ${err.message}`);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
    
    return () => { isMounted = false; };
  }, [selectedCategory, sortBy]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. Memoized Handlers to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((category) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <>
      <Helmet>
        <title>Catálogo de Perfumes - Velour Perfumes</title>
        <meta
          name="description"
          content="Explore nossa coleção completa de perfumes importados premium. Fragrâncias femininas e masculinas das melhores marcas."
        />
      </Helmet>

      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-amber-100 mb-4">
              Catálogo de Perfumes
            </h1>
            <p className="text-amber-100/70 text-lg">
              Descubra fragrâncias exclusivas das melhores marcas do mundo
            </p>
          </div>

          {/* Filters - ONLY Main Category and Sort */}
          <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Main Category Filter */}
              <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[220px] bg-zinc-900 border-amber-900/30 text-amber-100">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-amber-900/30">
                  <SelectItem value="all" className="text-amber-100">
                    Todas as Categorias
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-amber-100">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-zinc-900 border-amber-900/30 text-amber-100">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-amber-900/30">
                  <SelectItem value="name" className="text-amber-100">
                    Nome (A-Z)
                  </SelectItem>
                  <SelectItem value="price-asc" className="text-amber-100">
                    Menor Preço
                  </SelectItem>
                  <SelectItem value="price-desc" className="text-amber-100">
                    Maior Preço
                  </SelectItem>
                </SelectContent>
              </Select>

              {selectedCategory && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-amber-900/30 text-amber-100 hover:bg-amber-900/20"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>

            <p className="text-amber-100/60 text-sm">
              {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>

          {/* Error State with Retry */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-amber-500 bg-zinc-900/50 rounded-2xl border border-amber-900/30 mb-8">
              <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
              <p className="text-lg font-light text-center px-4">{error}</p>
              <Button onClick={() => fetchProducts()} variant="outline" className="mt-4 border-amber-600 text-amber-400 hover:bg-amber-900/20">
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Initial Loading Skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-zinc-900/50 rounded-xl h-[400px] animate-pulse border border-amber-900/20"></div>
              ))}
            </div>
          )}

          {/* Products Grid - Flat, no sub-categories */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* No products message */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/30 rounded-xl border border-amber-900/20">
              <p className="text-amber-100/60 text-lg">
                Nenhum produto encontrado com os filtros atuais.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4 border-amber-600 text-amber-400 hover:bg-amber-900/20">
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCatalog;
