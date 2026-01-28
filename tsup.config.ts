import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",
  outDir: "dist",
  sourcemap: true,
  clean: true,
  external: ["express", "cors", "morgan", "axios", "cheerio", "dotenv"],
});
