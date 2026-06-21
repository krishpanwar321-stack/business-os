import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(
    authOptions
  );

  if (!session?.user) {
    return NextResponse.json(
      [],
      { status: 401 }
    );
  }

  const userId = (session.user as any).id;

  const businesses =
    await prisma.business.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json(
    businesses
  );
}

export async function POST(
  request: Request
) {
  const session = await getServerSession(
    authOptions
  );

  if (!session?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await request.json();

  const userId =
    (session.user as any).id;

  const business =
    await prisma.business.create({
      data: {
        name: body.name,
        description:
          body.description || null,

        userId,
      },
    });

  return NextResponse.json(
    business
  );
}