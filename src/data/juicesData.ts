export type JuiceSize = {
  id: string;
  label: string; // "S / M / L"
  ml: number;
  price: number;
};

export type Juice = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sizes: JuiceSize[];
  popular?: boolean;
  tags?: string[];
};

export const juices: Juice[] = [
  {
    id: "co",
    name: "CO.",
    slug: "co",
    description: "Carrots, oranges, lemon, ginger & turmeric — revitalise your day!",
    image: "/images/juices/co.jpg",
    sizes: [
      { id: "co-s", label: "Small", ml: 250, price: 59 },
      { id: "co-m", label: "Medium", ml: 350, price: 73 },
      { id: "co-l", label: "Large", ml: 500, price: 89 }
    ],
    popular: true,
    tags: ["carrot", "ginger", "turmeric"]
  },
  {
    id: "the-green-mile",
    name: "The Green Mile",
    slug: "the-green-mile",
    description: "Apple, pear, cucumber, spinach, celery, lemon & ginger — for health conscious customers.",
    image: "/images/juices/the-green-mile.jpg",
    sizes: [
      { id: "green-s", label: "Small", ml: 250, price: 59 },
      { id: "green-m", label: "Medium", ml: 350, price: 73 },
      { id: "green-l", label: "Large", ml: 500, price: 89 }
    ],
    popular: true,
    tags: ["green", "healthy", "popular"]
  },
  {
    id: "ginger-shot",
    name: "Ginger Shot (50ml)",
    slug: "ginger-shot",
    description: "Our ginger shot is a fiery fusion of fresh ginger & a slight hint of lemon — your daily dose of bold, natural energy. (Approx. 80% ginger : 20% lemon.)",
    image: "/images/juices/ginger-shot.jpg",
    sizes: [
      { id: "ginger-50ml", label: "50ml", ml: 50, price: 60 }
    ],
    tags: ["ginger", "wellness", "spicy"]
  },
  {
    id: "fruit-punch",
    name: "Fruit Punch",
    slug: "fruit-punch",
    description: "A vibrant blend of the season's freshest fruits and veggies.",
    image: "/images/juices/fruit-punch.jpg",
    sizes: [
      { id: "fp-s", label: "Small", ml: 250, price: 59 },
      { id: "fp-m", label: "Medium", ml: 350, price: 73 },
      { id: "fp-l", label: "Large", ml: 500, price: 89 }
    ],
    popular: true,
    tags: ["fruity", "popular"]
  },
  {
    id: "up-beet-juice",
    name: "Up Beet Juice",
    slug: "up-beet-juice",
    description: "Beetroot, carrot, lemon, apple and ginger — popular among health enthusiasts.",
    image: "/images/juices/up-beet-juice.jpg",
    sizes: [
      { id: "upb-s", label: "Small", ml: 250, price: 59 },
      { id: "upb-m", label: "Medium", ml: 350, price: 73 },
      { id: "upb-l", label: "Large", ml: 500, price: 89 }
    ],
    popular: true,
    tags: ["beetroot", "healthy", "popular"]
  },
  {
    id: "apple-lemon",
    name: "Apple & Lemon Juice",
    slug: "apple-lemon-juice",
    description: "Granny Smith apples, lemon & celery — a classic, always in demand ;)",
    image: "/images/juices/apple-lemon.jpg",
    sizes: [
      { id: "al-s", label: "Small", ml: 250, price: 59 },
      { id: "al-m", label: "Medium", ml: 350, price: 73 },
      { id: "al-l", label: "Large", ml: 500, price: 89 }
    ],
    tags: ["classic", "refreshing"]
  },
  {
    id: "glow",
    name: "GLOW",
    slug: "glow",
    description: "Naartjies, fresh lemon, orange, turmeric and ginger — nature's perfect power blend!",
    image: "/images/juices/glow.jpg",
    sizes: [
      { id: "glow-s", label: "Small", ml: 250, price: 59 },
      { id: "glow-m", label: "Medium", ml: 350, price: 73 },
      { id: "glow-l", label: "Large", ml: 500, price: 89 }
    ],
    popular: true,
    tags: ["wellness", "turmeric", "ginger"]
  },
  {
    id: "apple-pear",
    name: "Apple & Pear Juice",
    slug: "apple-pear-juice",
    description: "Apples, pears, lemon and ginger — known for its health benefits and vibrant colour.",
    image: "/images/juices/apple-pear.jpg",
    sizes: [
      { id: "ap-s", label: "Small", ml: 250, price: 59 },
      { id: "ap-m", label: "Medium", ml: 350, price: 73 },
      { id: "ap-l", label: "Large", ml: 500, price: 89 }
    ],
    tags: ["healthy", "refreshing"]
  },
  {
    id: "oj",
    name: "OJ",
    slug: "oj",
    description: "Classic orange juice — always in demand.",
    image: "/images/juices/oj.jpg",
    sizes: [
      { id: "oj-s", label: "Small", ml: 250, price: 59 },
      { id: "oj-m", label: "Medium", ml: 350, price: 73 },
      { id: "oj-l", label: "Large", ml: 500, price: 89 }
    ],
    popular: true,
    tags: ["classic", "popular"]
  },
  {
    id: "immunity-elixir",
    name: "Immunity Boost Elixir",
    slug: "immunity-boost-elixir",
    description: "Orange, fresh lemon, ginger, turmeric root, green apple, carrot, garlic, celery, pinch of cayenne, honey & coconut water — a full-spectrum immunity blend.",
    image: "/images/juices/immunity-boost-elixir.jpg",
    sizes: [
      { id: "ibe-s", label: "Small", ml: 250, price: 75 },
      { id: "ibe-m", label: "Medium", ml: 350, price: 85 },
      { id: "ibe-l", label: "Large", ml: 500, price: 95 }
    ],
    popular: true,
    tags: ["immunity", "wellness", "popular"]
  }
];

export const juiceAddOns = [
  { id: "addon-ginger", name: "Extra Ginger", price: 10 },
  { id: "addon-turmeric", name: "Extra Turmeric", price: 10 },
  { id: "addon-chia", name: "Chia Seeds", price: 12 },
  { id: "addon-honey", name: "Honey Drizzle", price: 8 }
];

export const allJuices = juices;
