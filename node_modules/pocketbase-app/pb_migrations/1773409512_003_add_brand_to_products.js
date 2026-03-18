/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const brandsCollection = app.findCollectionByNameOrId("brands");
  const collection = app.findCollectionByNameOrId("products");

  const existing = collection.fields.getByName("brand");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("brand"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "brand",
    required: false,
    collectionId: brandsCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields.removeByName("brand");
  return app.save(collection);
})
