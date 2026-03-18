
import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [settingsId, setSettingsId] = useState(null);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const records = await pb.collection('settings').getList(1, 1, { $autoCancel: false });
        if (records.items.length > 0) {
          const settings = records.items[0];
          setSettingsId(settings.id);
          setFormData({
            storeName: settings.storeName || '',
            storeDescription: settings.storeDescription || '',
            contactEmail: settings.contactEmail || '',
            contactPhone: settings.contactPhone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (settingsId) {
        await pb.collection('settings').update(settingsId, formData, { $autoCancel: false });
      } else {
        const newRecord = await pb.collection('settings').create(formData, { $autoCancel: false });
        setSettingsId(newRecord.id);
      }
      toast({ title: 'Sucesso', description: 'Configurações salvas com sucesso.' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'Erro', description: 'Falha ao salvar configurações.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Configurações</h1>
        <p className="text-zinc-400 mt-1">Gerencie as informações gerais da loja.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Nome da Loja</Label>
              <Input 
                value={formData.storeName} 
                onChange={e => setFormData({...formData, storeName: e.target.value})} 
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500" 
                placeholder="Ex: Velour Perfumes"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Descrição da Loja</Label>
              <textarea 
                rows={4}
                value={formData.storeDescription} 
                onChange={e => setFormData({...formData, storeDescription: e.target.value})} 
                className="flex w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Breve descrição para SEO e rodapé..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-300">E-mail de Contato</Label>
                <Input 
                  type="email"
                  value={formData.contactEmail} 
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})} 
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500" 
                  placeholder="contato@velour.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Telefone / WhatsApp</Label>
                <Input 
                  value={formData.contactPhone} 
                  onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500" 
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Configurações
              </Button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;
