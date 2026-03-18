
import React from 'react';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/api/EcommerceApi';
import { getProductImageUrl } from '@/lib/imageUtils';
import { calculatePixPrice, calculatePixDiscount } from '@/lib/utils';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const brandName = product?.expand?.brand?.name || product?.brand?.name || 'Marca Desconhecida';

  // Use the helper function to get the first image safely
  const imageUrl = getProductImageUrl(product, 0);

  // Determine available sizes and lowest price
  const sizePrices = product?.sizePrices || {};
  const availableSizes = [];
  const prices = [];

  if (sizePrices.size30ml > 0) { availableSizes.push('30ml'); prices.push(sizePrices.size30ml); }
  
  // Support new 50ml size, fallback to 60ml for legacy data but display as 50ml
  if (sizePrices.size50ml > 0) { 
    availableSizes.push('50ml'); 
    prices.push(sizePrices.size50ml); 
  } else if (sizePrices.size60ml > 0) { 
    availableSizes.push('50ml'); 
    prices.push(sizePrices.size60ml); 
  }
  
  if (sizePrices.size100ml > 0) { availableSizes.push('100ml'); prices.push(sizePrices.size100ml); }

  // Fallback if no sizes are defined in sizePrices
  if (availableSizes.length === 0) {
    availableSizes.push('100ml');
    if (product?.price > 0) prices.push(product.price);
  }

  const lowestPrice = prices.length > 0 ? Math.min(...prices) : product?.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) return;

    // Default to the smallest available size for quick add
    const defaultSize = availableSizes[0] || '100ml';
    const defaultPrice = prices[0] || product.price || 0;

    const variant = { 
      id: `${product.id}-${defaultSize}`, 
      title: defaultSize, 
      price_in_cents: defaultPrice * 100, 
      inventory_quantity: product.stock || 100 
    };
    
    const productForCart = { ...product, image: imageUrl, title: product.name };
    
    try {
      addToCart(productForCart, variant, 1, product.stock || 100);
      toast({
        title: 'Produto adicionado! 🛒',
        description: `${product.name} (${defaultSize}) foi adicionado ao seu carrinho.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Erro ao adicionar',
        description: error.message || 'Não foi possível adicionar o produto.',
      });
    }
  };

  const currencyInfo = { code: 'BRL', symbol: 'R$ ' };
  
  const hasPrice = lowestPrice !== undefined && lowestPrice !== null && lowestPrice > 0;
  const pixPrice = hasPrice ? calculatePixPrice(lowestPrice) : 0;
  const savings = hasPrice ? calculatePixDiscount(lowestPrice) : 0;

  const formattedOriginalPrice = hasPrice ? formatCurrency(lowestPrice * 100, currencyInfo) : '';
  const formattedPixPrice = hasPrice ? formatCurrency(pixPrice * 100, currencyInfo) : 'Preço Indisponível';
  const formattedSavings = hasPrice ? formatCurrency(savings * 100, currencyInfo) : '';

  if (!product) return null;

  return (
    <div className="bg-zinc-950 border border-amber-900/30 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-[0_10px_40px_rgba(217,119,6,0.15)] transition-all duration-500 group flex flex-col h-full relative">
      {hasPrice && (
        <div className="absolute top-3 right-3 z-10 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-900/50">
          <Zap size={10} className="fill-current" />
          -10% PIX
        </div>
      )}
      
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-900">
        <img
          src={imageUrl}
          alt={product.name || 'Produto'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <span className="bg-amber-600/90 backdrop-blur-sm text-white px-6 py-2.5 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-lg shadow-black/50 font-medium tracking-wide">
            <Eye className="w-4 h-4" /> Ver Detalhes
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-2 flex-grow">
          <div className="flex justify-between items-start">
            <p className="text-amber-500/80 text-xs uppercase tracking-[0.2em] font-semibold">{brandName}</p>
            <div className="flex gap-1">
              {availableSizes.map(size => (
                <span key={size} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {size}
                </span>
              ))}
            </div>
          </div>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-amber-50 font-light text-xl line-clamp-2 hover:text-amber-400 transition-colors leading-snug">{product.name || 'Produto sem nome'}</h3>
          </Link>
          {product.description && (
            <p className="text-amber-100/60 text-sm line-clamp-3 font-light leading-relaxed pt-2">
              {product.description}
            </p>
          )}
        </div>
        
        <div className="pt-2 flex flex-col justify-end">
          {hasPrice ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-zinc-500 text-xs line-through">{formattedOriginalPrice}</span>
                <span className="text-green-500 text-[10px] font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                  Economize {formattedSavings}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-amber-400 text-lg font-medium tracking-wide drop-shadow-[0_0_12px_rgba(217,119,6,0.4)]">
                  {formattedPixPrice}
                </span>
                <span className="text-amber-500/70 text-xs font-medium">no Pix</span>
              </div>
            </>
          ) : (
            <p className="text-amber-400 text-lg font-medium tracking-wide drop-shadow-[0_0_12px_rgba(217,119,6,0.4)]">
              {formattedPixPrice}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-amber-900/30 mt-auto">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !hasPrice}
            className="w-full bg-transparent hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-600/50 h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
