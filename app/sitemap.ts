import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://utilify.com.ar";

  const supabase = createAdminClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false });

  const menuUrls = (businesses ?? []).map((b) => ({
    url: `${base}/menu/${b.slug}`,
    lastModified: new Date(b.updated_at as string),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/auth/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...menuUrls,
  ];
}
