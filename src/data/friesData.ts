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

export interface SauceOption {
  id: string;
  name: string;
  price: number;
}

export interface FriesItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns?: AddOn[];
  sauceOptions?: SauceOption[];
  juiceUpsell?: JuiceGroup[];
  tags?: string[];
}

export const fries: FriesItem[] = [
  {
    id: "fries1",
    slug: "classic-fries",
    name: "Classic Fries",
    description: "Crispy golden fries with sea salt, perfectly cooked to golden perfection.",
    price: 45,
    image: "/images/fries/classic-fries.jpg",
    addOns: [
      { id: "fries-addon-1", name: "Cheese Sauce", price: 15 },
      { id: "fries-addon-2", name: "Chili Mayo", price: 12 },
      { id: "fries-addon-3", name: "Garlic Aioli", price: 12 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "fries-juice-1", name: "Orange Juice", price: 35 },
          { id: "fries-juice-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "fries-juice-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "fries-juice-4", name: "Orange Juice", price: 45 },
          { id: "fries-juice-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "fries-juice-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "fries-juice-7", name: "Orange Juice", price: 55 },
          { id: "fries-juice-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "fries-juice-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["classic", "popular"]
  },
  {
    id: "fries2",
    slug: "sweet-potato-fries",
    name: "Sweet Potato Fries",
    description: "Crispy sweet potato fries served with a hint of paprika and sea salt.",
    price: 55,
    image: "/images/fries/sweet-potato-fries.jpg",
    addOns: [
      { id: "fries-addon-4", name: "Garlic Mayo", price: 12 },
      { id: "fries-addon-5", name: "Avocado Dip", price: 18 },
      { id: "fries-addon-6", name: "Sweet Chili Sauce", price: 10 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "fries-juice-10", name: "Orange Juice", price: 35 },
          { id: "fries-juice-11", name: "Carrot & Ginger Juice", price: 38 },
          { id: "fries-juice-12", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "fries-juice-13", name: "Orange Juice", price: 45 },
          { id: "fries-juice-14", name: "Carrot & Ginger Juice", price: 48 },
          { id: "fries-juice-15", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "fries-juice-16", name: "Orange Juice", price: 55 },
          { id: "fries-juice-17", name: "Carrot & Ginger Juice", price: 58 },
          { id: "fries-juice-18", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["vegetarian"]
  },
  {
    id: "fries3",
    slug: "loaded-fries",
    name: "Loaded Fries",
    description: "Fries topped with melted vegan cheese, jalapeños, and spicy sauce for the ultimate indulgence.",
    price: 75,
    image: "/images/fries/loaded-fries.jpg",
    addOns: [
      { id: "fries-addon-7", name: "Extra Cheese", price: 20 },
      { id: "fries-addon-8", name: "Extra Jalapeños", price: 10 },
      { id: "fries-addon-9", name: "Bacon Bits", price: 15 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "fries-juice-19", name: "Orange Juice", price: 35 },
          { id: "fries-juice-20", name: "Carrot & Ginger Juice", price: 38 },
          { id: "fries-juice-21", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "fries-juice-22", name: "Orange Juice", price: 45 },
          { id: "fries-juice-23", name: "Carrot & Ginger Juice", price: 48 },
          { id: "fries-juice-24", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "fries-juice-25", name: "Orange Juice", price: 55 },
          { id: "fries-juice-26", name: "Carrot & Ginger Juice", price: 58 },
          { id: "fries-juice-27", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["loaded", "spicy"]
  },
  {
    id: "fries4",
    slug: "grilled-chicken-fillet-strips",
    name: "Grilled Chicken Fillet Strips",
    description: "Tender grilled chicken breast strips, perfectly seasoned and served with your choice of dipping sauce.",
    price: 85,
    image: "/images/fries/grilled-chicken-strips.jpg",
    sauceOptions: [
      { id: "sauce-1", name: "BBQ Sauce", price: 0 },
      { id: "sauce-2", name: "Garlic Mayo", price: 0 },
      { id: "sauce-3", name: "Sweet Chili", price: 0 },
      { id: "sauce-4", name: "Peri-Peri", price: 0 },
      { id: "sauce-5", name: "Honey Mustard", price: 0 },
    ],
    addOns: [
      { id: "chicken-addon-1", name: "Extra Chicken Strips", price: 25 },
      { id: "chicken-addon-2", name: "Side of Fries", price: 35 },
      { id: "chicken-addon-3", name: "Side Salad", price: 30 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "fries-juice-28", name: "Orange Juice", price: 35 },
          { id: "fries-juice-29", name: "Carrot & Ginger Juice", price: 38 },
          { id: "fries-juice-30", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "fries-juice-31", name: "Orange Juice", price: 45 },
          { id: "fries-juice-32", name: "Carrot & Ginger Juice", price: 48 },
          { id: "fries-juice-33", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "fries-juice-34", name: "Orange Juice", price: 55 },
          { id: "fries-juice-35", name: "Carrot & Ginger Juice", price: 58 },
          { id: "fries-juice-36", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["chicken", "protein", "popular"]
  },
  {
    id: "fries5",
    slug: "wedges",
    name: "Seasoned Wedges",
    description: "Thick-cut potato wedges with rosemary and garlic seasoning, crispy on the outside and fluffy inside.",
    price: 50,
    image: "/images/fries/wedges.jpg",
    addOns: [
      { id: "fries-addon-10", name: "Sour Cream", price: 12 },
      { id: "fries-addon-11", name: "Sweet Chili Dip", price: 10 },
      { id: "fries-addon-12", name: "Cheese Sauce", price: 15 },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "fries-juice-37", name: "Orange Juice", price: 35 },
          { id: "fries-juice-38", name: "Carrot & Ginger Juice", price: 38 },
          { id: "fries-juice-39", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "fries-juice-40", name: "Orange Juice", price: 45 },
          { id: "fries-juice-41", name: "Carrot & Ginger Juice", price: 48 },
          { id: "fries-juice-42", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "fries-juice-43", name: "Orange Juice", price: 55 },
          { id: "fries-juice-44", name: "Carrot & Ginger Juice", price: 58 },
          { id: "fries-juice-45", name: "Mango Juice", price: 57 },
        ],
      },
    ],
    tags: ["vegetarian", "seasoned"]
  }
];
