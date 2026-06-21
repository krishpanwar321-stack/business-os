import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const businessId =
    searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json(
      [],
      { status: 400 }
    );
  }

  const sales =
    await prisma.dailySale.findMany({
      where: {
        businessId,
      },

      include: {
        product: true,
      },
    });

  const expenses =
    await prisma.expense.findMany({
      where: {
        businessId,
      },
    });

  let revenue = 0;
  let cogs = 0;

  for (const sale of sales) {
    revenue +=
      sale.unitsSold *
      sale.product.sp;

    cogs +=
      sale.unitsSold *
      sale.product.cp;
  }

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );

  const profit =
    revenue -
    cogs -
    totalExpenses;

  return NextResponse.json({
    revenue,
    expenses:
      totalExpenses,
    profit,
    sales,
  });
}