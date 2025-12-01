export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  prices: { [key: string]: number };
  image: string;
  category: string;
  tags?: string[];
  addOns?: AddOn[];
  ingredients?: string[];
  benefits?: string[];
}

export const juices: MenuItem[] = [
  {
    id: "juice-1",
    slug: "the-green-mile",
    name: "The Green Mile",
    description: "Apple, pear, cucumber, spinach, celery, lemon, ginger - for health conscious customers",
    prices: { "250ml": 75, "350ml": 85, "500ml": 95 },
    image: "/images/juices/green-mile.jpg",
    category: "juices",
    tags: ["Healthy", "Detox", "Popular"],
    ingredients: ["Apple", "Pear", "Cucumber", "Spinach", "Celery", "Lemon", "Ginger"],
    benefits: ["Energy Boost", "Hydration", "Antioxidants"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "turmeric", name: "Turmeric", price: 10 },
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
      { id: "protein-powder", name: "Protein Powder", price: 19 },
      { id: "honey", name: "Honey", price: 10 },
    ],
  },
  {
    id: "juice-2",
    slug: "immunity-boosting-ginger-shot",
    name: "Immunity-Boosting Ginger Shot",
    description: "Fiery fusion of fresh ginger & a slight hint of lemon — 50ml. Warning: 80% ginger, 20% lemon",
    prices: { "50ml": 60 },
    image: "/images/juices/ginger-shot.jpg",
    category: "juices",
    tags: ["Immunity", "Strong", "Wellness"],
    ingredients: ["Fresh Ginger", "Lemon"],
    benefits: ["Immune Support", "Anti-inflammatory"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "turmeric", name: "Turmeric", price: 10 },
      { id: "honey", name: "Honey", price: 10 },
    ],
  },
  {
    id: "juice-3",
    slug: "fruit-punch",
    name: "Fruit Punch",
    description: "A vibrant blend of the season's freshest fruits and veggies - a fusion of nature's freshest fruits and veg!",
    prices: { "250ml": 70, "350ml": 80, "500ml": 90 },
    image: "/images/juices/fruit-punch.jpg",
    category: "juices",
    tags: ["Sweet", "Refreshing", "Fruity"],
    ingredients: ["Seasonal Fruits", "Mixed Vegetables"],
    benefits: ["Vitamin C", "Refreshment"],
    addOns: [
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
      { id: "protein-powder", name: "Protein Powder", price: 19 },
      { id: "honey", name: "Honey", price: 10 },
    ],
  },
  {
    id: "juice-4",
    slug: "up-beet-juice",
    name: "Up Beet Juice",
    description: "Beetroot, carrot, lemon, apple and ginger - popular among health enthusiasts",
    prices: { "250ml": 75, "350ml": 85, "500ml": 95 },
    image: "/images/juices/up-beet.jpg",
    category: "juices",
    tags: ["Energy", "Popular", "Healthy"],
    ingredients: ["Beetroot", "Carrot", "Lemon", "Apple", "Ginger"],
    benefits: ["Stamina", "Blood Health", "Antioxidants"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "turmeric", name: "Turmeric", price: 10 },
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
      { id: "protein-powder", name: "Protein Powder", price: 19 },
    ],
  },
  {
    id: "juice-5",
    slug: "apple-lemon-juice",
    name: "Apple & Lemon Juice",
    description: "Granny smith apples, lemon, & celery - a classic, always in demand",
    prices: { "250ml": 65, "350ml": 75, "500ml": 85 },
    image: "/images/juices/apple-lemon.jpg",
    category: "juices",
    tags: ["Classic", "Refreshing", "Popular"],
    ingredients: ["Granny Smith Apples", "Lemon", "Celery"],
    benefits: ["Digestive Health", "Hydration"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "honey", name: "Honey", price: 10 },
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
    ],
  },
  {
    id: "juice-6",
    slug: "glow-juice",
    name: "GLOW",
    description: "Naartjies, fresh lemon, orange, turmeric and ginger - nature's perfect power blend!",
    prices: { "250ml": 75, "350ml": 85, "500ml": 95 },
    image: "/images/juices/glow.jpg",
    category: "juices",
    tags: ["Radiant", "Immunity", "Healthy"],
    ingredients: ["Naartjies", "Fresh Lemon", "Orange", "Turmeric", "Ginger"],
    benefits: ["Skin Health", "Immune Boost", "Anti-inflammatory"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "turmeric", name: "Turmeric", price: 10 },
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
      { id: "protein-powder", name: "Protein Powder", price: 19 },
    ],
  },
  {
    id: "juice-7",
    slug: "apple-pear-juice",
    name: "Apple & Pear Juice",
    description: "Apples, pears, lemon and ginger - known for its health benefits and vibrant color",
    prices: { "250ml": 70, "350ml": 80, "500ml": 90 },
    image: "/images/juices/apple-pear.jpg",
    category: "juices",
    tags: ["Sweet", "Healthy", "Digestive"],
    ingredients: ["Apples", "Pears", "Lemon", "Ginger"],
    benefits: ["Digestive Health", "Vitamin C"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "honey", name: "Honey", price: 10 },
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
    ],
  },
  {
    id: "juice-8",
    slug: "orange-juice",
    name: "OJ",
    description: "Classic orange juice - a classic, always in demand",
    prices: { "250ml": 60, "350ml": 70, "500ml": 80 },
    image: "/images/juices/orange-juice.jpg",
    category: "juices",
    tags: ["Classic", "Vitamin C", "Popular"],
    ingredients: ["Fresh Oranges"],
    benefits: ["Vitamin C", "Energy", "Hydration"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "turmeric", name: "Turmeric", price: 10 },
      { id: "protein-powder", name: "Protein Powder", price: 19 },
    ],
  },
  {
    id: "juice-9",
    slug: "immunity-boost-elixir",
    name: "Immunity Boost Elixir",
    description: "Orange, fresh lemon, ginger, turmeric root, green apple, carrot, garlic, celery, pinch of cayenne pepper, honey, coconut water",
    prices: { "250ml": 85, "350ml": 95, "500ml": 105 },
    image: "/images/juices/immunity-elixir.jpg",
    category: "juices",
    tags: ["Immunity", "Strong", "Wellness"],
    ingredients: ["Orange", "Lemon", "Ginger", "Turmeric", "Green Apple", "Carrot", "Garlic", "Celery", "Cayenne", "Honey", "Coconut Water"],
    benefits: ["Full Immune Support", "Anti-inflammatory", "Antioxidants"],
    addOns: [
      { id: "extra-ginger", name: "Extra Ginger", price: 10 },
      { id: "turmeric", name: "Turmeric", price: 10 },
      { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
      { id: "protein-powder", name: "Protein Powder", price: 19 },
      { id: "honey", name: "Honey", price: 10 },
    ],
  },
];

// Common add-ons for juices
export const juiceAddOns: AddOn[] = [
  { id: "extra-ginger", name: "Extra Ginger", price: 10 },
  { id: "turmeric", name: "Turmeric", price: 10 },
  { id: "chia-seeds", name: "Chia Seeds", price: 12.5 },
  { id: "protein-powder", name: "Protein Powder", price: 19 },
  { id: "honey", name: "Honey", price: 10 },
];
