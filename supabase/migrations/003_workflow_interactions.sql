-- ============================================================
-- Utilify — Migración 003: Workflow de aprobación + interacciones
-- ============================================================

-- ── Estado de publicación en menu_items ──────────────────────
-- DEFAULT 'published' para preservar ítems existentes en producción.
-- Los ítems creados desde el CMS explícitamente inician en 'draft'.
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'pending', 'published'));

-- ── Configuración de interacciones por ítem ──────────────────
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS allow_image_zoom BOOL NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pdf_url           TEXT;

-- Índice para filtrar por estado en queries públicas
CREATE INDEX IF NOT EXISTS idx_menu_items_status ON public.menu_items(status);

-- ── Storage bucket para documentos PDF ───────────────────────
-- Ejecutar en Supabase Dashboard > Storage > New Bucket
-- Nombre: menu-docs  |  Public: true
-- O via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('menu-docs', 'menu-docs', true);

-- Policies de storage para PDFs (mismo patrón que menu-images):
-- CREATE POLICY "menu_docs_insert" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'menu-docs'
--     AND auth.uid() IS NOT NULL
--   );

-- CREATE POLICY "menu_docs_select" ON storage.objects
--   FOR SELECT USING (bucket_id = 'menu-docs');

-- CREATE POLICY "menu_docs_delete" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'menu-docs'
--     AND auth.uid() IS NOT NULL
--   );
