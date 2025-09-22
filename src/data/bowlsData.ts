export interface AddOn {
  name: string;
  price: number;
}

export interface Bowl {
  name: string;
  description: string;
  price: number;
  image?: string;
  baseOptions: string[];
  addOns?: AddOn[];
  juiceUpsell?: any[]; // Added juice upsell property
}

export const bowls: Bowl[] = [
  {
    name: "Smoky Chipotle Chicken Bowl",
    description:
      "Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers & red onion. Topped with avocado slices, tomato salsa, shredded lettuce, cheddar. Finished with lime wedge & sesame seeds.",
    price: 145.45,
    image: "/images/bowls/smoky-chipotle-chicken.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { name: "Orange Juice", price: 35 },
          { name: "Carrot & Ginger Juice", price: 38 },
          { name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { name: "Orange Juice", price: 45 },
          { name: "Carrot & Ginger Juice", price: 48 },
          { name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { name: "Orange Juice", price: 55 },
          { name: "Carrot & Ginger Juice", price: 58 },
          { name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    name: "Beef Glow Bowl",
    description:
      "Pan-fried spicy beef with roasted sweet potato cubes, red cabbage, cucumber. Topped with corn salsa, guacamole, grated carrot. Finished with fresh coriander & sesame seeds.",
    price: 149.45,
    image: "/images/bowls/beef-glow.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { name: "Orange Juice", price: 35 },
          { name: "Carrot & Ginger Juice", price: 38 },
          { name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { name: "Orange Juice", price: 45 },
          { name: "Carrot & Ginger Juice", price: 48 },
          { name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { name: "Orange Juice", price: 55 },
          { name: "Carrot & Ginger Juice", price: 58 },
          { name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    name: "Fiery Chickpea Bowl (V)",
    description:
      "Spicy roasted chickpeas with tomato, cucumber, grilled zucchini, black beans. Topped with avocado, hummus, baby spinach. Finished with sesame seeds.",
    price: 140.45,
    image: "/images/bowls/fiery-chickpea.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { name: "Orange Juice", price: 35 },
          { name: "Carrot & Ginger Juice", price: 38 },
          { name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { name: "Orange Juice", price: 45 },
          { name: "Carrot & Ginger Juice", price: 48 },
          { name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { name: "Orange Juice", price: 55 },
          { name: "Carrot & Ginger Juice", price: 58 },
          { name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    name: "Boiled Egg & Tofu Power Bowl",
    description:
      "Soft-boiled egg halves with cubed marinated tofu, cherry tomatoes, radish, baby spinach, carrots. Topped with avocado & pickled onion. Finished with sesame seeds & chili flakes.",
    price: 149.25,
    image: "/images/bowls/egg-tofu-power.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { name: "Orange Juice", price: 35 },
          { name: "Carrot & Ginger Juice", price: 38 },
          { name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { name: "Orange Juice", price: 45 },
          { name: "Carrot & Ginger Juice", price: 48 },
          { name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { name: "Orange Juice", price: 55 },
          { name: "Carrot & Ginger Juice", price: 58 },
          { name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    name: "Grilled Chicken Poke Bowl",
    description:
      "Teriyaki-glazed grilled chicken strips with cucumber, corn, avocado, edamame, slaw. Topped with pineapple salsa & chopped chives. Finished with sesame seeds.",
    price: 145.39,
    image: "/images/bowls/chicken-poke.jpg",
    baseOptions: ["Cilantro Lime Brown Rice", "Quinoa", "Millet", "Bulgur", "Sorghum", "Brown Rice"],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { name: "Orange Juice", price: 35 },
          { name: "Carrot & Ginger Juice", price: 38 },
          { name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { name: "Orange Juice", price: 45 },
          { name: "Carrot & Ginger Juice", price: 48 },
          { name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { name: "Orange Juice", price: 55 },
          { name: "Carrot & Ginger Juice", price: 58 },
          { name: "Mango Juice", price: 57 },
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