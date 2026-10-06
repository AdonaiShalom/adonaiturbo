import { readFile } from "fs/promises";
import path from "path";

export async function loadAdonaiKnowledge() {
  const arquivo = path.join(
    process.cwd(),
    "src",
    "knowledge",
    "manual_adonai.md"
  );

  return await readFile(arquivo, "utf8");
}