/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");
  const field = collection.fields.getByName("paymentMethod");
  field.values = ["Pix", "CartaoCredito", "MercadoPago"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("orders");
  const field = collection.fields.getByName("paymentMethod");
  field.values = ["Pix", "CartaoCredito", "Outro"];
  return app.save(collection);
})