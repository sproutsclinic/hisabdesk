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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          metadata: Json | null
          org_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          org_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          org_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      beta_users: {
        Row: {
          created_at: string | null
          email: string
        }
        Insert: {
          created_at?: string | null
          email: string
        }
        Update: {
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          category: string
          created_at: string | null
          id: string
          month: number
          planned: number | null
          user_id: string
          year: number
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          month: number
          planned?: number | null
          user_id: string
          year: number
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          month?: number
          planned?: number | null
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      ca_profiles: {
        Row: {
          commission_percent: number | null
          created_at: string | null
          firm_name: string | null
          id: string
          license_number: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          commission_percent?: number | null
          created_at?: string | null
          firm_name?: string | null
          id?: string
          license_number?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          commission_percent?: number | null
          created_at?: string | null
          firm_name?: string | null
          id?: string
          license_number?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      ca_tickets: {
        Row: {
          ca_id: string | null
          created_at: string | null
          fee_paid: number | null
          id: string
          status: string | null
          strategy_id: string | null
          user_id: string
        }
        Insert: {
          ca_id?: string | null
          created_at?: string | null
          fee_paid?: number | null
          id?: string
          status?: string | null
          strategy_id?: string | null
          user_id: string
        }
        Update: {
          ca_id?: string | null
          created_at?: string | null
          fee_paid?: number | null
          id?: string
          status?: string | null
          strategy_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ca_tickets_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "ca_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ca_tickets_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "family_shift_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          email: string | null
          gstin: string | null
          id: string
          name: string
          org_id: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          org_id: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          org_id?: string
          phone?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      deductions: {
        Row: {
          created_at: string | null
          id: string
          total: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          total?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          total?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          name: string | null
          size_kb: number | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          name?: string | null
          size_kb?: number | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          name?: string | null
          size_kb?: number | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expense_budgets: {
        Row: {
          category: string
          created_at: string | null
          id: string
          limit_amount: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          limit_amount: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          limit_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          annual_income: number | null
          created_at: string | null
          id: string
          name: string
          pan: string | null
          relation: string | null
          user_id: string
        }
        Insert: {
          annual_income?: number | null
          created_at?: string | null
          id?: string
          name: string
          pan?: string | null
          relation?: string | null
          user_id: string
        }
        Update: {
          annual_income?: number | null
          created_at?: string | null
          id?: string
          name?: string
          pan?: string | null
          relation?: string | null
          user_id?: string
        }
        Relationships: []
      }
      family_shift_strategies: {
        Row: {
          ai_output: Json | null
          created_at: string | null
          estimated_savings: number | null
          id: string
          user_id: string
        }
        Insert: {
          ai_output?: Json | null
          created_at?: string | null
          estimated_savings?: number | null
          id?: string
          user_id: string
        }
        Update: {
          ai_output?: Json | null
          created_at?: string | null
          estimated_savings?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      family_vault: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          estimated_value: number | null
          file_path: string | null
          id: string
          proof_file_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          estimated_value?: number | null
          file_path?: string | null
          id?: string
          proof_file_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          estimated_value?: number | null
          file_path?: string | null
          id?: string
          proof_file_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gst_credentials: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: number | null
          gstin: string
          id: string
          org_id: string | null
          provider: string | null
          refresh_token: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: number | null
          gstin: string
          id?: string
          org_id?: string | null
          provider?: string | null
          refresh_token?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: number | null
          gstin?: string
          id?: string
          org_id?: string | null
          provider?: string | null
          refresh_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_credentials_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_invoices: {
        Row: {
          cess: number | null
          cgst: number | null
          confidence: number | null
          created_at: string | null
          id: string
          igst: number | null
          invoice_date: string | null
          invoice_number: string | null
          itc_eligible: boolean | null
          org_id: string
          party_gstin: string | null
          party_name: string | null
          raw_json: Json | null
          reconciled_with: string | null
          sgst: number | null
          taxable_value: number | null
          total_amount: number | null
          total_tax: number | null
          type: string | null
        }
        Insert: {
          cess?: number | null
          cgst?: number | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          igst?: number | null
          invoice_date?: string | null
          invoice_number?: string | null
          itc_eligible?: boolean | null
          org_id: string
          party_gstin?: string | null
          party_name?: string | null
          raw_json?: Json | null
          reconciled_with?: string | null
          sgst?: number | null
          taxable_value?: number | null
          total_amount?: number | null
          total_tax?: number | null
          type?: string | null
        }
        Update: {
          cess?: number | null
          cgst?: number | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          igst?: number | null
          invoice_date?: string | null
          invoice_number?: string | null
          itc_eligible?: boolean | null
          org_id?: string
          party_gstin?: string | null
          party_name?: string | null
          raw_json?: Json | null
          reconciled_with?: string | null
          sgst?: number | null
          taxable_value?: number | null
          total_amount?: number | null
          total_tax?: number | null
          type?: string | null
        }
        Relationships: []
      }
      gst_returns: {
        Row: {
          created_at: string | null
          filed: boolean | null
          filed_at: string | null
          id: string
          org_id: string
          period: string
          raw_json: Json | null
          total_itc: number | null
          total_sales: number | null
          total_tax: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          filed?: boolean | null
          filed_at?: string | null
          id?: string
          org_id: string
          period: string
          raw_json?: Json | null
          total_itc?: number | null
          total_sales?: number | null
          total_tax?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          filed?: boolean | null
          filed_at?: string | null
          id?: string
          org_id?: string
          period?: string
          raw_json?: Json | null
          total_itc?: number | null
          total_sales?: number | null
          total_tax?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gst_summary: {
        Row: {
          created_at: string | null
          id: string
          input_tax: number | null
          net_payable: number | null
          org_id: string
          output_tax: number | null
          period: string
          total_purchase: number | null
          total_sales: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_tax?: number | null
          net_payable?: number | null
          org_id: string
          output_tax?: number | null
          period: string
          total_purchase?: number | null
          total_sales?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_tax?: number | null
          net_payable?: number | null
          org_id?: string
          output_tax?: number | null
          period?: string
          total_purchase?: number | null
          total_sales?: number | null
        }
        Relationships: []
      }
      income_sources: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          source_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          source_id?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          source_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incomes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "income_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount: number
          buy_date: string | null
          created_at: string | null
          current_value: number | null
          goal_id: string | null
          id: string
          name: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          buy_date?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_id?: string | null
          id?: string
          name: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          buy_date?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_id?: string | null
          id?: string
          name?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "wealth_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          read: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          org_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: []
      }
      payment_audit_logs: {
        Row: {
          amount: number | null
          created_at: string | null
          event: string
          id: string
          payment_id: string | null
          raw: Json | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          event: string
          id?: string
          payment_id?: string | null
          raw?: Json | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          event?: string
          id?: string
          payment_id?: string | null
          raw?: Json | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          is_pro: boolean | null
          onboarding_profile: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_pro?: boolean | null
          onboarding_profile?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_pro?: boolean | null
          onboarding_profile?: Json | null
        }
        Relationships: []
      }
      recurring_income: {
        Row: {
          active: boolean | null
          amount: number
          category: string | null
          created_at: string | null
          frequency: string | null
          id: string
          next_run: string
          notes: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          amount: number
          category?: string | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          next_run: string
          notes?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          amount?: number
          category?: string | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          next_run?: string
          notes?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          id: string
          reminder_date: string
          status: string | null
          type: string | null
          user_id: string
          vault_item_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reminder_date: string
          status?: string | null
          type?: string | null
          user_id: string
          vault_item_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reminder_date?: string
          status?: string | null
          type?: string | null
          user_id?: string
          vault_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_vault_item_id_fkey"
            columns: ["vault_item_id"]
            isOneToOne: false
            referencedRelation: "vault_items"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          end_date: string | null
          id: string
          plan: string | null
          start_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          end_date?: string | null
          id?: string
          plan?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          end_date?: string | null
          id?: string
          plan?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tax_rules_engine: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          max_deduction: number | null
          rule_key: string | null
          section: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_deduction?: number | null
          rule_key?: string | null
          section?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_deduction?: number | null
          rule_key?: string | null
          section?: string | null
        }
        Relationships: []
      }
      tax_summaries: {
        Row: {
          savings: number | null
          tax_liability: number | null
          total_expense: number | null
          total_income: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          savings?: number | null
          tax_liability?: number | null
          total_expense?: number | null
          total_income?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          savings?: number | null
          tax_liability?: number | null
          total_expense?: number | null
          total_income?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          id: string
          note: string | null
          txn_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          txn_date?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          txn_date?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      vault_items: {
        Row: {
          category: string
          created_at: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wealth_goals: {
        Row: {
          achieved: boolean | null
          created_at: string | null
          duration: string | null
          id: string
          name: string
          saved_amount: number | null
          target_amount: number
          target_month: string | null
          user_id: string | null
        }
        Insert: {
          achieved?: boolean | null
          created_at?: string | null
          duration?: string | null
          id?: string
          name: string
          saved_amount?: number | null
          target_amount: number
          target_month?: string | null
          user_id?: string | null
        }
        Update: {
          achieved?: boolean | null
          created_at?: string | null
          duration?: string | null
          id?: string
          name?: string
          saved_amount?: number | null
          target_amount?: number
          target_month?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      income_category_summary: {
        Row: {
          category: string | null
          total: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      gst_upsert_summary_and_returns: {
        Args: {
          p_input_tax: number
          p_net_payable: number
          p_org_id: string
          p_output_tax: number
          p_period: string
          p_raw_g1: Json
          p_raw_g3: Json
          p_total_purchase: number
          p_total_sales: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
