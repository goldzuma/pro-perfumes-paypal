
import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import ShoppingCart from './components/ShoppingCart.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PayPalSuccessPage from './pages/PayPalSuccessPage.jsx';
import PayPalCancelPage from './pages/PayPalCancelPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ReturnPolicyPage from './pages/ReturnPolicyPage.jsx';
import ProductCatalog from './pages/ProductCatalog.jsx';
import FemininePage from './pages/FemininePage.jsx';
import MasculinePage from './pages/MasculinePage.jsx';

// Admin Pages
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProductManagement from './pages/ProductManagement.jsx';
import BrandManagement from './pages/BrandManagement.jsx';
import CategoryManagement from './pages/CategoryManagement.jsx';
import AdminSettings from './pages/AdminSettings.jsx';

import { Toaster } from './components/ui/toaster.jsx';

// Layout wrapper for public routes to include Header/Footer
const PublicLayout = ({ children, setIsCartOpen }) => (
  <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
    <Header setIsCartOpen={setIsCartOpen} />
    <main className="flex-1 pt-20 sm:pt-24">
      {children}
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          
          {/* ShoppingCart is rendered globally and controlled via state */}
          <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
          
          <Routes>
            {/* 1. Rota de Login Admin (PÚBLICA e ESPECÍFICA) */}
            <Route path="/admin" element={<AdminLogin />} />
            
            {/* 2. Rotas Protegidas do Admin */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/brands" element={<BrandManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* 3. Rotas Públicas da Loja */}
            <Route path="/" element={<PublicLayout setIsCartOpen={setIsCartOpen}><HomePage /></PublicLayout>} />
            <Route path="/product/:id" element={<PublicLayout setIsCartOpen={setIsCartOpen}><ProductDetailPage /></PublicLayout>} />
            <Route path="/payment" element={<PublicLayout setIsCartOpen={setIsCartOpen}><PaymentPage /></PublicLayout>} />
            <Route path="/paypal-success" element={<PublicLayout setIsCartOpen={setIsCartOpen}><PayPalSuccessPage /></PublicLayout>} />
            <Route path="/paypal-cancel" element={<PublicLayout setIsCartOpen={setIsCartOpen}><PayPalCancelPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout setIsCartOpen={setIsCartOpen}><AboutPage /></PublicLayout>} />
            <Route path="/return-policy" element={<PublicLayout setIsCartOpen={setIsCartOpen}><ReturnPolicyPage /></PublicLayout>} />
            <Route path="/catalog" element={<PublicLayout setIsCartOpen={setIsCartOpen}><ProductCatalog /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout setIsCartOpen={setIsCartOpen}><ProductCatalog /></PublicLayout>} />
            
            {/* Novas Rotas de Categoria */}
            <Route path="/feminino" element={<PublicLayout setIsCartOpen={setIsCartOpen}><FemininePage /></PublicLayout>} />
            <Route path="/masculino" element={<PublicLayout setIsCartOpen={setIsCartOpen}><MasculinePage /></PublicLayout>} />
            
            {/* 4. Catch-all Route (SEMPRE POR ÚLTIMO) */}
            <Route path="*" element={<PublicLayout setIsCartOpen={setIsCartOpen}><HomePage /></PublicLayout>} />
          </Routes>
          
          <Toaster />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
