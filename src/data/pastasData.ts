export interface PastaItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  ingredients: string[];
  addOns?: AddOn[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const pastaAddOns: AddOn[] = [
  { id: "addon-1", name: "Extra Chicken", price: 30 },
  { id: "addon-2", name: "Extra Beef", price: 35 },
  { id: "addon-3", name: "Extra Cheese", price: 15 },
  { id: "addon-4", name: "Basil Pesto", price: 20 },
  { id: "addon-5", name: "Garlic Bread", price: 25 },
];

export const pastas: PastaItem[] = [
  {
    id: "pasta-1",
    slug: "spinach-penne-pasta-chicken",
    name: "Spinach Penne Pasta with Chicken",
    description: "Penne pasta with chicken, garlic, spinach puree, peppers, mushrooms & cheddar cheese, topped with parmesan grated cheese",
    price: 128.65,
    image: "/images/pastas/spinach-penne-chicken.jpg",
    category: "pastas",
    popular: true,
    ingredients: ["Penne pasta", "Chicken", "Garlic", "Spinach puree", "Peppers", "Mushrooms", "Cheddar cheese", "Parmesan cheese"],
    addOns: [
      { id: "addon-4", name: "Basil Pesto", price: 20 }
    ]
  },
  {
    id: "pasta-2",
    slug: "veggie-penne-pasta",
    name: "Veggie Penne Pasta",
    description: "Penne pasta with sun-dried tomatoes, garlic, spinach puree, mushrooms, red onions, peppers, & cheddar cheese, topped with parmesan cheese",
    price: 129.15,
    image: "/images/pastas/veggie-penne.jpg",
    category: "pastas",
    popular: false,
    ingredients: ["Penne pasta", "Sun-dried tomatoes", "Garlic", "Spinach puree", "Mushrooms", "Red onions", "Peppers", "Cheddar cheese", "Parmesan cheese"],
    addOns: [
      { id: "addon-1", name: "Chicken", price: 30 },
      { id: "addon-2", name: "Beef", price: 35 }
    ]
  },
  {
    id: "pasta-3",
    slug: "garlic-beef-pasta",
    name: "Garlic Beef Pasta",
    description: "Penne pasta with thinly sliced beef, zucchini, mushrooms, red onions, peppers, feta cheese, garlic creamy sauce, and topped with parmesan cheese",
    price: 135.65,
    image: "/images/pastas/garlic-beef.jpg",
    category: "pastas",
    popular: true,
    ingredients: ["Penne pasta", "Beef", "Zucchini", "Mushrooms", "Red onions", "Peppers", "Feta cheese", "Garlic creamy sauce", "Parmesan cheese"],
    addOns: []
  }
];
