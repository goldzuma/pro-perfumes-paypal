/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("products", "name='La Vie Est Belle Eau de Parfum Lancôme'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("image_urls", [{"url": "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/4b30c4c447c48b29e5895ab42ce090a6.webp", "description": "Frasco La Vie Est Belle com fita cinza, vista frontal"}, {"url": "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/b67113e27ecc7d97bfc5002eaa483bfe.webp", "description": "La Vie Est Belle com flores rosa ao fundo"}, {"url": "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/a745cfba45a4172934b3a9be9ba50b18.webp", "description": "Campanha Lanc\u00f4me com mulher loira"}, {"url": "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/b2d65729f038cd56efbc49c5869e1604.webp", "description": "Frasco La Vie Est Belle com embalagem rosa e caixa"}]);
    try {
      app.save(record);
    } catch (e) {
      if (e.message.includes("Value must be unique")) {
        console.log("Record with unique value already exists, skipping");
      } else {
        throw e;
      }
    }
  }
}, (app) => {
  // Rollback: original values not stored, manual restore needed
})
