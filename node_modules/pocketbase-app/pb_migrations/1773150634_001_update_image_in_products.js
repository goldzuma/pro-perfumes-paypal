/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("image");
  field.maxSelect = 4;
  field.maxSize = 20971520;
  field.mimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  const field = collection.fields.getByName("image");
  field.maxSelect = 1;
  field.maxSize = 20971520;
  field.mimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return app.save(collection);
})
