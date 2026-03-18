/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "La Vie Est Belle Eau de Parfum Lanc\u00f4me");
    record0.set("category", "Feminino");
    record0.set("price", 779.0);
    record0.set("brand", "Lanc\u00f4me");
    record0.set("description", "Eau de Parfum Lanc\u00f4me - Fragr\u00e2ncia feminina sofisticada com notas de flor de laranjeira, patchouli e alm\u00edscar. Uma composi\u00e7\u00e3o elegante que transmite sensualidade e feminilidade. Perfeita para mulheres que apreciam fragr\u00e2ncias cl\u00e1ssicas e refinadas.");
    record0.set("stock", 10);
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
