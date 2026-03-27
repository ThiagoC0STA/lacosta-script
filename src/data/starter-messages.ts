export interface StarterMessage {
  id: string;
  label: string;
  context: string;
  message: (name: string, product: string, value: string, parcela: string) => string;
}

function valueContext(value: string, parcela: string): string {
  if (value && parcela) return ` de ${value} (parcela ~${parcela})`;
  if (value) return ` de ${value}`;
  if (parcela) return ` com parcela em torno de ${parcela}`;
  return "";
}

export const starterMessages: StarterMessage[] = [
  {
    id: "warm-first",
    label: "Primeiro contato — caloroso",
    context: "Cliente acabou de chegar do site",
    message: (name, product, value, parcela) =>
      `Oii${name ? ` ${name}` : ""}, tudo bem? 😊\nMe chamo Luciano e vou cuidar do seu atendimento!\n\nVi aqui que você se interessou por ${product || "consórcio"}${valueContext(value, parcela)}. Antes de tudo, me conta: você já conhece como funciona o consórcio ou seria novidade pra você?`,
  },
  {
    id: "casual-first",
    label: "Primeiro contato — descontraído",
    context: "Cliente acabou de chegar do site",
    message: (name, product, value, parcela) =>
      `E aí${name ? ` ${name}` : ""}, bom dia! 😄\nAqui é o Luciano da La Costa.\n\n${product ? `Vi seu interesse em ${product}` : "Vi que você fez uma simulação"}${valueContext(value, parcela)}, que bacana! Me diz uma coisa: tá pesquisando opções ou já tem uma ideia do que quer?`,
  },
  {
    id: "direct-first",
    label: "Primeiro contato — direto",
    context: "Cliente acabou de chegar do site",
    message: (name, product, value, parcela) =>
      `Opa${name ? ` ${name}` : ""}, tudo certo? ✌️\nLuciano aqui da La Costa Consórcios!\n\nChegou sua simulação aqui${product ? ` de ${product}` : ""}${valueContext(value, parcela)}. Antes de te mandar as opções, queria entender melhor o que você tá buscando. Me conta!`,
  },
  {
    id: "followup-cold",
    label: "Follow-up — lead esfriou",
    context: "Não respondeu há 2+ dias",
    message: (name) =>
      `Oi${name ? ` ${name}` : ""}, tudo bem? 😊\nSó passando pra saber se ficou alguma dúvida. Se preferir posso te ligar e explicar rapidinho — leva menos de 5 minutinhos! O que acha?`,
  },
  {
    id: "followup-warm",
    label: "Follow-up — já conversou",
    context: "Conversou mas não fechou",
    message: (name) =>
      `${name ? `${name}` : "Oi"}, bom dia! ☀️\nLembrei de você — surgiu um grupo novo com condições muito boas. Conseguiu pensar sobre o que conversamos? Tô aqui se precisar!`,
  },
  {
    id: "custom",
    label: "Mensagem livre",
    context: "Escreva sua própria mensagem",
    message: () => "",
  },
];
