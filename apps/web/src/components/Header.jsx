
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Phone, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

const Header = ({ setIsCartOpen }) => {
  const { cartItems } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinkClasses = "text-sm font-medium tracking-wide text-amber-100/90 hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1 nav-link-hover py-1";
  const activeNavLinkClasses = "text-sm font-medium tracking-wide text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1 py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-amber-400 relative";

  const getLinkClass = (path) => {
    return location.pathname === path ? activeNavLinkClasses : navLinkClasses;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-amber-900/30 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 w-40 sm:w-64 flex justify-start z-50">
            <Link to="/" className="block interactive-transition hover:opacity-80" onClick={closeMenu}>
              <img
                src="https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/36de3f435cfb630cfce3995ff11f8b60.png"
                alt="Velour Perfumes"
                className="h-[44px] sm:h-[68px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-8">
            <Link to="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link to="/about" className={getLinkClass('/about')}>
              Quem Somos
            </Link>
            <Link to="/feminino" className={getLinkClass('/feminino')}>
              Feminino
            </Link>
            <Link to="/masculino" className={getLinkClass('/masculino')}>
              Masculino
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex-shrink-0 flex justify-end items-center space-x-2 sm:space-x-4 z-50">
            {/* WhatsApp Button (Desktop/Tablet) */}
            <a
              href="https://wa.me/5554999768543"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/30 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(22,163,74,0.1)] hover:shadow-[0_0_15px_rgba(22,163,74,0.2)] active:scale-95"
              title="Atendimento via WhatsApp"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline-block ml-2 text-sm font-medium">WhatsApp</span>
            </a>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative text-amber-100 hover:text-amber-400 hover:bg-amber-900/20 transition-colors h-10 w-10 rounded-full active:scale-95"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-950 text-amber-400 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-amber-400/50 shadow-[0_0_8px_rgba(217,119,6,0.4)]">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-amber-100 hover:text-amber-400 hover:bg-amber-900/20 transition-colors h-10 w-10 rounded-full active:scale-95"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-zinc-950 border-r border-amber-900/30 shadow-2xl z-[70] md:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-amber-900/20 bg-black/40">
                <img
                  src="https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/36de3f435cfb630cfce3995ff11f8b60.png"
                  alt="Velour Perfumes"
                  className="h-[40px] w-auto object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className="text-amber-100/70 hover:text-amber-400 hover:bg-amber-900/20 rounded-full h-10 w-10 active:scale-95 transition-all"
                  aria-label="Fechar menu"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col space-y-8">
                
                {/* Primary Links */}
                <div className="flex flex-col space-y-1">
                  <Link to="/" onClick={closeMenu} className="flex items-center justify-between py-3 text-lg font-medium text-amber-100 hover:text-amber-400 transition-colors border-b border-amber-900/10">
                    Home <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                  <Link to="/about" onClick={closeMenu} className="flex items-center justify-between py-3 text-lg font-medium text-amber-100 hover:text-amber-400 transition-colors border-b border-amber-900/10">
                    Quem Somos <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                  <Link to="/feminino" onClick={closeMenu} className="flex items-center justify-between py-3 text-lg font-medium text-amber-100 hover:text-amber-400 transition-colors border-b border-amber-900/10">
                    Feminino <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                  <Link to="/masculino" onClick={closeMenu} className="flex items-center justify-between py-3 text-lg font-medium text-amber-100 hover:text-amber-400 transition-colors border-b border-amber-900/10">
                    Masculino <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Footer (WhatsApp) */}
              <div className="p-6 border-t border-amber-900/20 bg-black/40 mt-auto">
                <a
                  href="https://wa.me/5554999768543"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98]"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <span className="font-medium">Atendimento via WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
