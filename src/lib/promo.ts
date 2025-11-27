// src/lib/promo.ts
export type Promo = {
  code: string;
  discount: number;
  type: "fixed" | "percentage";
  used: boolean;
  appliedAt: string;
  description: string;
};

export const DEFAULT_FIRST_ORDER_PROMO: Promo = {
  code: "FIRST20",
  discount: 20,
  type: "percentage",
  used: false,
  appliedAt: new Date().toISOString(),
  description: "20% off your first order",
};

/**
 * Apply a promo code
 * @param promoCode optional user-entered promo code
 * @param availablePromos list of available manual promos
 * @returns promo object to attach to user
 */
export function getValidPromo(promoCode?: string, availablePromos?: Record<string, Omit<Promo, "used" | "appliedAt">>) {
  if (promoCode && availablePromos) {
    const promo = availablePromos[promoCode as keyof typeof availablePromos];
    if (promo && promo.type && promo.discount) {
      return { ...promo, used: false, appliedAt: new Date().toISOString() };
    }
  }

  // Default first-order promo always applies if no valid manual promo
  return { ...DEFAULT_FIRST_ORDER_PROMO };
}

// src/config/promo.ts
export const PROMO_CODES = {
  FIRST_ORDER: {
    code: "FIRST_ORDER",
    discount: 20,
    type: "percentage" as const,
    description: "20% off your first order",
    active: true,
  },
};
