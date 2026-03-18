/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields.removeByName("brand");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("products");
  collection.fields.add(new SelectField({
    name: "brand",
    required: false,
    values: ["\u00c1rabe", "Importada", "Nacional", "Outros", "Lanc\u00f4me", "Carolina Herrera", "Calvin Klein"],
    maxSelect: 1
  }));
  return app.save(collection);
})
