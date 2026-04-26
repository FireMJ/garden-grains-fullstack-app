interface DiscountValidation {
  valid: boolean;
  percentage?: number;
  amount?: number;
  message?: string;
}

class DiscountService {
  private readonly DISCOUNT_KEY = 'garden_grains_discount_used';
  private readonly DISCOUNT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year

  // Check if user has already used a discount
  hasUsedDiscount(email?: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const usedDiscounts = JSON.parse(localStorage.getItem(this.DISCOUNT_KEY) || '[]');
    const deviceId = this.getDeviceId();
    
    // Check by email
    if (email && usedDiscounts.some((d: any) => d.email === email)) {
      return true;
    }
    
    // Check by device
    if (usedDiscounts.some((d: any) => d.deviceId === deviceId)) {
      return true;
    }
    
    return false;
  }

  // Mark discount as used
  markDiscountUsed(email?: string): void {
    if (typeof window === 'undefined') return;
    
    const usedDiscounts = JSON.parse(localStorage.getItem(this.DISCOUNT_KEY) || '[]');
    usedDiscounts.push({
      email: email,
      deviceId: this.getDeviceId(),
      timestamp: Date.now(),
      expiry: Date.now() + this.DISCOUNT_EXPIRY
    });
    localStorage.setItem(this.DISCOUNT_KEY, JSON.stringify(usedDiscounts));
  }

  // Get device fingerprint
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `${navigator.userAgent}_${screen.width}x${screen.height}_${new Date().getTimezoneOffset()}`;
      deviceId = btoa(deviceId).substring(0, 32);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  // Validate discount code
  async validateDiscount(code: string, totalPrice: number, email?: string): Promise<DiscountValidation> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const normalizedCode = code.toUpperCase().trim();
    
    // Check for new user discount (WELCOME20)
    if (normalizedCode === 'WELCOME20') {
      // Prevent abuse
      if (this.hasUsedDiscount(email)) {
        return {
          valid: false,
          message: 'This discount has already been used. New customers only!'
        };
      }
      
      const percentage = 20;
      const amount = (totalPrice * percentage) / 100;
      
      return {
        valid: true,
        percentage,
        amount,
        message: '20% off for new customers!'
      };
    }
    
    // Other discount codes
    const discounts: Record<string, number> = {
      'SAVE10': 10,
      'GARDEN15': 15,
      'WELCOME20': 20,
      'FIRSTORDER': 15,
    };
    
    const percentage = discounts[normalizedCode];
    if (percentage) {
      return {
        valid: true,
        percentage,
        amount: (totalPrice * percentage) / 100
      };
    }
    
    return {
      valid: false,
      message: 'Invalid or expired discount code'
    };
  }
}

export const discountService = new DiscountService();
