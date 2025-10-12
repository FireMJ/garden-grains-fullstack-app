import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Endpoint working' });
}

export async function POST() {
  return NextResponse.json({ message: 'Method not implemented' });
}
