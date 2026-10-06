import { readFile } from "fs/promises";
import path from "path";

export async function loadBibliaConhecimento(){
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

  return partes.join("\n\n");
}
