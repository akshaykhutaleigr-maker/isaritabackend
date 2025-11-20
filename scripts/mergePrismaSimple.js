const fs = require("fs");
const path = require("path");

const prismaDir = path.join(__dirname, "..", "prisma");
const modelsDir = path.join(prismaDir, "models");

// Output file
const outputFile = path.join(prismaDir, "schema.generated.prisma");

// Read main schema.prisma
const mainSchema = fs.readFileSync(path.join(prismaDir, "schema.prisma"), "utf8");

// Collect all .prisma model files
let modelFiles = [];

if (fs.existsSync(modelsDir)) {
    modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith(".prisma"));
}

let mergedModels = "";

// Merge all model files
for (const file of modelFiles) {
    const content = fs.readFileSync(path.join(modelsDir, file), "utf8");
    mergedModels += "\n\n" + content;
}

// Combine main schema with models
const finalSchema = mainSchema + "\n\n" + mergedModels;

// Write merged schema
fs.writeFileSync(outputFile, finalSchema);

console.log("✔ Prisma schema merged successfully → schema.generated.prisma");
