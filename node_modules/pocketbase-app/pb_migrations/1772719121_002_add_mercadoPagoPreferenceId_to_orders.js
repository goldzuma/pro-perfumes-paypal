/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  const existing = collection.fields.getByName("mercadoPagoPreferenceId");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("mercadoPagoPreferenceId"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "mercadoPagoPreferenceId",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("orders");
  collection.fields.removeByName("mercadoPagoPreferenceId");
  return app.save(collection);
})