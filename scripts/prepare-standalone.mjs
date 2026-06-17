import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  throw new Error(
    "Missing .next/standalone. Run next build with output: 'standalone' first.",
  );
}

await mkdir(path.join(standaloneDir, ".next"), { recursive: true });

await cp(
  path.join(root, ".next", "static"),
  path.join(standaloneDir, ".next", "static"),
  { recursive: true },
);

await cp(path.join(root, "public"), path.join(standaloneDir, "public"), {
  recursive: true,
});

console.log("Standalone assets copied.");
