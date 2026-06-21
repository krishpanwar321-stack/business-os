import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  const session =
  await getServerSession(
    authOptions
  );

if (!session?.user) {
  return NextResponse.json(
    [],
    { status: 401 }
  );
}

const business =
  await prisma.business.findFirst({
    where: {
      id: businessId,

      userId:
        (session.user as any).id,
    },
  });

if (!business) {
  return NextResponse.json(
    [],
    { status: 403 }
  );
}
  const products =
    await prisma.product.findMany({
      where: {
        businessId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json(products);
}

export async function POST(
    request: Request
  ) {
    const session =
      await getServerSession(
        authOptions
      );
  
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  
    const body =
      await request.json();
  
    const business =
      await prisma.business.findFirst({
        where: {
          id: body.businessId,
  
          userId:
            (session.user as any).id,
        },
      });
  
    if (!business) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  
    const product =
      await prisma.product.create({
        data: {
          name: body.name,
          cp: Number(body.cp),
          sp: Number(body.sp),
          businessId:
            body.businessId,
        },
      });
  
    return NextResponse.json(
      product
    );
  }

  export async function DELETE(
    request: Request
  ) {
    const session =
      await getServerSession(
        authOptions
      );
  
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  
    const { searchParams } =
      new URL(request.url);
  
    const id =
      searchParams.get("id");
  
    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }
  
    const product =
      await prisma.product.findUnique({
        where: { id },
  
        include: {
          business: true,
        },
      });
  
    if (
      !product ||
      product.business.userId !==
        (session.user as any).id
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  
    await prisma.product.delete({
      where: {
        id,
      },
    });
  
    return NextResponse.json({
      success: true,
    });
  }
  export async function PUT(
    request: Request
  ) {
    const session =
      await getServerSession(
        authOptions
      );
  
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  
    const body =
      await request.json();
  
    const existing =
      await prisma.product.findUnique({
        where: {
          id: body.id,
        },
  
        include: {
          business: true,
        },
      });
  
    if (
      !existing ||
      existing.business.userId !==
        (session.user as any).id
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  
    const product =
      await prisma.product.update({
        where: {
          id: body.id,
        },
  
        data: {
          name: body.name,
          cp: Number(body.cp),
          sp: Number(body.sp),
        },
      });
  
    return NextResponse.json(
      product
    );
  }