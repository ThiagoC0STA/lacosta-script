export interface Product {
  id: string;
  name: string;
  emoji: string;
}

export const products: Product[] = [
  { id: "imovel", name: "Imóvel", emoji: "🏠" },
  { id: "veiculos", name: "Veículos", emoji: "🚗" },
  { id: "estetica", name: "Estética", emoji: "✨" },
  { id: "investimento", name: "Investimento", emoji: "📈" },
  { id: "embarcacoes", name: "Embarcações", emoji: "🚤" },
  { id: "servicos", name: "Serviços", emoji: "🔧" },
  { id: "agronegocio", name: "Agronegócio", emoji: "🌾" },
  { id: "educacao", name: "Educação", emoji: "🎓" },
  { id: "saude", name: "Saúde", emoji: "❤️" },
  { id: "reforma", name: "Reforma", emoji: "🔨" },
];
