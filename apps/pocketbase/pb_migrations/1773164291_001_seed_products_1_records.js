/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "La Vie Est Belle Eau de Parfum");
    record0.set("category", "Feminino");
    record0.set("brand", "Lanc\u00f4me");
    record0.set("price", 787.99);
    record0.set("priceWithDiscount", 748.59);
    record0.set("discountPercentage", 5);
    record0.set("installments", 6);
    record0.set("installmentValue", 131.33);
    record0.set("sizes", ["30ml", "50ml", "100ml", "150ml"]);
    record0.set("image_urls", ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500", "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500", "https://images.unsplash.com/photo-1585708372795-c15b757b8851?w=500"]);
    record0.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
