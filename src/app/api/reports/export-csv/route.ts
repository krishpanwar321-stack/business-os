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
    return new NextResponse(
      "Missing businessId",
      {
        status: 400,
      }
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

  let csv =
    "Date,Product,Units Sold,Revenue,Profit\n";

  for (const sale of sales) {
    const revenue =
      sale.unitsSold *
      sale.product.sp;

    const profit =
      sale.unitsSold *
      (
        sale.product.sp -
        sale.product.cp
      );

    csv +=
      `${sale.date.toISOString()},${sale.product.name},${sale.unitsSold},${revenue},${profit}\n`;
  }

  return new NextResponse(
    csv,
    {
      headers: {
        "Content-Type":
          "text/csv",

        "Content-Disposition":
          'attachment; filename="sales-report.csv"',
      },
    }
  );
}