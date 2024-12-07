const commentPattern = /\/\/\s+/;
const code = Deno.readTextFileSync("./mod.test.ts");
const [init, ...sections] = code.split(commentPattern);

const markdownSections = sections.map((section) => {
  const [heading, ...lines] = section.split(/\n/);
  return `## ${heading}\n\n\`\`\`ts${lines.join("\n")}\`\`\``;
});

const heading = `# Conbase`;

const description = `
    A simple in-memory database. It improves memory performance by storing an
    array of objects as an array of arrays.
  `.trim()
  .replace(/\s{2,}/, " ");

const initHeading = `## Create Table`;
const initBody = `\`\`\`ts\n${init}\`\`\``;

const markdown = [
  heading,
  description,
  initHeading,
  initBody,
  ...markdownSections,
].join("\n\n");

Deno.writeTextFileSync("./README.md", markdown);
