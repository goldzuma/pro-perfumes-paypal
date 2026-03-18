
import React, { useState, useEffect, useRef } from 'react';
import { Copy, CheckCircle2, Info, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PixPayment = ({ onCopy, amount }) => {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  
  const pixKey = '47.006.756/0001-01';
  const companyName = 'MasterCred Connect Finanças e Consórcio Ltda.';
  
  // Gerar URL do QR Code estático para a chave PIX (usando API pública para fins visuais)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}&bgcolor=000000&color=2dd4bf`;

  // 1. Logs detalhados de ciclo de vida e dados
  useEffect(() => {
    console.log('[PixPayment] Componente montado com sucesso.');
    console.log('[PixPayment] Referência do container DOM:', containerRef.current);
    console.log('[PixPayment] Dados recebidos:', { pixKey, companyName, amount });
    
    return () => {
      console.log('[PixPayment] Componente desmontado. Limpando recursos...');
    };
  }, [amount]);

  // 2. Função de cópia com Try-Catch e logs
  const handleCopy = async () => {
    console.log('[PixPayment] Botão copiar clicado.');
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API não está disponível neste navegador ou contexto.');
      }
      
      await navigator.clipboard.writeText(pixKey);
      console.log('[PixPayment] Chave PIX copiada com sucesso para a área de transferência.');
      
      setCopied(true);
      if (onCopy) onCopy();
      
      setTimeout(() => {
        setCopied(false);
        console.log('[PixPayment] Estado de cópia resetado para false.');
      }, 2000);
    } catch (error) {
      console.error('[PixPayment] Erro crítico ao tentar copiar a chave PIX:', error);
      // Fallback visual caso a cópia falhe
      alert(`Por favor, copie a chave manualmente: ${pixKey}`);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="bg-zinc-900 border border-teal-500/30 rounded-lg p-6 shadow-md hover:shadow-teal-900/20 transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-500/20 p-2.5 rounded-full">
          <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-medium text-teal-400">Pagamento via PIX</h3>
          <p className="text-sm text-amber-100/60">Transferência rápida e segura</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        
        {/* 3. QR Code renderizado de forma segura como componente React (img tag) */}
        <div className="flex-shrink-0 bg-black p-4 rounded-xl border border-teal-900/50 flex flex-col items-center justify-center w-full md:w-auto">
          <div className="w-40 h-40 relative bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center mb-3">
            <img 
              src={qrCodeUrl} 
              alt="QR Code para pagamento PIX" 
              className="w-full h-full object-contain"
              onLoad={() => console.log('[PixPayment] Imagem do QR Code carregada com sucesso.')}
              onError={(e) => {
                console.error('[PixPayment] Falha ao carregar a imagem do QR Code.');
                e.target.style.display = 'none';
              }}
            />
          </div>
          <p className="text-xs text-teal-400/80 flex items-center gap-1 font-medium">
            <QrCode className="w-3 h-3" /> Escaneie para pagar
          </p>
        </div>

        {/* Detalhes da Chave */}
        <div className="flex-1 w-full space-y-5">
          <div className="bg-black/60 p-5 rounded-lg border border-zinc-800">
            <div className="mb-4">
              <p className="text-xs text-amber-100/50 uppercase tracking-wider mb-1">Beneficiário</p>
              <p className="font-medium text-amber-100">{companyName}</p>
            </div>
            
            <div>
              <p className="text-xs text-amber-100/50 uppercase tracking-wider mb-2">Chave PIX (CNPJ)</p>
              <div className="flex flex-wrap items-center gap-3">
                <code className="flex-1 min-w-[220px] text-base sm:text-lg text-teal-300 font-semibold bg-teal-950/30 px-3 py-2 rounded-md border border-teal-800/60 select-all whitespace-nowrap overflow-x-auto">
                  {pixKey}
                </code>
                
                {/* 
                  4. CORREÇÃO CRÍTICA DO ERRO 'insertBefore':
                  Em vez de usar renderização condicional de nós de texto (que quebra quando 
                  extensões como Google Translate modificam o DOM), usamos duas spans com 
                  opacidade controlada por CSS. Isso garante que a estrutura do DOM nunca mude,
                  evitando conflitos com o React.
                */}
                <Button 
                  type="button"
                  onClick={handleCopy}
                  className={`relative w-full sm:w-auto min-w-[160px] shrink-0 transition-colors duration-300 overflow-hidden ${
                    copied 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <div className="relative flex items-center justify-center w-full h-full">
                    <span 
                      className={`absolute flex items-center gap-2 transition-opacity duration-200 ${
                        copied ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Copiado!</span>
                    </span>
                    <span 
                      className={`flex items-center gap-2 transition-opacity duration-200 ${
                        !copied ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar Chave</span>
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-teal-100/80 bg-teal-950/30 p-4 rounded-lg border border-teal-900/50">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <p>Abra o app do seu banco, escolha pagar via PIX e escaneie o QR Code ou cole a chave acima.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixPayment;
