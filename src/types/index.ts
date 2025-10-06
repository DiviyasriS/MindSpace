export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  institution?: string;
  field_of_study?: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  title: string;
  content: string;
  category: 'academic' | 'social' | 'personal' | 'general';
  is_anonymous: boolean;
  created_at: string;
  stress_analysis?: StressAnalysis;
}

export interface StressAnalysis {
  id: string;
  post_id: string;
  stress_level: 'low' | 'moderate' | 'high' | 'critical';
  confidence_score: number;
  detected_indicators: string[];
  sentiment_score: number;
  recommended_resources: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'exercise' | 'hotline';
  content: string;
  tags: string[];
}

export interface StressTrackingEntry {
  id: string;
  stress_level: 'low' | 'moderate' | 'high' | 'critical';
  source: 'self_report' | 'post_analysis' | 'chat_analysis';
  notes?: string;
  created_at: string;
}
