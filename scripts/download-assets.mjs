#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import * as path from "node:path";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";

// change working directory to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.chdir(path.resolve(__dirname, "../"));

// create assets dir
const assetDir = "./src/assets";
if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir, { recursive: true });
}

const assetsUrlFilenameMap = {
  "https://github.com/naptha/tessdata/raw/refs/heads/gh-pages/4.0.0_best_int/deu.traineddata.gz":
    "deu.traineddata",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@v6.0.0/tesseract-core-lstm.wasm.js":
    "tesseractjs-tesseract-core-lstm.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@v6.0.0/tesseract-core-simd-lstm.wasm.js":
    "tesseractjs-tesseract-core-simd-lstm.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js@v6.0.0/dist/worker.min.js":
    "tesseractjs-worker.min.js",
};

async function downloadAsset(url, filename) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  const filePath = path.join(assetDir, filename);
  const fileStream = fs.createWriteStream(filePath);

  // if the downloaded file is gzipped, decompress it
  if (url.endsWith(".gz")) {
    await pipeline(response.body, createGunzip(), fileStream);
  } else {
    await pipeline(response.body, fileStream);
  }
}

Promise.all(
  Object.entries(assetsUrlFilenameMap).map(([url, filename]) =>
    downloadAsset(url, filename)
  )
)
  .then(() => {
    console.log("All assets downloaded successfully.");
  })
  .catch((error) => {
    console.error("Error downloading assets:", error);
  });
