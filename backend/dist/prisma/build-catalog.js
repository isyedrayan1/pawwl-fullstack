import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildCatalogBackup } from "../src/lib/catalog.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = process.argv[2] ??
    path.resolve(__dirname, "../dataproduct/csvpolished-List of items for shazil-polished.csv");
const productsRoot = process.argv[3] ?? path.resolve(__dirname, "../products");
const outputPath = process.argv[4] ??
    path.resolve(__dirname, "../dataproduct/catalog.master.json");
const main = async () => {
    const backup = buildCatalogBackup({ csvPath, productsRoot });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(backup, null, 2)}\n`, "utf8");
    console.log(`Catalog backup written to ${outputPath}`);
    console.log(`Rows processed: ${backup.items.length}`);
};
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
