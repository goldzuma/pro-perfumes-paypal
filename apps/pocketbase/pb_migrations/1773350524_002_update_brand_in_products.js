/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("brand");
  field.values = ["\u00c1rabe", "Importada", "Nacional", "Outros", "Lanc\u00f4me", "Carolina Herrera", "Calvin Klein"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("brand");
  field.values = ["\u00c1rabe", "Importada", "Nacional", "Outros", "Lanc\u00f4me"];
  return app.save(collection);
})
