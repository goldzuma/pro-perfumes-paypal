
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useBrandsSync } from '@/hooks/useBrandsSync.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BrandManagement = () => {
  const { brands, loading } = useBrandsSync();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setName(brand.name);
    } else {
      setEditingBrand(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBrand) {
        await pb.collection('brands').update(editingBrand.id, { name }, { $autoCancel: false });
        toast({ title: 'Sucesso', description: 'Marca atualizada com sucesso.' });
      } else {
        await pb.collection('brands').create({ name }, { $autoCancel: false });
        toast({ title: 'Sucesso', description: 'Marca criada com sucesso.' });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving brand:', error);
      toast({ title: 'Erro', description: 'Falha ao salvar marca.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta marca? Esta ação não pode ser desfeita.')) {
      try {
        await pb.collection('brands').delete(id, { $autoCancel: false });
        toast({ title: 'Sucesso', description: 'Marca excluída com sucesso.' });
      } catch (error) {
        console.error('Error deleting brand:', error);
        toast({ title: 'Erro', description: 'Falha ao excluir marca.', variant: 'destructive' });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Marcas</h1>
          <p className="text-zinc-400 mt-1">Gerencie as marcas dos produtos.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nova Marca
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-3xl">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Nome da Marca</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-100">{brand.name}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(brand)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(brand.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-zinc-500">Nenhuma marca encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl text-amber-500">
              {editingBrand ? 'Editar Marca' : 'Nova Marca'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Nome da Marca</Label>
              <Input 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500" 
                placeholder="Ex: Chanel"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BrandManagement;
