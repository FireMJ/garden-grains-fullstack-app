export const wraps = [
  {
    name: "Chicken Avocado Wrap",
    description:
      "Grilled chicken breast, fresh avocado, lettuce, tomato, shredded cheese, and a light mayo dressing in a whole wheat wrap.",
    image: "/images/wraps/chicken_avocado.jpg",
    price: 115,
    addOns: [
      { name: "extra chicken", price: 40 },
      { name: "extra avocado", price: 25 },
      { name: "extra cheese", price: 15 },
    ],
    friesUpsell: [
      { name: "Skinny Potato Chips", price: 45 },
      { name: "Sweet Potato Fries", price: 59 },
      { name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { name: "Tomato Sauce", price: 0, optional: true },
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
    name: "Chicken,Cheese & Mayo Wrap",
    description:
      "Brown flour tortilla, shredded grilled chicken fillet, mayonnaise, dijon mustard, shredded cheddar cheese, baby spinach.",
    image: "/images/wraps/chicken-mayo.jpg",
    price: 110,
    addOns: [
      { name: "extra falafel", price: 30 },
      { name: "extra hummus", price: 15 },
      { name: "extra tahini sauce", price: 10 },
    ],
    friesUpsell: [
      { name: "Skinny Potato Chips", price: 45 },
      { name: "Sweet Potato Fries", price: 59 },
      { name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { name: "Tomato Sauce", price: 0, optional: true },
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
    name: "Beef & Cheddar Wrap",
    description:
      "Tender slices of beef, cheddar cheese, lettuce, tomatoes, caramelized onions, and mustard mayo in a grilled wrap.",
    image: "/images/wraps/beef_cheddar.jpg",
    price: 120,
    addOns: [
      { name: "extra beef", price: 45 },
      { name: "extra cheddar", price: 15 },
      { name: "extra caramelized onions", price: 10 },
    ],
    friesUpsell: [
      { name: "Skinny Potato Chips", price: 45 },
      { name: "Sweet Potato Fries", price: 59 },
      { name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { name: "Tomato Sauce", price: 0, optional: true },
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
    name: "Veggie Delight Wrap",
    description:
      "Mixed seasonal veggies, hummus, shredded carrots, avocado, cucumber, and a light vinaigrette in a whole wheat wrap.",
    image: "/images/wraps/veggie_delight.jpg",
    price: 105,
    addOns: [
      { name: "extra avocado", price: 25 },
      { name: "extra hummus", price: 15 },
      { name: "extra veggies", price: 10 },
    ],
    friesUpsell: [
      { name: "Skinny Potato Chips", price: 45 },
      { name: "Sweet Potato Fries", price: 59 },
      { name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { name: "Tomato Sauce", price: 0, optional: true },
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
    name: "Spicy Chicken Wrap",
    description:
      "Grilled chicken, spicy sriracha mayo, lettuce, jalapeños, cheddar cheese, and tomato in a grilled tortilla.",
    image: "/images/wraps/spicy_chicken.jpg",
    price: 120,
    addOns: [
      { name: "extra chicken", price: 40 },
      { name: "extra sriracha mayo", price: 10 },
      { name: "extra cheddar", price: 15 },
    ],
    friesUpsell: [
      { name: "Skinny Potato Chips", price: 45 },
      { name: "Sweet Potato Fries", price: 59 },
      { name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { name: "Tomato Sauce", price: 0, optional: true },
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
    name: "Pulled Lamb Wrap",
    description:
      "Tender pulled lamb, caramelized onions, rocket, cheddar cheese, and a garlic yogurt sauce in a soft wrap.",
    image: "/images/wraps/pulled_lamb.jpg",
    price: 125,
    addOns: [
      { name: "extra pulled lamb", price: 40 },
      { name: "extra cheddar", price: 15 },
      { name: "extra garlic yogurt sauce", price: 10 },
    ],
    friesUpsell: [
      { name: "Skinny Potato Chips", price: 45 },
      { name: "Sweet Potato Fries", price: 59 },
      { name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { name: "Tomato Sauce", price: 0, optional: true },
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
];
