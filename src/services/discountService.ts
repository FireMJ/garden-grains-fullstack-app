'use client';

interface DiscountCode {
  code: string;
  percentage: number;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
  userId?: string;
  email?: string;
}

class DiscountService {
  private storageKey = 'discount_codes';
  private usedCodesKey = 'used_discount_codes';
  private newUserDiscountKey = 'new_user_discount_claimed';

  // Generate a unique discount code for new users
  generateNewUserDiscountCode(): DiscountCode {
    const code = `WELCOME${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const discount: DiscountCode = {
      code,
      percentage: 20,
      isUsed: false,
      createdAt: new Date().toISOString(),
    };
    
    // Store the discount code
    const existingCodes = this.getAllDiscountCodes();
    existingCodes.push(discount);
    localStorage.setItem(this.storageKey, JSON.stringify(existingCodes));
    
    return discount;
  }

  // Get all discount codes
  getAllDiscountCodes(): DiscountCode[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Check if new user has already claimed discount
  hasNewUserClaimedDiscount(): boolean {
    return localStorage.getItem(this.newUserDiscountKey) === 'true';
  }

  // Mark discount as claimed for new user
  markNewUserDiscountClaimed() {
    localStorage.setItem(this.newUserDiscountKey, 'true');
  }

  // Get available discount for new user
  getNewUserDiscount(): DiscountCode | null {
    if (this.hasNewUserClaimedDiscount()) {
      return null;
    }
    
    // Check if there's an unused code for this user
    const codes = this.getAllDiscountCodes();
    const unusedCode = codes.find(c => !c.isUsed);
    
    if (unusedCode) {
      return unusedCode;
    }
    
    // Generate new code if none exists
    return this.generateNewUserDiscountCode();
  }

  // Validate and apply discount code
  validateDiscountCode(code: string, userId?: string, email?: string): { valid: boolean; percentage?: number; message?: string } {
    const codes = this.getAllDiscountCodes();
    const discount = codes.find(c => c.code === code);
    
    if (!discount) {
      return { valid: false, message: 'Invalid discount code' };
    }
    
    if (discount.isUsed) {
      return { valid: false, message: 'This discount code has already been used' };
    }
    
    // Mark as used
    discount.isUsed = true;
    discount.usedAt = new Date().toISOString();
    discount.userId = userId;
    discount.email = email;
    
    // Update storage
    localStorage.setItem(this.storageKey, JSON.stringify(codes));
    
    return { valid: true, percentage: discount.percentage };
  }

  // Apply discount to cart total
  applyDiscount(total: number, percentage: number): number {
    const discountAmount = (total * percentage) / 100;
    return total - discountAmount;
  }

  // Get discount stats for admin
  getDiscountStats() {
    const codes = this.getAllDiscountCodes();
    const usedCodes = codes.filter(c => c.isUsed);
    const totalDiscountGiven = usedCodes.reduce((sum, code) => {
      // This would need to be calculated from actual orders
      return sum;
    }, 0);
    
    return {
      totalGenerated: codes.length,
      totalUsed: usedCodes.length,
      conversionRate: codes.length > 0 ? (usedCodes.length / codes.length) * 100 : 0,
    };
  }
}

export const discountService = new DiscountService();
