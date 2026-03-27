import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SYSTEM_PROMPT } from "@/data/system-prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getLearnings(): Promise<string[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("ai_learnings")
      .select("insight")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    return data?.map((r) => r.insight as string) || [];
  } catch {
    return [];
  }
}

async function getRules(): Promise<string[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const query = supabase
      .from("ai_rules")
      .select("rule,is_active")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    const { data: withActive, error: withActiveError } = await query;

    if (!withActiveError && withActive) {
      return withActive
        .filter((r) => (typeof r.is_active === "boolean" ? r.is_active : true))
        .map((r) => r.rule as string);
    }

    if (withActiveError && withActiveError.message.toLowerCase().includes("is_active")) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("ai_rules")
        .select("rule")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);
      if (fallbackError || !fallbackData) return [];
      return fallbackData.map((r) => r.rule as string);
    }

    return [];
  } catch {
    return [];
  }
}

interface ChatMessage {
  role: "client" | "seller";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  productType: string;
  clientName: string;
  refinement?: string;
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
    const { messages, productType, clientName, refinement } = body;

    const [learnings, rules] = await Promise.all([getLearnings(), getRules()]);

    let contextMessage = `Contexto atual:
- Nome do cliente: ${clientName || "não informado"}
- Produto de interesse: ${productType || "não informado"}
- Total de mensagens na conversa: ${messages.length}`;

    if (learnings.length > 0) {
      contextMessage += `\n\nAPRENDIZADOS DE CONVERSAS ANTERIORES (aplique esses aprendizados nas respostas):\n${learnings.map((l, i) => `${i + 1}. ${l}`).join("\n")}`;
    }

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: contextMessage },
    ];

    if (rules.length > 0) {
      openaiMessages.push({
        role: "system",
        content: `REGRAS CUSTOMIZADAS DO VENDEDOR (prioridade alta):\n${rules
          .map((r, i) => `${i + 1}. ${r}`)
          .join("\n")}`,
      });
    }

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

    if (refinement) {
      openaiMessages.push({
        role: "user",
        content: `ATENÇÃO - INSTRUÇÃO OBRIGATÓRIA DO VENDEDOR (prioridade máxima):
"${refinement}"

Você DEVE obedecer essa instrução ao gerar as versões. Releia toda a conversa acima e gere versões que respeitem 100% essa instrução. Responda o JSON completo.`,
      });
    }

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
