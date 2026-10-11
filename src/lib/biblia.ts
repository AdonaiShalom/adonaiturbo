
import { readFile, readdir } from "fs/promises";
import path from "path";

type Versiculo = { number: number; text: string };
type Capitulo = { number: number; verses: Versiculo[] };
type Livro = { name: string; chapters: Capitulo[] };

let livrosCache: Promise<Livro[]> | null = null;

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function carregarLivros(): Promise<Livro[]> {
  if (!livrosCache) {
    livrosCache = (async () => {
      const pasta = path.join(
        process.cwd(),
        "src",
        "knowledge",
        "biblia",
        "BLivre",
        "json"
      );

      const arquivos = (await readdir(pasta))
        .filter((arquivo) => /^blivre-.*\.json$/i.test(arquivo))
        .sort();

      const livros = await Promise.all(
        arquivos.map(async (arquivo) => {
          const conteudo = await readFile(path.join(pasta, arquivo), "utf8");
          return JSON.parse(conteudo) as Livro;
        })
      );

      return livros.sort((a, b) => b.name.length - a.name.length);
    })().catch((erro) => {
      livrosCache = null;
      throw erro;
    });
  }

  return livrosCache;
}

function localizarReferencia(
  pergunta: string,
  livros: Livro[]
): { livro: Livro; capitulo: number; versiculo?: number; fim?: number } | null {
  const texto = normalizar(pergunta);

  for (const livro of livros) {
    const nome = normalizar(livro.name)
      .split(" ")
      .map(escaparRegex)
      .join("\\s+");

    const regex = new RegExp(
      `(?:^|[^a-z0-9])${nome}\\s+(\\d+)(?::(\\d+)(?:\\s*[-–]\\s*(\\d+))?)?(?![a-z0-9])`,
      "i"
    );

    const match = texto.match(regex);
    if (match) {
      return {
        livro,
        capitulo: Number(match[1]),
        versiculo: match[2] ? Number(match[2]) : undefined,
        fim: match[3] ? Number(match[3]) : undefined,
      };
    }
  }

  return null;
}

async function buscarTrecho(pergunta: string): Promise<string> {
  const livros = await carregarLivros();
  const referencia = localizarReferencia(pergunta, livros);

  if (!referencia) return "";

  const { livro, capitulo, versiculo, fim } = referencia;
  const cap = livro.chapters.find((item) => item.number === capitulo);

  if (!cap) {
    return `Referência ${livro.name} ${capitulo} não encontrada na Bíblia Livre.`;
  }

  let versiculos = cap.verses;

  if (versiculo !== undefined) {
    const ultimo = fim ?? versiculo;

    if (ultimo < versiculo || ultimo - versiculo > 100) {
      return "Intervalo de versículos inválido ou muito extenso.";
    }

    versiculos = cap.verses.filter(
      (item) => item.number >= versiculo && item.number <= ultimo
    );

    if (
      !versiculos.length ||
      versiculos[0].number !== versiculo ||
      versiculos[versiculos.length - 1].number !== ultimo
    ) {
      return `Versículos solicitados não encontrados em ${livro.name} ${capitulo}.`;
    }
  }

  const referenciaTexto =
    `${livro.name} ${capitulo}` +
    (versiculo !== undefined
      ? `:${versiculo}${fim !== undefined ? `-${fim}` : ""}`
      : "");

  return [
    `Trecho consultado: ${referenciaTexto}`,
    ...versiculos.map((v) => `${referenciaTexto.includes(":") ? v.number : `${capitulo}:${v.number}`} — ${v.text}`),
    "Fonte: Bíblia Livre, Projeto Euaggelion. Licença CC BY 3.0.",
    "https://github.com/Projeto-Euaggelion/biblia.publica",
  ].join("\n");
}

export async function loadBibliaConhecimento(pergunta = "") {
  const base = path.join(process.cwd(), "src", "knowledge", "biblia");
  const versoes = ["ACF", "ARC", "ARA", "NVI"];
  const partes: string[] = [];

  for (const versao of versoes) {
    const arquivo = path.join(base, versao, "README.md");
    try {
      partes.push(`## ${versao}\n${await readFile(arquivo, "utf8")}`);
    } catch {
      partes.push(`## ${versao}\nBase ainda sem texto autorizado.`);
    }
  }

  if (pergunta.trim()) {
    const trecho = await buscarTrecho(pergunta);
    if (trecho) partes.push(`## BÍBLIA LIVRE — TEXTO CONSULTADO\n${trecho}`);
  }

  return partes.join("\n\n");
}
