const examplePattern = /@example/;
const template = Deno.readTextFileSync("./mod.template.ts");
const docs = Deno.readTextFileSync("./mod.test.ts");

const lines = ["```ts", docs, "```"]
  .join("\n")
  .split("\n")
  .map((line) => ` *${line.length ? " " : ""}${line}`)
  .join("\n");

const jsDocs = `@example\n${lines}`;
const text = template.replace(examplePattern, jsDocs);
Deno.writeTextFileSync("./mod.ts", text);
