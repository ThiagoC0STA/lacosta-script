import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: "client" | "seller";
  content: string;
}

const INTELLIGENCE_PROMPT = `You are a precise sales intelligence analyst for La Costa Consorcios (consortium sales). Analyze this conversation with STRICT accuracy.

=== CRITICAL: COUNT MESSAGES BY ROLE ===
Before analyzing, count EXACTLY:
- How many messages are from CLIENTE (client)
- How many messages are from VENDEDOR (seller)
This is the MOST IMPORTANT factor for temperature and stage.

=== TEMPERATURE (based on CLIENT behavior, NOT seller) ===
- "cold": Client has NOT responded at all, OR gave only 1-2 very short answers, OR has been silent for multiple seller messages, OR is clearly disengaged. If the seller sent multiple messages without ANY client response, this is ALWAYS cold.
- "warm": Client is responding regularly but without strong buying signals. Asking basic questions. Polite but not excited.
- "hot": Client is actively engaged, asking detailed questions about prices/parcelas/groups, showing urgency ("preciso logo", "quero fechar"), requesting simulations, or giving clear buying signals.

RULE: If there are ZERO client messages, temperature is ALWAYS "cold". No exceptions.
RULE: If client sent fewer messages than seller and last 2+ messages are all from seller, temperature is "cold" or at best "warm".

=== SALES STAGES (based on WHAT ACTUALLY HAPPENED, not what seller intended) ===
1 = ABERTURA: First contact only. Greeting sent but no real conversation yet.
2 = DESCOBERTA: Seller is asking questions to understand client needs. Client is answering.
3 = APRESENTACAO DE VALOR: Seller is presenting solutions, groups, values, benefits. Showing how consortium solves client's problem.
4 = OBJECOES: Client raised specific concerns (price, timing, trust) and seller is addressing them.
5 = FECHAMENTO: Seller is attempting to close. Asking for documents, scheduling, or client agreed to move forward.

STAGE RULES:
- If seller is sending product info, groups, values = stage 3 (even if client hasn't responded).
- If seller already sent info and is now following up = stage 3 still (not discovery).
- Discovery requires the client ACTUALLY answering questions. Seller asking into the void is NOT discovery.
- Stage is based on the LAST meaningful exchange, not the first message.
- CRITICAL: If the client raised ANY objection (price, timing, trust, preference for financing, etc.), the stage is 4 (OBJECTION HANDLING), even if the seller responds with discovery-style questions. An objection raised = stage 4, period.
- Stage 5 only if client explicitly shows intent to close ("quero fechar", "manda o contrato", sends documents).

=== DESIRES & OBJECTIONS ===
- ONLY include desires/objections the CLIENT explicitly stated.
- If the client never spoke, desires = [] and objections = [].
- Do NOT infer desires from what the SELLER said or offered.
- Numbers mentioned by the SELLER about products are NOT client desires unless the client confirmed them.

=== KEY NUMBERS ===
- Include numbers mentioned by EITHER side, but label clearly who mentioned them.
- "Credito apresentado pelo vendedor: R$ 300.000" vs "Orcamento do cliente: R$ 1.500/mes"

=== NEXT ACTIONS ===
- Be REALISTIC. If client isn't responding, top action should be about re-engagement, not about advancing the sale.
- If client is cold: suggest follow-up strategies, different channel (call), or waiting.
- If client is warm: suggest deepening the conversation.
- If client is hot: suggest closing actions.

=== PDF ===
- shouldSendPdf = true ONLY if: client showed interest AND asked about values/groups, OR conversation has 3+ meaningful exchanges with engagement.
- If client hasn't responded, shouldSendPdf = false.

Return ONLY this JSON:
{
  "stage": <1-5>,
  "stageLabel": "<Portuguese label>",
  "temperature": "hot" | "warm" | "cold",
  "summary": "<2-sentence HONEST summary. If client isn't responding, say so clearly.>",
  "desires": ["<ONLY what CLIENT explicitly said they want>"],
  "objections": ["<ONLY objections CLIENT explicitly raised>"],
  "nextActions": [
    { "action": "<realistic next step>", "priority": "high" | "medium" | "low" }
  ],
  "keyNumbers": [
    { "label": "<clear label with who mentioned>", "value": "<value>" }
  ],
  "shouldSendPdf": <boolean>,
  "pdfReason": "<reason>"
}

Respond in Portuguese (BR). Be BRUTALLY honest, not optimistic.`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const { messages, productType, clientName } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages to analyze" },
        { status: 400 }
      );
    }

    const typedMessages = messages as ChatMessage[];
    const clientMsgCount = typedMessages.filter((m) => m.role === "client").length;
    const sellerMsgCount = typedMessages.filter((m) => m.role === "seller").length;

    const conversationText = typedMessages
      .map((m) => `${m.role === "client" ? "CLIENTE" : "VENDEDOR"}: ${m.content}`)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: INTELLIGENCE_PROMPT },
        {
          role: "user",
          content: `Cliente: ${clientName || "nao informado"}
Produto: ${productType || "nao informado"}

CONTAGEM DE MENSAGENS:
- Mensagens do CLIENTE: ${clientMsgCount}
- Mensagens do VENDEDOR: ${sellerMsgCount}
- Total: ${typedMessages.length}
${clientMsgCount === 0 ? "\n⚠️ ATENCAO: O cliente NAO enviou NENHUMA mensagem. Temperature DEVE ser 'cold'.\n" : ""}
CONVERSA:
${conversationText}

Analise com precisao e retorne o JSON.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response" }, { status: 500 });
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Intelligence API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
