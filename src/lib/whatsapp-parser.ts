export interface ParsedMessage {
  role: "client" | "seller";
  content: string;
  timestamp: string;
  sender: string;
}

export interface ParseResult {
  messages: ParsedMessage[];
  clientName: string;
  sellerIdentifiers: string[];
}

const SELLER_KEYWORDS = [
  "la costa",
  "lacosta",
  "corretora",
  "luciano",
];

const LINE_REGEX = /^\[(\d{1,2}:\d{2}),?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\]\s*(.+?):\s*([\s\S]*)$/;

function isSeller(sender: string): boolean {
  const lower = sender.toLowerCase();
  return SELLER_KEYWORDS.some((kw) => lower.includes(kw));
}

function extractName(sender: string): string {
  const phoneMatch = sender.match(/^\+?\d[\d\s-]+$/);
  if (phoneMatch) return "";
  return sender.trim();
}

export function parseWhatsApp(raw: string): ParseResult {
  const lines = raw.split("\n");
  const messages: ParsedMessage[] = [];
  const senders = new Set<string>();
  let current: ParsedMessage | null = null;

  for (const line of lines) {
    const match = line.match(LINE_REGEX);
    if (match) {
      if (current) {
        messages.push(current);
      }

      const [, time, date, sender, content] = match;
      const senderTrimmed = sender.trim();
      senders.add(senderTrimmed);

      const seller = isSeller(senderTrimmed);
      current = {
        role: seller ? "seller" : "client",
        content: content.trim(),
        timestamp: `${date} ${time}`,
        sender: senderTrimmed,
      };
    } else if (current && line.trim()) {
      current.content += "\n" + line.trim();
    }
  }

  if (current) {
    messages.push(current);
  }

  const sellerIds = Array.from(senders).filter(isSeller);
  const clientIds = Array.from(senders).filter((s) => !isSeller(s));

  let clientName = "";
  for (const id of clientIds) {
    const name = extractName(id);
    if (name && !name.match(/^\+?\d[\d\s-]+$/)) {
      clientName = name;
      break;
    }
  }

  return {
    messages: messages.filter((m) => m.content.length > 0),
    clientName,
    sellerIdentifiers: sellerIds,
  };
}
