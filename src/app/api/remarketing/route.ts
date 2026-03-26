import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const REMARKETING_PROMPT = `Você é um especialista em remarketing e análise de vendas de consórcio (Servopa/Rodobens, La Costa Consórcios). Sua função é analisar uma conversa entre vendedor e cliente que NÃO fechou negócio e determinar se vale a pena reabordar esse cliente.

REGRA ABSOLUTA: NUNCA use travessão longo ("—" ou "–") em nenhum campo. Use vírgula ou ponto.

Responda APENAS neste JSON:
{
  "remarketing_score": <1-10>,
  "is_good_lead": <true/false>,
  "verdict": "<1 frase direta: vale ou não reabordar e por quê>",
  "client_profile": {
    "interest_level": "<high | medium | low>",
    "objections": ["<objeção que o cliente levantou>"],
    "desires": ["<o que o cliente demonstrou querer/precisar>"],
    "buying_stage": "<em qual estágio de compra o cliente está: apenas curioso, pesquisando, comparando, quase decidindo, desistiu>"
  },
  "conversation_errors": [
    {
      "error": "<erro específico cometido pelo vendedor>",
      "impact": "<critical | moderate | minor>",
      "fix": "<como deveria ter feito>"
    }
  ],
  "reapproach_strategy": {
    "best_timing": "<quando reabordar: ex: 'em 3-5 dias', 'após 1 semana', 'imediatamente'>",
    "angle": "<por qual ângulo reabordar: novidade, condição especial, etc>",
    "tone": "<tom ideal: casual, urgente, consultivo, etc>"
  },
  "suggested_messages": [
    {
      "message": "<mensagem pronta pra enviar no WhatsApp>",
      "style": "<estilo: casual, consultivo, gatilho de escassez, etc>"
    }
  ],
  "reasoning": "<análise detalhada em 3-5 frases explicando sua avaliação>"
}

CRITÉRIOS DE AVALIAÇÃO DO LEAD:
1. INTERESSE DEMONSTRADO: O cliente fez perguntas? Mostrou curiosidade? Pediu valores?
2. OBJEÇÕES TRATÁVEIS: As objeções são de timing (agora não posso) ou de rejeição total (não quero)?
3. PERFIL FINANCEIRO: O cliente demonstrou poder aquisitivo compatível?
4. ENGAJAMENTO: Respondeu rápido? Deu respostas longas? Fez perguntas?
5. MOTIVO DA NÃO-COMPRA: Foi por falha do vendedor ou decisão real do cliente?

ERROS DO VENDEDOR - Seja rigoroso e específico:
- Pressionou demais ou de menos?
- Perdeu timing de fechamento?
- Não tratou objeção corretamente?
- Foi muito técnico ou muito vago?
- Não criou urgência?
- Não personalizou a abordagem?
- Deixou a conversa morrer?

MENSAGENS DE REABORDAGEM:
- Gere 2-4 mensagens prontas para WhatsApp
- Devem ser naturais, como pessoa real
- Cada uma com abordagem diferente
- Use \\n para quebras de linha
- Considere o contexto da conversa anterior

REGRAS:
- remarketing_score >= 7 = lead quente, reabordar com prioridade
- remarketing_score 4-6 = lead morno, reabordar com estratégia
- remarketing_score <= 3 = lead frio, baixa prioridade
- is_good_lead = true se score >= 5
- conversation_errors: liste 0-5 erros (só reais)
- suggested_messages: 2-4 mensagens
- Seja brutalmente honesto na análise`;

interface ChatMessage {
  role: "client" | "seller";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("sk-COLE")) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const { messages, productType, clientName } = (await request.json()) as {
      messages: ChatMessage[];
      productType: string;
      clientName: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages to analyze" },
        { status: 400 }
      );
    }

    const conversationText = messages
      .map((m) => `${m.role === "client" ? "CLIENTE" : "VENDEDOR"}: ${m.content}`)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: REMARKETING_PROMPT },
        {
          role: "user",
          content: `Cliente: ${clientName || "não informado"}\nProduto: ${productType || "não informado"}\nTotal de mensagens: ${messages.length}\n\n--- CONVERSA COMPLETA ---\n${conversationText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    const sanitized = content.replace(/[—–]/g, ",");
    return NextResponse.json(JSON.parse(sanitized));
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
