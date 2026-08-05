export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          group_type: string
          icon: string
          id: string
          name: string
          name_np: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          group_type?: string
          icon?: string
          id?: string
          name: string
          name_np?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          group_type?: string
          icon?: string
          id?: string
          name?: string
          name_np?: string | null
          slug?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          address: string | null
          ai_summary: string | null
          assigned_worker_id: string | null
          budget_max: number | null
          budget_min: number | null
          category_slug: string | null
          city: string | null
          created_at: string
          deadline: string | null
          description: string
          employer_id: string
          id: string
          latitude: number | null
          longitude: number | null
          photo_urls: string[]
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          address?: string | null
          ai_summary?: string | null
          assigned_worker_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category_slug?: string | null
          city?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          employer_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_urls?: string[]
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          address?: string | null
          ai_summary?: string | null
          assigned_worker_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category_slug?: string | null
          city?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          employer_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_urls?: string[]
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string
          id: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          created_at: string
          id: string
          job_id: string
          message: string | null
          status: string
          worker_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          job_id: string
          message?: string | null
          status?: string
          worker_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          job_id?: string
          message?: string | null
          status?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_id: string
          comment: string | null
          created_at: string
          id: string
          job_id: string | null
          rating: number
          worker_id: string
        }
        Insert: {
          author_id: string
          comment?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          rating: number
          worker_id: string
        }
        Update: {
          author_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          rating?: number
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worker_profiles: {
        Row: {
          bio: string | null
          category_slugs: string[]
          city: string | null
          created_at: string
          daily_rate: number | null
          experience_years: number
          headline: string
          hourly_rate: number | null
          id: string
          is_available: boolean
          jobs_completed: number
          languages: string[]
          latitude: number | null
          longitude: number | null
          portfolio_urls: string[]
          rating: number
          reviews_count: number
          service_radius_km: number
          skills: string[]
          updated_at: string
          user_id: string
          verification: Database["public"]["Enums"]["verification_level"]
        }
        Insert: {
          bio?: string | null
          category_slugs?: string[]
          city?: string | null
          created_at?: string
          daily_rate?: number | null
          experience_years?: number
          headline?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean
          jobs_completed?: number
          languages?: string[]
          latitude?: number | null
          longitude?: number | null
          portfolio_urls?: string[]
          rating?: number
          reviews_count?: number
          service_radius_km?: number
          skills?: string[]
          updated_at?: string
          user_id: string
          verification?: Database["public"]["Enums"]["verification_level"]
        }
        Update: {
          bio?: string | null
          category_slugs?: string[]
          city?: string | null
          created_at?: string
          daily_rate?: number | null
          experience_years?: number
          headline?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean
          jobs_completed?: number
          languages?: string[]
          latitude?: number | null
          longitude?: number | null
          portfolio_urls?: string[]
          rating?: number
          reviews_count?: number
          service_radius_km?: number
          skills?: string[]
          updated_at?: string
          user_id?: string
          verification?: Database["public"]["Enums"]["verification_level"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "employer" | "worker" | "admin"
      job_status: "open" | "assigned" | "completed" | "cancelled"
      urgency_level: "low" | "medium" | "high" | "emergency"
      verification_level: "basic" | "silver" | "gold" | "platinum"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["employer", "worker", "admin"],
      job_status: ["open", "assigned", "completed", "cancelled"],
      urgency_level: ["low", "medium", "high", "emergency"],
      verification_level: ["basic", "silver", "gold", "platinum"],
    },
  },
} as const
