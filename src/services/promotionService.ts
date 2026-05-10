import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

export interface PromotionRecord {
  userId: string;
  promoCode: string;
  used: boolean;
  usedAt: Date | null;
  deviceFingerprint?: string;
}

class PromotionService {
  private promotionsCollection = collection(db, 'promotions');
  private devicePromotionsCollection = collection(db, 'devicePromotions');

  // Check if user is eligible for the 20% promotion
  async isEligibleForPromotion(userId: string, deviceFingerprint: string): Promise<boolean> {
    try {
      // Check if user has already used the promotion
      const userPromotionQuery = query(
        this.promotionsCollection,
        where('userId', '==', userId),
        where('promoCode', '==', 'WELCOME20')
      );
      const userSnapshot = await getDocs(userPromotionQuery);
      
      if (!userSnapshot.empty) {
        const promo = userSnapshot.docs[0].data();
        if (promo.used) {
          return false; // User already used the promotion
        }
      }

      // Check if device has used the promotion (prevent multiple accounts)
      const deviceQuery = query(
        this.devicePromotionsCollection,
        where('deviceFingerprint', '==', deviceFingerprint)
      );
      const deviceSnapshot = await getDocs(deviceQuery);
      
      if (!deviceSnapshot.empty) {
        return false; // This device already used the promotion
      }

      return true;
    } catch (error) {
      console.error('Error checking promotion eligibility:', error);
      return false;
    }
  }

  // Apply the 20% promotion for a user
  async applyPromotion(userId: string, deviceFingerprint: string): Promise<boolean> {
    try {
      // Create promotion record
      await addDoc(this.promotionsCollection, {
        userId,
        promoCode: 'WELCOME20',
        used: false,
        usedAt: null,
        createdAt: new Date()
      });

      // Track device to prevent abuse
      await setDoc(doc(this.devicePromotionsCollection, deviceFingerprint), {
        deviceFingerprint,
        userId,
        usedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error applying promotion:', error);
      return false;
    }
  }

  // Mark promotion as used after first order
  async markPromotionAsUsed(userId: string): Promise<void> {
    try {
      const userPromotionQuery = query(
        this.promotionsCollection,
        where('userId', '==', userId),
        where('promoCode', '==', 'WELCOME20')
      );
      const snapshot = await getDocs(userPromotionQuery);
      
      if (!snapshot.empty) {
        const promoDoc = snapshot.docs[0];
        await updateDoc(doc(this.promotionsCollection, promoDoc.id), {
          used: true,
          usedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking promotion as used:', error);
    }
  }

  // Generate device fingerprint for abuse prevention
  generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!navigator.hardwareConcurrency,
      navigator.deviceMemory || '',
      // @ts-ignore
      navigator.platform || ''
    ];
    
    return btoa(components.join('|')).replace(/=/g, '');
  }
}

export const promotionService = new PromotionService();
