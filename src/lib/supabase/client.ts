import { createClient } from "@supabase/supabase-js";

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

type Database = {
  public: {
    Tables: {
      core_outputs: {
        Row: CoreOutput;
        Insert: Omit<CoreOutput, "id" | "created_at">;
        Update: Partial<Omit<CoreOutput, "id" | "created_at">>;
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

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);
