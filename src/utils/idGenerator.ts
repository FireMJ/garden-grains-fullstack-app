/**
 * Stable ID generator for hydration safety
 */

let clientIdCounter = 0;

export function generateStableId(prefix: string = ''): string {
  // On server, return a placeholder
  if (typeof window === 'undefined') {
    return `${prefix}-server`;
  }
  
  // On client, generate unique ID
  clientIdCounter++;
  return `${prefix}-${Date.now()}-${clientIdCounter}`;
}

export function generateOrderId(): string {
  if (typeof window === 'undefined') {
    return 'ORD-XXXXXX';
  }
  return `ORD-${Date.now().toString().slice(-8)}`;
}
