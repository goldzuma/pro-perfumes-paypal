
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Wallet } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const PayPalCheckout = ({ amount, items, disabled, checkoutData, onOpenModal, triggerPayment, onPaymentTriggered }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Auto-trigger payment when checkoutData is provided and triggerPayment is true
  useEffect(() => {
    if (triggerPayment && checkoutData && !isLoading) {
      handlePayment();
      if (onPaymentTriggered) onPaymentTriggered();
    }
  }, [triggerPayment, checkoutData]);

  const handlePayment = async () => {
    console.log('[PayPalCheckout] ========== PAYMENT INITIATED ==========');
    console.log('[PayPalCheckout] Timestamp:', new Date().toISOString());
    console.log('[PayPalCheckout] Component state:');
    console.log('  - disabled:', disabled);
    console.log('  - items count:', items?.length || 0);
    console.log('  - checkoutData exists:', !!checkoutData);
    console.log('  - amount:', amount);

    if (disabled || !items || items.length === 0) {
      console.log('[PayPalCheckout] Payment blocked - disabled or no items');
      return;
    }

    // If no customer data, open the modal first
    if (!checkoutData) {
      console.log('[PayPalCheckout] No checkout data - opening modal');
      if (onOpenModal) onOpenModal();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const paymentAmount = Number(amount.toFixed(2));
      console.log('[PayPalCheckout] Payment amount (formatted):', paymentAmount);
      
      // Build return and cancel URLs
      const returnUrl = `${window.location.origin}/paypal-success`;
      const cancelUrl = `${window.location.origin}/paypal-cancel`;

      console.log('[PayPalCheckout] Redirect URLs:');
      console.log('  - Return URL:', returnUrl);
      console.log('  - Cancel URL:', cancelUrl);

      // CRITICAL: Backend expects ONLY { amount, returnUrl, cancelUrl }
      const requestPayload = {
        amount: paymentAmount,
        returnUrl,
        cancelUrl
      };

      console.log('[PayPalCheckout] ========== REQUEST PAYLOAD ==========');
      console.log('[PayPalCheckout] Endpoint: /paypal/create-payment');
      console.log('[PayPalCheckout] Method: POST');
      console.log('[PayPalCheckout] Payload:');
      console.log(JSON.stringify(requestPayload, null, 2));
      console.log('[PayPalCheckout] =====================================');

      // Call the create-payment endpoint
      const response = await apiServerClient.fetch('/paypal/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      console.log('[PayPalCheckout] ========== RESPONSE RECEIVED ==========');
      console.log('[PayPalCheckout] Response status:', response.status);
      console.log('[PayPalCheckout] Response status text:', response.statusText);
      console.log('[PayPalCheckout] Response ok:', response.ok);
      console.log('[PayPalCheckout] Response headers:');
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log(JSON.stringify(headers, null, 2));
      console.log('[PayPalCheckout] =======================================');

      // Parse response body
      const responseText = await response.text();
      console.log('[PayPalCheckout] Response body (raw text):');
      console.log(responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[PayPalCheckout] Response body (parsed JSON):');
        console.log(JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('[PayPalCheckout] ❌ Failed to parse response as JSON');
        console.error('[PayPalCheckout] Parse error:', parseError.message);
        console.error('[PayPalCheckout] Raw response:', responseText.substring(0, 200));
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}`);
      }

      // Check if response was successful
      if (!response.ok) {
        console.error('[PayPalCheckout] ========== ERROR RESPONSE ==========');
        console.error('[PayPalCheckout] HTTP Status:', response.status);
        console.error('[PayPalCheckout] Status Text:', response.statusText);
        console.error('[PayPalCheckout] Error data:', JSON.stringify(data, null, 2));
        console.error('[PayPalCheckout] ====================================');

        // Extract error message from server response
        const serverError = data.error || data.message || 'Erro desconhecido do servidor';
        const errorDetails = data.details || '';
        const fullErrorMessage = errorDetails ? `${serverError}\n${errorDetails}` : serverError;

        console.error('[PayPalCheckout] Extracted error message:', fullErrorMessage);
        throw new Error(fullErrorMessage);
      }

      // Validate response structure
      console.log('[PayPalCheckout] ========== VALIDATING RESPONSE ==========');
      console.log('[PayPalCheckout] Response has id:', !!data.id);
      console.log('[PayPalCheckout] Response has links:', !!data.links);
      console.log('[PayPalCheckout] Links is array:', Array.isArray(data.links));
      console.log('[PayPalCheckout] Links count:', data.links?.length || 0);
      
      if (data.links && Array.isArray(data.links)) {
        console.log('[PayPalCheckout] Links details:');
        data.links.forEach((link, index) => {
          console.log(`  Link ${index + 1}:`, {
            rel: link.rel,
            href: link.href?.substring(0, 50) + '...',
            method: link.method
          });
        });
      }
      console.log('[PayPalCheckout] =========================================');

      if (!data.id || !data.links || !Array.isArray(data.links)) {
        console.error('[PayPalCheckout] ❌ Invalid response structure');
        console.error('[PayPalCheckout] Expected: { id: string, links: array }');
        console.error('[PayPalCheckout] Received:', data);
        throw new Error('Resposta inválida do PayPal - estrutura incorreta');
      }

      // Find approval URL in links array
      const approvalLink = data.links.find(link => link.rel === 'approval_url' || link.rel === 'approve');
      console.log('[PayPalCheckout] Searching for approval link...');
      console.log('[PayPalCheckout] Approval link found:', !!approvalLink);
      
      if (approvalLink) {
        console.log('[PayPalCheckout] Approval link details:', {
          rel: approvalLink.rel,
          href: approvalLink.href,
          method: approvalLink.method
        });
      }

      if (!approvalLink || !approvalLink.href) {
        console.error('[PayPalCheckout] ❌ No approval URL found in links');
        console.error('[PayPalCheckout] Available links:', data.links);
        throw new Error('URL de aprovação do PayPal não encontrada na resposta');
      }

      const approvalUrl = approvalLink.href;
      console.log('[PayPalCheckout] ========== REDIRECTING TO PAYPAL ==========');
      console.log('[PayPalCheckout] Payment ID:', data.id);
      console.log('[PayPalCheckout] Approval URL:', approvalUrl);
      console.log('[PayPalCheckout] Redirecting in 1 second...');
      console.log('[PayPalCheckout] ============================================');

      toast({
        title: 'Redirecionando...',
        description: 'Você está sendo levado ao ambiente seguro do PayPal.',
      });

      // Redirect to PayPal
      window.location.href = approvalUrl;

    } catch (err) {
      console.error('[PayPalCheckout] ========== PAYMENT ERROR ==========');
      console.error('[PayPalCheckout] Error type:', err.constructor.name);
      console.error('[PayPalCheckout] Error message:', err.message);
      console.error('[PayPalCheckout] Error stack:');
      console.error(err.stack);
      
      // Log response data if available (for fetch errors)
      if (err.response) {
        console.error('[PayPalCheckout] Error has response object:');
        console.error('  - Status:', err.response.status);
        console.error('  - Data:', err.response.data);
      }
      
      console.error('[PayPalCheckout] ===================================');

      // Set error state with actual server error message
      const errorMessage = err.message || 'Erro desconhecido ao processar pagamento';
      setError(errorMessage);

      toast({
        variant: 'destructive',
        title: 'Erro ao iniciar pagamento',
        description: errorMessage
      });

      setIsLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className="p-5 bg-zinc-900/80 border border-amber-900/30 rounded-xl text-center text-amber-100/60 text-sm shadow-inner">
        Preencha todos os dados necessários para liberar o pagamento com PayPal.
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-5 bg-zinc-900/80 border border-amber-900/30 rounded-xl text-center text-amber-100/60 text-sm shadow-inner">
        Seu carrinho está vazio.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full mt-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 mb-4">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">Erro no Pagamento</p>
            <p className="text-xs opacity-80 mt-1 whitespace-pre-wrap">{error}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={isLoading || disabled}
        className="w-full h-14 bg-[#0070ba] hover:bg-[#005ea6] text-white font-medium text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#0070ba]/20"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Wallet className="w-6 h-6" />
        )}
        {isLoading ? 'Processando...' : (checkoutData ? 'Pagar com PayPal' : 'Preencher Dados e Pagar')}
      </Button>
      
      <p className="text-center text-xs text-amber-100/50 mt-3">
        Você será redirecionado para o ambiente seguro do PayPal para concluir a compra.
      </p>
    </div>
  );
};

export default PayPalCheckout;
