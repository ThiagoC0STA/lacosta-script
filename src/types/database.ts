export type ConversationStatus = "active" | "remarketing" | "closed";

export interface Conversation {
  id: string;
  user_id: string;
  client_name: string;
  product_type: string;
  status: ConversationStatus;
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

export interface AnalysisResponse {
  score: number;
  summary: string;
  wins: string[];
  mistakes: string[];
  suggestions: string[];
}

export interface RemarketingAnalysis {
  remarketing_score: number;
  is_good_lead: boolean;
  verdict: string;
  client_profile: {
    interest_level: "high" | "medium" | "low";
    objections: string[];
    desires: string[];
    buying_stage: string;
  };
  conversation_errors: {
    error: string;
    impact: "critical" | "moderate" | "minor";
    fix: string;
  }[];
  reapproach_strategy: {
    best_timing: string;
    angle: string;
    tone: string;
  };
  suggested_messages: {
    message: string;
    style: string;
  }[];
  reasoning: string;
}
