// src/app/api/orders/[id]/deliver/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ plain object
) {
  const { id } = params;
  const { status } = await req.json();

  // Validate status
  if (!["IN_TRANSIT", "DELIVERED"].includes(status)) {
    return NextResponse.json({ error: "Invalid delivery status" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Partial<typeof order> = { deliveryStatus: status };
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Delivery status updated", order: updated });
  } catch (err) {
    console.error("❌ Failed to update delivery status:", err);
    return NextResponse.json({ error: "Failed to update delivery status" }, { status: 500 });
  }
}
