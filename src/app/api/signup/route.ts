import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
try {
const body = await request.json();


const { name, email, password } = body;

const existingUser = await prisma.user.findUnique({
  where: {
    email,
  },
});

if (existingUser) {
  return NextResponse.json(
    { error: "User already exists" },
    { status: 400 }
  );
}

const hashedPassword = await bcrypt.hash(
  password,
  10
);

const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
  },
});

return NextResponse.json(user);


} catch (error) {
return NextResponse.json(
{ error: "Something went wrong" },
{ status: 500 }
);
}
}
