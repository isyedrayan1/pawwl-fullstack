import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  const product = await prisma.product.findFirst({
    where: { slug: 'premium-adult-kibble' }
  });
  console.log(JSON.stringify(product, null, 2));
  await prisma.$disconnect();
})();
