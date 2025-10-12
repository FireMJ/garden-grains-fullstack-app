import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, description, cart } = await req.json();

    const yocoSecretKey = process.env.YOCO_SECRET_KEY;
    if (!yocoSecretKey) {
      return NextResponse.json(
        { error: "YOCO_SECRET_KEY missing in env" },
        { status: 500 }
      );
    }

    // 1️⃣ Create order in DB first as "pending"
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total: amount,
        items: {
          create: cart.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
          })),
        },
      },
    });

    // 2️⃣ Create a Yoco payment session, passing orderId in metadata
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${yocoSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Yoco expects cents
        currency: "ZAR",
        successUrl: `${process.env.NEXTAUTH_URL}/checkout-success`,
        cancelUrl: `${process.env.NEXTAUTH_URL}/checkout-cancelled`,
        lineItems: [
          {
            name: description || "Garden & Grains Order",
            amount: Math.round(amount * 100),
            quantity: 1,
          },
        ],
        customer: {
          email: session.user?.email || undefined,
          name: session.user?.name || undefined,
        },
        metadata: {
          orderId: order.id, // 👈 critical for webhook
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Yoco error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to create Yoco payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentUrl: data.redirectUrl,
      paymentId: data.id,
      orderId: order.id, // 👈 return orderId too (optional, for client reference)
    });
  } catch (error) {
    console.error("Error creating Yoco payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
