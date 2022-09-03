import {
  prettier,
  prettierPlugins,
} from "https://denolib.com/denolib/prettier/prettier.ts";

const dynamicImports: {
  variableName: string;
  expression: string;
}[] = [];

const filePath = Deno.args[0];

const file = await Deno.readTextFile(filePath);

const importRegex = /import (.*?) from (["'].*?\.vue["']);/g;

const imports = file.match(importRegex);

if (!imports) throw new Error("No imports found");

for (const item of imports) {
  item.match(importRegex);
  const result = importRegex.exec(item);
  if (!result) continue;
  const [_, variableName, path] = result;
  dynamicImports.push({
    variableName,
    expression: `() => import(${path})`,
  });
}

let newFile = file.replace(importRegex, "");

for (const item of dynamicImports) {
  newFile = newFile.replaceAll(item.variableName, item.expression);
}

const formatted = prettier.format(newFile, {
  parser: "typescript",
  plugins: prettierPlugins,
});

await Deno.writeTextFile(filePath, formatted);
