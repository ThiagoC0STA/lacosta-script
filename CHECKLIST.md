# La Costa Script - Checklist de Melhorias

## Bugs para corrigir

- [ ] **Bug no Re-analisar do remarketing** - Stale closure: `handleReanalyze` limpa o map mas `handleSelect` ainda lê o valor antigo e pula a chamada da API
- [ ] **Crash se IA retornar valores inesperados** - `RemarketingAnalysisView` quebra se `interest_level` ou `impact` vierem com valor fora do esperado (sem fallback)
- [ ] **Erros do Supabase ignorados** - Home e remarketing não checam `error` das queries, UI fica vazia sem feedback
- [ ] **Ações sem rollback** - `handleDelete`, `handleStatusChange`, `handleClientNameChange` atualizam state local mesmo se Supabase falhar
- [ ] **Modal fecha antes de confirmar criação** - Se o insert der erro, modal já fechou e usuário acha que criou
- [ ] **Textos em inglês misturados** - Remarketing page tem erros em inglês no meio do app em português
- [ ] **Dead code no sidebar** - `statusConf` é atribuído mas nunca usado no render

## Segurança

- [ ] **API routes sem autenticação** - `/api/chat`, `/api/analyze`, `/api/remarketing` podem ser chamadas sem sessão (middleware exclui `/api/*`), qualquer um gasta seus tokens da OpenAI
- [ ] **Sem rate limiting** - Arrays enormes de mensagens podem explodir custo de tokens
- [ ] **Prompt injection** - Texto do cliente vai direto no prompt, risco de manipulação das respostas
- [ ] **Validar body das APIs** - Nenhuma rota valida o shape do request antes de mandar pra OpenAI
- [ ] **Validar resposta da OpenAI** - `JSON.parse` sem schema check, shapes errados quebram o front

## Performance

- [ ] **`createClient()` chamado no render** - Cria nova instância a cada render em `page.tsx` e `ChatArea.tsx` (mover pra `useMemo` ou nível de módulo)
- [ ] **Conversas longas = payload pesado** - Toda a conversa vai pra OpenAI toda vez, sem truncamento ou resumo

## UX existente

- [ ] **Campo "Nome do cliente" duplicado no modal** - Aparece nos dois lados ligado ao mesmo state, redundante
- [ ] **Clipboard sem fallback** - Botões de copiar/colar não tratam erro de permissão ou HTTP sem HTTPS

---

## Ideias para fechar mais vendas

### Objeção Killer (alta prioridade)
- [ ] **Banco de objeções com respostas prontas** - Criar uma base de objeções comuns ("tá caro", "vou pensar", "não confio", "prefiro financiamento") com respostas matadoras que a IA pode sugerir automaticamente quando detectar a objeção na mensagem do cliente

### Calculadora de Comparação (alta prioridade)
- [ ] **Financiamento vs Consórcio lado a lado** - Uma mini calculadora onde o Luciano coloca o valor do bem, e ela mostra: total pago no financiamento vs consórcio, diferença em R$, parcela mensal de cada. Poder mandar screenshot pro cliente ou gerar link

### Follow-up Automático (alta prioridade)
- [ ] **Timer de follow-up por conversa** - Quando marca como remarketing ou fica X dias sem resposta, o sistema avisa "Faz 3 dias que o João não responde, quer reabordar?" com sugestão de mensagem pronta
- [ ] **Dashboard de follow-ups do dia** - Tela mostrando todos os clientes que precisam de follow-up hoje, ordenados por prioridade

### Histórico de Objeções do Cliente (média prioridade)
- [ ] **Tags automáticas por objeção** - A IA detecta e tagga automaticamente: "preço", "timing", "confiança", "comparando", etc. Na sidebar aparece a tag principal do cliente pra saber de cara qual é a dor dele

### Templates de Gatilho (média prioridade)
- [ ] **Biblioteca de gatilhos por situação** - Templates prontos pra momentos específicos: "cliente sumiu há 1 semana", "cliente pediu pra pensar", "cliente comparando com banco", "cliente disse que não tem entrada". Cada um com 3-4 mensagens prontas que a IA adapta ao contexto

### Simulador de Lance (média prioridade)
- [ ] **Calculadora de lance embutido** - Input com valor do crédito e % de lance, mostra quanto fica de parcela com e sem lance, chance estimada de contemplação. Visual simples pra mostrar pro cliente

### Score de Temperatura do Lead (média prioridade)
- [ ] **Termômetro em tempo real na conversa** - A IA calcula um score de 1-10 de "quão perto de fechar" o cliente tá, baseado nas respostas. Atualiza a cada mensagem. Quando chega em 7+, a IA sugere mensagem de fechamento

### Audio to Text (baixa prioridade)
- [ ] **Transcrever áudio do cliente** - Muitos clientes mandam áudio no WhatsApp. Poder colar o áudio e o sistema transcrever automaticamente pra alimentar a IA

### CRM Leve (baixa prioridade)
- [ ] **Campos extras no cliente** - Renda estimada, cidade, tem imóvel próprio, já fez consórcio, fonte do lead (Instagram, indicação, etc). A IA usa essas infos pra personalizar ainda mais as mensagens
- [ ] **Notas manuais na conversa** - Campo pra Luciano anotar coisas que não estão na conversa ("falei com ele por telefone, tá interessado mas a esposa não quer")

### Mensagens de Pós-Venda (baixa prioridade)
- [ ] **Templates de relacionamento** - Mensagens pra mandar depois de fechar: aniversário da compra, atualização de grupo, contemplação de alguém do grupo (prova social pra quem ainda não foi contemplado)

### Análise de Padrões (futuro)
- [ ] **Dashboard de insights** - Qual produto vende mais, qual objeção aparece mais, qual tipo de mensagem converte mais, horário que cliente responde mais rápido. Dados pra refinar a estratégia
