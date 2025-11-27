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
  optional?: boolean;
}

export interface Pasta {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
  tags?: string[];
}

export const pastas: Pasta[] = [
  {
    id: "pasta1",
    slug: "spinach-penne-pasta-with-chicken",
    name: "Spinach Penne Pasta with Chicken",
    description: "Penne pasta, chicken, garlic, spinach puree, peppers, mushrooms & cheddar cheese, topped with parmesan.",
    image: "/images/pastas/spinach_penne_chicken.jpg",
    price: 148.65,
    addOns: [
      { id: "pasta-addon-1", name: "Extra Chicken", price: 30 },
      { id: "pasta-addon-2", name: "Extra Mushrooms", price: 15 },
      { id: "pasta-addon-3", name: "Extra Cheese", price: 20 },
    ],
    friesUpsell: [
      { id: "pasta-fries-1", name: "Garlic Bread", price: 25 },
      { id: "pasta-fries-2", name: "Side Salad", price: 35 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "pasta-juice-1", name: "Orange Juice", price: 35 },
          { id: "pasta-juice-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "pasta-juice-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "pasta-juice-4", name: "Orange Juice", price: 45 },
          { id: "pasta-juice-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "pasta-juice-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "pasta-juice-7", name: "Orange Juice", price: 55 },
          { id: "pasta-juice-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "pasta-juice-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["chicken", "popular"]
  },
  {
    id: "pasta2",
    slug: "veggie-penne-pasta",
    name: "Veggie Penne Pasta",
    description: "Penne pasta, sun-dried tomatoes, garlic, spinach puree, mushrooms, red onions, peppers, & cheddar cheese, topped with parmesan.",
    image: "/images/pastas/veggie_penne.jpg",
    price: 148.65,
    addOns: [
      { id: "pasta-addon-4", name: "Extra Mushrooms", price: 15 },
      { id: "pasta-addon-5", name: "Extra Cheese", price: 20 },
      { id: "pasta-addon-6", name: "Extra Spinach", price: 10 },
    ],
    friesUpsell: [
      { id: "pasta-fries-3", name: "Garlic Bread", price: 25 },
      { id: "pasta-fries-4", name: "Side Salad", price: 35 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "pasta-juice-10", name: "Orange Juice", price: 35 },
          { id: "pasta-juice-11", name: "Carrot & Ginger Juice", price: 38 },
          { id: "pasta-juice-12", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "pasta-juice-13", name: "Orange Juice", price: 45 },
          { id: "pasta-juice-14", name: "Carrot & Ginger Juice", price: 48 },
          { id: "pasta-juice-15", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "pasta-juice-16", name: "Orange Juice", price: 55 },
          { id: "pasta-juice-17", name: "Carrot & Ginger Juice", price: 58 },
          { id: "pasta-juice-18", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["vegetarian"]
  },
  {
    id: "pasta3",
    slug: "garlic-beef-pasta",
    name: "Garlic Beef Pasta",
    description: "Penne pasta, thinly sliced beef, zucchini, mushrooms, red onions, peppers, feta cheese, garlic creamy sauce, topped with parmesan.",
    image: "/images/pastas/garlic_beef_pasta.jpg",
    price: 149.65,
    addOns: [
      { id: "pasta-addon-7", name: "Extra Beef", price: 35 },
      { id: "pasta-addon-8", name: "Extra Mushrooms", price: 15 },
      { id: "pasta-addon-9", name: "Extra Cheese", price: 20 },
    ],
    friesUpsell: [
      { id: "pasta-fries-5", name: "Garlic Bread", price: 25 },
      { id: "pasta-fries-6", name: "Side Salad", price: 35 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "pasta-juice-19", name: "Orange Juice", price: 35 },
          { id: "pasta-juice-20", name: "Carrot & Ginger Juice", price: 38 },
          { id: "pasta-juice-21", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "pasta-juice-22", name: "Orange Juice", price: 45 },
          { id: "pasta-juice-23", name: "Carrot & Ginger Juice", price: 48 },
          { id: "pasta-juice-24", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "pasta-juice-25", name: "Orange Juice", price: 55 },
          { id: "pasta-juice-26", name: "Carrot & Ginger Juice", price: 58 },
          { id: "pasta-juice-27", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["beef", "spicy"]
  },
  {
    id: "pasta4",
    slug: "creamy-pesto-chicken-penne",
    name: "Creamy Pesto Chicken Penne",
    description: "Penne pasta tossed in creamy basil pesto with grilled chicken, cherry tomatoes, and parmesan.",
    image: "/images/pastas/creamy_pesto_chicken.jpg",
    price: 149.15,
    addOns: [
      { id: "pasta-addon-10", name: "Extra Chicken", price: 30 },
      { id: "pasta-addon-11", name: "Extra Pesto", price: 15 },
      { id: "pasta-addon-12", name: "Extra Cheese", price: 20 },
    ],
    friesUpsell: [
      { id: "pasta-fries-7", name: "Garlic Bread", price: 25 },
      { id: "pasta-fries-8", name: "Side Salad", price: 35 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "pasta-juice-28", name: "Orange Juice", price: 35 },
          { id: "pasta-juice-29", name: "Carrot & Ginger Juice", price: 38 },
          { id: "pasta-juice-30", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "pasta-juice-31", name: "Orange Juice", price: 45 },
          { id: "pasta-juice-32", name: "Carrot & Ginger Juice", price: 48 },
          { id: "pasta-juice-33", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "pasta-juice-34", name: "Orange Juice", price: 55 },
          { id: "pasta-juice-35", name: "Carrot & Ginger Juice", price: 58 },
          { id: "pasta-juice-36", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["chicken", "popular"]
  },
  {
    id: "pasta5",
    slug: "mushroom-spinach-penne",
    name: "Mushroom & Spinach Penne",
    description: "Penne pasta, sautéed mushrooms, spinach, garlic, cream sauce, and topped with parmesan cheese.",
    image: "/images/pastas/mushroom_spinach_penne.jpg",
    price: 148.65,
    addOns: [
      { id: "pasta-addon-13", name: "Extra Mushrooms", price: 15 },
      { id: "pasta-addon-14", name: "Extra Spinach", price: 10 },
      { id: "pasta-addon-15", name: "Extra Cheese", price: 20 },
    ],
    friesUpsell: [
      { id: "pasta-fries-9", name: "Garlic Bread", price: 25 },
      { id: "pasta-fries-10", name: "Side Salad", price: 35 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "pasta-juice-37", name: "Orange Juice", price: 35 },
          { id: "pasta-juice-38", name: "Carrot & Ginger Juice", price: 38 },
          { id: "pasta-juice-39", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "pasta-juice-40", name: "Orange Juice", price: 45 },
          { id: "pasta-juice-41", name: "Carrot & Ginger Juice", price: 48 },
          { id: "pasta-juice-42", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "pasta-juice-43", name: "Orange Juice", price: 55 },
          { id: "pasta-juice-44", name: "Carrot & Ginger Juice", price: 58 },
          { id: "pasta-juice-45", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["vegetarian"]
  }
];
