
import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart.jsx';
import MercadoPagoCheckout from '@/components/MercadoPagoCheckout.jsx';
import PayPalCheckout from '@/components/PayPalCheckout.jsx';
import PixPayment from '@/components/PixPayment.jsx';
import StripeCheckoutButton from '@/components/StripeCheckoutButton.jsx';
import CheckoutModal from '@/components/CheckoutModal.jsx';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Wallet, ShieldCheck, Loader2, AlertTriangle, RefreshCcw, CreditCard } from 'lucide-react';

class PaymentMethodBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[PaymentBoundary] Erro no componente ${this.props.methodName}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-sm flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Falha ao carregar {this.props.methodName}</p>
              <p className="text-xs opacity-80 mt-1">{this.state.error?.message || 'Erro interno no componente.'}</p>
            </div>
          </div>
          <button 
            onClick={this.handleReset}
            className="self-start flex items-center text-xs bg-red-900/40 hover:bg-red-900/60 px-3 py-1.5 rounded-md transition-colors"
          >
            <RefreshCcw className="w-3 h-3 mr-1.5" /> Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PaymentPage = () => {
  const { getCartTotal, getValidCartItems, validateCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [triggerPayPal, setTriggerPayPal] = useState(false);
  
  const validItems = getValidCartItems();
  const isCartValid = validateCart();
  const total = getCartTotal() || 0;

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar a página de pagamento.');
      setIsLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleOpenModal = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (formData) => {
    try {
      setCheckoutData(formData);
      setIsCheckoutModalOpen(false);
      setTriggerPayPal(true);
    } catch (err) {
      console.error('Error handling checkout submit:', err);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-950/30 p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-2">Erro ao carregar</h1>
          <p className="text-amber-100/70 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleRetry}
              className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-amber-100 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Tentar novamente
            </button>
            <Link to="/catalog" className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-black font-medium px-6 py-3 rounded-lg transition-colors">
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-amber-100">Preparando checkout...</h2>
        <p className="text-amber-100/50 mt-2">Ambiente seguro</p>
      </div>
    );
  }

  if (!isCartValid) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-amber-900/30 max-w-md w-full">
          <Wallet className="w-12 h-12 text-amber-500/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-100 mb-2">Seu carrinho está vazio</h1>
          <p className="text-amber-100/60 mb-8">Adicione alguns produtos antes de finalizar a compra.</p>
          <Link to="/catalog" className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-black font-medium px-6 py-3 rounded-lg transition-colors w-full">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <Link to="/catalog" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a loja
      </Link>
      
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-100">Finalizar Compra</h1>
        <ShieldCheck className="w-8 h-8 text-green-500" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Order Summary */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="bg-zinc-900/50 p-6 md:p-8 rounded-2xl border border-amber-900/30 h-fit sticky top-32">
            <h2 className="text-xl font-medium text-amber-100 mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {validItems.map(item => {
                const itemPrice = item.price || (item.variant?.price_in_cents / 100) || item.product?.price || 0;
                const itemName = item.name || item.product?.title || 'Produto';
                const itemImage = item.image || item.product?.image || 'https://placehold.co/100x100';
                
                return (
                  <div key={item.id || item.variant?.id} className="flex gap-4 text-sm">
                    <div className="w-16 h-16 rounded-md bg-black overflow-hidden flex-shrink-0 border border-amber-900/20">
                      <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-amber-100/90 font-medium line-clamp-2">{itemName}</span>
                      <span className="text-amber-100/50 mt-1">Qtd: {item.quantity}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 font-medium">R$ {(itemPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-amber-900/30 pt-6 space-y-3">
              <div className="flex justify-between items-center text-amber-100/70">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-amber-100/70">
                <span>Frete</span>
                <span className="text-green-400">Grátis</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-amber-900/20 mt-3">
                <span className="text-lg font-medium text-amber-100">Total</span>
                <span className="text-3xl font-bold text-amber-400">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <h2 className="text-xl font-medium text-amber-100 mb-6">Escolha a Forma de Pagamento</h2>
          
          {!isCartValid && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-sm flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>O valor total do carrinho é inválido. Verifique os itens antes de prosseguir.</span>
            </div>
          )}

          {/* Pix */}
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Recomendado
            </div>
            <div className="flex items-center gap-4 mb-4 text-amber-100">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Pix</h3>
                <p className="text-sm text-amber-100/60">Aprovação instantânea com 10% de desconto.</p>
              </div>
            </div>
            <div className="mt-6">
              <PaymentMethodBoundary methodName="Pix">
                <PixPayment amount={total} disabled={!isCartValid || isLoading} />
              </PaymentMethodBoundary>
            </div>
          </div>

          {/* Mercado Pago */}
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-blue-500/30 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4 text-amber-100">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Mercado Pago</h3>
                <p className="text-sm text-amber-100/60">Pague com seu saldo ou cartão via Mercado Pago.</p>
              </div>
            </div>
            <div className="mt-6">
              <PaymentMethodBoundary methodName="Mercado Pago">
                <MercadoPagoCheckout amount={total} items={validItems} disabled={!isCartValid || isLoading} />
              </PaymentMethodBoundary>
            </div>
          </div>

          {/* PayPal */}
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-sky-500/30 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4 text-amber-100">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">PayPal</h3>
                <p className="text-sm text-amber-100/60">Pague com segurança usando sua conta PayPal.</p>
              </div>
            </div>
            <div className="mt-6">
              <PaymentMethodBoundary methodName="PayPal">
                <PayPalCheckout 
                  amount={total} 
                  items={validItems} 
                  disabled={!isCartValid || isLoading} 
                  checkoutData={checkoutData}
                  onOpenModal={handleOpenModal}
                  triggerPayment={triggerPayPal}
                  onPaymentTriggered={() => setTriggerPayPal(false)}
                />
              </PaymentMethodBoundary>
            </div>
          </div>

          {/* Stripe */}
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4 text-amber-100">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Cartão de Crédito (Stripe)</h3>
                <p className="text-sm text-amber-100/60">Pagamento internacional seguro via Stripe.</p>
              </div>
            </div>
            <div className="mt-6">
              <PaymentMethodBoundary methodName="Stripe">
                <StripeCheckoutButton 
                  amount={total} 
                  productName="Pedido Velour Perfumes" 
                  disabled={!isCartValid || isLoading} 
                />
              </PaymentMethodBoundary>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-amber-100/40 mt-8">
            <ShieldCheck className="w-4 h-4" />
            <span>Ambiente 100% seguro e criptografado</span>
          </div>
        </div>
      </div>

      {/* Checkout Modal for Customer Data */}
      <PaymentMethodBoundary methodName="CheckoutModal">
        <CheckoutModal 
          isOpen={isCheckoutModalOpen} 
          onClose={setIsCheckoutModalOpen} 
          onSubmit={handleCheckoutSubmit} 
        />
      </PaymentMethodBoundary>
    </div>
  );
};

export default PaymentPage;
