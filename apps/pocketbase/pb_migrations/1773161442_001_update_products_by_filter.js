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
    record.set("image", []);
    record.set("image_urls", ["https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/b2a377527214aec1b1406abecf195723.webp", "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/4f7d6d2b4a3cbb062fa24b5939aef859.webp", "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/1b9fe4fecf14018e9c6c165c1e2c0888.webp", "https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/db13f74775ca3c0dd6f78dc2b53fd98d.webp"]);
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
