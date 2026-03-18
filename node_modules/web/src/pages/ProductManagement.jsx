
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2, PackageSearch } from 'lucide-react';
import { useBrandsSync } from '@/hooks/useBrandsSync.js';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const { brands, loading: brandsLoading } = useBrandsSync();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    description: '',
    stock: 0
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      // Added expand: 'brand' to fetch the related brand record
      const records = await pb.collection('products').getFullList({ 
        sort: '-created',
        expand: 'brand',
        $autoCancel: false 
      });
      setProducts(records);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível carregar os produtos.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        // Brand is a relation field, so we send the ID. If empty, send null to clear it.
        brand: formData.brand || null,
        // Category is a select field, so we send the string name.
        category: formData.category || ""
      };

      if (editingId) {
        await pb.collection('products').update(editingId, dataToSave, { $autoCancel: false });
        toast({ title: 'Sucesso', description: 'Produto atualizado com sucesso.' });
      } else {
        await pb.collection('products').create(dataToSave, { $autoCancel: false });
        toast({ title: 'Sucesso', description: 'Produto criado com sucesso.' });
      }
      
      setFormData({ name: '', price: '', category: '', brand: '', description: '', stock: 0 });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Product save error details:', error);
      
      let errorMessage = error.message || 'Ocorreu um erro ao salvar o produto.';
      
      // Extract specific validation errors from PocketBase response
      if (error.response?.data) {
        const validationErrors = Object.entries(error.response.data)
          .map(([field, errObj]) => `${field}: ${errObj.message}`)
          .join(' | ');
          
        if (validationErrors) {
          errorMessage = `Erro de validação: ${validationErrors}`;
        }
      }

      toast({
        title: 'Erro ao salvar produto',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await pb.collection('products').delete(id, { $autoCancel: false });
      toast({ title: 'Sucesso', description: 'Produto excluído.' });
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível excluir o produto.', 
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category || '', // Category is stored as a string name
      brand: product.brand || '',       // Brand is stored as a relation ID
      description: product.description || '',
      stock: product.stock || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper functions to display names in the table
  const getCategoryName = (categoryValue) => {
    return categoryValue || '-';
  };

  const getBrandName = (brandId) => {
    if (!brandId) return '-';
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <PackageSearch className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold text-amber-100">Gerenciar Produtos</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-4 bg-zinc-900/50 p-6 rounded-2xl border border-amber-900/30 h-fit sticky top-24">
          <h2 className="text-xl font-medium text-amber-100 mb-6">
            {editingId ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-100">Nome do Produto</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
                className="bg-black border-amber-900/50 text-amber-100 focus-visible:ring-amber-500"
                placeholder="Ex: Chanel No. 5"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-amber-100">Preço (R$)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  required 
                  className="bg-black border-amber-900/50 text-amber-100 focus-visible:ring-amber-500"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-amber-100">Estoque</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  min="0"
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                  required 
                  className="bg-black border-amber-900/50 text-amber-100 focus-visible:ring-amber-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-amber-100">Categoria</Label>
                <select 
                  id="category" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-black border border-amber-900/50 text-amber-100 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Unissex">Unissex</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-amber-100">Marca</Label>
                <select 
                  id="brand" 
                  value={formData.brand} 
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  disabled={brandsLoading}
                  className="w-full bg-black border border-amber-900/50 text-amber-100 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  <option value="">Selecione uma marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold h-11 mt-4"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : editingId ? (
                <Edit className="w-5 h-5 mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {editingId ? 'Atualizar Produto' : 'Criar Produto'}
            </Button>
            
            {editingId && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => { 
                  setEditingId(null); 
                  setFormData({ name: '', price: '', category: '', brand: '', description: '', stock: 0 }); 
                }} 
                className="w-full text-amber-100/60 hover:text-amber-100 hover:bg-amber-900/20"
              >
                Cancelar Edição
              </Button>
            )}
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-8 bg-zinc-900/50 p-6 rounded-2xl border border-amber-900/30">
          <h2 className="text-xl font-medium text-amber-100 mb-6">Lista de Produtos ({products.length})</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-amber-900/20">
              <table className="w-full text-left text-sm text-amber-100/80">
                <thead className="text-xs uppercase bg-black/80 text-amber-100/60 border-b border-amber-900/30">
                  <tr>
                    <th className="px-4 py-4 font-medium">Nome</th>
                    <th className="px-4 py-4 font-medium">Categoria</th>
                    <th className="px-4 py-4 font-medium">Marca</th>
                    <th className="px-4 py-4 font-medium">Preço</th>
                    <th className="px-4 py-4 font-medium">Estoque</th>
                    <th className="px-4 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-black/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-amber-100">{product.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-amber-900/30 text-amber-400 px-2 py-1 rounded-md text-xs">
                          {getCategoryName(product.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-amber-100/70">
                        {/* Use expanded brand name, fallback to local state, then raw ID */}
                        {product.expand?.brand?.name || getBrandName(product.brand)}
                      </td>
                      <td className="px-4 py-3 font-medium">R$ {product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.stock > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(product)} 
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 h-8 w-8 mr-1"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(product.id)} 
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-amber-100/50">
                        Nenhum produto cadastrado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
