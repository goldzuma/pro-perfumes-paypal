/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Oud Premium");
    record0.set("category", "Feminino");
    record0.set("brand", "\u00c1rabe");
    record0.set("price", 18990);
    record0.set("stock", 50);
    record0.set("description", "Frag\u00e2ncia oriental premium com notas profundas de oud envelhecido e \u00e2mbar dourado. Uma composi\u00e7\u00e3o sofisticada que evoca luxo e mist\u00e9rio. Notas: Oud, \u00c2mbar, Especiarias. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Ocasi\u00f5es especiais e uso noturno. Imagem: https://images.unsplash.com/photo-1597135343824-a99c19f448bd");
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
    record1.set("description", "Delicada ess\u00eancia de rosa com toques florais sofisticados. Uma frag\u00e2ncia que celebra a eleg\u00e2ncia feminina em sua forma mais pura. Notas: Rosa, Jasmim, Alm\u00edscar. Dura\u00e7\u00e3o: 8+ horas. Ideal para: Uso di\u00e1rio e ocasi\u00f5es especiais. Imagem: https://images.unsplash.com/photo-1595425970377-c9703cf48b6d");
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
    record2.set("description", "Baunilha sofisticada com notas de chocolate e alm\u00edscar. Uma frag\u00e2ncia sensual e envolvente que deixa uma trilha irresist\u00edvel. Notas: Baunilha, Chocolate, Alm\u00edscar. Dura\u00e7\u00e3o: 10+ horas. Ideal para: Noites especiais e uso noturno. Imagem: https://images.unsplash.com/photo-1673531156388-d1a5f9841b54");
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
    record3.set("description", "\u00c2mbar dourado com especiarias orientais que transmitem sofistica\u00e7\u00e3o e poder. Uma frag\u00e2ncia marcante para homens que apreciam luxo. Notas: \u00c2mbar, Especiarias, S\u00e2ndalo. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Uso di\u00e1rio e ocasi\u00f5es formais. Imagem: https://images.unsplash.com/photo-1684762870187-47219389c8f7");
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
    record4.set("description", "C\u00edtricos vibrantes com notas de bergamota e lim\u00e3o. Uma frag\u00e2ncia fresca e energizante perfeita para o dia a dia. Notas: Bergamota, Lim\u00e3o, Cedro. Dura\u00e7\u00e3o: 6+ horas. Ideal para: Uso di\u00e1rio e atividades ao ar livre. Imagem: https://images.unsplash.com/photo-1613521140785-e85e427f8002");
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
    record5.set("description", "Alm\u00edscar refinado com toques de s\u00e2ndalo que criam uma aura de eleg\u00e2ncia duradoura. Uma frag\u00e2ncia cl\u00e1ssica e sofisticada. Notas: Alm\u00edscar, S\u00e2ndalo, Rosa. Dura\u00e7\u00e3o: 10+ horas. Ideal para: Uso di\u00e1rio e ocasi\u00f5es especiais. Imagem: https://images.unsplash.com/photo-1691940268154-dc2957088f4a");
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
    record6.set("description", "Oud Premium Al-Haramain \u00e9 uma frag\u00e2ncia oriental cl\u00e1ssica que combina oud envelhecido com \u00e2mbar dourado e especiarias. Perfeita para quem aprecia aromas profundos e duradouros. Notas: Oud, \u00c2mbar, Especiarias. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Ocasi\u00f5es especiais e uso noturno. Dispon\u00edvel em: 50ml (R$ 89,90), 100ml (R$ 149,90), 200ml (R$ 249,90). Imagem: https://images.unsplash.com/photo-1608828201325-cfc4c1cc6ef9");
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
    record7.set("description", "Wisal Dhahab \u00e9 uma frag\u00e2ncia unissex que celebra a riqueza do ouro \u00e1rabe. Combina oud com notas florais delicadas e alm\u00edscar branco. Notas: Oud, Rosa, Alm\u00edscar. Dura\u00e7\u00e3o: 10+ horas. Ideal para: Uso di\u00e1rio e ocasi\u00f5es especiais. Dispon\u00edvel em: 50ml (R$ 79,90), 100ml (R$ 139,90). Imagem: https://images.unsplash.com/photo-1608828201325-cfc4c1cc6ef9");
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
    record8.set("description", "Royal Oud \u00e9 a ess\u00eancia da realeza \u00e1rabe. Uma frag\u00e2ncia sofisticada que combina oud premium com notas de s\u00e2ndalo, rosa e alm\u00edscar. Notas: Oud Premium, S\u00e2ndalo, Rosa, Alm\u00edscar. Dura\u00e7\u00e3o: 14+ horas. Ideal para: Colecionadores e ocasi\u00f5es de gala. Dispon\u00edvel em: 75ml (R$ 119,90), 150ml (R$ 199,90). Imagem: https://images.unsplash.com/photo-1597135343824-a99c19f448bd");
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
    record9.set("name", "Chanel No. 5");
    record9.set("category", "Feminino");
    record9.set("brand", "Importada");
    record9.set("price", 44990);
    record9.set("stock", 25);
    record9.set("description", "Chanel No. 5 \u00e9 o \u00edcone absoluto da perfumaria feminina. Uma frag\u00e2ncia cl\u00e1ssica e sofisticada que combina notas florais de jasmim, rosa e ylang-ylang com base de s\u00e2ndalo e alm\u00edscar. Criada em 1921, continua sendo a escolha das mulheres que apreciam eleg\u00e2ncia atemporal. Notas: Jasmim, Rosa, Ylang-Ylang, S\u00e2ndalo, Alm\u00edscar. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Mulheres sofisticadas que buscam uma frag\u00e2ncia cl\u00e1ssica e duradoura. Dispon\u00edvel em: 50ml (R$ 299,90), 100ml (R$ 449,90). Imagem: https://images.unsplash.com/photo-1611066529351-2b0c0754a7de");
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
    record10.set("name", "Dior Sauvage");
    record10.set("category", "Masculino");
    record10.set("brand", "Importada");
    record10.set("price", 39990);
    record10.set("stock", 25);
    record10.set("description", "Dior Sauvage \u00e9 a frag\u00e2ncia masculina mais ic\u00f4nica do s\u00e9culo XXI. Uma composi\u00e7\u00e3o sofisticada que combina notas frescas de ambroxano com especiarias quentes e s\u00e2ndalo. Perfeita para homens que buscam uma frag\u00e2ncia vers\u00e1til, elegante e duradoura. Notas: Ambroxano, Pimenta, S\u00e2ndalo. Dura\u00e7\u00e3o: 12+ horas. Ideal para: Homens que apreciam sofistica\u00e7\u00e3o e versatilidade. Dispon\u00edvel em: 60ml (R$ 279,90), 100ml (R$ 399,90). Imagem: https://images.unsplash.com/photo-1644958307902-2d0347086a38");
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