import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient, Prisma } from "@prisma/client";
import xlsx from "xlsx";
import { uniqueSlug } from "../src/lib/slug.js";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ProductRow = {
  Name?: string;
  "Sales Price With GST"?: number;
};

const workbookPath =
  process.argv[2] ??
  path.resolve(__dirname, "../../frontend/src/data/List of items for shazil.xlsx");

const main = async () => {
  const workbook = xlsx.readFile(workbookPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<ProductRow>(sheet);

  let imported = 0;
  for (const [index, row] of rows.entries()) {
    const name = String(row.Name ?? "").trim();
    if (!name) continue;

    const gstPrice = Number(row["Sales Price With GST"] ?? 0);
    const slug = uniqueSlug(name, index + 1);

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        category: "Uncategorized",
        description: "",
        images: JSON.stringify([]),
        imagePaths: JSON.stringify([]),
        price: new Prisma.Decimal(gstPrice),
        stock: 0,
        status: "draft",
        productvariant: {
          create: {
            name: "Default",
            price: new Prisma.Decimal(gstPrice),
            gstPrice: new Prisma.Decimal(gstPrice),
            stock: 0,
          },
        },
      },
    });
    imported += 1;
  }

  console.log(`Imported ${imported} draft products from ${workbookPath}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
