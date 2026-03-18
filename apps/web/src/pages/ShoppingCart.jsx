
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext.jsx';
import { Button } from '@/components/ui/button';
import { getProductImageUrl } from '@/lib/imageUtils';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, calculateFreight } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const freight = calculateFreight(subtotal);
  const total = subtotal + freight;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Carrinho de Compras - Velour Perfumes</title>
          <meta name="description" content="Seu carrinho de compras está vazio." />
        </Helmet>

        <div className="min-h-screen bg-black pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center py-20">
              <ShoppingBag className="w-24 h-24 text-amber-400/30 mx-auto mb-6" />
              <h1 className="text-3xl font-light text-amber-100 mb-4">
                Seu carrinho está vazio
              </h1>
              <p className="text-amber-100/60 mb-8">
                Adicione produtos ao carrinho para continuar comprando
              </p>
              <Link to="/catalog">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Carrinho de Compras - Velour Perfumes</title>
        <meta name="description" content="Revise seus produtos e finalize sua compra." />
      </Helmet>

      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-light text-amber-100 mb-8">Carrinho de Compras</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                // If item.image is already a full URL (saved by ProductCard), use it.
                // Otherwise, try to resolve it using the helper.
                const imageUrl = typeof item.image === 'string' && item.image.startsWith('http')
                  ? item.image
                  : getProductImageUrl(item);

                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-amber-900/30 rounded-lg p-4 flex gap-4"
                  >
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-amber-400 text-xs uppercase">{item.brand}</p>
                          <h3 className="text-amber-100 font-light text-lg">{item.name}</h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-amber-100 p-1 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-amber-100 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-amber-100 p-1 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-amber-400 text-xl font-light">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-light text-amber-100 mb-6">Resumo do Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-amber-100/80">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-100/80">
                    <span>Frete</span>
                    <span>{freight === 0 ? 'Grátis' : `R$ ${freight.toFixed(2)}`}</span>
                  </div>
                  {freight === 0 && (
                    <p className="text-green-400 text-sm">
                      🎉 Você ganhou frete grátis!
                    </p>
                  )}
                  {freight > 0 && subtotal < 400 && (
                    <p className="text-amber-100/60 text-sm">
                      Faltam R$ {(400 - subtotal).toFixed(2)} para frete grátis
                    </p>
                  )}
                  <div className="border-t border-amber-900/30 pt-4">
                    <div className="flex justify-between text-amber-100 text-xl font-light">
                      <span>Total</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
                  <p className="text-amber-400 text-sm font-semibold mb-1">
                    💰 Desconto no Pix
                  </p>
                  <p className="text-amber-100/80 text-sm">
                    Ganhe 10% de desconto pagando via Pix
                  </p>
                  <p className="text-amber-400 text-lg font-light mt-2">
                    R$ {(total * 0.9).toFixed(2)} no Pix
                  </p>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  size="lg"
                >
                  Finalizar Compra
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Link to="/catalog">
                  <Button
                    variant="outline"
                    className="w-full mt-3 border-amber-900/30 text-amber-100 hover:bg-amber-900/20"
                  >
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
