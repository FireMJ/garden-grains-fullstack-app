import { NextRequest, NextResponse } from 'next/server';

// Mock voucher data - replace with database in production
const VALID_VOUCHERS = {
  'WELCOME10': { discountPercent: 10, maxUses: 100, used: 0, type: 'percentage' },
  'SAVE15': { discountPercent: 15, maxUses: 50, used: 0, type: 'percentage' },
  'SPECIAL20': { discountPercent: 20, maxUses: 25, used: 0, type: 'percentage' },
  'FIRSTORDER': { discountPercent: 20, maxUses: 1000, used: 0, type: 'percentage' }
};

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Voucher code required' },
        { status: 400 }
      );
    }

    const voucher = VALID_VOUCHERS[code as keyof typeof VALID_VOUCHERS];

    if (!voucher) {
      return NextResponse.json(
        { valid: false, message: 'Invalid voucher code' },
        { status: 404 }
      );
    }

    if (voucher.used >= voucher.maxUses) {
      return NextResponse.json(
        { valid: false, message: 'Voucher has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discountPercent: voucher.discountPercent,
      type: voucher.type,
      message: `Voucher applied! ${voucher.discountPercent}% discount`,
    });
  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// REMOVED: export default POST - This was causing the TypeScript error
// API routes should only export HTTP methods (POST, GET, etc.)
