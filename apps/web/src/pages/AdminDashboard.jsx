
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tags, FolderTree, ShoppingBag, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const StatCard = ({ title, value, icon: Icon, colorClass, to }) => {
  const CardContent = (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center space-x-4 hover:bg-zinc-800/80 transition-colors h-full">
      <div className={`p-4 rounded-lg ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-zinc-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-zinc-100 mt-1">{value}</h3>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {CardContent}
    </Link>
  ) : (
    <div className="h-full">{CardContent}</div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    brands: 0,
    categories: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, brandsRes, categoriesRes, ordersRes] = await Promise.all([
          pb.collection('products').getList(1, 1, { $autoCancel: false }),
          pb.collection('brands').getList(1, 1, { $autoCancel: false }),
          pb.collection('categories').getList(1, 1, { $autoCancel: false }),
          pb.collection('orders').getList(1, 1, { $autoCancel: false })
        ]);

        setStats({
          products: productsRes.totalItems,
          brands: brandsRes.totalItems,
          categories: categoriesRes.totalItems,
          orders: ordersRes.totalItems
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Falha ao carregar estatísticas.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Visão geral da sua loja. Clique nos cards para gerenciar.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total de Produtos" 
            value={stats.products} 
            icon={Package} 
            colorClass="bg-blue-500/10 text-blue-500" 
            to="/admin/products"
          />
          <StatCard 
            title="Marcas Cadastradas" 
            value={stats.brands} 
            icon={Tags} 
            colorClass="bg-purple-500/10 text-purple-500" 
            to="/admin/brands"
          />
          <StatCard 
            title="Categorias" 
            value={stats.categories} 
            icon={FolderTree} 
            colorClass="bg-green-500/10 text-green-500" 
            to="/admin/categories"
          />
          <StatCard 
            title="Pedidos Realizados" 
            value={stats.orders} 
            icon={ShoppingBag} 
            colorClass="bg-amber-500/10 text-amber-500" 
            to="/admin/orders"
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
