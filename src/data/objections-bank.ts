export interface ObjectionEntry {
  id: string;
  trigger: string;
  description: string;
  responses: string[];
}

export const objectionsBank: ObjectionEntry[] = [
  {
    id: "think",
    trigger: "Vou pensar",
    description: "Cliente quer adiar a decisao",
    responses: [
      "Claro! O que ficou de duvida? Assim consigo te ajudar melhor",
      "Tranquilo! So pra eu saber, o que pesou mais: o valor ou o prazo?",
      "Te mando um resumo rapidinho pra tu ver com calma?",
    ],
  },
  {
    id: "expensive",
    trigger: "Ta caro / Nao cabe",
    description: "Objecao de preco ou orcamento",
    responses: [
      "Quanto tu paga de aluguel hoje? Muitas vezes a parcela fica menor",
      "No financiamento tu paga quase o dobro. Aqui a economia eh de 30-40%",
      "A gente tem grupos com parcelas a partir de R$X. Qual faixa ficaria confortavel pra ti?",
    ],
  },
  {
    id: "slow",
    trigger: "Demora muito",
    description: "Preocupacao com tempo de contemplacao",
    responses: [
      "Tem gente que eh contemplada no primeiro mes por lance. A media eh X meses",
      "A questao eh: tu vai pagar de um jeito ou de outro. A diferenca eh que aqui tu paga menos",
      "Tem uma estrategia de lance embutido que acelera muito. Posso te explicar?",
    ],
  },
  {
    id: "trust",
    trigger: "Nao confio em consorcio",
    description: "Desconfianca com o modelo",
    responses: [
      "A gente eh regulamentado pelo Banco Central, igualzinho banco",
      "Temos 5.000+ clientes, Servopa e Rodobens como administradoras. Posso te mandar depoimento?",
      "Entendo, tem muita info errada por ai. Deixa eu te mostrar como funciona na pratica",
    ],
  },
  {
    id: "financing",
    trigger: "Prefiro financiamento",
    description: "Cliente prefere financiamento",
    responses: [
      "Num imovel de 300k, o financiamento em 20 anos sai quase 600k. No consorcio, 360k. Sao 240k de diferenca",
      "Com a Selic a 15%, os juros do financiamento tao pesadissimos. O consorcio nao tem juro",
      "No consorcio tu pode usar FGTS pra lance, pra amortizar... no financiamento eh mais engessado",
    ],
  },
  {
    id: "already-know",
    trigger: "Ja tenho / Ja conheco",
    description: "Cliente ja conhece consorcio",
    responses: [
      "Show! Tu ja tem alguma cota? A gente pode ver uma estrategia de lance pra acelerar",
      "Muitos clientes nossos tem 2 ou 3 cotas. Uma pra usar, outra pra investir",
      "Massa! Entao tu ja sabe o poder que tem. O que ta buscando agora?",
    ],
  },
  {
    id: "spouse",
    trigger: "Preciso falar com esposa/marido",
    description: "Precisa de aprovacao de terceiros",
    responses: [
      "Claro! Que tal eu preparar um resumo bem claro pra voces verem juntos?",
      "Faz total sentido. Se quiser, posso gravar um audio explicando os pontos principais pro(a) parceiro(a)",
      "Perfeito! Posso te ligar num horario que os dois estejam disponiveis?",
    ],
  },
  {
    id: "no-money-now",
    trigger: "Agora nao da / Sem dinheiro",
    description: "Sem condicoes financeiras no momento",
    responses: [
      "Entendo. E se eu te mostrar que a parcela pode caber no teu orcamento atual? As vezes surpreende",
      "Muita gente pensa assim, mas quando ve que a parcela eh menor que o aluguel, muda de ideia",
      "Tranquilo! Posso te mandar uma simulacao so pra tu ter o numero certinho? Sem compromisso",
    ],
  },
];
