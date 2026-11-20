import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "out");
const botDir = process.env.MAKEFUN_BOT_DIR ?? here;

const src = join(botDir, "POST.json");
const dst = join(outDir, "POST.json");

if (!existsSync(src)) throw new Error("POST.json not found in the repository");
const parsed = JSON.parse(readFileSync(src, "utf8"));
if (typeof parsed !== "object" || parsed === null || typeof parsed.url !== "string") {
  throw new Error("POST.json must be a JSON object with a url string");
}
if (!/^https:\/\/(x\.com|twitter\.com|www\.x\.com|www\.twitter\.com|mobile\.twitter\.com)\//.test(parsed.url)) {
  throw new Error("POST.json url must be an X post address");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
console.log("POST.json copied to", dst, "for post", parsed.url);
