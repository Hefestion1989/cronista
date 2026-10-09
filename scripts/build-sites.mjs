import { cp, mkdir, rm } from "node:fs/promises";

const source = (path) => new URL(`../${path}`, import.meta.url);
const output = (path) => new URL(`../dist/${path}`, import.meta.url);

await rm(output(""), { recursive: true, force: true });
await mkdir(output(".openai/"), { recursive: true });
for (const file of ["index.html", "app.js", "styles.css", "favicon.svg", "vendor"]) {
  await cp(source(file), output(file), { recursive: true });
}
await cp(source(".openai/hosting.json"), output(".openai/hosting.json"));
