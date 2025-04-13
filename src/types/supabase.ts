export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          created_at: string;
          asset_type: string;
          asset_name: string;
          rental_type: string | null;
          date: string;
          route: string | null;
          price: number;
          fuel_cost: number | null;
          driver_cost: number | null;
          trips: number | null;
          days: number | null;
          daily_cash: number;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          asset_type: string;
          asset_name: string;
          rental_type?: string | null;
          date: string;
          route?: string | null;
          price: number;
          fuel_cost?: number | null;
          driver_cost?: number | null;
          trips?: number | null;
          days?: number | null;
          daily_cash: number;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          asset_type?: string;
          asset_name?: string;
          rental_type?: string | null;
          date?: string;
          route?: string | null;
          price?: number;
          fuel_cost?: number | null;
          driver_cost?: number | null;
          trips?: number | null;
          days?: number | null;
          daily_cash?: number;
          user_id?: string | null;
        };
      };
      monthly_expenses: {
        Row: {
          id: string;
          created_at: string;
          month: number;
          year: number;
          staff_salary: number | null;
          night_guard_salary: number | null;
          electricity_bill: number | null;
          water_bill: number | null;
          internet_bill: number | null;
          other_expenses: number | null;
          total_expense: number;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          month: number;
          year: number;
          staff_salary?: number | null;
          night_guard_salary?: number | null;
          electricity_bill?: number | null;
          water_bill?: number | null;
          internet_bill?: number | null;
          other_expenses?: number | null;
          total_expense: number;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          month?: number;
          year?: number;
          staff_salary?: number | null;
          night_guard_salary?: number | null;
          electricity_bill?: number | null;
          water_bill?: number | null;
          internet_bill?: number | null;
          other_expenses?: number | null;
          total_expense?: number;
          user_id?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          is_admin?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
