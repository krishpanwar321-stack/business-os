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

  const analytics =
    new Map();

  for (const sale of sales) {
    const productId =
      sale.product.id;

    const revenue =
      sale.unitsSold *
      sale.product.sp;

    const profit =
      sale.unitsSold *
      (
        sale.product.sp -
        sale.product.cp
      );

    if (
      !analytics.has(
        productId
      )
    ) {
      analytics.set(
        productId,
        {
          id: productId,

          name:
            sale.product.name,

          unitsSold: 0,

          revenue: 0,

          profit: 0,
        }
      );
    }

    const current =
      analytics.get(
        productId
      );

    current.unitsSold +=
      sale.unitsSold;

    current.revenue +=
      revenue;

    current.profit +=
      profit;
  }

  return NextResponse.json(
    Array.from(
      analytics.values()
    ).sort(
      (a, b) =>
        b.revenue -
        a.revenue
    )
  );
}