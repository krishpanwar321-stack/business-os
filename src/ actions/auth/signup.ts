"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function signup(
  name: string,
  email: string,
  password: string
) {
  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
  };
}