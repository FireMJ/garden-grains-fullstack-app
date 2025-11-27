import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Stats API - Firebase version under development",
    stats: { totalOrders: 0, totalUsers: 0 }
  });
}
