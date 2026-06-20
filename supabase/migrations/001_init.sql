-- ============================================================
-- Utilify — Migración inicial
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ── businesses ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.businesses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  category    TEXT,
  plan        TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'completo')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_businesses_slug    ON public.businesses(slug);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses_select_own" ON public.businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "businesses_insert_own" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "businesses_update_own" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "businesses_delete_own" ON public.businesses
  FOR DELETE USING (auth.uid() = user_id);

-- ── menu_categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  description   TEXT,
  display_order INT  NOT NULL DEFAULT 0,
  is_active     BOOL NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, slug)
);

CREATE INDEX idx_menu_categories_business_id ON public.menu_categories(business_id);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_categories_select_own" ON public.menu_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_categories_insert_own" ON public.menu_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_categories_update_own" ON public.menu_categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_categories_delete_own" ON public.menu_categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

-- ── menu_items ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.menu_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  business_id   UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url     TEXT,
  is_available  BOOL NOT NULL DEFAULT true,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  display_order INT   NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_menu_items_business_id   ON public.menu_items(business_id);
CREATE INDEX idx_menu_items_category_id   ON public.menu_items(category_id);
CREATE INDEX idx_menu_items_is_available  ON public.menu_items(is_available);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_items_select_own" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_items_insert_own" ON public.menu_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_items_update_own" ON public.menu_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_items_delete_own" ON public.menu_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

-- ── menu_publications ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.menu_publications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  published_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  triggered_by     TEXT NOT NULL,
  webhook_status   TEXT,
  webhook_response TEXT
);

CREATE INDEX idx_menu_publications_business_id ON public.menu_publications(business_id);

ALTER TABLE public.menu_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_publications_select_own" ON public.menu_publications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "menu_publications_insert_own" ON public.menu_publications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER menu_categories_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Storage bucket para imágenes ─────────────────────────────
-- Ejecutar en Supabase Dashboard > Storage > New Bucket
-- Nombre: menu-images  |  Public: true
-- O via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);

-- Policy de storage (solo el dueño puede subir al path de su negocio):
-- CREATE POLICY "menu_images_insert" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'menu-images'
--     AND auth.uid() IS NOT NULL
--   );

-- CREATE POLICY "menu_images_select" ON storage.objects
--   FOR SELECT USING (bucket_id = 'menu-images');

-- CREATE POLICY "menu_images_delete" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'menu-images'
--     AND auth.uid() IS NOT NULL
--   );
