
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const CheckoutModal = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  
  const initialData = {
    fullName: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleClear = () => {
    setFormData(initialData);
    setErrors({});
    toast({
      title: "Formulário limpo",
      description: "Todos os campos foram redefinidos.",
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.complement.trim()) newErrors.complement = 'Complemento é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (formData.zipCode.replace(/\D/g, '').length < 8) {
      newErrors.zipCode = 'CEP inválido';
    }
    
    if (!formData.country.trim()) newErrors.country = 'País é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios corretamente.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        postalCode: formData.zipCode
      };
      
      if (typeof onSubmit === 'function') {
        await onSubmit(submissionData);
      } else {
        throw new Error('Handler de submissão não encontrado.');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: error.message || "Ocorreu um erro ao processar seus dados. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-zinc-950 border-amber-900/30 text-amber-50 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-400">Dados de Entrega</DialogTitle>
          <DialogDescription className="text-amber-100/60">
            Preencha todos os campos abaixo para prosseguirmos com o pagamento seguro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          
          {/* Section 1: Personal Info */}
          <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
            <h3 className="text-lg font-medium text-amber-100 border-b border-amber-900/30 pb-2">1. Informações Pessoais</h3>
            
            <div className="form-group">
              <Label htmlFor="fullName" className="form-label">Nome Completo *</Label>
              <Input 
                id="fullName" name="fullName" 
                value={formData.fullName} onChange={handleChange}
                className={`form-input ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="Ex: João da Silva"
              />
              {errors.fullName && <p className="form-error text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <Label htmlFor="email" className="form-label">Email *</Label>
                <Input 
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  className={`form-input ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: joao@exemplo.com"
                />
                {errors.email && <p className="form-error text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="form-group">
                <Label htmlFor="phone" className="form-label">Telefone *</Label>
                <Input 
                  id="phone" name="phone" 
                  value={formData.phone} onChange={handleChange}
                  className={`form-input ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: (11) 99999-9999"
                />
                {errors.phone && <p className="form-error text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
            <h3 className="text-lg font-medium text-amber-100 border-b border-amber-900/30 pb-2">2. Endereço</h3>
            
            <div className="form-group">
              <Label htmlFor="street" className="form-label">Rua / Avenida *</Label>
              <Input 
                id="street" name="street" 
                value={formData.street} onChange={handleChange}
                className={`form-input ${errors.street ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="Ex: Av. Paulista"
              />
              {errors.street && <p className="form-error text-red-400 text-xs mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <Label htmlFor="number" className="form-label">Número *</Label>
                <Input 
                  id="number" name="number" 
                  value={formData.number} onChange={handleChange}
                  className={`form-input ${errors.number ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: 1000"
                />
                {errors.number && <p className="form-error text-red-400 text-xs mt-1">{errors.number}</p>}
              </div>
              <div className="form-group">
                <Label htmlFor="complement" className="form-label">Complemento *</Label>
                <Input 
                  id="complement" name="complement" 
                  value={formData.complement} onChange={handleChange}
                  className={`form-input ${errors.complement ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: Apto 42, Bloco B"
                />
                {errors.complement && <p className="form-error text-red-400 text-xs mt-1">{errors.complement}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: City/State/Zip */}
          <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
            <h3 className="text-lg font-medium text-amber-100 border-b border-amber-900/30 pb-2">3. Localidade</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <Label htmlFor="city" className="form-label">Cidade *</Label>
                <Input 
                  id="city" name="city" 
                  value={formData.city} onChange={handleChange}
                  className={`form-input ${errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: São Paulo"
                />
                {errors.city && <p className="form-error text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div className="form-group">
                <Label htmlFor="state" className="form-label">Estado *</Label>
                <Input 
                  id="state" name="state" 
                  value={formData.state} onChange={handleChange}
                  className={`form-input ${errors.state ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: SP"
                  maxLength={2}
                />
                {errors.state && <p className="form-error text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>
              <div className="form-group">
                <Label htmlFor="zipCode" className="form-label">CEP *</Label>
                <Input 
                  id="zipCode" name="zipCode" 
                  value={formData.zipCode} onChange={handleChange}
                  className={`form-input ${errors.zipCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Ex: 01310-100"
                />
                {errors.zipCode && <p className="form-error text-red-400 text-xs mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Country */}
          <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
            <h3 className="text-lg font-medium text-amber-100 border-b border-amber-900/30 pb-2">4. País</h3>
            
            <div className="form-group">
              <Label htmlFor="country" className="form-label">País *</Label>
              <Input 
                id="country" name="country" 
                value={formData.country} onChange={handleChange}
                className={`form-input ${errors.country ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="Ex: Brasil"
              />
              {errors.country && <p className="form-error text-red-400 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Existem erros no formulário. Por favor, verifique os campos destacados em vermelho antes de continuar.</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 border-t border-amber-900/30">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClear}
              className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Formulário
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose(false)}
                className="border-amber-900/50 text-amber-100 hover:bg-amber-900/20"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-black font-medium min-w-[180px] shadow-lg shadow-amber-600/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSubmitting ? 'Processando...' : 'Continuar para Pagamento'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
