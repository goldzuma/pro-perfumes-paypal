
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, Minus, Plus, ChevronDown, ChevronUp, Truck, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrency } from '@/api/EcommerceApi';
import { getProductImageUrl } from '@/lib/imageUtils';
import { calculatePixPrice, calculatePixDiscount } from '@/lib/utils';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await pb.collection('products').getOne(id, { 
          $autoCancel: false,
          expand: 'brand' // Expand brand para obter nome da marca
        });
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Determine available sizes and prices
  const sizePrices = product?.sizePrices || {};
  const availableSizes = [];
  
  if (sizePrices.size30ml > 0) availableSizes.push({ id: '30ml', label: '30ml', price: sizePrices.size30ml });
  
  // Support new 50ml size, fallback to 60ml for legacy data but display as 50ml
  if (sizePrices.size50ml > 0) {
    availableSizes.push({ id: '50ml', label: '50ml', price: sizePrices.size50ml });
  } else if (sizePrices.size60ml > 0) {
    availableSizes.push({ id: '50ml', label: '50ml', price: sizePrices.size60ml });
  }
  
  if (sizePrices.size100ml > 0) availableSizes.push({ id: '100ml', label: '100ml', price: sizePrices.size100ml });

  // Fallback if no sizes are defined
  if (availableSizes.length === 0 && product) {
    availableSizes.push({ id: '100ml', label: '100ml', price: product.price || 0 });
  }

  // Auto-select first available size
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0].id);
    }
  }, [availableSizes, selectedSize]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const providedImages = [
    { url: 'https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/21e92ecdec5176131f67f494bb9912b9.webp' },
    { url: 'https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/284316f10fe5f799a585ef9cece3829e.webp' },
    { url: 'https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/57eb56a96516aa25b05273524da0b3ec.webp' },
    { url: 'https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/fb22fee826adcffdf2cd49ef556d7b45.webp' }
  ];

  const hasImages = product?.image && (Array.isArray(product.image) ? product.image.length > 0 : true);
  const productImages = hasImages
    ? (Array.isArray(product.image) 
        ? product.image.map((_, idx) => ({ url: getProductImageUrl(product, idx) }))
        : [{ url: getProductImageUrl(product, 0) }])
    : providedImages;

  const currentSizeObj = availableSizes.find(s => s.id === selectedSize) || availableSizes[0];
  const currentPrice = currentSizeObj?.price || product?.price || 0;

  const handleAddToCart = async () => {
    if (product && currentSizeObj) {
      setIsAdding(true);
      const availableQuantity = product.stock || 100;
      
      const variant = { 
        id: `${product.id}-${currentSizeObj.id}`, 
        title: currentSizeObj.label, 
        price_in_cents: currentPrice * 100, 
        inventory_quantity: availableQuantity 
      };
      
      const productForCart = { 
        ...product, 
        image: productImages[0].url, 
        title: product.name,
        price: currentPrice
      };

      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        addToCart(productForCart, variant, quantity, availableQuantity);
        toast({
          title: "Adicionado ao Carrinho! 🛒",
          description: `${quantity} x ${product.name} (${currentSizeObj.label}) adicionado com sucesso.`,
          className: "bg-green-600 text-white border-none",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ops! Algo deu errado.",
          description: error.message,
        });
      } finally {
        setIsAdding(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center items-center">
        <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <div className="text-center text-red-500 p-8 bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 rounded-2xl shadow-sm">
            <p className="mb-6 text-lg">Erro ao carregar produto: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const pixPrice = calculatePixPrice(currentPrice);
  const pixSavings = calculatePixDiscount(currentPrice);
  
  const currencyInfo = { code: 'BRL', symbol: 'R$ ' };
  const formattedOriginalPrice = formatCurrency(currentPrice * 100, currencyInfo);
  const formattedPixPrice = formatCurrency(pixPrice * 100, currencyInfo);
  const formattedSavings = formatCurrency(pixSavings * 100, currencyInfo);
  
  const installments = 6;
  const installmentValue = currentPrice / installments;
  const formattedInstallment = formatCurrency(installmentValue * 100, currencyInfo);

  const currentImage = productImages[currentImageIndex] || productImages[0];

  // Lógica robusta para extrair o nome da marca
  const brandName = product?.expand?.brand?.name || product?.brand?.name || 'Marca Desconhecida';

  return (
    <>
      <Helmet>
        <title>{product.name} - Velour Perfumes</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.name} />
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex text-sm text-zinc-500 dark:text-zinc-400 mb-8 font-medium tracking-wide">
            <Link to="/" className="hover:text-green-600 transition-colors">Início</Link>
            <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
            <Link to="/catalog" className="hover:text-green-600 transition-colors">Catálogo</Link>
            <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
            <span className="text-zinc-900 dark:text-zinc-100">{brandName}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column: Image Gallery (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={currentImage.url}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-green-500 shadow-md' 
                          : 'border-transparent hover:border-green-500/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details (60%) */}
            <div className="w-full lg:w-[60%] flex flex-col">
              
              {/* Brand Badge */}
              <div className="mb-4">
                <span className="inline-block bg-black text-white dark:bg-white dark:text-black px-3 py-1 rounded text-xs font-bold tracking-widest uppercase shadow-sm">
                  {brandName}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Pricing Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl text-zinc-500 dark:text-zinc-400 line-through">
                    {formattedOriginalPrice}
                  </span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap size={12} className="fill-current" />
                    ECONOMIZE {formattedSavings}
                  </span>
                </div>
                
                {/* Pix Discount Box */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <div className="text-sm text-green-800 dark:text-green-500 font-medium mb-1">Preço com 10% de desconto no Pix</div>
                    <span className="text-4xl font-extrabold text-green-700 dark:text-green-400 transition-all duration-300">
                      {formattedPixPrice}
                    </span>
                  </div>
                  <div className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-4 py-2 rounded-lg text-sm font-semibold text-center">
                    Você economiza {formattedSavings} com Pix!
                  </div>
                </div>
                
                {/* Installments */}
                <div className="text-zinc-600 dark:text-zinc-400 text-base">
                  Ou <strong className="text-zinc-900 dark:text-zinc-200">{formattedOriginalPrice}</strong> em até <strong className="text-zinc-900 dark:text-zinc-200">{installments}x de {formattedInstallment}</strong> sem juros no cartão
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-8">
                <label className="block text-zinc-900 dark:text-zinc-200 font-semibold mb-3">
                  Selecione o Tamanho
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 border-2 ${
                        selectedSize === size.id
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500 shadow-sm'
                          : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-green-500/50 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Buy Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* Quantity Selector */}
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 h-14 w-full sm:w-36 shrink-0">
                  <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="flex-1 flex items-center justify-center text-zinc-500 hover:text-green-600 transition-colors h-full"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-semibold text-zinc-900 dark:text-white text-lg">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="flex-1 flex items-center justify-center text-zinc-500 hover:text-green-600 transition-colors h-full"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Buy Button */}
                <Button 
                  onClick={handleAddToCart} 
                  disabled={isAdding || !currentSizeObj}
                  className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {isAdding ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-6 w-6" />
                  )}
                  {isAdding ? 'ADICIONANDO...' : 'COMPRAR'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mb-8 py-4 border-y border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <ShieldCheck className="text-green-600" size={20} />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Truck className="text-green-600" size={20} />
                  <span>Envio para todo Brasil</span>
                </div>
              </div>

              {/* Shipping Section (Collapsible) */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50">
                <button 
                  onClick={() => setIsShippingOpen(!isShippingOpen)} 
                  className="flex justify-between items-center w-full p-4 text-left font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Truck size={20} className="text-zinc-500" /> 
                    MEIOS DE ENVIO
                  </span>
                  {isShippingOpen ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-400" />}
                </button>
                
                <AnimatePresence>
                  {isShippingOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                          Calcule o prazo e valor do frete para sua região:
                        </p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="00000-000" 
                            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                          />
                          <Button variant="outline" className="shrink-0 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            Calcular
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
          
          {/* Product Description Section */}
          <div id="details" className="mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Detalhes do Produto</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.description || 'Uma fragrância exclusiva e sofisticada, perfeita para momentos inesquecíveis. A vida é bela com esta assinatura olfativa única que combina notas florais e doces para criar uma aura de elegância e feminilidade.'}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;
