import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export interface PromoRecord {
  userId: string;
  email: string;
  phoneNumber?: string;
  deviceFingerprint: string;
  ipAddress?: string;
  claimedAt: Date;
  discountCode: string;
  discountPercent: number;
  used: boolean;
  usedAt?: Date;
  orderId?: string;
  source: string;
}

class PromoService {
  private readonly STORAGE_KEY = 'gardenGrainsPromo';
  private readonly PROMO_CODE = 'WELCOME20';
  private readonly DISCOUNT_PERCENT = 20;
  private readonly COOLDOWN_DAYS = 365; // One year cooldown

  // Generate device fingerprint
  generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent || '',
      navigator.language || '',
      screen.colorDepth || '',
      `${screen.width}x${screen.height}`,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || '',
      (navigator as any).deviceMemory || '',
      (navigator as any).platform || '',
    ];
    
    // Simple hash function
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Check if user is eligible (multiple checks)
  async isEligible(userId: string | null, email: string, deviceFingerprint: string): Promise<{ eligible: boolean; reason?: string }> {
    
    // Check local storage first (fastest, no Firebase call)
    const localClaimed = localStorage.getItem(`${this.STORAGE_KEY}_claimed`);
    if (localClaimed === 'true') {
      const claimedDate = localStorage.getItem(`${this.STORAGE_KEY}_date`);
      if (claimedDate) {
        const daysSince = (Date.now() - new Date(claimedDate).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < this.COOLDOWN_DAYS) {
          return { eligible: false, reason: 'Promo already claimed on this device' };
        }
      }
    }

    // Firebase checks - wrap in try/catch to handle permission errors
    try {
      // Check by device fingerprint
      const deviceQuery = query(collection(db, 'promos'), where('deviceFingerprint', '==', deviceFingerprint));
      const deviceSnapshot = await getDocs(deviceQuery);
      if (!deviceSnapshot.empty) {
        const promo = deviceSnapshot.docs[0].data();
        if (!promo.used) {
          return { eligible: false, reason: 'Promo already claimed on this device' };
        }
      }
    } catch (error) {
      console.error('Error checking device (permissions may not be set):', error);
      // Continue execution - don't fail due to permission errors
    }

    try {
      // Check by email
      const emailQuery = query(collection(db, 'promos'), where('email', '==', email.toLowerCase()));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        const promo = emailSnapshot.docs[0].data();
        if (!promo.used) {
          return { eligible: false, reason: 'This email has already claimed the promo' };
        }
      }
    } catch (error) {
      console.error('Error checking email (permissions may not be set):', error);
      // Continue execution
    }

    // Check by userId if logged in
    if (userId) {
      try {
        const userQuery = query(collection(db, 'promos'), where('userId', '==', userId));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const promo = userSnapshot.docs[0].data();
          if (!promo.used) {
            return { eligible: false, reason: 'You have already claimed this promo' };
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    }

    return { eligible: true };
  }

  // Claim promo
  async claimPromo(
    userId: string | null, 
    email: string, 
    deviceFingerprint: string,
    phoneNumber?: string
  ): Promise<{ success: boolean; discountCode: string; message: string }> {
    try {
      const eligibility = await this.isEligible(userId, email, deviceFingerprint);
      
      if (!eligibility.eligible) {
        return {
          success: false,
          discountCode: '',
          message: eligibility.reason || 'Not eligible for this promo'
        };
      }

      // Get IP address (client-side)
      let ipAddress;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (error) {
        console.error('Unable to get IP:', error);
      }

      const promoData = {
        userId: userId || 'guest',
        email: email.toLowerCase(),
        phoneNumber: phoneNumber || '',
        deviceFingerprint,
        ipAddress: ipAddress || '',
        claimedAt: new Date(),
        discountCode: this.PROMO_CODE,
        discountPercent: this.DISCOUNT_PERCENT,
        used: false,
        source: 'floating_promo_button',
        createdAt: serverTimestamp()
      };

      // Save to Firestore (may fail if rules not set, but we still save to localStorage)
      try {
        const promoRef = doc(collection(db, 'promos'));
        await setDoc(promoRef, promoData);
      } catch (firestoreError) {
        console.error('Firestore save failed (rules may need update):', firestoreError);
        // Still consider it a success since we'll use localStorage
      }

      // Save to local storage (always works)
      localStorage.setItem(`${this.STORAGE_KEY}_claimed`, 'true');
      localStorage.setItem(`${this.STORAGE_KEY}_date`, new Date().toISOString());
      localStorage.setItem(`${this.STORAGE_KEY}_code`, this.PROMO_CODE);
      localStorage.setItem(`${this.STORAGE_KEY}_percent`, this.DISCOUNT_PERCENT.toString());
      localStorage.setItem(`${this.STORAGE_KEY}_email`, email.toLowerCase());

      return {
        success: true,
        discountCode: this.PROMO_CODE,
        message: `🎉 Success! ${this.DISCOUNT_PERCENT}% discount applied to your first order!`
      };
    } catch (error) {
      console.error('Error claiming promo:', error);
      return {
        success: false,
        discountCode: '',
        message: 'Unable to claim promo at this time. Please try again.'
      };
    }
  }

  // Check if user has active promo
  async hasActivePromo(email: string): Promise<boolean> {
    // Check localStorage first
    const localClaimed = localStorage.getItem(`${this.STORAGE_KEY}_claimed`);
    if (localClaimed === 'true') {
      return true;
    }
    
    try {
      const emailQuery = query(collection(db, 'promos'), where('email', '==', email.toLowerCase()), where('used', '==', false));
      const emailSnapshot = await getDocs(emailQuery);
      return !emailSnapshot.empty;
    } catch (error) {
      console.error('Error checking active promo:', error);
      return false;
    }
  }

  // Apply discount to cart
  applyDiscount(subtotal: number): { discountedTotal: number; discountAmount: number } {
    const discountAmount = (subtotal * this.DISCOUNT_PERCENT) / 100;
    return {
      discountedTotal: subtotal - discountAmount,
      discountAmount
    };
  }

  // Mark promo as used after order
  async markPromoUsed(email: string, orderId: string): Promise<void> {
    try {
      const emailQuery = query(collection(db, 'promos'), where('email', '==', email.toLowerCase()), where('used', '==', false));
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        const promoDoc = emailSnapshot.docs[0];
        await updateDoc(promoDoc.ref, {
          used: true,
          usedAt: new Date(),
          orderId
        });
      }
    } catch (error) {
      console.error('Error marking promo used:', error);
    }
  }
}

export const promoService = new PromoService();
