export interface ClosingTechnique {
  id: string;
  name: string;
  whenToUse: string;
  intensity: "soft" | "medium" | "strong";
  versions: string[];
}

export const closingTechniques: ClosingTechnique[] = [
  {
    id: "assumptive",
    name: "Assumptivo",
    whenToUse: "Cliente já demonstrou interesse claro",
    intensity: "medium",
    versions: [
      "Perfeito, então vamos montar o melhor plano pra você. Prefere a parcela pra começo ou meio do mês?",
      "Show! Vou separar o grupo ideal. Só preciso que me confirme: parcela cheia ou meia parcela?",
    ],
  },
  {
    id: "alternative",
    name: "Por Alternativa",
    whenToUse: "Cliente indeciso mas interessado",
    intensity: "medium",
    versions: [
      "Temos duas opções ótimas: o plano A com parcela menor e prazo mais longo, ou o plano B com parcela um pouco maior mas contempla mais rápido. Qual te agrada mais?",
      "Posso te encaixar no grupo de parcela cheia (contempla mais rápido) ou meia parcela (mais leve no bolso). Qual faz mais sentido pra você?",
    ],
  },
  {
    id: "scarcity",
    name: "Escassez",
    whenToUse: "Quando realmente há prazo ou vagas limitadas",
    intensity: "strong",
    versions: [
      "Esse grupo tá fechando agora e as condições são as melhores que vi. O próximo pode demorar e vir com taxas diferentes. Quer garantir a vaga?",
      "Olha, esse grupo tem poucas vagas abertas e a taxa tá muito boa. Quando fechar, só o próximo — e não sei quando abre. Bora garantir?",
    ],
  },
  {
    id: "summary",
    name: "Por Resumo",
    whenToUse: "Conversa longa, cliente precisa de clareza",
    intensity: "medium",
    versions: [
      "[NOME], resumindo: crédito de [VALOR], parcelas sem juros, economia enorme comparado ao banco, regulamentado pelo Banco Central, e eu te acompanho do começo ao fim. Faz sentido seguir?",
      "Vamos recapitular: você conquista seu sonho, paga menos do que pagaria no banco, sem entrada, sem juros, e com segurança total. O que você acha?",
    ],
  },
  {
    id: "loss-aversion",
    name: "Custo da Inação",
    whenToUse: "Cliente procrastina",
    intensity: "strong",
    versions: [
      "Cada mês sem começar, são [VALOR] que poderiam estar construindo patrimônio. Quem começou 12 meses atrás já tá perto de contemplar. Bora iniciar?",
      "Daqui a 1 ano você vai desejar ter começado hoje. O melhor momento é agora — e a parcela é menor do que você imagina.",
    ],
  },
  {
    id: "story",
    name: "Por História",
    whenToUse: "Cliente precisa de prova social",
    intensity: "soft",
    versions: [
      "Semana passada um cliente com perfil parecido com o seu tava na mesma dúvida. Decidiu começar e me disse: 'meu único arrependimento é não ter feito antes'. Quer começar a sua história?",
      "Tenho um cliente que ficou 3 meses pensando. Quando finalmente entrou, foi contemplado no segundo mês. Ele fala até hoje que quase perdeu a oportunidade.",
    ],
  },
  {
    id: "trial-close",
    name: "Teste de Temperatura",
    whenToUse: "No meio da conversa, pra calibrar",
    intensity: "soft",
    versions: [
      "De 0 a 10, quanto faz sentido pra você? Se for 7+: o que falta pra virar 10?",
      "Me diz sinceramente: tá fazendo sentido ou tem alguma coisa que te trava?",
    ],
  },
  {
    id: "now-or-never",
    name: "Agora ou Nunca",
    whenToUse: "Cliente volta pela 2ª ou 3ª vez sem fechar",
    intensity: "strong",
    versions: [
      "[NOME], essa já é a nossa [X]ª conversa sobre isso. Você sabe que faz sentido — senão não teria voltado. Que tal transformar conversa em ação? Preencho tudo pra você em 10 minutos.",
      "[NOME], você voltou porque sabe que vale a pena. Bora parar de adiar e começar? Eu cuido de tudo, você só precisa dizer sim.",
    ],
  },
];
