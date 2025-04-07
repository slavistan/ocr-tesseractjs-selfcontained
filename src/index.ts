import tesseract from "tesseract.js";
import { simd } from "wasm-feature-detect";
import * as indexeddb from "idb-keyval";
import tesseractLangFileDEU from "./assets/deu.traineddata";
import tesseractWorkerSource from "./assets/tesseractjs-worker.min.js";
import tesseractCoreSource from "./assets/tesseractjs-tesseract-core-lstm.wasm.js";
import tesseractCoreSIMDSource from "./assets/tesseractjs-tesseract-core-simd-lstm.wasm.js";

// Write language-specific model file to IndexedDB, where
// tesseract expects it.
await indexeddb.set("ocr/deu.traineddata", tesseractLangFileDEU);

// workerPath
const workerBlobUrl = URL.createObjectURL(new Blob([tesseractWorkerSource]));

let tesseractjsCorePath: string;
if (await simd()) {
  tesseractjsCorePath = URL.createObjectURL(
    new Blob([tesseractCoreSIMDSource])
  );
} else {
  tesseractjsCorePath = URL.createObjectURL(new Blob([tesseractCoreSource]));
}

// HACK: tesseract.js checks whether the corePath parameter ends in 'js'. Otherwise
//       the value is interpreted as a prefix which tesseract.js will append stuff
//       to. In order to circumvent this behavior while retaining a valid URL we just
//       append a random shard.
tesseractjsCorePath += "#foo";

export async function ocr(png: tesseract.ImageLike): Promise<string> {
  const worker = await tesseract.createWorker("deu", undefined, {
    cachePath: "ocr",
    workerPath: workerBlobUrl,
    corePath: tesseractjsCorePath,
  });

  const text = (await worker.recognize(png)).data.text;
  await worker.terminate();
  return text;
}
