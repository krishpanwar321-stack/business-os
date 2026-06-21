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
    return NextResponse.json([]);
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

  const months =
    new Map();

  for (const sale of sales) {
    const month =
      new Date(
        sale.date
      ).toLocaleString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      );

    if (!months.has(month)) {
      months.set(month, {
        month,
        revenue: 0,
        cogs: 0,
        expenses: 0,
        profit: 0,
      });
    }

    const current =
      months.get(month);

    current.revenue +=
      sale.unitsSold *
      sale.product.sp;

    current.cogs +=
      sale.unitsSold *
      sale.product.cp;
  }

  for (const expense of expenses) {
    const month =
      new Date(
        expense.date
      ).toLocaleString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      );

    if (!months.has(month)) {
      months.set(month, {
        month,
        revenue: 0,
        cogs: 0,
        expenses: 0,
        profit: 0,
      });
    }

    months.get(month)
      .expenses +=
      expense.amount;
  }

  const result =
    Array.from(
      months.values()
    ).map((month) => ({
      ...month,

      profit:
        month.revenue -
        month.cogs -
        month.expenses,
    }));

  return NextResponse.json(
    result
  );
}