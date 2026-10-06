import { NextResponse } from "next/server";
import { loadProviders, getChatUrl, getHeaders } from "@/lib/providers";

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_SECRET_KEY || ""
  };
}

async function supabase(
  caminho: string,
  options: RequestInit = {}
) {
  const { url, key } = supabaseConfig();

  if (!url || !key) {
    throw new Error("Supabase nao configurado.");
  }

  const headers = new Headers(options.headers);

  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  headers.set("Content-Type", "application/json");
  headers.set("Accept-Profile", "turbo");
  headers.set("Content-Profile", "turbo");

  const r = await fetch(`${url}/rest/v1/${caminho}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!r.ok) {
    const erro = await r.text();
    throw new Error(erro);
  }

  const texto = await r.text();
  return texto ? JSON.parse(texto) : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const providers = loadProviders();

    if (!providers.length) {
      return NextResponse.json(
        { error: "Nenhum provedor configurado." },
        { status: 503 }
      );
    }

    const model = body.model || "auto";

    const messages = Array.isArray(body.mensagens)
      ? body.mensagens
      : Array.isArray(body.messages)
        ? body.messages
        : body.mensagem
          ? [{ role: "user", content: body.mensagem }]
          : [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "Envie uma mensagem." },
        { status: 400 }
      );
    }

    const ultimaMensagem = messages[messages.length - 1];
    const textoNovo =
      typeof ultimaMensagem?.content === "string"
        ? ultimaMensagem.content
        : "";

    let conversaId =
      typeof body.conversaId === "string" && body.conversaId.trim()
        ? body.conversaId
        : null;

    let salvando = false;

    if (textoNovo) {
      try {
        if (!conversaId) {
          const criada = await supabase("conversas", {
            method: "POST",
            headers: {
              Prefer: "return=representation"
            },
            body: JSON.stringify({
              titulo: textoNovo.slice(0, 80)
            })
          });

          conversaId = criada?.[0]?.id || null;
        }

        if (conversaId) {
          await supabase("mensagens", {
            method: "POST",
            body: JSON.stringify({
              conversa_id: conversaId,
              papel: "user",
              conteudo: textoNovo
            })
          });

          salvando = true;
        }
      } catch (erro) {
        console.error("Nao consegui salvar a pergunta:", erro);
        conversaId = null;
      }
    }

    for (const provider of providers) {
      for (const providerModel of provider.models) {
        if (model !== "auto" && providerModel.id !== model) {
          continue;
        }

        try {
          const url = getChatUrl(provider, providerModel.id);
          const headers = getHeaders(provider);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              ...headers,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...body,
              model: providerModel.id,
              messages
            })
          });

          if (!response.ok) {
            continue;
          }

          const data = await response.json();

          const textoResposta =
            data.choices?.[0]?.message?.content || "";

          let salvo = false;

          if (salvando && conversaId && textoResposta) {
            try {
              await supabase("mensagens", {
                method: "POST",
                body: JSON.stringify({
                  conversa_id: conversaId,
                  papel: "assistant",
                  conteudo: textoResposta
                })
              });

              await supabase(`conversas?id=eq.${conversaId}`, {
                method: "PATCH",
                body: JSON.stringify({
                  atualizada_em: new Date().toISOString()
                })
              });

              salvo = true;
            } catch (erro) {
              console.error(
                "Nao consegui salvar a resposta:",
                erro
              );
            }
          }

          return NextResponse.json({
            resposta: textoResposta,
            conversaId,
            salvo,
            data
          });
        } catch (erro) {
          console.error(
            `Erro no provedor ${provider.name}:`,
            erro
          );
        }
      }
    }

    return NextResponse.json(
      {
        error: "Nenhum provedor respondeu.",
        conversaId
      },
      { status: 502 }
    );
  } catch (erro) {
    console.error("Erro no chat:", erro);

    return NextResponse.json(
      { error: "Requisicao invalida." },
      { status: 400 }
    );
  }
}