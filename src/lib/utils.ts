// utils.ts
export const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  return parseFloat(price.replace(/[^\d.-]/g, "")) || 0;
};
