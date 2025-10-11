// app/api/redeem-signup-promo/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: { isNewUser: false }, // 👈 remove promo eligibility
  });

  return NextResponse.json({ success: true });
}
