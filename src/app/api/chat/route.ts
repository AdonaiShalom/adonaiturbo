import { NextResponse } from "next/server";
import { loadProviders, getChatUrl, getHeaders } from "@/lib/providers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const providers = loadProviders();

    if (!providers.length) {
      return NextResponse.json({ error: "Nenhum provedor configurado." }, { status: 503 });
    }

    const model = body.model || "auto";
    const messages = Array.isArray(body.mensagens) ? body.mensagens : (Array.isArray(body.messages) ? body.messages : (body.mensagem ? [{ role: "user", content: body.mensagem }] : []));

    for (const provider of providers) {
      for (const providerModel of provider.models) {
        if (model !== "auto" && providerModel.id !== model) continue;

        try {
          const url = getChatUrl(provider, providerModel.id);
          const headers = getHeaders(provider);

          const response = await fetch(url, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({
              ...body,
              model: providerModel.id,
              messages
            })
          });

          if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
              resposta: data.choices?.[0]?.message?.content || "",
              data
            });
          }
        } catch {}
      }
    }

    return NextResponse.json(
      { error: "Nenhum provedor respondeu." },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 400 }
    );
  }
}
