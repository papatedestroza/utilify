-- Tabla de waitlist para módulos próximos
CREATE TABLE IF NOT EXISTS public.waitlist (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text        NOT NULL,
  module      text        NOT NULL DEFAULT 'general',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Un email puede anotarse a múltiples módulos, pero no dos veces al mismo
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_module_idx ON public.waitlist (email, module);

-- RLS: solo admins leen; cualquier visitante puede inscribirse
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_insert_public" ON public.waitlist
  FOR INSERT WITH CHECK (true);
