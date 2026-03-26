import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DISTILL_PROMPT = `Você é um destilador de aprendizados de vendas. Receba uma análise de conversa de vendas e extraia 1-3 lições PRÁTICAS e CURTAS que o vendedor deve lembrar em futuras conversas.

Cada lição deve:
- Ter no máximo 1 frase
- Ser acionável (o vendedor sabe exatamente o que fazer)
- Ser genérica o suficiente pra aplicar em outras conversas
- Focar no que MELHORAR, não no que já deu certo

Responda APENAS um JSON: { "insights": ["lição 1", "lição 2"] }
NUNCA use travessão longo ("—" ou "–").`;

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
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
}

export async function GET() {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data } = await supabase
      .from("ai_learnings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ learnings: data || [] });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { analysis } = await request.json();

    if (!analysis) {
      return NextResponse.json({ error: "No analysis provided" }, { status: 400 });
    }

    const analysisText = [
      `Score: ${analysis.score}/10`,
      `Summary: ${analysis.summary}`,
      analysis.wins?.length > 0
        ? `Wins: ${analysis.wins.join("; ")}`
        : "",
      analysis.mistakes?.length > 0
        ? `Mistakes: ${analysis.mistakes.join("; ")}`
        : "",
      analysis.suggestions?.length > 0
        ? `Suggestions: ${analysis.suggestions.join("; ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DISTILL_PROMPT },
        { role: "user", content: analysisText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response" }, { status: 500 });
    }

    const sanitized = content.replace(/[—–]/g, ",");
    const parsed = JSON.parse(sanitized);
    const insights: string[] = Array.isArray(parsed.insights)
      ? parsed.insights.map((s: unknown) =>
          typeof s === "string" ? s.replace(/[—–]/g, ",") : ""
        )
      : [];

    if (insights.length === 0) {
      return NextResponse.json({ error: "No insights extracted" }, { status: 400 });
    }

    const rows = insights.map((insight) => ({
      user_id: user.id,
      insight,
      source: "analysis" as const,
    }));

    const { error: dbError } = await supabase
      .from("ai_learnings")
      .insert(rows);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ insights, saved: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
