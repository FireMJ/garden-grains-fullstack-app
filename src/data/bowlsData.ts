export interface AddOn {
    id: "bowl-1",
    name: string;
  price: number;
}

export interface FriesUpsell {
    id: "bowl-2",
    name: string;
  price: number;
  optional?: boolean;
}

export interface JuiceOption {
    id: "bowl-3",
    name: string;
  price: number;
}

export interface JuiceGroup {
  size: string;
  options: JuiceOption[];
}

export interface Bowl {
  id?: number;
  slug?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  baseOptions: string[];
  addOns?: AddOn[];
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceGroup[];
}

// ✅ Consolidated Bowls Array
export const bowls: Bowl[] = [
  {
    id: "bowl-4",
    name: "Smoky Chipotle Chicken Bowl",
    description:
      "Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers & red onion. Topped with avocado slices, tomato salsa, shredded lettuce, cheddar. Finished with lime wedge & sesame seeds.",
    price: 145.45,
    image: "/images/bowls/smoky-chipotle-chicken.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    addOns: [
      {
    id: "bowl-5",
    name: "Extra Chicken", price: 35 },
      {
    id: "bowl-6",
    name: "Avocado", price: 25 },
      {
    id: "bowl-7",
    name: "Cheddar Cheese", price: 20 },
    ],
    friesUpsell: [
      {
    id: "bowl-8",
    name: "Skinny Potato Chips", price: 45 },
      {
    id: "bowl-9",
    name: "Sweet Potato Fries", price: 59 },
      {
    id: "bowl-10",
    name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      {
    id: "bowl-11",
    name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          {
    id: "bowl-12",
    name: "Orange Juice", price: 35 },
          {
    id: "bowl-13",
    name: "Carrot & Ginger Juice", price: 38 },
          {
    id: "bowl-14",
    name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          {
    id: "bowl-15",
    name: "Orange Juice", price: 45 },
          {
    id: "bowl-16",
    name: "Carrot & Ginger Juice", price: 48 },
          {
    id: "bowl-17",
    name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          {
    id: "bowl-18",
    name: "Orange Juice", price: 55 },
          {
    id: "bowl-19",
    name: "Carrot & Ginger Juice", price: 58 },
          {
    id: "bowl-20",
    name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "bowl-21",
    name: "Beef Glow Bowl",
    description:
      "Pan-fried spicy beef with roasted sweet potato cubes, red cabbage, cucumber. Topped with corn salsa, guacamole, grated carrot. Finished with fresh coriander & sesame seeds.",
    price: 149.45,
    image: "/images/bowls/beef-glow.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    addOns: [
      {
    id: "bowl-22",
    name: "Extra Beef", price: 40 },
      {
    id: "bowl-23",
    name: "Guacamole", price: 25 },
    ],
    friesUpsell: [
      {
    id: "bowl-24",
    name: "Skinny Potato Chips", price: 45 },
      {
    id: "bowl-25",
    name: "Sweet Potato Fries", price: 59 },
      {
    id: "bowl-26",
    name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      {
    id: "bowl-27",
    name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          {
    id: "bowl-28",
    name: "Orange Juice", price: 35 },
          {
    id: "bowl-29",
    name: "Carrot & Ginger Juice", price: 38 },
          {
    id: "bowl-30",
    name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          {
    id: "bowl-31",
    name: "Orange Juice", price: 45 },
          {
    id: "bowl-32",
    name: "Carrot & Ginger Juice", price: 48 },
          {
    id: "bowl-33",
    name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          {
    id: "bowl-34",
    name: "Orange Juice", price: 55 },
          {
    id: "bowl-35",
    name: "Carrot & Ginger Juice", price: 58 },
          {
    id: "bowl-36",
    name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "bowl-37",
    name: "Fiery Chickpea Bowl (V)",
    description:
      "Spicy roasted chickpeas with tomato, cucumber, grilled zucchini, black beans. Topped with avocado, hummus, baby spinach. Finished with sesame seeds.",
    price: 140.45,
    image: "/images/bowls/fiery-chickpea.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    addOns: [
      {
    id: "bowl-38",
    name: "Extra Chickpeas", price: 20 },
      {
    id: "bowl-39",
    name: "Hummus", price: 15 },
      {
    id: "bowl-40",
    name: "Avocado", price: 25 },
    ],
   friesUpsell: [
      {
    id: "bowl-41",
    name: "Skinny Potato Chips", price: 45 },
      {
    id: "bowl-42",
    name: "Sweet Potato Fries", price: 59 },
      {
    id: "bowl-43",
    name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      {
    id: "bowl-44",
    name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          {
    id: "bowl-45",
    name: "Orange Juice", price: 35 },
          {
    id: "bowl-46",
    name: "Carrot & Ginger Juice", price: 38 },
          {
    id: "bowl-47",
    name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          {
    id: "bowl-48",
    name: "Orange Juice", price: 45 },
          {
    id: "bowl-49",
    name: "Carrot & Ginger Juice", price: 48 },
          {
    id: "bowl-50",
    name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          {
    id: "bowl-51",
    name: "Orange Juice", price: 55 },
          {
    id: "bowl-52",
    name: "Carrot & Ginger Juice", price: 58 },
          {
    id: "bowl-53",
    name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "bowl-54",
    name: "Boiled Egg & Tofu Power Bowl",
    description:
      "Soft-boiled egg halves with cubed marinated tofu, cherry tomatoes, radish, baby spinach, carrots. Topped with avocado & pickled onion. Finished with sesame seeds & chili flakes.",
    price: 149.25,
    image: "/images/bowls/egg-tofu-power.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    addOns: [
      {
    id: "bowl-55",
    name: "Extra Tofu", price: 25 },
      {
    id: "bowl-56",
    name: "Extra Egg", price: 20 },
      {
    id: "bowl-57",
    name: "Avocado", price: 25 },
    ],
    friesUpsell: [
      {
    id: "bowl-58",
    name: "Skinny Potato Chips", price: 45 },
      {
    id: "bowl-59",
    name: "Sweet Potato Fries", price: 59 },
      {
    id: "bowl-60",
    name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      {
    id: "bowl-61",
    name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          {
    id: "bowl-62",
    name: "Orange Juice", price: 35 },
          {
    id: "bowl-63",
    name: "Carrot & Ginger Juice", price: 38 },
          {
    id: "bowl-64",
    name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          {
    id: "bowl-65",
    name: "Orange Juice", price: 45 },
          {
    id: "bowl-66",
    name: "Carrot & Ginger Juice", price: 48 },
          {
    id: "bowl-67",
    name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          {
    id: "bowl-68",
    name: "Orange Juice", price: 55 },
          {
    id: "bowl-69",
    name: "Carrot & Ginger Juice", price: 58 },
          {
    id: "bowl-70",
    name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "bowl-71",
    name: "Grilled Chicken Poke Bowl",
    description:
      "Teriyaki-glazed grilled chicken strips with cucumber, corn, avocado, edamame, slaw. Topped with pineapple salsa & chopped chives. Finished with sesame seeds.",
    price: 145.39,
    image: "/images/bowls/chicken-poke.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    addOns: [
      {
    id: "bowl-72",
    name: "Extra Chicken", price: 35 },
      {
    id: "bowl-73",
    name: "Avocado", price: 25 },
    ],
   friesUpsell: [
      {
    id: "bowl-74",
    name: "Skinny Potato Chips", price: 45 },
      {
    id: "bowl-75",
    name: "Sweet Potato Fries", price: 59 },
      {
    id: "bowl-76",
    name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      {
    id: "bowl-77",
    name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          {
    id: "bowl-78",
    name: "Orange Juice", price: 35 },
          {
    id: "bowl-79",
    name: "Carrot & Ginger Juice", price: 38 },
          {
    id: "bowl-80",
    name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          {
    id: "bowl-81",
    name: "Orange Juice", price: 45 },
          {
    id: "bowl-82",
    name: "Carrot & Ginger Juice", price: 48 },
          {
    id: "bowl-83",
    name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          {
    id: "bowl-84",
    name: "Orange Juice", price: 55 },
          {
    id: "bowl-85",
    name: "Carrot & Ginger Juice", price: 58 },
          {
    id: "bowl-86",
    name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
];

// ✅ Dressings
export const bowlDressings: string[] = [
  "No Dressing",
  "Orange Ginger Dressing",
  "Sesame Soy Dressing",
  "Buttermilk Ranch Dressing",
  "Balsamic Vinaigrette",
  "Lemon & Herb Vinaigrette",
  "Honey Mustard Dressing",
  "Apple Cider Vinaigrette",
  "Authentic Greek Dressing",
  "Citrus Coriander Dressing",
  "Creamy Chipotle Yoghurt Sauce",
];
