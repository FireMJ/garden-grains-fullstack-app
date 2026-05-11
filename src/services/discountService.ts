// Discount Service for managing promotions and discounts
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface DiscountResult {
  valid: boolean;
  percentage: number;
  amount: number;
  message?: string;
  code?: string;
}

export class DiscountService {
  private readonly NEW_USER_DISCOUNT_KEY = 'newUserDiscountClaimed';
  private readonly VALID_DISCOUNTS: Record<string, number> = {
    'WELCOME20': 20,
    'GRAINS10': 10,
    'ROSE15': 15,
  };

  // Check if user has claimed new user discount
  hasNewUserClaimedDiscount(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.NEW_USER_DISCOUNT_KEY) === 'true';
  }

  // Claim new user discount
  async claimNewUserDiscount(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    const hasClaimed = localStorage.getItem(this.NEW_USER_DISCOUNT_KEY) === 'true';
    if (hasClaimed) {
      return false;
    }
    
    localStorage.setItem(this.NEW_USER_DISCOUNT_KEY, 'true');
    localStorage.setItem('newUserDiscountApplied', 'true');
    return true;
  }

  // Validate discount code
  async validateDiscount(code: string, orderTotal: number): Promise<DiscountResult> {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase().trim();
    
    // Check if discount exists
    const discountPercentage = this.VALID_DISCOUNTS[normalizedCode];
    
    if (!discountPercentage) {
      return {
        valid: false,
        percentage: 0,
        amount: 0,
        message: 'Invalid discount code',
        code: normalizedCode
      };
    }
    
    // Check for new user discount
    if (normalizedCode === 'WELCOME20') {
      const hasClaimed = this.hasNewUserClaimedDiscount();
      if (hasClaimed) {
        return {
          valid: false,
          percentage: 0,
          amount: 0,
          message: 'Discount already claimed',
          code: normalizedCode
        };
      }
    }
    
    const discountAmount = (orderTotal * discountPercentage) / 100;
    
    return {
      valid: true,
      percentage: discountPercentage,
      amount: discountAmount,
      message: 'Discount applied successfully!',
      code: normalizedCode
    };
  }

  // Apply discount to order total (legacy method)
  applyDiscount(total: number, discountPercentage: number = 20): number {
    const discount = (total * discountPercentage) / 100;
    return total - discount;
  }

  // Get discount amount (legacy method)
  getDiscountAmount(total: number, discountPercentage: number = 20): number {
    return (total * discountPercentage) / 100;
  }

  // Check if discount is applicable
  isDiscountApplicable(userId: string, orderTotal: number): boolean {
    return orderTotal > 0 && !this.hasNewUserClaimedDiscount();
  }

  // Save discount usage to Firestore
  async saveDiscountUsage(userId: string, discountAmount: number, orderId: string): Promise<void> {
    try {
      const discountRef = doc(collection(db, 'discountUsage'), orderId);
      await setDoc(discountRef, {
        userId,
        discountAmount,
        orderId,
        appliedAt: new Date().toISOString(),
        discountType: 'NEW_USER_20'
      });
    } catch (error) {
      console.error('Error saving discount usage:', error);
    }
  }
}

export const discountService = new DiscountService();
