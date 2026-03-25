export interface MessageTemplate {
  id: string;
  phase: string;
  label: string;
  versions: ((name: string, product: string, value: string) => string)[];
}

export const messageTemplates: MessageTemplate[] = [
  {
    id: "first-reply",
    phase: "Primeira Resposta",
    label: "Cliente veio do site",
    versions: [
      (name, product, value) =>
        `Oii${name ? ` ${name}` : ""}, tudo bem? 😊\nMe chamo Luciano e vou cuidar do seu atendimento!\n\nVi aqui que você se interessou por ${product || "consórcio"}${value ? ` de ${value}` : ""}. Antes de tudo, me conta: você já conhece como funciona o consórcio ou seria novidade pra você?`,
      (name, product, value) =>
        `E aí${name ? ` ${name}` : ""}, bom dia! 😄\nAqui é o Luciano da La Costa.\n\n${product ? `Vi seu interesse em ${product}` : "Vi que você fez uma simulação"}${value ? ` no valor de ${value}` : ""}, que bacana! Me diz uma coisa: você tá pesquisando opções ou já tem uma ideia do que quer?`,
      (name, product, value) =>
        `Opa${name ? ` ${name}` : ""}, tudo certo? ✌️\nLuciano aqui da La Costa Consórcios!\n\nChegou sua simulação aqui${product ? ` de ${product}` : ""}${value ? ` — ${value}` : ""}. Antes de te mandar as opções, queria entender melhor o que você tá buscando. Me conta um pouquinho?`,
    ],
  },
  {
    id: "explain-simple",
    phase: "Explicação",
    label: "Explicar consórcio (não conhece)",
    versions: [
      (name) =>
        `${name ? `${name}, ` : ""}vou te explicar de um jeito bem simples:\n\nPensa no consórcio como uma poupança turbinada 💡\n\nVocê paga parcelas todo mês, SEM JUROS. Todo mês rola sorteio + lance. Quando você é contemplado, recebe o valor total pra comprar o que quiser.\n\nA grande sacada comparando com financiamento: lá você paga quase o DOBRO por causa dos juros. Aqui esse dinheiro fica com VOCÊ.\n\nQuer que eu faça uma simulação pro seu caso?`,
      (name) =>
        `Bora lá${name ? ` ${name}` : ""}, vou simplificar:\n\nConsórcio funciona assim: um grupo de pessoas paga parcelas todo mês. Esse dinheiro fica num fundo. Todo mês alguém do grupo é contemplado (por sorteio ou lance) e recebe o crédito total.\n\nDiferente do financiamento:\n• Sem juros — só uma taxa administrativa pequena\n• Parcela bem menor\n• 100% regulado pelo Banco Central\n\nÉ basicamente um jeito inteligente de comprar sem enriquecer banco 😉\n\nFicou claro? Posso detalhar qualquer parte!`,
      (name) =>
        `${name ? `${name}, ` : ""}imagina o seguinte:\n\nNo financiamento, o banco te empresta dinheiro e você paga com JUROS pesados. Às vezes paga o dobro do valor.\n\nNo consórcio, não tem banco no meio. Um grupo de pessoas se junta, todo mundo paga parcelas menores, e todo mês alguém recebe a carta de crédito.\n\nResultado? Você paga MUITO menos e no final tem o mesmo poder de compra.\n\nQuer ver os números do seu caso? Te mostro na prática 📊`,
    ],
  },
  {
    id: "already-knows",
    phase: "Já Conhece",
    label: "Cliente já conhece consórcio",
    versions: [
      (name, _p, value) =>
        `Boa${name ? ` ${name}` : ""}, já tem experiência! Facilita demais 😄\n\nMe passa esses dados que acho o grupo perfeito pra você:\n\n1️⃣ Valor da carta${value ? ` (vi ${value}, tá certo?)` : ""}\n2️⃣ Parcela ideal\n3️⃣ Tem valor pra lance?\n\nCom isso te mando as melhores opções!`,
      (name, _p, value) =>
        `Show${name ? ` ${name}` : ""}! Quem já conhece sabe o poder que tem 💪\n\nPra montar a melhor proposta, preciso de 3 infos:\n\n• Qual crédito você busca?${value ? ` (${value}?)` : ""}\n• Quanto quer pagar de parcela?\n• Pretende dar lance pra antecipar?\n\nMe manda que já vejo os grupos disponíveis!`,
    ],
  },
  {
    id: "send-simulation",
    phase: "Simulação",
    label: "Enviar simulação / proposta",
    versions: [
      (name) =>
        `${name ? `${name}, ` : ""}achei um grupo muito bom pra você! 🎯\n\nTô mandando aqui a simulação. Dá uma olhada com calma e qualquer dúvida me chama, tá? Tô aqui!`,
      (name) =>
        `Olha só${name ? ` ${name}` : ""}, separei uma opção que encaixa bem no que você pediu 👇\n\nDá uma olhada e me diz o que achou! Se quiser, posso te ligar rapidinho pra explicar cada detalhe.`,
      (name) =>
        `${name ? `${name}` : "Oi"}, tô te enviando a simulação aqui embaixo 📋\n\nÉ bem simples de entender, mas se preferir posso te explicar por áudio rapidinho. O que acha?`,
    ],
  },
  {
    id: "comparison-hook",
    phase: "Comparativo",
    label: "Gancho financiamento vs consórcio",
    versions: [
      (name, _p, value) =>
        `${name ? `${name}, ` : ""}deixa eu te mostrar uma coisa que pouca gente sabe:\n\nNum financiamento de ${value || "R$ 100 mil"}, depois de pagar tudo, você gastou quase ${value ? "" : "R$ "}180 mil. Os outros 80 mil? Foram de JUROS pro banco.\n\nNo consórcio do mesmo valor, você paga em torno de 118 mil. Diferença de mais de 60 mil reais no seu bolso.\n\nQuer que eu faça essa conta certinha com o valor que você quer?`,
      (name, _p, value) =>
        `${name ? `${name}, ` : ""}pensa nesse cenário:\n\nVocê quer ${value || "R$ 100 mil"} pra realizar seu sonho.\n\n🏦 Pelo banco: parcela alta + juros pesados = paga quase o dobro\n✅ Pelo consórcio: parcela menor + zero juros = sobra dinheiro\n\nA pergunta é: faz sentido pagar R$ 60-80 mil a mais pro banco quando existe outra opção?\n\nPosso te mostrar os números exatos!`,
    ],
  },
];

