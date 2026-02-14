// ==========================================================
// HisabDesk — Database Types (Strict)
// Enterprise safety layer
// Week 1 Day 1 — Type Hardening
// ==========================================================

/*
  IMPORTANT:
  Later you should auto-generate this from Supabase CLI.

  But for now we define strict manual schema
  to REMOVE ALL `any` usage project-wide.
*/

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ==========================================================
// DATABASE ROOT TYPE
// ==========================================================

export interface Database {
  public: {
    Tables: {

      // ======================================================
      // EXPENSES
      // ======================================================
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          notes: string | null
          date: string
          created_at: string
        }

        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          notes?: string | null
          date: string
          created_at?: string
        }

        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          notes?: string | null
          date?: string
          created_at?: string
        }
      }

      // ======================================================
      // INCOME
      // ======================================================
      income: {
        Row: {
          id: string
          user_id: string
          amount: number
          notes: string | null
          date: string
          created_at: string
        }

        Insert: {
          id?: string
          user_id: string
          amount: number
          notes?: string | null
          date: string
          created_at?: string
        }

        Update: {
          id?: string
          user_id?: string
          amount?: number
          notes?: string | null
          date?: string
          created_at?: string
        }
      }
    }

    Views: {}
    Functions: {}
    Enums: {}
  }
}
