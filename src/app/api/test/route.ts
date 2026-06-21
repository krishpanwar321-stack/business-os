
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const businesses =
    await prisma.business.findMany();

  return NextResponse.json({
    success: true,
    businesses,
  });
}