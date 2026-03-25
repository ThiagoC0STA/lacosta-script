export interface Conversation {
  id: string;
  user_id: string;
  client_name: string;
  product_type: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "client" | "seller";
  content: string;
  created_at: string;
}

export interface AiResponse {
  versions: string[];
  tips: string[];
  errors: string[];
}
