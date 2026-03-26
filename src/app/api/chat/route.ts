import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/data/system-prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "client" | "seller";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  productType: string;
  clientName: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("sk-COLE")) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada. Adicione no .env.local" },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();
    const { messages, productType, clientName } = body;

    const contextMessage = `Contexto atual:
- Nome do cliente: ${clientName || "não informado"}
- Produto de interesse: ${productType || "não informado"}
- Total de mensagens na conversa: ${messages.length}`;

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: contextMessage },
    ];

    for (const msg of messages) {
      if (msg.role === "client") {
        openaiMessages.push({
          role: "user",
          content: `[CLIENTE DISSE]: ${msg.content}`,
        });
      } else {
        openaiMessages.push({
          role: "assistant",
          content: `[VENDEDOR ENVIOU]: ${msg.content}`,
        });
      }
    }

    openaiMessages.push({
      role: "user",
      content:
        "Agora gere as versões de resposta para o vendedor enviar ao cliente. Responda APENAS o JSON no formato especificado.",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Resposta vazia da OpenAI" },
        { status: 500 }
      );
    }

    const sanitized = content.replace(/[—–]/g, ",");
    const parsed = JSON.parse(sanitized);

    const clean = (arr: unknown[]) =>
      arr.map((s) => (typeof s === "string" ? s.replace(/[—–]/g, ",") : s));

    const response = {
      versions: Array.isArray(parsed.versions) ? clean(parsed.versions) : [],
      tips: Array.isArray(parsed.tips) ? clean(parsed.tips) : [],
      errors: Array.isArray(parsed.errors) ? clean(parsed.errors) : [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
