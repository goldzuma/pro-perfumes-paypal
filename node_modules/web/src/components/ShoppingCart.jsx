
import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const total = Number(getCartTotal()) || 0;

  const handleNavigateToPayment = () => {
    try {
      setIsNavigating(true);
      setTimeout(() => {
        setIsCartOpen(false);
        navigate('/payment');
        setIsNavigating(false);
      }, 300);
    } catch (error) {
      setIsNavigating(false);
      toast({
        title: 'Erro de navegação',
        description: 'Não foi possível redirecionar para a página de pagamento.',
        variant: 'destructive'
      });
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => !isNavigating && setIsCartOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-zinc-950 border-l border-amber-900/30 shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-amber-900/30 flex items-center justify-between bg-black/50">
              <h2 className="text-lg font-medium text-amber-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" /> Carrinho
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCartOpen(false)} 
                disabled={isNavigating}
                className="text-amber-100 hover:text-amber-400 hover:bg-amber-900/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!cartItems || cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-amber-100/50">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <Button 
                    variant="link" 
                    onClick={() => { setIsCartOpen(false); navigate('/catalog'); }}
                    className="mt-4 text-amber-500 hover:text-amber-400"
                  >
                    Continuar comprando
                  </Button>
                </div>
              ) : (
                cartItems.map(item => {
                  const itemId = item.id || item.variant?.id || item.product?.id;
                  const itemPrice = parseFloat(item.price || (item.variant?.price_in_cents / 100) || item.product?.price || 0);
                  
                  return (
                    <div key={itemId} className="flex gap-4 bg-zinc-900/50 p-3 rounded-xl border border-amber-900/20 hover:border-amber-900/50 transition-colors">
                      <img 
                        src={item.image || item.product?.image || 'https://placehold.co/100x100'} 
                        alt={item.name || item.product?.title || 'Produto'} 
                        className="w-20 h-20 object-cover rounded-lg bg-black" 
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-amber-100 line-clamp-2">{item.name || item.product?.title}</h3>
                          <p className="text-amber-400 font-medium mt-1">
                            R$ {itemPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-black rounded-lg border border-amber-900/30 px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))} 
                              className="text-amber-100 hover:text-amber-400 transition-colors"
                              disabled={isNavigating}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-amber-100 w-4 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(itemId, item.quantity + 1)} 
                              className="text-amber-100 hover:text-amber-400 transition-colors"
                              disabled={isNavigating}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(itemId)} 
                            className="text-red-400/70 hover:text-red-400 p-1 transition-colors"
                            aria-label="Remover item"
                            disabled={isNavigating}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cartItems?.length > 0 && (
              <div className="p-6 border-t border-amber-900/30 bg-black/80 backdrop-blur-md">
                <div className="flex justify-between mb-6 text-amber-100">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold text-amber-400">R$ {total.toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold h-14 text-lg rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/20"
                    onClick={handleNavigateToPayment}
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    {isNavigating ? 'Redirecionando...' : 'Finalizar Compra'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
