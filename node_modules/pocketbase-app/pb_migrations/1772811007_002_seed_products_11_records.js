/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Oud Premium");
    record0.set("category", "Feminino");
    record0.set("brand", "Outros");
    record0.set("price", 18990);
    record0.set("stock", 50);
    record0.set("description", "Fragr\u00e2ncia oriental com notas profundas de oud e \u00e2mbar. Perfeita para ocasi\u00f5es especiais.");
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
    record1.set("name", "Rose Essence");
    record1.set("category", "Feminino");
    record1.set("brand", "Importada");
    record1.set("price", 14990);
    record1.set("stock", 50);
    record1.set("description", "Delicada ess\u00eancia de rosa com toques florais. Eleg\u00e2ncia em cada pulveriza\u00e7\u00e3o.");
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
    record2.set("name", "Vanilla Noir");
    record2.set("category", "Feminino");
    record2.set("brand", "Nacional");
    record2.set("price", 15990);
    record2.set("stock", 50);
    record2.set("description", "Baunilha sofisticada com notas de chocolate e alm\u00edscar. Sensual e envolvente.");
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
    record3.set("name", "Amber Luxe");
    record3.set("category", "Masculino");
    record3.set("brand", "Importada");
    record3.set("price", 17990);
    record3.set("stock", 50);
    record3.set("description", "\u00c2mbar dourado com especiarias orientais. Luxo e sofistica\u00e7\u00e3o em uma fragr\u00e2ncia.");
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
    record4.set("name", "Citrus Fresh");
    record4.set("category", "Masculino");
    record4.set("brand", "Nacional");
    record4.set("price", 13990);
    record4.set("stock", 50);
    record4.set("description", "C\u00edtricos vibrantes com notas de bergamota e lim\u00e3o. Fresco e energizante.");
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
    record5.set("name", "Musk Elegance");
    record5.set("category", "Feminino");
    record5.set("brand", "\u00c1rabe");
    record5.set("price", 16990);
    record5.set("stock", 50);
    record5.set("description", "Alm\u00edscar refinado com toques de s\u00e2ndalo. Eleg\u00e2ncia duradoura e sofisticada.");
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
    record6.set("name", "Amber Oud (Al-Haramain)");
    record6.set("category", "Fragr\u00e2ncias \u00c1rabe");
    record6.set("brand", "\u00c1rabe");
    record6.set("price", 24990);
    record6.set("stock", 30);
    record6.set("description", "Oud Premium Al-Haramain \u00e9 uma fragr\u00e2ncia oriental cl\u00e1ssica que combina oud envelhecido com \u00e2mbar dourado e especiarias. Perfeita para quem aprecia aromas profundos e duradouros. Notas: Oud, \u00c2mbar, Especiarias. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Ocasi\u00f5es especiais e uso noturno.");
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
    record7.set("name", "Wisal Dhahab (Ajmal)");
    record7.set("category", "Fragr\u00e2ncias \u00c1rabe");
    record7.set("brand", "\u00c1rabe");
    record7.set("price", 21990);
    record7.set("stock", 30);
    record7.set("description", "Wisal Dhahab \u00e9 uma fragr\u00e2ncia unissex que celebra a riqueza do ouro \u00e1rabe. Combina oud com notas florais delicadas e alm\u00edscar branco. Notas: Oud, Rosa, Alm\u00edscar. Dura\u00e7\u00e3o: 10+ horas. Ideal para: Uso di\u00e1rio e ocasi\u00f5es especiais.");
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
    record8.set("name", "Royal Oud (Arabian Oud)");
    record8.set("category", "Fragr\u00e2ncias \u00c1rabe");
    record8.set("brand", "\u00c1rabe");
    record8.set("price", 27990);
    record8.set("stock", 30);
    record8.set("description", "Royal Oud \u00e9 a ess\u00eancia da realeza \u00e1rabe. Uma fragr\u00e2ncia sofisticada que combina oud premium com notas de s\u00e2ndalo, rosa e alm\u00edscar. Notas: Oud Premium, S\u00e2ndalo, Rosa, Alm\u00edscar. Dura\u00e7\u00e3o: 14+ horas. Ideal para: Colecionadores e ocasi\u00f5es de gala.");
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
    record9.set("name", "Flor de L\u00f3tus");
    record9.set("category", "Feminino");
    record9.set("brand", "\u00c1rabe");
    record9.set("price", 19990);
    record9.set("stock", 40);
    record9.set("description", "Flor de L\u00f3tus \u00e9 uma fragr\u00e2ncia feminina que captura a ess\u00eancia da eleg\u00e2ncia oriental. Combina notas florais delicadas de l\u00f3tus com toques de jasmim e alm\u00edscar branco. Notas: L\u00f3tus, Jasmim, Alm\u00edscar Branco. Dura\u00e7\u00e3o: 8+ horas. Ideal para: Mulheres que apreciam fragr\u00e2ncias florais sofisticadas.");
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Poder \u00c1rabe");
    record10.set("category", "Masculino");
    record10.set("brand", "\u00c1rabe");
    record10.set("price", 22990);
    record10.set("stock", 35);
    record10.set("description", "Poder \u00c1rabe \u00e9 uma fragr\u00e2ncia masculina que transmite for\u00e7a e sofistica\u00e7\u00e3o. Combina oud com notas de couro, tabaco e especiarias orientais. Notas: Oud, Couro, Tabaco, Especiarias. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Homens que buscam uma fragr\u00e2ncia marcante e duradoura.");
  try {
    app.save(record10);
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