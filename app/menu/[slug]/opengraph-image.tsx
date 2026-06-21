import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase-server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("name, category")
    .eq("slug", slug)
    .single();

  const name = business?.name ?? "Menú digital";
  const category = business?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px",
          background: "#17191c",
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: "sans-serif",
          }}
        >
          Utilify · Menú digital
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.0,
            fontFamily: "sans-serif",
          }}
        >
          {name}
        </div>
        {category && (
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.5)",
              marginTop: 20,
              fontFamily: "sans-serif",
            }}
          >
            {category}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
