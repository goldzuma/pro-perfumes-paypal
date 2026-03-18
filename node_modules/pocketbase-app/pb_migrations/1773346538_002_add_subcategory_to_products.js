/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const existing = collection.fields.getByName("subcategory");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("subcategory"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "subcategory",
    required: false,
    values: ["Calvin Klein"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields.removeByName("subcategory");
  return app.save(collection);
})
