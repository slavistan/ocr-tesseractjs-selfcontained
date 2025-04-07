**Self-contained, bundled wrapper of tesseract.js for the web.**

# Usage

This library exposes a single function that wraps Tesseract.js (see _src/index.ts_):

```ts
async function ocr(png: tesseract.ImageLike): Promise<string>;
```

For an example usage see below.

# Dev Setup

Usage:

```bash
npm i

# Downloads external files required by tesseract.js into ./src/assets:
# - deu.traineddata file
# - Tesseract.js core wasm module (lstm-only, simd and non-simd version)
# - Tesseract.js worker code
npx download-assets

# Builds a single file self-contained library exposing a single function that wraps tesseract.js.
npx build

# Run an example.
npx example

# Publish to npm
npm publish
```
