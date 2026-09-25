import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
