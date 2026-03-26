import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ANALYSIS_PROMPT = `Você é um coach de vendas especialista em consórcios no Brasil (Servopa/Rodobens). Analise a conversa entre o vendedor e o cliente e dê um feedback detalhado.

Responda APENAS neste JSON:
{
  "score": <1-10>,
  "summary": "<resumo de 1-2 frases da performance geral>",
  "wins": ["<acerto 1>", "<acerto 2>"],
  "mistakes": ["<erro 1>", "<erro 2>"],
  "suggestions": ["<sugestão prática 1>", "<sugestão prática 2>"]
}

CRITÉRIOS:
- Rapport: o vendedor criou conexão humana?
- Discovery: entendeu a dor/sonho do cliente?
- Objeções: tratou objeções com empatia e técnica?
- Persuasão: usou prova social, comparativos, visualização?
- Naturalidade: pareceu conversa real ou robô?
- Fechamento: conduziu pro próximo passo?
- Timing: respondeu na hora certa, sem pressionar demais?

REGRAS:
- "wins" = 1-4 itens (só se realmente acertou)
- "mistakes" = 0-3 itens (seja honesto mas construtivo)
- "suggestions" = 2-4 itens (práticos e aplicáveis)
- "score" = nota justa de 1 a 10
- Se tiver poucas mensagens, avalie o que tem e sugira próximos passos`;

interface ChatMessage {
  role: "client" | "seller";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("sk-COLE")) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const { messages, productType, clientName } = (await request.json()) as {
      messages: ChatMessage[];
      productType: string;
      clientName: string;
    };

    const conversationText = messages
      .map((m) => `${m.role === "client" ? "CLIENTE" : "VENDEDOR"}: ${m.content}`)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ANALYSIS_PROMPT },
        {
          role: "user",
          content: `Cliente: ${clientName || "não informado"}\nProduto: ${productType || "não informado"}\n\n--- CONVERSA ---\n${conversationText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Resposta vazia" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
