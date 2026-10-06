import { NextResponse } from "next/server";

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_SECRET_KEY || ""
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { url, key } = supabaseConfig();
  const { id } = await params;

  if (!url || !key) {
    return NextResponse.json(
      { erro: "Supabase nao configurado." },
      { status: 503 }
    );
  }

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return NextResponse.json(
      { erro: "Identificador de conversa invalido." },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(
      `${url}/rest/v1/mensagens?select=papel,conteudo,criada_em&conversa_id=eq.${id}&order=criada_em.asc`,
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
      mensagens: dados
    });
  } catch (erro) {
    console.error("Erro ao carregar conversa:", erro);

    return NextResponse.json(
      { erro: "Nao foi possivel carregar a conversa." },
      { status: 502 }
    );
  }
}