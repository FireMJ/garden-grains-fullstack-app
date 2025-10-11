import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"; // Change to default import

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart, total, schedule } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        user: { connect: { email: session.user.email } },
        total,
        status: "PENDING",
        scheduledFor: schedule || null,
        items: {
          create: cart.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            addOns: item.addOns ? JSON.stringify(item.addOns) : "[]",
            fries: item.fries ? JSON.stringify(item.fries) : "[]",
            juices: item.juices ? JSON.stringify(item.juices) : "[]",
            specialInstructions: item.specialInstructions || "",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}