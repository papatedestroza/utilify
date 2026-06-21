-- ============================================================
-- Utilify — Migración 004: Bucket menu-docs + RLS policies
-- ============================================================

-- ── Crear bucket público para PDFs ───────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-docs',
  'menu-docs',
  true,
  10485760,           -- 10 MB en bytes (RF4.3)
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ── RLS policies para storage.objects (menu-docs) ────────────
-- Lectura pública: cualquier visitante puede descargar PDFs publicados
CREATE POLICY "menu_docs_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-docs');

-- Subida: solo usuarios autenticados pueden subir a su carpeta de negocio
-- El path sigue el patrón: {business_id}/{timestamp}.pdf
-- Verificamos que el negocio pertenezca al usuario que sube
CREATE POLICY "menu_docs_insert_owner"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-docs'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.user_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  );

-- Actualización (necesaria para upsert: true en el cliente)
CREATE POLICY "menu_docs_update_owner"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-docs'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.user_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  );

-- Eliminación: solo el dueño del negocio puede borrar sus PDFs
CREATE POLICY "menu_docs_delete_owner"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-docs'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.user_id = auth.uid()
        AND (storage.foldername(name))[1] = b.id::text
    )
  );

-- ── Mismo refuerzo para menu-images (por si no se aplicó antes) ──
-- Reemplaza los policies permisivos comentados en 001_init.sql
-- con la misma lógica de ownership por carpeta de negocio.
DO $$
BEGIN
  -- insert
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'menu_images_insert_owner'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "menu_images_insert_owner"
        ON storage.objects FOR INSERT
        WITH CHECK (
          bucket_id = 'menu-images'
          AND auth.uid() IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM public.businesses b
            WHERE b.user_id = auth.uid()
              AND (storage.foldername(name))[1] = b.id::text
          )
        )
    $policy$;
  END IF;

  -- update (para upsert)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'menu_images_update_owner'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "menu_images_update_owner"
        ON storage.objects FOR UPDATE
        USING (
          bucket_id = 'menu-images'
          AND auth.uid() IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM public.businesses b
            WHERE b.user_id = auth.uid()
              AND (storage.foldername(name))[1] = b.id::text
          )
        )
    $policy$;
  END IF;

  -- select público
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'menu_images_select_public'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "menu_images_select_public"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'menu-images')
    $policy$;
  END IF;

  -- delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'menu_images_delete_owner'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "menu_images_delete_owner"
        ON storage.objects FOR DELETE
        USING (
          bucket_id = 'menu-images'
          AND auth.uid() IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM public.businesses b
            WHERE b.user_id = auth.uid()
              AND (storage.foldername(name))[1] = b.id::text
          )
        )
    $policy$;
  END IF;
END
$$;
