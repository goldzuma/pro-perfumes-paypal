
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const TestMercadoPagoPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await apiServerClient.fetch('/mercado-pago/test');
      
      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Fallback if response is not JSON
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Ocorreu um erro desconhecido ao testar a conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Teste de Credenciais Mercado Pago - Admin</title>
      </Helmet>

      <div className="min-h-screen bg-black pt-32 pb-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-900/20 mb-4">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl font-light text-amber-100">Teste de Credenciais Mercado Pago</h1>
            <p className="text-amber-100/60 font-light">
              Verifique se as chaves de API do Mercado Pago estão configuradas corretamente no servidor.
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleTest} 
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white h-12 px-8 text-lg shadow-lg shadow-amber-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Testando Conexão...
                </>
              ) : (
                'Testar Conexão'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-950/50 border-red-900/50 text-red-200">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertTitle className="text-red-400 font-medium">Erro na Verificação</AlertTitle>
              <AlertDescription className="mt-2 opacity-90">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="bg-zinc-900 border-amber-900/30 shadow-xl">
              <CardHeader className="border-b border-amber-900/20 pb-4">
                <CardTitle className="text-xl font-light text-amber-100 flex items-center gap-2">
                  Resultados do Teste
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/20">
                  <span className="text-amber-100/70">Status Geral</span>
                  <div className="flex items-center gap-2">
                    {result.status === 'ok' || result.status === 'OK' ? (
                      <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> OK
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400 font-medium bg-red-400/10 px-3 py-1 rounded-full">
                        <XCircle className="w-4 h-4 mr-1.5" /> ERRO
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/20">
                  <span className="text-amber-100/70">Credenciais Carregadas</span>
                  <span className="text-amber-100 font-medium">
                    {(result.hasAccessToken && result.hasPublicKey) || result.credentialsLoaded ? 'Sim' : 'Não'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/20">
                  <span className="text-amber-100/70">Access Token (Comprimento)</span>
                  <span className="text-amber-400 font-mono">
                    {result.accessTokenLength || 0} caracteres
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/20">
                  <span className="text-amber-100/70">Public Key (Comprimento)</span>
                  <span className="text-amber-400 font-mono">
                    {result.publicKeyLength || 0} caracteres
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/20">
                  <span className="text-amber-100/70">Timestamp do Servidor</span>
                  <span className="text-amber-100/50 text-sm font-mono">
                    {result.timestamp ? new Date(result.timestamp).toLocaleString('pt-BR') : 'N/A'}
                  </span>
                </div>

              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default TestMercadoPagoPage;
