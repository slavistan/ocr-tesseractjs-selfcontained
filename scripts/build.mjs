import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import { spawn } from "node:child_process";

// change working directory to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.chdir(path.resolve(__dirname, "../"));

async function build_lib() {
  try {
    await build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      outfile: "dist/index.js",
      format: "esm",
      platform: "browser",
      target: ["esnext"],
      sourcemap: "external",
      minify: false,
      external: ["fs", "path"],
      loader: {
        ".traineddata": "binary",
        ".min.js": "binary",
        ".wasm.js": "binary",
      },
    });
    console.log("Build complete");

    // Generate type annotations
    const tsc = spawn("npx", ["tsc"], { stdio: "inherit" });
    tsc.on("exit", (code) => {
      if (code === 0) {
        console.log("Declaration generation complete.");
      } else {
        console.error(`Declaration generation failed with code ${code}`);
        process.exit(code);
      }
    });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build_lib();
