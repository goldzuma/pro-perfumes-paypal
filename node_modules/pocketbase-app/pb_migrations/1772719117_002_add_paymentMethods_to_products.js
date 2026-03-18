/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const existing = collection.fields.getByName("paymentMethods");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("paymentMethods"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "paymentMethods",
    required: false,
    values: ["Pix", "CartaoCredito", "MercadoPago"],
    maxSelect: 3
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields.removeByName("paymentMethods");
  return app.save(collection);
})