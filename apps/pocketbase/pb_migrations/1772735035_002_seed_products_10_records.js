/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Yara");
    record0.set("brand", "Velour");
    record0.set("category", "Feminino");
    record0.set("price", 8999);
    record0.set("description", "Perfume feminino sofisticado com notas florais e amadeiradas, perfeito para mulheres que buscam eleg\u00e2ncia e sensualidade.");
    record0.set("stock", 50);
    record0.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "La Vie Est Belle");
    record1.set("brand", "Velour");
    record1.set("category", "Feminino");
    record1.set("price", 9499);
    record1.set("description", "Fragr\u00e2ncia luxuosa com notas de iris, patchouli e baunilha, transmitindo beleza e feminilidade em cada aplica\u00e7\u00e3o.");
    record1.set("stock", 50);
    record1.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Good Girl");
    record2.set("brand", "Velour");
    record2.set("category", "Feminino");
    record2.set("price", 8799);
    record2.set("description", "Perfume ousado e sedutor com notas de caf\u00e9, am\u00eandoa e \u00e2mbar, ideal para mulheres confiantes e modernas.");
    record2.set("stock", 50);
    record2.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "212 VIP Ros\u00e9");
    record3.set("brand", "Velour");
    record3.set("category", "Feminino");
    record3.set("price", 9199);
    record3.set("description", "Fragr\u00e2ncia rosada e sofisticada com notas de morango, p\u00eassego e alm\u00edscares, perfeita para ocasi\u00f5es especiais.");
    record3.set("stock", 50);
    record3.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Libre");
    record4.set("brand", "Velour");
    record4.set("category", "Feminino");
    record4.set("price", 8599);
    record4.set("description", "Perfume libertador com notas de flor de laranja, lavanda e alm\u00edscares, para mulheres livres e independentes.");
    record4.set("stock", 50);
    record4.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Club de Nuit Intense Man");
    record5.set("brand", "Velour");
    record5.set("category", "Masculino");
    record5.set("price", 9299);
    record5.set("description", "Fragr\u00e2ncia intensa e marcante com notas de especiarias, \u00e2mbar e alm\u00edscares, para homens sofisticados.");
    record5.set("stock", 50);
    record5.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "9PM");
    record6.set("brand", "Velour");
    record6.set("category", "Masculino");
    record6.set("price", 8899);
    record6.set("description", "Perfume cl\u00e1ssico com notas de cedro, s\u00e2ndalo e alm\u00edscares, transmitindo eleg\u00e2ncia e masculinidade.");
    record6.set("stock", 50);
    record6.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Asad");
    record7.set("brand", "Velour");
    record7.set("category", "Masculino");
    record7.set("price", 8699);
    record7.set("description", "Fragr\u00e2ncia oriental com notas de \u00e2mbar, alm\u00edscares e especiarias, perfeita para homens que buscam destaque.");
    record7.set("stock", 50);
    record7.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Sauvage");
    record8.set("brand", "Velour");
    record8.set("category", "Masculino");
    record8.set("price", 9099);
    record8.set("description", "Perfume fresco e vers\u00e1til com notas de ambroxano e especiarias, ideal para o homem moderno e sofisticado.");
    record8.set("stock", 50);
    record8.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Versace Eros");
    record9.set("brand", "Velour");
    record9.set("category", "Masculino");
    record9.set("price", 9399);
    record9.set("description", "Fragr\u00e2ncia vibrante com notas de menta, am\u00eandoa e \u00e2mbar, para homens apaixonados e cheios de energia.");
    record9.set("stock", 50);
    record9.set("paymentMethods", ["Pix", "CartaoCredito", "MercadoPago"]);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})