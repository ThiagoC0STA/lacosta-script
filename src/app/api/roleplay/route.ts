import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RoleplayMessage {
  role: "seller" | "client";
  content: string;
}

const SCENARIOS = {
  price: {
    name: "Objecao de preco",
    persona: `Voce eh Ricardo, 35 anos, casado, 2 filhos. Mora de aluguel (R$ 1.800/mes) e quer comprar um apartamento. Ouviu falar de consorcio mas acha CARO. Sua objecao principal: "A parcela nao cabe no meu orcamento". Voce ganha R$ 6.000/mes. Voce eh desconfiado mas educado. Se o vendedor for convincente com numeros reais, voce cede aos poucos.`,
  },
  trust: {
    name: "Desconfianca",
    persona: `Voce eh Fernanda, 42 anos, empresaria. Tem dinheiro mas NAO confia em consorcio. Ja ouviu historias ruins. Sua objecao: "Consorcio eh furada, nunca sou contemplada". Voce eh direta e meio agressiva. So muda de ideia com DADOS concretos (regulamentacao do Banco Central, numeros reais de contemplacao, casos de sucesso).`,
  },
  financing: {
    name: "Prefere financiamento",
    persona: `Voce eh Carlos, 28 anos, solteiro, desenvolvedor. Quer comprar um carro de R$ 80.000. Ja pesquisou financiamento e achou bom. Sua objecao: "Financiamento eh mais rapido, no consorcio demora demais". Voce eh racional e gosta de numeros. Compara tudo. Se o vendedor mostrar economia real em reais, voce considera.`,
  },
  thinking: {
    name: "Vou pensar",
    persona: `Voce eh Marina, 38 anos, professora. Quer uma casa propria mas sempre adia a decisao. Toda conversa termina com "Vou pensar" ou "Preciso falar com meu marido". Voce gosta do produto mas tem medo de se comprometer. Se o vendedor criar urgencia REAL (nao pressao), voce abre. Voce eh carinhosa e se conecta com vendedores que demonstram empatia.`,
  },
  expert: {
    name: "Cliente que sabe tudo",
    persona: `Voce eh Paulo, 50 anos, investidor. Ja tem 3 consorcios e conhece TUDO sobre o produto. Testa o vendedor fazendo perguntas tecnicas (taxa de administracao, fundo de reserva, lance embutido). Se o vendedor demonstrar conhecimento real, voce se interessa por mais uma cota. Se errar informacao, voce perde o interesse na hora.`,
  },
};

type ScenarioKey = keyof typeof SCENARIOS;

interface RequestBody {
  scenario: ScenarioKey;
  messages: RoleplayMessage[];
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const { scenario, messages }: RequestBody = await request.json();

    const scenarioData = SCENARIOS[scenario];
    if (!scenarioData) {
      return NextResponse.json({ error: "Invalid scenario" }, { status: 400 });
    }

    const systemPrompt = `Voce esta simulando um CLIENTE em um roleplay de treinamento de vendas de consorcio.

${scenarioData.persona}

REGRAS:
- Voce eh o CLIENTE, nao o vendedor.
- Responda como uma pessoa real responderia no WhatsApp: curto, informal, com erros de digitacao ocasionais.
- NAO seja facil demais. Faca o vendedor trabalhar.
- Mantenha sua personalidade e objecoes consistentes.
- Se o vendedor for muito bom, ceda gradualmente (nao de uma vez).
- Se o vendedor for ruim (generico, pressiona, nao escuta), fique mais resistente.
- Maximo 2-3 frases por mensagem. Eh WhatsApp, nao email.
- Quando a conversa chegar a um ponto natural de conclusao (voce fechou, desistiu, ou marcou retorno), adicione ao final: [FIM]

Responda APENAS como o cliente. Uma mensagem por vez.`;

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    for (const msg of messages) {
      openaiMessages.push({
        role: msg.role === "seller" ? "user" : "assistant",
        content: msg.content,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.9,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || "";
    const isFinished = content.includes("[FIM]");
    const cleanContent = content.replace("[FIM]", "").trim();

    let feedback = null;
    if (isFinished) {
      const feedbackCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Voce eh um coach de vendas expert em consorcio. Avalie a performance do vendedor neste roleplay. Retorne APENAS este JSON:
{
  "score": <1-10>,
  "summary": "<1 frase resumindo a performance>",
  "strengths": ["<ponto forte 1>", "<ponto forte 2>"],
  "improvements": ["<melhoria 1>", "<melhoria 2>"],
  "tip": "<1 dica pratica pra proxima vez>"
}
Responda em Portugues (BR). Seja honesto mas construtivo.`,
          },
          {
            role: "user",
            content: `Cenario: ${scenarioData.name}\nPersona: ${scenarioData.persona}\n\nConversa:\n${messages.map((m) => `${m.role === "seller" ? "VENDEDOR" : "CLIENTE"}: ${m.content}`).join("\n")}\nCLIENTE: ${cleanContent}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 500,
      });

      try {
        feedback = JSON.parse(feedbackCompletion.choices[0]?.message?.content || "{}");
      } catch {
        feedback = null;
      }
    }

    return NextResponse.json({
      message: cleanContent,
      isFinished,
      feedback,
    });
  } catch (error) {
    console.error("Roleplay API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
