// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, items, total } = await req.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate final total (optional promo logic can go here)
    let finalTotal = total;
    let discountApplied = false;
    if ((user as any).promoCode && !(user as any).promoUsed) {
      finalTotal = Math.max(0, total - 30);
      discountApplied = true;
      await prisma.user.update({
        where: { id: userId },
        data: { promoUsed: true },
      });
    }

    // Create the order with nested items
    const order = await prisma.order.create({
      data: {
        userId,
        total: finalTotal,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            addOns: item.addOns || null,
            notes: item.notes || null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ message: "Order placed successfully", order });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong while placing order" },
      { status: 500 }
    );
  }
}
