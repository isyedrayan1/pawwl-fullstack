import { Prisma } from "@prisma/client";

export const decimal = (value: number | string | Prisma.Decimal) =>
  new Prisma.Decimal(value);

export const toNumber = (value: Prisma.Decimal | number | string | null | undefined) =>
  value == null ? 0 : Number(value);

export const lineTotal = (unitPrice: Prisma.Decimal, quantity: number) =>
  unitPrice.mul(quantity);
