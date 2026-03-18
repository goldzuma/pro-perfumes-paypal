/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "La Vie Est Belle Eau de Parfum");
    record0.set("brand", "Lanc\u00f4me");
    record0.set("category", "Feminino");
    record0.set("price", 787.99);
    record0.set("priceWithDiscount", 748.59);
    record0.set("discountPercentage", 5);
    record0.set("installments", 6);
    record0.set("installmentValue", 131.33);
    record0.set("sizes", ["30ml", "50ml", "100ml", "150ml"]);
    record0.set("image_urls", ["https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/b2a377527214aec1b1406abecf195723.webp", "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/4f7d6d2b4a3cbb062fa24b5939aef859.webp", "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/1b9fe4fecf14018e9c6c165c1e2c0888.webp", "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/db13f74775ca3c0dd6f78dc2b53fd98d.webp"]);
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