export interface RemarketingIdea {
  id: string;
  label: string;
  context: string;
  versions: ((name: string) => string)[];
}

export const remarketingIdeas: RemarketingIdea[] = [
  {
    id: "gentle-check",
    label: "Check leve",
    context: "Sumiu há 1-2 dias",
    versions: [
      (name) =>
        `Oi${name ? ` ${name}` : ""}, tudo bem? 😊\nSó passando pra saber se ficou alguma dúvida sobre o que conversamos. Tô por aqui!`,
      (name) =>
        `E aí${name ? ` ${name}` : ""}, como tá? Conseguiu dar uma olhada naquilo que te mandei? Se precisar de algo é só chamar! 😉`,
    ],
  },
  {
    id: "new-group",
    label: "Grupo novo",
    context: "Sumiu há 3-5 dias",
    versions: [
      (name) =>
        `${name ? `${name}` : "Oi"}, bom dia! ☀️\n\nAbriu um grupo novo com condições bem interessantes. Lembrei de você na hora! Quer que eu te mande os detalhes?`,
      (name) =>
        `Opa${name ? ` ${name}` : ""}, tudo certo?\n\nSurgiu uma oportunidade aqui que encaixa bem no que você tava buscando. Posso te contar?`,
    ],
  },
  {
    id: "value-content",
    label: "Conteúdo de valor",
    context: "Sumiu há 1 semana+",
    versions: [
      (name) =>
        `${name ? `${name}` : "Oi"}, achei que isso podia te interessar:\n\nVocê sabia que no consórcio você pode usar o FGTS pra dar lance? Muita gente não sabe e acaba deixando dinheiro parado.\n\nSe quiser saber mais, tô aqui! 😊`,
      (name) =>
        `Oi${name ? ` ${name}` : ""}! Tava vendo uma matéria sobre como o consórcio tá batendo recorde no Brasil — mais de 12 milhões de pessoas já participam.\n\nSe ainda faz sentido pra você, tô à disposição pra conversar sem compromisso! ✌️`,
      (name) =>
        `${name ? `${name}` : "Oi"}, tudo bem?\n\nSabia que um cliente nosso da semana passada foi contemplado em 4 meses? Ele usou uma estratégia de lance embutido que é bem inteligente.\n\nSe quiser, posso te explicar como funciona!`,
    ],
  },
  {
    id: "direct-call",
    label: "Proposta de ligação",
    context: "Lead quente que travou",
    versions: [
      (name) =>
        `${name ? `${name}` : "Oi"}, sei que pelo texto às vezes fica confuso mesmo. Que tal uma ligação rápida de 5 minutinhos? Aí te explico tudo direitinho e você decide com mais segurança.\n\nPode ser agora ou marca o melhor horário pra você?`,
      (name) =>
        `Oi${name ? ` ${name}` : ""}! Tava pensando que talvez seja mais fácil a gente conversar por ligação. Às vezes por texto não dá pra passar a mesma segurança.\n\n2 minutinhos e tiro todas suas dúvidas. Topa?`,
    ],
  },
  {
    id: "last-try",
    label: "Última tentativa",
    context: "Sumiu há 2+ semanas",
    versions: [
      (name) =>
        `${name ? `${name}` : "Oi"}, tudo bem?\n\nSei que cada um tem seu tempo e respeito isso! Só queria deixar a porta aberta: se um dia quiser retomar a conversa sobre consórcio, é só me chamar. Sem compromisso nenhum.\n\nTe desejo tudo de bom! 🤝`,
      (name) =>
        `Oi${name ? ` ${name}` : ""}! Não quero ser chato rs, só queria saber se ainda posso te ajudar com o consórcio ou se mudou de planos.\n\nSe não for o momento, sem problema nenhum! Fico à disposição pro futuro 😊`,
    ],
  },
];
