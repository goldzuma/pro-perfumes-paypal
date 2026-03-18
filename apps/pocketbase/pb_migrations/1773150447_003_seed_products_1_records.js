/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "La Vie Est Belle Eau de Parfum Lanc\u00f4me");
    record0.set("category", "Feminino");
    record0.set("brand", "Lanc\u00f4me");
    record0.set("price", 77900);
    record0.set("stock", 0);
    record0.set("description", "La Vie Est Belle Eau de Parfum Lanc\u00f4me \u2013 Perfume Feminino Floral Gourmand Ic\u00f4nico\n\nO La Vie Est Belle Eau de Parfum, da Lanc\u00f4me, \u00e9 um dos perfumes femininos mais ic\u00f4nicos do mundo. Uma fragr\u00e2ncia que celebra a felicidade, a liberdade e a beleza de viver a vida do seu jeito, combinando eleg\u00e2ncia, do\u00e7ura e sofistica\u00e7\u00e3o em cada borrifada.\n\nA abertura traz o frescor adocicado da pera e do cassis. No cora\u00e7\u00e3o, a \u00edris \u2014 assinatura da fragr\u00e2ncia \u2014 se une ao jasmim e \u00e0 flor de laranjeira. O fundo de baunilha, pralin\u00ea, patchouli e fava tonka garante alta fixa\u00e7\u00e3o e um rastro envolvente.\n\nIdeal para mulheres que gostam de perfumes doces, elegantes e marcantes, sem abrir m\u00e3o da sofistica\u00e7\u00e3o. Perfeito para o dia a dia ou ocasi\u00f5es especiais.\n\n\ud83c\udf38 Notas Olfativas\nTopo: Pera, Cassis\nCora\u00e7\u00e3o: \u00cdris, Jasmim, Flor de Laranjeira\nFundo: Baunilha, Pralin\u00ea, Patchouli, Fava Tonka\n\n\u2728 Por que escolher o La Vie Est Belle?\nPerfume feminino floral gourmand consagrado mundialmente\nFragr\u00e2ncia doce, sofisticada e extremamente feminina\nExcelente fixa\u00e7\u00e3o e proje\u00e7\u00e3o\nIdeal para uso di\u00e1rio e ocasi\u00f5es especiais\nFrasco ic\u00f4nico com design elegante\n\nSe voc\u00ea busca um perfume envolvente, feminino e com assinatura reconhec\u00edvel, o La Vie Est Belle \u00e9 uma escolha certeira.\n\n\ud83c\udf3a Principais Acordes\nDoce, baunilha, frutado, patchouli, amadeirado, floral branco, atalcado, \u00edris, terroso e especiado quente.\n\n\u2753 Perguntas Frequentes\nQual \u00e9 o cheiro do La Vie Est Belle?\n\u00c9 um perfume floral gourmand doce e sofisticado, com destaque para a \u00edris, baunilha e pralin\u00ea.\n\nA fixa\u00e7\u00e3o \u00e9 boa?\nSim. Possui fixa\u00e7\u00e3o prolongada e permanece por muitas horas na pele.\n\nO perfume \u00e9 original?\nSim. Trabalhamos exclusivamente com perfumes 100% originais. Produto aut\u00eantico da Lanc\u00f4me.");
  try {
    app.save(record0);
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
