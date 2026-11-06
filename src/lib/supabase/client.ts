import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  CakeDesignTranscriptMessage,
  CakeInspirationSource,
  DesignFeeling,
  DesignGuardrailCategory,
  UniqueCakeDetail,
} from "../cake-design.mjs";

export type CoreOutput = {
  id: string;
  created_at: string;
  occasion: string;
  product_type: "cake" | "cupcakes";
  guests: number;
  flavor: string;
  style: string;
  budget: string;
  recommendation: string;
};

export type ResearchBenchmark = {
  name: string;
  country: string;
  pattern: string;
  relevance: string;
  source: string;
  accessed: string;
};

export type ResearchCompetitor = {
  name: string;
  type: string;
  market: string;
  offer: string;
  strength: string;
  gap: string;
  risk: "Low" | "Medium" | "High";
  source: string;
};

export type ResearchRisk = {
  name: string;
  level: "Low" | "Medium" | "High";
  detail: string;
};

export type ResearchOutput = {
  id: number;
  created_at: string;
  topic: string;
  target_user: string;
  market: string;
  research_goal: string;
  summary: string;
  benchmarks: ResearchBenchmark[];
  competitors: ResearchCompetitor[];
  risks: ResearchRisk[];
};

export type PricingScenarioRow = {
  id: string;
  created_at: string;
  name: string;
  scenario_type: "Conservador" | "Optimista";
  customer_counts: { freePlannerUsers: number; plannerPlusSubscribers: number; bakeryProSubscribers: number };
  monthly_prices: { plannerPlusPrice: number; bakeryProPrice: number };
  monthly_revenue: number;
  annual_revenue: number;
};

export type MarketingAssetType =
  | "landing_copy"
  | "social_post"
  | "video_script"
  | "campaign_calendar";

export type MarketingAssetRow = {
  id: string;
  user_id: string;
  created_at: string;
  asset_type: MarketingAssetType;
  title: string;
  content: string;
};

export type CakeDesignChatRow = {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  feeling: DesignFeeling;
  unique_detail: UniqueCakeDetail;
  inspiration: CakeInspirationSource;
  design_description: string;
  guardrail_categories: DesignGuardrailCategory[];
  transcript: CakeDesignTranscriptMessage[];
};

export type CakeDesignFeedbackRow = {
  id: string;
  owner_id: string;
  session_id: string;
  design_version: "week5-design-v1";
  vote: "up" | "down";
  created_at: string;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      core_outputs: {
        Row: CoreOutput;
        Insert: Omit<CoreOutput, "id" | "created_at">;
        Update: Partial<Omit<CoreOutput, "id" | "created_at">>;
        Relationships: [];
      };
      research_outputs: {
        Row: ResearchOutput;
        Insert: Omit<ResearchOutput, "id" | "created_at">;
        Update: Partial<Omit<ResearchOutput, "id" | "created_at">>;
        Relationships: [];
      };
      pricing_scenarios: {
        Row: PricingScenarioRow;
        Insert: Omit<PricingScenarioRow, "id" | "created_at">;
        Update: Partial<Omit<PricingScenarioRow, "id" | "created_at">>;
        Relationships: [];
      };
      marketing_assets: {
        Row: MarketingAssetRow;
        Insert: Omit<MarketingAssetRow, "id" | "created_at">;
        Update: Partial<Omit<MarketingAssetRow, "id" | "created_at">>;
        Relationships: [];
      };
      chat_sessions: {
        Row: CakeDesignChatRow;
        Insert: Omit<CakeDesignChatRow, "id" | "created_at">;
        Update: Partial<Omit<CakeDesignChatRow, "id" | "owner_id" | "created_at">>;
        Relationships: [];
      };
      chat_feedback: {
        Row: CakeDesignFeedbackRow;
        Insert: Omit<CakeDesignFeedbackRow, "id" | "created_at">;
        Update: Partial<Omit<CakeDesignFeedbackRow, "id" | "owner_id" | "session_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase public environment variables.");
}

const globalForSupabase = globalThis as typeof globalThis & {
  cakematchSupabase?: SupabaseClient<Database>;
};

export const supabase = globalForSupabase.cakematchSupabase ?? createClient<Database>(supabaseUrl, supabasePublishableKey);

globalForSupabase.cakematchSupabase = supabase;
