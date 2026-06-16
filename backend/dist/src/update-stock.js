import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    console.log("Updating all products and variants stock to 100...");
    const updatedProducts = await prisma.product.updateMany({
        data: {
            stock: 100,
        },
    });
    const updatedVariants = await prisma.productvariant.updateMany({
        data: {
            stock: 100,
        },
    });
    console.log(`Successfully updated ${updatedProducts.count} products and ${updatedVariants.count} product variants stock to 100.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
