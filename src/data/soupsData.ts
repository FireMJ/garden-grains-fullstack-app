export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface JuiceUpsell {
  id: string;
  name: string;
  price: number;
  size: string;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  addOns?: AddOn[];
  juiceUpsell?: JuiceUpsell[];
}

export const soups: MenuItem[] = [
  {
    id: "soup-1",
    slug: "creamy-broccoli-cauliflower-soup",
    name: "Creamy Broccoli and Cauliflower Soup",
    description: "Broccoli, cauliflower, onion, garlic, dried thyme, olive oil, and chicken stock, topped with blue cheese, fresh cream, & olive oil. Served with a toasted slice of sourdough bread.",
    price: 128.65,
    image: "/images/soups/creamy-broccoli-cauliflower.jpg",
    category: "soups",
    tags: ["Creamy", "Vegetarian", "Popular"],
    addOns: [
      { id: "extra-bread", name: "Extra Sourdough Bread", price: 12.00 },
      { id: "extra-cheese", name: "Extra Blue Cheese", price: 15.00 },
      { id: "extra-cream", name: "Extra Fresh Cream", price: 8.00 },
    ],
    juiceUpsell: [
      { id: "juice-soup-1", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-soup-2", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-soup-3", name: "Apple & Pear Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-soup-4", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-soup-5", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-soup-6", name: "Apple & Pear Juice (350ml)", price: 46.00, size: "350ml" },
    ],
  },
  {
    id: "soup-2",
    slug: "pea-macon-soup",
    name: "Pea and Macon Soup",
    description: "Peas, macon, onion, garlic, chicken stock, topped with fresh cream, parmesan cheese, & served with toasted slice sourdough bread.",
    price: 129.15,
    image: "/images/soups/pea-macon-soup.jpg",
    category: "soups",
    tags: ["Hearty", "Savory", "Popular"],
    addOns: [
      { id: "extra-bread", name: "Extra Sourdough Bread", price: 12.00 },
      { id: "extra-parmesan", name: "Extra Parmesan Cheese", price: 10.00 },
      { id: "extra-cream", name: "Extra Fresh Cream", price: 8.00 },
      { id: "extra-macon", name: "Extra Macon", price: 18.00 },
    ],
    juiceUpsell: [
      { id: "juice-soup-7", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-soup-8", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-soup-9", name: "Green Mile Juice (250ml)", price: 40.00, size: "250ml" },
      { id: "juice-soup-10", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-soup-11", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-soup-12", name: "Green Mile Juice (350ml)", price: 50.00, size: "350ml" },
    ],
  },
  {
    id: "soup-3",
    slug: "creamy-butternut-soup",
    name: "Creamy Butternut Soup",
    description: "Roasted butternut, onion, garlic, carrots, apple, vegetable stock, cinnamon, nutmeg, smoked paprika, topped with cream, parmesan cheese, roasted pumpkin seeds and served with toasted slice of sourdough bread.",
    price: 128.65,
    image: "/images/soups/creamy-butternut.jpg",
    category: "soups",
    tags: ["Sweet", "Vegetarian", "Comforting"],
    addOns: [
      { id: "extra-bread", name: "Extra Sourdough Bread", price: 12.00 },
      { id: "extra-parmesan", name: "Extra Parmesan Cheese", price: 10.00 },
      { id: "extra-pumpkin-seeds", name: "Extra Pumpkin Seeds", price: 8.00 },
      { id: "extra-cream", name: "Extra Cream", price: 8.00 },
    ],
    juiceUpsell: [
      { id: "juice-soup-13", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-soup-14", name: "Apple & Pear Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-soup-15", name: "Mango Juice (250ml)", price: 37.00, size: "250ml" },
      { id: "juice-soup-16", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-soup-17", name: "Apple & Pear Juice (350ml)", price: 46.00, size: "350ml" },
      { id: "juice-soup-18", name: "Mango Juice (350ml)", price: 47.00, size: "350ml" },
    ],
  },
  {
    id: "soup-4",
    slug: "velvety-broccoli-spinach-soup",
    name: "Velvety Broccoli & Spinach Soup",
    description: "Broccoli, baby spinach, olive oil, onion, garlic, potato, vegetable stock, nutritional yeast, salt & pepper to taste, lemon juice",
    price: 129.65,
    image: "/images/soups/broccoli-spinach.jpg",
    category: "soups",
    tags: ["Healthy", "Vegetarian", "Green"],
    addOns: [
      { id: "extra-bread", name: "Extra Sourdough Bread", price: 12.00 },
      { id: "extra-spinach", name: "Extra Spinach", price: 10.00 },
      { id: "extra-lemon", name: "Extra Lemon", price: 5.00 },
      { id: "nutritional-yeast", name: "Extra Nutritional Yeast", price: 8.00 },
    ],
    juiceUpsell: [
      { id: "juice-soup-19", name: "Green Mile Juice (250ml)", price: 40.00, size: "250ml" },
      { id: "juice-soup-20", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-soup-21", name: "Apple & Lemon Juice (250ml)", price: 36.00, size: "250ml" },
      { id: "juice-soup-22", name: "Green Mile Juice (350ml)", price: 50.00, size: "350ml" },
      { id: "juice-soup-23", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-soup-24", name: "Apple & Lemon Juice (350ml)", price: 46.00, size: "350ml" },
    ],
  },
  {
    id: "soup-5",
    slug: "creamy-spiced-sweet-potato-soup",
    name: "Creamy Spiced Sweet Potato Soup",
    description: "Olive oil, onion, garlic, fresh ginger, ground cumin, smoked paprika, cinnamon, ground coriander, sweet potatoes, carrot, vegetable broth, coconut milk, Salt & pepper to taste, Juice of orange",
    price: 128.65,
    image: "/images/soups/spiced-sweet-potato.jpg",
    category: "soups",
    tags: ["Spicy", "Vegetarian", "Creamy"],
    addOns: [
      { id: "extra-bread", name: "Extra Sourdough Bread", price: 12.00 },
      { id: "extra-coconut-milk", name: "Extra Coconut Milk", price: 10.00 },
      { id: "extra-spices", name: "Extra Spice Blend", price: 8.00 },
      { id: "extra-ginger", name: "Extra Fresh Ginger", price: 6.00 },
    ],
    juiceUpsell: [
      { id: "juice-soup-25", name: "Orange Juice (250ml)", price: 35.00, size: "250ml" },
      { id: "juice-soup-26", name: "Carrot & Ginger Juice (250ml)", price: 38.00, size: "250ml" },
      { id: "juice-soup-27", name: "Mango Juice (250ml)", price: 37.00, size: "250ml" },
      { id: "juice-soup-28", name: "Orange Juice (350ml)", price: 45.00, size: "350ml" },
      { id: "juice-soup-29", name: "Carrot & Ginger Juice (350ml)", price: 48.00, size: "350ml" },
      { id: "juice-soup-30", name: "Mango Juice (350ml)", price: 47.00, size: "350ml" },
    ],
  },
];

export const soupAddOns: AddOn[] = [
  { id: "extra-bread", name: "Extra Sourdough Bread", price: 12.00 },
  { id: "extra-croutons", name: "Extra Croutons", price: 8.00 },
  { id: "extra-cheese", name: "Extra Cheese", price: 10.00 },
  { id: "chili-flakes", name: "Chili Flakes", price: 5.00 },
  { id: "fresh-herbs", name: "Fresh Herbs", price: 8.00 },
];
