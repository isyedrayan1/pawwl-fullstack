import { PrismaClient } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
const prisma = new PrismaClient();
async function main() {
    await prisma.adminrole.upsert({
        where: { name: 'Fulfillment & Logistics' },
        update: { permissions: 'manage_orders,manage_fulfillment,manage_returns' },
        create: {
            id: createId(),
            name: 'Fulfillment & Logistics',
            permissions: 'manage_orders,manage_fulfillment,manage_returns'
        }
    });
    await prisma.adminrole.upsert({
        where: { name: 'Customer Support' },
        update: { permissions: 'manage_orders,manage_users,manage_reviews,manage_returns' },
        create: {
            id: createId(),
            name: 'Customer Support',
            permissions: 'manage_orders,manage_users,manage_reviews,manage_returns'
        }
    });
    console.log('Successfully created the two requested roles!');
}
main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
