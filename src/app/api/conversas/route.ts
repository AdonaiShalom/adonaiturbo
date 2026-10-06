import { NextResponse } from "next/server";

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_SECRET_KEY || ""
  };
}

export async function GET() {
  const { url, key } = supabaseConfig();

  if (!url || !key) {
    return NextResponse.json(
      { erro: "Supabase nao configurado." },
      { status: 503 }
    );
  }

  try {
    const r = await fetch(
      `${url}/rest/v1/conversas?select=id,titulo,atualizada_em&order=atualizada_em.desc&limit=50`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "Accept-Profile": "turbo"
        },
        cache: "no-store"
      }
    );

    if (!r.ok) {
      const erro = await r.text();
      throw new Error(erro);
    }

    const dados = await r.json();

    return NextResponse.json({
      conversas: dados
    });
  } catch (erro) {
    console.error("Erro ao listar conversas:", erro);

    return NextResponse.json(
      { erro: "Nao foi possivel listar as conversas." },
      { status: 502 }
    );
  }
}