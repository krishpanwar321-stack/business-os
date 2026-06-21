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
    return NextResponse.json({
      revenue: 0,
      cogs: 0,
      expenses: 0,
      ebitda: 0,
      ebitdaPercent: 0,
      pbt: 0,
      pbtPercent: 0,
    });
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

  const ebitda =
    revenue -
    cogs -
    totalExpenses;

  const ebitdaPercent =
    revenue > 0
      ? (ebitda / revenue) *
        100
      : 0;

  const pbt = ebitda;

  const pbtPercent =
    revenue > 0
      ? (pbt / revenue) * 100
      : 0;

      const netProfit = pbt;

      const netProfitPercent =
        revenue > 0
          ? (netProfit / revenue) * 100
          : 0;
      
      return NextResponse.json({
        revenue,
        cogs,
        expenses: totalExpenses,
        ebitda,
        ebitdaPercent,
        pbt,
        pbtPercent,
        netProfit,
        netProfitPercent,
      });
}