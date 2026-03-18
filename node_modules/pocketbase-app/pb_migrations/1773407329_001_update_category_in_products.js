/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("category");
  field.values = ["Feminino", "Masculino", "Unissex"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("category");
  field.values = ["Feminino", "Masculino"];
  return app.save(collection);
})
