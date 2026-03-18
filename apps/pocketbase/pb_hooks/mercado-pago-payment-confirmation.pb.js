/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only send email when status changes to 'Processando'
  if (previousStatus !== "Processando" && currentStatus === "Processando") {
    const orderId = e.record.id;
    const customerName = e.record.get("customerName");
    const customerEmail = e.record.get("customerEmail");
    const paymentMethod = e.record.get("paymentMethod");
    const total = e.record.get("total");
    
    // Calculate estimated delivery date (14 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString("pt-BR");
    
    // Build tracking link
    const trackingLink = "https://seu-dominio.com/orders/" + orderId + "/track";
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: customerEmail }],
      subject: "Pagamento Confirmado - Pedido #" + orderId,
      html: "<h2>Pagamento Confirmado!</h2>" +
            "<p>Olá <strong>" + customerName + "</strong>,</p>" +
            "<p>Seu pagamento foi processado com sucesso. Aqui estão os detalhes do seu pedido:</p>" +
            "<hr>" +
            "<p><strong>ID do Pedido:</strong> " + orderId + "</p>" +
            "<p><strong>Método de Pagamento:</strong> " + paymentMethod + "</p>" +
            "<p><strong>Valor Total:</strong> R$ " + total.toFixed(2) + "</p>" +
            "<p><strong>Data Estimada de Entrega:</strong> " + formattedDeliveryDate + "</p>" +
            "<hr>" +
            "<p><a href=\"" + trackingLink + "\" style=\"background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;\">Rastrear Pedido</a></p>" +
            "<p>Obrigado pela sua compra!</p>"
    });
    
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "orders");