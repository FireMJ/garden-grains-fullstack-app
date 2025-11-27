export const toasties = [
  {
    id: "toastie-1",
    name: "Pressed Beef and Cheese",
    description:
      "Sourdough, ham slices, gouda cheese, dijon mustard, sliced tomatoes, mayonnaise.",
    image: "/images/toasties/pressed_beef_cheese.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-1-1", name: "extra ham", price: 35 },
      { id: "addon-1-2", name: "extra gouda", price: 25 },
      { id: "addon-1-3", name: "extra dijon mustard", price: 5 },
    ],
    friesUpsell: [
      { id: "fries-1-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-1-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-1-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-1-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-1-1", name: "Orange Juice", price: 35 },
          { id: "juice-1-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-1-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-1-4", name: "Orange Juice", price: 45 },
          { id: "juice-1-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-1-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-1-7", name: "Orange Juice", price: 55 },
          { id: "juice-1-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-1-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-2",
    name: "Tomato, Basil & Mozzarella",
    description:
      "Sourdough, mozzarella cheese, tomato slices, fresh basil leaves, balsamic glaze, olive oil.",
    image: "/images/toasties/tomato_basil_mozzarella.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-2-1", name: "extra mozzarella", price: 25 },
      { id: "addon-2-2", name: "extra tomato", price: 10 },
      { id: "addon-2-3", name: "extra basil", price: 5 },
    ],
    friesUpsell: [
      { id: "fries-2-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-2-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-2-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-2-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-2-1", name: "Orange Juice", price: 35 },
          { id: "juice-2-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-2-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-2-4", name: "Orange Juice", price: 45 },
          { id: "juice-2-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-2-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-2-7", name: "Orange Juice", price: 55 },
          { id: "juice-2-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-2-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-3",
    name: "Mushroom and Mozzarella",
    description:
      "Sourdough, sautéed mushrooms, mozzarella cheese, caramelized onions, fresh thyme, tomatoes, butter-grilled cherry tomatoes.",
    image: "/images/toasties/mushroom_mozzarella.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-3-1", name: "extra mushrooms", price: 20 },
      { id: "addon-3-2", name: "extra mozzarella", price: 25 },
      { id: "addon-3-3", name: "extra caramelized onions", price: 10 },
    ],
    friesUpsell: [
      { id: "fries-3-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-3-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-3-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-3-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-3-1", name: "Orange Juice", price: 35 },
          { id: "juice-3-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-3-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-3-4", name: "Orange Juice", price: 45 },
          { id: "juice-3-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-3-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-3-7", name: "Orange Juice", price: 55 },
          { id: "juice-3-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-3-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-4",
    name: "Chicken and Pesto",
    description:
      "Sourdough, grilled chicken breast slices, pesto, sun-dried tomatoes, cheddar cheese, arugula.",
    image: "/images/toasties/chicken_pesto.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-4-1", name: "extra chicken", price: 40 },
      { id: "addon-4-2", name: "extra pesto", price: 15 },
      { id: "addon-4-3", name: "extra cheddar", price: 15 },
    ],
    friesUpsell: [
      { id: "fries-4-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-4-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-4-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-4-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-4-1", name: "Orange Juice", price: 35 },
          { id: "juice-4-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-4-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-4-4", name: "Orange Juice", price: 45 },
          { id: "juice-4-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-4-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-4-7", name: "Orange Juice", price: 55 },
          { id: "juice-4-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-4-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-5",
    name: "Macon, Egg, and Cheese",
    description:
      "Sourdough, crispy macon, two fried eggs, cheddar cheese, sliced tomato, avocado.",
    image: "/images/toasties/macon_egg_cheese.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-5-1", name: "extra macon", price: 25 },
      { id: "addon-5-2", name: "extra eggs", price: 15 },
      { id: "addon-5-3", name: "extra cheddar", price: 15 },
      { id: "addon-5-4", name: "extra avocado", price: 20 },
    ],
    friesUpsell: [
      { id: "fries-5-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-5-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-5-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-5-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-5-1", name: "Orange Juice", price: 35 },
          { id: "juice-5-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-5-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-5-4", name: "Orange Juice", price: 45 },
          { id: "juice-5-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-5-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-5-7", name: "Orange Juice", price: 55 },
          { id: "juice-5-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-5-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-6",
    name: "Pulled Lamb & Caramelized Onion",
    description:
      "Sourdough, spiced pulled lamb with rosemary, garlic, paprika, caramelized onion, rocket, cheddar cheese & pickled cucumber ribbons.",
    image: "/images/toasties/pulled_lamb_caramelized.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-6-1", name: "extra pulled lamb", price: 40 },
      { id: "addon-6-2", name: "extra cheddar", price: 15 },
      { id: "addon-6-3", name: "extra caramelized onion", price: 10 },
    ],
    friesUpsell: [
      { id: "fries-6-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-6-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-6-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-6-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-6-1", name: "Orange Juice", price: 35 },
          { id: "juice-6-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-6-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-6-4", name: "Orange Juice", price: 45 },
          { id: "juice-6-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-6-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-6-7", name: "Orange Juice", price: 55 },
          { id: "juice-6-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-6-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-7",
    name: "Pulled Beef and Slaw",
    description:
      "Sourdough, pulled beef, slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese.",
    image: "/images/toasties/pulled_beef_slaw.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-7-1", name: "extra pulled beef", price: 45 },
      { id: "addon-7-2", name: "extra slaw", price: 10 },
      { id: "addon-7-3", name: "extra cheddar", price: 15 },
    ],
    friesUpsell: [
      { id: "fries-7-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-7-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-7-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-7-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-7-1", name: "Orange Juice", price: 35 },
          { id: "juice-7-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-7-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-7-4", name: "Orange Juice", price: 45 },
          { id: "juice-7-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-7-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-7-7", name: "Orange Juice", price: 55 },
          { id: "juice-7-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-7-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-8",
    name: "Chicken, Cheese & Mayo",
    description:
      "Sourdough, roasted chicken, mayonnaise, dijon mustard, shredded cheddar cheese, baby spinach.",
    image: "/images/toasties/chicken_cheese_mayo.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-8-1", name: "extra chicken", price: 40 },
      { id: "addon-8-2", name: "extra cheddar", price: 15 },
      { id: "addon-8-3", name: "extra mayo", price: 5 },
    ],
    friesUpsell: [
      { id: "fries-8-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-8-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-8-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-8-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-8-1", name: "Orange Juice", price: 35 },
          { id: "juice-8-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-8-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-8-4", name: "Orange Juice", price: 45 },
          { id: "juice-8-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-8-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-8-7", name: "Orange Juice", price: 55 },
          { id: "juice-8-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-8-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-9",
    name: "Pulled Lamb and Pickle",
    description:
      "Sourdough, pulled pork with barbeque sauce, & a hint of chili, pickle slices, caramelized onion, cheddar cheese.",
    image: "/images/toasties/pulled_lamb_pickle.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-9-1", name: "extra pulled pork", price: 40 },
      { id: "addon-9-2", name: "extra cheddar", price: 15 },
      { id: "addon-9-3", name: "extra caramelized onion", price: 10 },
    ],
    friesUpsell: [
      { id: "fries-9-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-9-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-9-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-9-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-9-1", name: "Orange Juice", price: 35 },
          { id: "juice-9-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-9-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-9-4", name: "Orange Juice", price: 45 },
          { id: "juice-9-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-9-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-9-7", name: "Orange Juice", price: 55 },
          { id: "juice-9-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-9-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-10",
    name: "Beef and Onion",
    description:
      "Sourdough, thinly sliced beef, BBQ sauce, pickles, caramelized onions, rocket, cheddar cheese.",
    image: "/images/toasties/beef_onion.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-10-1", name: "extra beef", price: 45 },
      { id: "addon-10-2", name: "extra cheddar", price: 15 },
      { id: "addon-10-3", name: "extra caramelized onion", price: 10 },
    ],
    friesUpsell: [
      { id: "fries-10-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-10-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-10-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-10-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-10-1", name: "Orange Juice", price: 35 },
          { id: "juice-10-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-10-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-10-4", name: "Orange Juice", price: 45 },
          { id: "juice-10-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-10-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-10-7", name: "Orange Juice", price: 55 },
          { id: "juice-10-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-10-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
  {
    id: "toastie-11",
    name: "Spinach and Feta",
    description:
      "Sourdough, fresh baby spinach, crumbled feta cheese, pickled red onion, olives, olive oil, cheddar cheese.",
    image: "/images/toasties/spinach_feta.jpg",
    price: 148.65,
    addOns: [
      { id: "addon-11-1", name: "extra spinach", price: 10 },
      { id: "addon-11-2", name: "extra feta", price: 20 },
      { id: "addon-11-3", name: "extra cheddar", price: 15 },
    ],
    friesUpsell: [
      { id: "fries-11-1", name: "Skinny Potato Chips", price: 45 },
      { id: "fries-11-2", name: "Sweet Potato Fries", price: 59 },
      { id: "fries-11-3", name: "Garden & Grains Mayo Dip", price: 0, optional: true },
      { id: "fries-11-4", name: "Tomato Sauce", price: 0, optional: true },
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-11-1", name: "Orange Juice", price: 35 },
          { id: "juice-11-2", name: "Carrot & Ginger Juice", price: 38 },
          { id: "juice-11-3", name: "Mango Juice", price: 37 },
        ],
      },
      {
        size: "350ml",
        options: [
          { id: "juice-11-4", name: "Orange Juice", price: 45 },
          { id: "juice-11-5", name: "Carrot & Ginger Juice", price: 48 },
          { id: "juice-11-6", name: "Mango Juice", price: 47 },
        ],
      },
      {
        size: "500ml",
        options: [
          { id: "juice-11-7", name: "Orange Juice", price: 55 },
          { id: "juice-11-8", name: "Carrot & Ginger Juice", price: 58 },
          { id: "juice-11-9", name: "Mango Juice", price: 57 },
        ],
      },
    ],
  },
];
