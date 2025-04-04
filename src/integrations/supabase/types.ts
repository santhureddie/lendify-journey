export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          description: string | null
          document_type: string
          file_path: string
          id: string
          loan_id: string
          mime_type: string
          original_filename: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          description?: string | null
          document_type: string
          file_path: string
          id?: string
          loan_id: string
          mime_type: string
          original_filename: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          description?: string | null
          document_type?: string
          file_path?: string
          id?: string
          loan_id?: string
          mime_type?: string
          original_filename?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          application_id: string
          borrower_address: string | null
          borrower_email: string | null
          borrower_name: string | null
          borrower_phone: string | null
          created_at: string | null
          customer_id: string
          customer_name: string
          employer_name: string | null
          employment_status: string | null
          evidence_required: string | null
          id: string
          income_amount: number | null
          loan_amount: number
          loan_purpose: string | null
          loan_type: string | null
          rejection_reason: string | null
          status: string
        }
        Insert: {
          application_id: string
          borrower_address?: string | null
          borrower_email?: string | null
          borrower_name?: string | null
          borrower_phone?: string | null
          created_at?: string | null
          customer_id: string
          customer_name: string
          employer_name?: string | null
          employment_status?: string | null
          evidence_required?: string | null
          id?: string
          income_amount?: number | null
          loan_amount: number
          loan_purpose?: string | null
          loan_type?: string | null
          rejection_reason?: string | null
          status: string
        }
        Update: {
          application_id?: string
          borrower_address?: string | null
          borrower_email?: string | null
          borrower_name?: string | null
          borrower_phone?: string | null
          created_at?: string | null
          customer_id?: string
          customer_name?: string
          employer_name?: string | null
          employment_status?: string | null
          evidence_required?: string | null
          id?: string
          income_amount?: number | null
          loan_amount?: number
          loan_purpose?: string | null
          loan_type?: string | null
          rejection_reason?: string | null
          status?: string
        }
        Relationships: []
      }
      loan_status_updates: {
        Row: {
          created_at: string | null
          id: string
          loan_id: string
          reason: string | null
          status: string
          updated_by: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          loan_id: string
          reason?: string | null
          status: string
          updated_by: string
        }
        Update: {
          created_at?: string | null
          id?: string
          loan_id?: string
          reason?: string | null
          status?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_status_updates_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_types: {
        Row: {
          base_interest_rate: number
          created_at: string | null
          description: string | null
          id: string
          max_amount: number
          max_term_months: number
          min_amount: number
          min_term_months: number
          name: string
        }
        Insert: {
          base_interest_rate: number
          created_at?: string | null
          description?: string | null
          id?: string
          max_amount: number
          max_term_months: number
          min_amount: number
          min_term_months: number
          name: string
        }
        Update: {
          base_interest_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          max_amount?: number
          max_term_months?: number
          min_amount?: number
          min_term_months?: number
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_id: number
          order_id: string
          price: number
          quantity: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: number
          order_id: string
          price: number
          quantity: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: number
          order_id?: string
          price?: number
          quantity?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          special_instructions: string | null
          status: string
          total: number
          user_email: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          special_instructions?: string | null
          status?: string
          total: number
          user_email: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          special_instructions?: string | null
          status?: string
          total?: number
          user_email?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          application_id: string
          created_at: string | null
          customer_id: string
          id: string
          payment_id: string
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          payment_id: string
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_related_entity_type?: string
          p_related_entity_id?: string
        }
        Returns: string
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
