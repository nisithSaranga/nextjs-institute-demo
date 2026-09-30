// Next.js on Windows can export segment payloads in nested folders while Link
// requests dot-separated filenames. Keep the export portable to any static host.
// Upstream: https://github.com/vercel/next.js/issues/92339
// Copies generated files only; no runtime rewrite or node_modules patch is needed.
import { readdir, copyFile, stat } from "node:fs/promises";
import { resolve, join, relative, sep, basename, dirname } from "node:path";

const root = resolve("out");
let copied = 0;
async function flatten(segmentRoot, directory = segmentRoot) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) await flatten(segmentRoot, source);
    else if (entry.isFile() && entry.name.endsWith(".txt")) {
      const suffix = relative(segmentRoot, source).split(sep).join(".");
      const destination = join(
        dirname(segmentRoot),
        `${basename(segmentRoot)}.${suffix}`,
      );
      // Prefer a correct file if a future Next.js version already emits it.
      try {
        await stat(destination);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        await copyFile(source, destination);
        copied++;
      }
    }
  }
}
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (
      !entry.isDirectory() ||
      entry.name === "_next" ||
      entry.name === "images"
    )
      continue;
    const child = join(directory, entry.name);
    if (entry.name.startsWith("__next.")) await flatten(child);
    else await visit(child);
  }
}
await visit(root);
console.log(`Static export: normalized ${copied} segment payload filename(s).`);
