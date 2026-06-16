import { Prisma } from "@prisma/client";
export const decimal = (value) => new Prisma.Decimal(value);
export const toNumber = (value) => value == null ? 0 : Number(value);
export const lineTotal = (unitPrice, quantity) => unitPrice.mul(quantity);
