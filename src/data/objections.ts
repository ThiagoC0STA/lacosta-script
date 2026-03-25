export interface Objection {
  id: string;
  objection: string;
  versions: { response: string; followUp: string }[];
}

export const objections: Objection[] = [
  {
    id: "expensive",
    objection: "Tá caro / Não tenho dinheiro",
    versions: [
      {
        response:
          "Entendo! Mas pensa comigo: quanto você gasta por mês com coisas que não viram patrimônio? Delivery, streaming, cafezinho... soma tudo, dá R$ 300-500 fácil. Com esse mesmo valor você CONSTRÓI algo seu.",
        followUp: "Se eu mostrar que cabe no seu orçamento, a gente avança?",
      },
      {
        response:
          "Concordo que a gente sempre tem que cuidar do bolso. Mas me diz: faz sentido continuar pagando aluguel/juros e não construir nada? O consórcio é tipo redirecionar um gasto que você já tem.",
        followUp:
          "Qual valor de parcela seria confortável pra você hoje? Posso achar um grupo que encaixe.",
      },
    ],
  },
  {
    id: "think-about",
    objection: "Vou pensar e te retorno",
    versions: [
      {
        response:
          "Claro! Mas me ajuda a entender: o que exatamente te trava? É o valor? O momento? Porque dependendo, posso te ajudar agora mesmo.",
        followUp: "Qual é sua maior dúvida?",
      },
      {
        response:
          "Com certeza, é bom pensar! Mas sabia que a maioria das pessoas que dizem 'vou pensar' acabam esquecendo e 6 meses depois se arrependem de não ter começado antes?",
        followUp:
          "Que tal a gente resolver as dúvidas agora e você decide com tudo na mão?",
      },
    ],
  },
  {
    id: "dont-know",
    objection: "Não conheço consórcio / Tenho medo",
    versions: [
      {
        response:
          "Normal ter receio! Mas olha: consórcio é regulamentado pelo Banco Central. São mais de 12 MILHÕES de brasileiros participando hoje. Servopa e Rodobens têm décadas de mercado.",
        followUp: "Quer que eu te explique direitinho como funciona? Leva 2 minutos!",
      },
      {
        response:
          "Entendo total! Eu mesmo antes de trabalhar com isso não conhecia. Mas quando entendi que é basicamente uma poupança coletiva sem juros, regulada pelo Banco Central, fez muito sentido.",
        followUp: "Posso te mandar um áudio rápido explicando?",
      },
    ],
  },
  {
    id: "financing-faster",
    objection: "No financiamento pego na hora",
    versions: [
      {
        response:
          "Verdade, é mais rápido. Mas 'rápido' custa caro. Num financiamento de R$ 80 mil, você paga uns R$ 108 mil. São R$ 28 mil que vão pro banco. No consórcio, esse dinheiro fica com VOCÊ.",
        followUp:
          "Faz sentido pagar R$ 28 mil a mais só pra ter uns meses antes?",
      },
      {
        response:
          "Sim, financiamento é imediato. Mas pensa assim: você tá trocando dinheiro por velocidade. No consórcio, com lance embutido, muita gente contempla em 3-6 meses. E economiza MUITO.",
        followUp:
          "Que tal a gente ver quanto de lance seria pra você contemplar rápido?",
      },
    ],
  },
  {
    id: "never-win",
    objection: "Ninguém ganha / Demora muito",
    versions: [
      {
        response:
          "Essa é uma crença antiga! Todo mês tem contemplação por sorteio E por lance. Com lance embutido, você usa parte do crédito como lance — sem tirar dinheiro extra do bolso.",
        followUp: "Posso te mostrar o histórico de contemplações?",
      },
      {
        response:
          "Te entendo, mas os números contam outra história. Na média, nossos clientes são contemplados em 8 meses. E mesmo que demore, cada parcela é patrimônio SEU, não juros pro banco.",
        followUp: "Quer ver como funciona a estratégia de lance?",
      },
    ],
  },
  {
    id: "spouse",
    objection: "Preciso falar com cônjuge / sócio",
    versions: [
      {
        response:
          "Com certeza! Decisão importante se toma junto. Que tal a gente marcar uma conversa rápida com vocês dois? Aí tiro todas as dúvidas de uma vez.",
        followUp: "Posso ligar agora junto com você?",
      },
      {
        response:
          "Faz total sentido! Me diz o melhor horário que eu ligo e explico pra vocês dois juntos. Leva 10 minutinhos.",
        followUp: "Hoje à tarde funciona?",
      },
    ],
  },
  {
    id: "bad-timing",
    objection: "Agora não é o momento",
    versions: [
      {
        response:
          "Entendo. Mas se daqui a 1 ano você quer ter realizado esse sonho, o melhor momento pra começar é agora. Cada mês que passa é um mês a mais de espera.",
        followUp: "E se começar pelo menor plano possível?",
      },
      {
        response:
          "Respeito! Mas me conta: quando seria o momento certo? Porque geralmente o momento certo é quando a gente decide que não quer mais adiar.",
        followUp:
          "Que tal só ver os números sem compromisso? Aí você decide com calma.",
      },
    ],
  },
  {
    id: "installment-increase",
    objection: "A parcela vai aumentar?",
    versions: [
      {
        response:
          "Tem reajuste anual sim, sou 100% transparente. Mas o reajuste acompanha a inflação, ou seja, o PODER DE COMPRA da sua carta se mantém. No financiamento, a parcela sobe e o valor do bem fica travado.",
        followUp:
          "Prefere parcela que cresce junto com o valor do bem ou que cresce só pra pagar juros?",
      },
      {
        response:
          "Existe reajuste, sim. Mas é proporcional: se o valor dos imóveis/carros sobe, seu crédito sobe também. Você não perde poder de compra. No financiamento o valor trava e os juros comem tudo.",
        followUp: "Quer que eu te mostre como fica na prática?",
      },
    ],
  },
  {
    id: "cancel",
    objection: "E se eu quiser cancelar?",
    versions: [
      {
        response:
          "Pode cancelar e recebe de volta o que pagou. Mas tem opções melhores: transferir pra outra pessoa ou vender a cota contemplada com lucro.",
        followUp: "Quer que eu detalhe essas opções?",
      },
      {
        response:
          "Boa pergunta! Você tem flexibilidade total: pode cancelar, transferir a cota, ou até vender. Seu dinheiro não fica preso.",
        followUp: "Isso te dá mais segurança?",
      },
    ],
  },
];
