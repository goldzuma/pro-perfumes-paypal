/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const existing = collection.fields.getByName("brand");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("brand"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "brand",
    required: false,
    values: ["\u00c1rabe", "Importada", "Nacional", "Outros"],
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields.removeByName("brand");
  return app.save(collection);
})