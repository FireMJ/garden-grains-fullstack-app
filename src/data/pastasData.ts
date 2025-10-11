// src/data/pastasData.ts
export const pastas = [
  {
    id: "pasta-1",
    name: "Spinach Penne Pasta with Chicken",
    description:
      "Penne pasta, chicken, garlic, spinach puree, peppers, mushrooms & cheddar cheese, topped with parmesan.",
    image: "/images/pastas/spinach_penne_chicken.jpg",
    price: 148.65,
    addOns: [
      { name: "extra chicken", price: 30
  },
      {
    id: "pasta-2",
    name: "extra mushrooms", price: 15
  },
      {
    id: "pasta-3",
    name: "extra cheese", price: 20
  },
    ],
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
    name: "Veggie Penne Pasta",
    description:
      "Penne pasta, sun-dried tomatoes, garlic, spinach puree, mushrooms, red onions, peppers, & cheddar cheese, topped with parmesan.",
    image: "/images/pastas/veggie_penne.jpg",
    price: 148.65,
    addOns: [
      { name: "extra mushrooms", price: 15 },
      { name: "extra cheese", price: 20 },
      { name: "extra spinach", price: 10 },
    ],
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
    name: "Garlic Beef Pasta",
    description:
      "Penne pasta, thinly sliced beef, zucchini, mushrooms, red onions, peppers, feta cheese, garlic creamy sauce, topped with parmesan.",
    image: "/images/pastas/garlic_beef_pasta.jpg",
    price: 149.65,
    addOns: [
      { name: "extra beef", price: 35 },
      { name: "extra mushrooms", price: 15 },
      { name: "extra cheese", price: 20 },
    ],
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
    name: "Creamy Pesto Chicken Penne",
    description:
      "Penne pasta tossed in creamy basil pesto with grilled chicken, cherry tomatoes, and parmesan.",
    image: "/images/pastas/creamy_pesto_chicken.jpg",
    price: 149.15,
    addOns: [
      { name: "extra chicken", price: 30 },
      { name: "extra pesto", price: 15 },
      { name: "extra cheese", price: 20 },
    ],
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
    name: "Mushroom & Spinach Penne",
    description:
      "Penne pasta, sautéed mushrooms, spinach, garlic, cream sauce, and topped with parmesan cheese.",
    image: "/images/pastas/mushroom_spinach_penne.jpg",
    price: 148.65,
    addOns: [
      { name: "extra mushrooms", price: 15 },
      { name: "extra spinach", price: 10 },
      { name: "extra cheese", price: 20 },
    ],
    juiceUpsell: [
      {
        size: "250 ml",
        options: [
          { name: "Classic Orange Juice", price: 32.5 },
          { name: "Carrot & Ginger Juice", price: 34.5 },
          { name: "Beetroot & Apple Juice", price: 34.5 },
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
        size: "500 ml",
        options: [
          { name: "Classic Orange Juice", price: 45.0 },
          { name: "Carrot & Ginger Juice", price: 48.0 },
          { name: "Beetroot & Apple Juice", price: 48.0 },
        ],
      },
    ],
  },
];
