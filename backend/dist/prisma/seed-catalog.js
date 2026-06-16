import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient, Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupPath = process.argv[2] ??
    path.resolve(__dirname, "../dataproduct/catalog.master.json");
const main = async () => {
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    const animalTypes = Array.from(new Set(backup.items.map((item) => item.animalType).filter((value) => Boolean(value))));
    const categories = Array.from(new Set(backup.items.map((item) => item.category).filter(Boolean)));
    const animalTypeLookup = new Map();
    const categoryLookup = new Map();
    for (const animalType of animalTypes) {
        const key = animalType.toLowerCase();
        const record = await prisma.animaltype.upsert({
            where: { key },
            update: { name: animalType },
            create: {
                id: createId(),
                key,
                name: animalType,
            },
        });
        animalTypeLookup.set(animalType, record);
    }
    for (const category of categories) {
        const key = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const record = await prisma.productcategory.upsert({
            where: { key },
            update: { name: category },
            create: {
                id: createId(),
                key,
                name: category,
            },
        });
        categoryLookup.set(category, record);
    }
    for (const item of backup.items) {
        const animalTypeRecord = item.animalType ? animalTypeLookup.get(item.animalType) : null;
        const categoryRecord = categoryLookup.get(item.category) ?? null;
        const product = await prisma.product.upsert({
            where: { catalogId: item.catalogId },
            update: {
                name: item.name,
                slug: item.slug,
                category: item.category,
                brand: item.brand ?? null,
                description: item.description ?? null,
                benefits: JSON.stringify(item.benefits ?? []),
                ingredients: item.ingredients ?? null,
                usage: item.usage ?? null,
                seoTitle: item.seoTitle ?? null,
                seoDescription: item.seoDescription ?? null,
                images: JSON.stringify(item.imagePaths),
                imagePaths: JSON.stringify(item.imagePaths),
                price: new Prisma.Decimal(item.price),
                stock: item.stock,
                status: item.status,
                animalTypeId: animalTypeRecord?.id ?? null,
                productCategoryId: categoryRecord?.id ?? null,
                sourceFolder: item.sourceFolder,
            },
            create: {
                id: createId(),
                catalogId: item.catalogId,
                name: item.name,
                slug: item.slug,
                description: item.description ?? null,
                category: item.category,
                brand: item.brand ?? null,
                benefits: JSON.stringify(item.benefits ?? []),
                ingredients: item.ingredients ?? null,
                usage: item.usage ?? null,
                seoTitle: item.seoTitle ?? null,
                seoDescription: item.seoDescription ?? null,
                images: JSON.stringify(item.imagePaths),
                imagePaths: JSON.stringify(item.imagePaths),
                price: new Prisma.Decimal(item.price),
                stock: item.stock,
                status: item.status,
                reviewCount: 0,
                animalTypeId: animalTypeRecord?.id ?? null,
                productCategoryId: categoryRecord?.id ?? null,
                sourceFolder: item.sourceFolder,
            },
        });
        await prisma.productvariant.deleteMany({ where: { productId: product.id } });
        await prisma.productvariant.create({
            data: {
                id: createId(),
                productId: product.id,
                name: "Default",
                price: new Prisma.Decimal(item.price),
                gstPrice: new Prisma.Decimal(item.price),
                stock: item.stock,
                isActive: item.status === "published",
            },
        });
    }
    console.log(`Seeded ${backup.items.length} catalog products from ${backupPath}`);
};
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
