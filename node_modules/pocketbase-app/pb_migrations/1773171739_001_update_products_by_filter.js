/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("products", "name='La Vie Est Belle'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("description", "La Vie Est Belle, de Lanc\u00f4me, \u00e9 uma fragr\u00e2ncia feminina que traduz eleg\u00e2ncia, do\u00e7ura e sofistica\u00e7\u00e3o em cada nota. Lan\u00e7ado em 2012 e criado pelos perfumistas Olivier Polge, Dominique Ropion e Anne Flipo, o perfume se tornou um verdadeiro \u00edcone da perfumaria por sua assinatura marcante, envolvente e extremamente feminina.\n\nClassificado como um Floral Frutado Gourmand, La Vie Est Belle abre com notas suculentas e luminosas de pera e groselha preta, que trazem frescor adocicado e um toque vibrante logo nas primeiras borrifadas. No cora\u00e7\u00e3o, a fragr\u00e2ncia revela toda a sua delicadeza e sofistica\u00e7\u00e3o com a uni\u00e3o da \u00edris, do jasmim e da flor de laranjeira, formando um buqu\u00ea floral elegante, aveludado e irresistivelmente refinado.\n\nNa base, o perfume ganha profundidade e sensualidade com acordes envolventes de pralin\u00ea, baunilha, patchouli e fava tonka, criando um rastro doce, cremoso e sofisticado, sem perder a classe. O resultado \u00e9 uma fragr\u00e2ncia intensa e memor\u00e1vel, perfeita para mulheres que desejam expressar feminilidade, alegria e poder com um toque de luxo.\n\nLa Vie Est Belle \u00e9 ideal para quem aprecia perfumes marcantes, doces na medida certa e com excelente presen\u00e7a. Uma cria\u00e7\u00e3o que celebra a beleza da vida, a liberdade de ser feliz e o brilho \u00fanico de cada mulher.");
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
