import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const AddressForm = ({ address, setAddress, errors, setErrors }) => {
  const [loadingCep, setLoadingCep] = useState(false);

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = (e) => {
    const formatted = formatCep(e.target.value);
    setAddress({ ...address, cep: formatted });
    
    if (errors.cep) {
      setErrors({ ...errors, cep: '' });
    }
  };

  const fetchAddressByCep = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      setErrors({ ...errors, cep: 'CEP deve ter 8 dígitos' });
      return;
    }

    setLoadingCep(true);
    setErrors({ ...errors, cep: '' });

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErrors({ ...errors, cep: 'CEP não encontrado' });
        return;
      }

      setAddress({
        ...address,
        cep: formatCep(cleanCep),
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      });
    } catch (error) {
      console.error('Error fetching CEP:', error);
      setErrors({ ...errors, cep: 'Erro ao buscar CEP' });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepBlur = () => {
    const cleanCep = address.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetchAddressByCep(address.cep);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <Label htmlFor="cep" className="text-amber-100/80 mb-2 block">
            CEP *
          </Label>
          <div className="relative">
            <Input
              id="cep"
              type="text"
              value={address.cep}
              onChange={handleCepChange}
              onBlur={handleCepBlur}
              placeholder="00000-000"
              maxLength={9}
              required
              className={`bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12 ${
                errors.cep ? 'border-red-500' : ''
              }`}
            />
            {loadingCep && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 animate-spin" />
            )}
          </div>
          {errors.cep && (
            <p className="text-red-400 text-sm mt-1">{errors.cep}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-3">
          <Label htmlFor="rua" className="text-amber-100/80 mb-2 block">
            Rua *
          </Label>
          <Input
            id="rua"
            type="text"
            value={address.rua}
            onChange={(e) => setAddress({ ...address, rua: e.target.value })}
            required
            className="bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12"
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="numero" className="text-amber-100/80 mb-2 block">
            Número *
          </Label>
          <Input
            id="numero"
            type="text"
            value={address.numero}
            onChange={(e) => setAddress({ ...address, numero: e.target.value })}
            required
            className="bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="complemento" className="text-amber-100/80 mb-2 block">
          Complemento
        </Label>
        <Input
          id="complemento"
          type="text"
          value={address.complemento}
          onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
          placeholder="Apto, Bloco, etc."
          className="bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <Label htmlFor="bairro" className="text-amber-100/80 mb-2 block">
            Bairro *
          </Label>
          <Input
            id="bairro"
            type="text"
            value={address.bairro}
            onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
            required
            className="bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12"
          />
        </div>
        <div>
          <Label htmlFor="cidade" className="text-amber-100/80 mb-2 block">
            Cidade *
          </Label>
          <Input
            id="cidade"
            type="text"
            value={address.cidade}
            onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
            required
            className="bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12"
          />
        </div>
        <div>
          <Label htmlFor="estado" className="text-amber-100/80 mb-2 block">
            Estado *
          </Label>
          <Input
            id="estado"
            type="text"
            value={address.estado}
            onChange={(e) => setAddress({ ...address, estado: e.target.value.toUpperCase() })}
            placeholder="SP"
            maxLength={2}
            required
            className="bg-black border-amber-900/50 text-amber-100 focus:border-amber-500 h-12"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;