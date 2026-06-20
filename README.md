# Utilify — Plataforma de gestión para pequeños negocios

SaaS modular para dueños de bares, cafeterías y comercios en Argentina. Módulo MVP: CMS de menú digital.

## Stack

- **Frontend/Backend**: Next.js 16 (App Router) + TypeScript + Tailwind v4
- **Auth + DB + Storage**: Supabase
- **Hosting**: Vercel
- **Notificaciones de UI**: Sonner

## Setup local

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd utilify
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Completar con los valores de tu proyecto Supabase (app.supabase.com > Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
REVALIDATION_SECRET=string-random-seguro
```

### 3. Crear proyecto en Supabase

1. Ir a [app.supabase.com](https://app.supabase.com) y crear un proyecto nuevo.
2. En **SQL Editor**, ejecutar el contenido de `supabase/migrations/001_init.sql`.
3. Crear el bucket de storage:
   - Ir a **Storage > New Bucket**
   - Nombre: `menu-images`
   - Marcar como **Public**
4. Crear las políticas de storage (copiar los comandos comentados al final del SQL).

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Flujo end-to-end

1. `/ ` → Landing pública
2. `/auth/register` → Registro (crea negocio automáticamente con slug generado del nombre)
3. `/admin` → Dashboard con módulos
4. `/admin/cms` → Editor de menú con categorías e ítems
5. Botón **Publicar menú** → llama a `/api/revalidate` que invalida la caché y registra la publicación
6. Las webs de clientes Torii consumen `/api/businesses/[slug]/menu` para mostrar el menú actualizado

## Endpoints públicos (para webs externas)

```
GET /api/businesses/:slug          → Info del negocio
GET /api/businesses/:slug/menu     → Menú completo (solo ítems disponibles)
```

Respuesta del menú:
```json
{
  "slug": "bar-la-esquina",
  "categories": [
    {
      "id": "...",
      "name": "Platos principales",
      "menu_items": [
        { "id": "...", "name": "Empanada", "price": 850, "tags": ["spicy"], ... }
      ]
    }
  ]
}
```

## Estructura de carpetas

```
app/
├── page.tsx                    ← Landing pública
├── sitemap.ts / robots.ts
├── auth/login | register
├── admin/
│   ├── layout.tsx              ← Layout con sidebar
│   ├── page.tsx                ← Dashboard de módulos
│   └── cms/
│       ├── page.tsx            ← Lista de categorías + preview
│       ├── category/new | [id]
│       └── item/new | [id]
└── api/
    ├── revalidate/             ← POST, requiere REVALIDATION_SECRET
    └── businesses/[slug]/menu  ← GET, público

components/
├── landing/    ← Nav, Hero, SocialProof, Modules, HowItWorks, DashboardDemo, Pricing, CTA, Footer
├── cms/        ← ItemForm, CategoryForm, MenuPreview, UploadImage
└── common/     ← AdminSidebar

lib/
├── supabase-client.ts  ← Browser client
├── supabase-server.ts  ← Server client + admin client
├── types.ts            ← Tipos TypeScript de todas las tablas
└── utils.ts            ← cn(), slugify()

supabase/
└── migrations/001_init.sql
```

## Próximos pasos (Fase 2)

- Pagos con MercadoPago (suscripción mensual)
- Módulo Finanzas
- Módulo Gestión (turnos/reservas)
- Módulo Marketing (campañas WhatsApp/IG)
- FastAPI backend para webhooks avanzados (Railway)
