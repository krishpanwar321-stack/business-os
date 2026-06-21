import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request
  ) {
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
  
    const { searchParams } =
      new URL(request.url);
  
    const businessId =
      searchParams.get("businessId");
  
    if (!businessId) {
      return NextResponse.json([]);
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
  
    const expenses =
      await prisma.expense.findMany({
        where: {
          businessId,
        },
  
        orderBy: {
          date: "desc",
        },
      });
  
    return NextResponse.json(
      expenses
    );
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
  
    const expense =
      await prisma.expense.create({
        data: {
          title: body.title,
  
          amount: Number(
            body.amount
          ),
  
          category:
            body.category,
  
          notes:
            body.notes || null,
  
          date: new Date(
            body.date
          ),
  
          businessId:
            body.businessId,
        },
      });
  
    return NextResponse.json(
      expense
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
  
    const expense =
      await prisma.expense.findUnique({
        where: { id },
  
        include: {
          business: true,
        },
      });
  
    if (
      !expense ||
      expense.business.userId !==
        (session.user as any).id
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  
    await prisma.expense.delete({
      where: {
        id,
      },
    });
  
    return NextResponse.json({
      success: true,
    });
  }