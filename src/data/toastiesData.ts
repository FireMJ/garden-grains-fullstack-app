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

export interface FriesOption {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
}

export interface ToastieItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns: AddOn[];
  friesUpsell: FriesOption[];
  juiceUpsell: JuiceGroup[];
}

export const toasties: ToastieItem[] = [
  {
    id: "toastie-1",
    slug: "pressed-beef-and-cheese",
    name: "Pressed Beef and Cheese",
    description: "Sourdough, ham slices, gouda cheese, dijon mustard, sliced tomatoes, mayonnaise",
    price: 118.00,
    image: "/images/toasties/pressed_beef_cheese.jpg",
    addOns: [
      { id: "addon-1-1", name: "Extra ham slices", price: 25.00 },
      { id: "addon-1-2", name: "Extra gouda cheese", price: 20.00 },
      { id: "addon-1-3", name: "Extra tomatoes", price: 10.00 }
    ],
    friesUpsell: [
      { id: "fries-1-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-1-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-1-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-1-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-1-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-1-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-1-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-1-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-1-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-1-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-1-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-1-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-1-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-1-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-2",
    slug: "chicken-cheese-mayo",
    name: "Chicken, Cheese & Mayo",
    description: "Sourdough, roasted chicken, mayonnaise, dijon mustard, shredded cheddar cheese, baby spinach",
    price: 128.00,
    image: "/images/toasties/chicken_cheese_mayo.jpg",
    addOns: [
      { id: "addon-2-1", name: "Extra chicken", price: 35.00 },
      { id: "addon-2-2", name: "Extra cheddar cheese", price: 20.00 },
      { id: "addon-2-3", name: "Extra spinach", price: 8.00 }
    ],
    friesUpsell: [
      { id: "fries-2-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-2-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-2-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-2-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-2-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-2-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-2-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-2-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-2-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-2-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-2-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-2-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-2-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-2-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-3",
    slug: "tomato-basil-mozzarella",
    name: "Tomato, Basil & Mozzarella",
    description: "Sourdough, mozzarella cheese, tomato slices, fresh basil leaves, balsamic glaze, olive oil",
    price: 125.00,
    image: "/images/toasties/tomato_basil_mozzarella.jpg",
    addOns: [
      { id: "addon-3-1", name: "Extra mozzarella", price: 20.00 },
      { id: "addon-3-2", name: "Extra tomatoes", price: 10.00 },
      { id: "addon-3-3", name: "Extra basil", price: 8.00 }
    ],
    friesUpsell: [
      { id: "fries-3-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-3-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-3-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-3-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-3-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-3-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-3-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-3-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-3-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-3-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-3-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-3-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-3-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-3-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-4",
    slug: "mushroom-and-mozzarella",
    name: "Mushroom and Mozzarella",
    description: "Sourdough, sautéed mushrooms, mozzarella cheese, caramelised onions, fresh thyme, butter grilled cherry tomatoes",
    price: 125.00,
    image: "/images/toasties/mushroom_mozzarella.jpg",
    addOns: [
      { id: "addon-4-1", name: "Extra mushrooms", price: 18.00 },
      { id: "addon-4-2", name: "Extra mozzarella", price: 20.00 },
      { id: "addon-4-3", name: "Extra caramelized onions", price: 12.00 }
    ],
    friesUpsell: [
      { id: "fries-4-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-4-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-4-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-4-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-4-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-4-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-4-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-4-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-4-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-4-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-4-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-4-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-4-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-4-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-5",
    slug: "chicken-and-pesto",
    name: "Chicken and Pesto",
    description: "Sourdough, grilled chicken breast slices, pesto, sun-dried tomatoes, cheddar cheese, arugula",
    price: 128.00,
    image: "/images/toasties/chicken_pesto.jpg",
    addOns: [
      { id: "addon-5-1", name: "Extra chicken", price: 35.00 },
      { id: "addon-5-2", name: "Extra pesto", price: 12.00 },
      { id: "addon-5-3", name: "Extra sun-dried tomatoes", price: 15.00 }
    ],
    friesUpsell: [
      { id: "fries-5-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-5-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-5-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-5-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-5-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-5-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-5-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-5-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-5-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-5-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-5-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-5-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-5-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-5-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-6",
    slug: "macon-egg-and-cheese",
    name: "Macon, Egg, and Cheese",
    description: "Sourdough, crispy bacon, two fried eggs, cheddar cheese, sliced tomato, avocado",
    price: 129.00,
    image: "/images/toasties/macon_egg_cheese.jpg",
    addOns: [
      { id: "addon-6-1", name: "Extra bacon", price: 22.00 },
      { id: "addon-6-2", name: "Extra egg", price: 12.00 },
      { id: "addon-6-3", name: "Extra avocado", price: 18.00 }
    ],
    friesUpsell: [
      { id: "fries-6-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-6-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-6-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-6-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-6-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-6-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-6-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-6-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-6-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-6-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-6-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-6-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-6-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-6-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-7",
    slug: "pulled-lamb-caramelized-onion",
    name: "Pulled Lamb & Caramelized Onion",
    description: "Sourdough, spiced pulled lamb with rosemary, garlic, paprika, caramelized onion, rocket, cheddar cheese & pickled cucumber ribbons",
    price: 135.00,
    image: "/images/toasties/pulled_lamb_caramelized.jpg",
    addOns: [
      { id: "addon-7-1", name: "Extra pulled lamb", price: 40.00 },
      { id: "addon-7-2", name: "Extra cheddar cheese", price: 20.00 },
      { id: "addon-7-3", name: "Extra caramelized onion", price: 12.00 }
    ],
    friesUpsell: [
      { id: "fries-7-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-7-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-7-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-7-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-7-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-7-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-7-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-7-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-7-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-7-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-7-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-7-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-7-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-7-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  },
  {
    id: "toastie-8",
    slug: "pulled-beef-and-slaw",
    name: "Pulled Beef and Slaw",
    description: "Sourdough, pulled beef, slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese",
    price: 128.00,
    image: "/images/toasties/pulled_beef_slaw.jpg",
    addOns: [
      { id: "addon-8-1", name: "Extra pulled beef", price: 38.00 },
      { id: "addon-8-2", name: "Extra slaw", price: 15.00 },
      { id: "addon-8-3", name: "Extra cheddar cheese", price: 20.00 }
    ],
    friesUpsell: [
      { id: "fries-8-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-8-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-8-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-8-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-8-5", name: "Tomato Sauce", price: 0, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-8-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-8-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-8-3", name: "Mango Juice", price: 37.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-8-4", name: "Orange Juice", price: 45.00 },
          { id: "juice-8-5", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-8-6", name: "Mango Juice", price: 47.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-8-7", name: "Orange Juice", price: 55.00 },
          { id: "juice-8-8", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-8-9", name: "Mango Juice", price: 57.00 }
        ]
      }
    ]
  }
];