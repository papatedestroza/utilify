export type Plan = "starter" | "pro" | "completo";

export type ContentStatus = "draft" | "pending" | "published";

export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  category: string | null;
  plan: Plan;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ItemTag = "spicy" | "sin-gluten" | "vegano" | "sin-huevo";

export interface MenuItem {
  id: string;
  category_id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  tags: ItemTag[];
  display_order: number;
  // Workflow de aprobación (RF3.x)
  status: ContentStatus;
  // Configuración de interacciones (RF2.3)
  allow_image_zoom: boolean;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuPublication {
  id: string;
  business_id: string;
  published_at: string;
  triggered_by: string;
  webhook_status: string | null;
  webhook_response: string | null;
}

export interface MenuCategoryWithItems extends MenuCategory {
  menu_items: MenuItem[];
}

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Omit<Business, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Business, "id" | "user_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      menu_categories: {
        Row: MenuCategory;
        Insert: Omit<MenuCategory, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MenuCategory, "id" | "business_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MenuItem, "id" | "business_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      menu_publications: {
        Row: MenuPublication;
        Insert: Omit<MenuPublication, "id" | "published_at">;
        Update: Partial<Omit<MenuPublication, "id" | "business_id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
