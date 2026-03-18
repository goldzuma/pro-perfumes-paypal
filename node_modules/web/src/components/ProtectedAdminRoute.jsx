
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = () => {
  const { currentUser, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-amber-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium tracking-wide">Verificando credenciais...</p>
      </div>
    );
  }

  // Se não estiver logado ou não for admin, redireciona para a rota de login (/admin)
  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Se estiver autenticado como admin, renderiza o layout com as rotas filhas
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default ProtectedAdminRoute;
