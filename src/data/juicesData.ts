export const juices = [
  {
    id: "juice-1",
    slug: "the-green-mile",
    name: "The Green Mile",
    description: "Apple, pear, cucumber, spinach, celery, lemon, ginger - for health conscious customers",
    prices: { S: 75, M: 85 },
    image: "/images/juices/green-mile.jpg",
    addOns: [
      { id: "addon-1-1", name: "ginger", price: 10 },
      { id: "addon-1-2", name: "turmeric", price: 10 },
      { id: "addon-1-3", name: "chia seeds", price: 12.5 },
    ],
  },
  {
    id: "juice-2", 
    slug: "immunity-boosting-ginger-shot",
    name: "Immunity-Boosting Ginger Shot",
    description: "Fiery fusion of fresh ginger & a slight hint of lemon — 50ml. Warning: 80% ginger, 20% lemon",
    prices: { S: 60 },
    image: "/images/juices/ginger-shot.jpg",
    addOns: [
      { id: "addon-2-1", name: "ginger", price: 10 },
      { id: "addon-2-2", name: "turmeric", price: 10 },
    ],
  },
  // Add slugs to other juice items as needed...
];
