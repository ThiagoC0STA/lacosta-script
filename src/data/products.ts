import {
  Home,
  Car,
  Sparkles,
  TrendingUp,
  Ship,
  Wrench,
  Wheat,
  GraduationCap,
  HeartPulse,
  Hammer,
  type LucideIcon,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  icon: LucideIcon;
  emoji: string;
  dreamPhrase: string;
  painPoints: string[];
  benefits: string[];
  financingRate: number;
  consortiumRate: number;
  closingHook: string;
}

export const products: Product[] = [
  {
    id: "imovel",
    name: "Imóvel",
    icon: Home,
    emoji: "🏠",
    dreamPhrase: "a chave da casa própria na mão da sua família",
    painPoints: [
      "Aluguel é jogar dinheiro fora todo mês",
      "Financiamento cobra juros de até 12% ao ano — paga quase o dobro",
      "Dificuldade de aprovação de crédito nos bancos",
    ],
    benefits: [
      "Zero juros — só taxa de administração diluída",
      "Poder de compra à vista: negocia preços menores",
      "Pode usar FGTS para dar lance",
      "Parcelas até 70% menores que financiamento",
    ],
    financingRate: 11.5,
    consortiumRate: 0.18,
    closingHook: "dá pra mobiliar a casa inteira e ainda sobrar",
  },
  {
    id: "veiculos",
    name: "Veículos",
    icon: Car,
    emoji: "🚗",
    dreamPhrase: "dirigindo seu carro zero, com aquele cheirinho de novo",
    painPoints: [
      "Financiamento de veículo cobra 1,5% a 2,5% ao mês",
      "No final, paga até 70% a mais que o valor do carro",
      "Entrada alta exigida pelos bancos",
    ],
    benefits: [
      "Parcelas que cabem no bolso, sem juros",
      "Carta contemplada = compra à vista",
      "Lance embutido pra contemplar mais rápido",
      "Sem entrada obrigatória",
    ],
    financingRate: 1.99,
    consortiumRate: 0.15,
    closingHook: "dá pra pagar seguro, IPVA e combustível por anos",
  },
  {
    id: "estetica",
    name: "Estética",
    icon: Sparkles,
    emoji: "✨",
    dreamPhrase: "realizando aquele procedimento que sempre quis",
    painPoints: [
      "Procedimentos estéticos são caros à vista",
      "Cartão de crédito tem juros altíssimos",
      "Clínicas cobram mais caro no parcelamento",
    ],
    benefits: [
      "Parcelas acessíveis sem juros",
      "Crédito pra usar na clínica que escolher",
      "Pode fazer vários procedimentos com a mesma carta",
    ],
    financingRate: 3.5,
    consortiumRate: 0.17,
    closingHook: "realiza o procedimento e ainda guarda dinheiro",
  },
  {
    id: "investimento",
    name: "Investimento",
    icon: TrendingUp,
    emoji: "📈",
    dreamPhrase: "patrimônio crescendo enquanto paga parcelas menores que um aluguel",
    painPoints: [
      "Poupança rende quase nada",
      "Investir em imóvel exige capital alto",
      "Financiamento inviabiliza o retorno",
    ],
    benefits: [
      "Compra imóvel pra alugar com parcelas acessíveis",
      "Carta contemplada = compra à vista = melhor negociação",
      "Renda do aluguel cobre a parcela",
      "Patrimônio que valoriza com o tempo",
    ],
    financingRate: 11.0,
    consortiumRate: 0.18,
    closingHook: "o aluguel do imóvel paga a parcela. Dinheiro gerando dinheiro",
  },
  {
    id: "embarcacoes",
    name: "Embarcações",
    icon: Ship,
    emoji: "🚤",
    dreamPhrase: "curtindo o fim de semana no seu barco com a família",
    painPoints: [
      "Embarcações são caras à vista",
      "Financiamento náutico tem juros altíssimos",
      "Poucas opções de crédito no mercado",
    ],
    benefits: [
      "Parcelas acessíveis sem juros bancários",
      "Crédito pra escolher a embarcação ideal",
      "Lance embutido acelera a contemplação",
    ],
    financingRate: 2.5,
    consortiumRate: 0.16,
    closingHook: "já cobre manutenção e marina por anos",
  },
  {
    id: "servicos",
    name: "Serviços",
    icon: Wrench,
    emoji: "🔧",
    dreamPhrase: "realizando aquele projeto que transforma sua vida",
    painPoints: [
      "Serviços especializados custam caro",
      "Empréstimo pessoal tem juros abusivos",
    ],
    benefits: [
      "Crédito flexível pra usar como quiser",
      "Sem juros bancários",
      "Planejamento sem aperto",
    ],
    financingRate: 4.0,
    consortiumRate: 0.17,
    closingHook: "pagar menos e conquistar mais",
  },
  {
    id: "agronegocio",
    name: "Agronegócio",
    icon: Wheat,
    emoji: "🌾",
    dreamPhrase: "renovando a frota ou expandindo a propriedade sem comprometer o caixa",
    painPoints: [
      "Máquinas agrícolas são investimentos altíssimos",
      "Crédito rural tem burocracia enorme",
    ],
    benefits: [
      "Parcelas previsíveis sem juros",
      "Crédito alto pra máquinas e equipamentos",
      "Sem burocracia do crédito rural",
    ],
    financingRate: 1.8,
    consortiumRate: 0.15,
    closingHook: "essa economia é quase o valor de outro equipamento",
  },
  {
    id: "educacao",
    name: "Educação",
    icon: GraduationCap,
    emoji: "🎓",
    dreamPhrase: "formado, com um diploma que muda tudo",
    painPoints: [
      "Faculdade particular custa uma fortuna",
      "FIES tem vagas limitadas e juros",
    ],
    benefits: [
      "Parcelas acessíveis sem juros",
      "Crédito pra qualquer instituição",
      "Planejamento antecipado",
    ],
    financingRate: 3.0,
    consortiumRate: 0.17,
    closingHook: "educação é o melhor investimento — sem juros, melhor ainda",
  },
  {
    id: "saude",
    name: "Saúde",
    icon: HeartPulse,
    emoji: "❤️",
    dreamPhrase: "acesso ao melhor tratamento sem preocupação financeira",
    painPoints: [
      "Tratamentos médicos são caros",
      "Plano de saúde não cobre tudo",
    ],
    benefits: [
      "Crédito pra tratamentos e procedimentos",
      "Parcelas acessíveis sem juros",
    ],
    financingRate: 3.5,
    consortiumRate: 0.17,
    closingHook: "sua saúde não tem preço, mas dá pra pagar menos por ela",
  },
  {
    id: "reforma",
    name: "Reforma",
    icon: Hammer,
    emoji: "🔨",
    dreamPhrase: "sua casa reformada, do jeitinho que sempre sonhou",
    painPoints: [
      "Reforma sempre custa mais que o planejado",
      "Empréstimo pessoal tem juros altíssimos",
    ],
    benefits: [
      "Crédito pra reforma completa",
      "Poder de compra à vista em materiais",
      "Sem juros = mais dinheiro pra obra",
    ],
    financingRate: 3.0,
    consortiumRate: 0.17,
    closingHook: "com essa economia, dá pra fazer uma reforma ainda melhor",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
