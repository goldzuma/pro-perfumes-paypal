/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("category");
  field.values = ["Feminino", "Masculino"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("category");
  field.values = ["Feminino", "Masculino", "Fragr\u00e2ncias \u00c1rabe"];
  return app.save(collection);
})
