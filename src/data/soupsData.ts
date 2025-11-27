export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface JuiceOption {
  id: string;
  name: string;
  price: number;
}

export interface JuiceGroup {
  size: string;
  options: JuiceOption[];
}

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
}

export interface Soup {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

export const soups: Soup[] = [
  {
    id: "soup1",
    slug: "creamy-broccoli-cauliflower-soup",
    name: "Creamy Broccoli and Cauliflower Soup",
    price: 65,
    description: "Broccoli, cauliflower, onion, garlic, dried thyme, olive oil, and chicken stock, topped with blue cheese, fresh cream, & olive oil. Served with a toasted slice of sourdough bread.",
    image: "/images/soups/creamy-broccoli-cauliflower.png",
    addOns: [
      { id: "addon1", name: "Garlic Bread", price: 20 },
      { id: "addon2", name: "Avocado Slices", price: 25 },
      { id: "addon3", name: "Vegan Cheese", price: 22 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice1", name: "Orange Juice", price: 35 },
          { id: "juice2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice4", name: "Orange Juice", price: 45 },
          { id: "juice5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice7", name: "Orange Juice", price: 55 },
          { id: "juice8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "soup2",
    slug: "butternut-sage-soup",
    name: "Butternut & Sage Soup",
    price: 72,
    description: "Smooth roasted butternut blended with sage and a touch of coconut cream.",
    image: "/images/soups/butternut.png",
    addOns: [
      { id: "addon4", name: "Seeded Bread Roll", price: 18 },
      { id: "addon5", name: "Chili Flakes", price: 8 },
      { id: "addon6", name: "Pumpkin Seeds", price: 15 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice10", name: "Orange Juice", price: 35 },
          { id: "juice11", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice12", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice13", name: "Orange Juice", price: 45 },
          { id: "juice14", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice15", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice16", name: "Orange Juice", price: 55 },
          { id: "juice17", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice18", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "soup3",
    slug: "miso-mushroom-soup",
    name: "Miso & Mushroom Soup",
    price: 78,
    description: "A comforting Japanese-inspired miso broth with shiitake mushrooms, seaweed, and spring onions.",
    image: "/images/soups/miso.png",
    addOns: [
      { id: "addon7", name: "Tofu Cubes", price: 22 },
      { id: "addon8", name: "Noodles", price: 25 },
      { id: "addon9", name: "Sesame Seeds", price: 10 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice19", name: "Orange Juice", price: 35 },
          { id: "juice20", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice21", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice22", name: "Orange Juice", price: 45 },
          { id: "juice23", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice24", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice25", name: "Orange Juice", price: 55 },
          { id: "juice26", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice27", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
];
