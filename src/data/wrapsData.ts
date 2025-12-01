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

export interface WrapItem {
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

export const wraps: WrapItem[] = [
  {
    id: "wrap-1",
    slug: "mediterranean-pulled-lamb",
    name: "Mediterranean Pulled Lamb Wrap",
    description: "Tortilla wrap, juicy pulled lamb, hummus, slaw, cucumber, pickled onion, cherry tomatoes, and garlic yoghurt — drizzled with lemon-herb tahini.",
    price: 125.00,
    image: "/images/wraps/mediterranean-pulled-lamb.jpg",
    addOns: [
      { id: "addon-1-1", name: "Extra pulled lamb", price: 40.00 },
      { id: "addon-1-2", name: "Extra hummus", price: 15.00 },
      { id: "addon-1-3", name: "Extra garlic yoghurt", price: 12.00 }
    ],
    friesUpsell: [
      { id: "fries-1-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-1-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-1-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-1-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-1-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-1-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-1-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-1-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-1-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-1-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-1-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-1-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-1-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-1-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-1-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-1-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-1-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-1-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-1-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-1-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-1-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-1-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-1-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  },
  {
    id: "wrap-2",
    slug: "pulled-beef-slaw", 
    name: "Pulled Beef and Slaw Wrap",
    description: "Tortilla, pulled beef, slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese",
    price: 118.00,
    image: "/images/wraps/pulled-beef-slaw.jpg",
    addOns: [
      { id: "addon-2-1", name: "Extra pulled beef", price: 38.00 },
      { id: "addon-2-2", name: "Extra slaw", price: 15.00 },
      { id: "addon-2-3", name: "Extra cheddar cheese", price: 20.00 }
    ],
    friesUpsell: [
      { id: "fries-2-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-2-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-2-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-2-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-2-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-2-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-2-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-2-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-2-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-2-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-2-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-2-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-2-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-2-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-2-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-2-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-2-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-2-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-2-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-2-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-2-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-2-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-2-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  },
  {
    id: "wrap-3",
    slug: "beef-bbq-slaw",
    name: "Beef & Slaw Wrap",
    description: "Tortilla, beef strips with BBQ sauce, coleslaw, caramelized onions, & cheddar cheese",
    price: 115.00,
    image: "/images/wraps/beef-bbq-slaw.jpg",
    addOns: [
      { id: "addon-3-1", name: "Extra beef strips", price: 35.00 },
      { id: "addon-3-2", name: "Extra BBQ sauce", price: 8.00 },
      { id: "addon-3-3", name: "Extra cheddar cheese", price: 20.00 }
    ],
    friesUpsell: [
      { id: "fries-3-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-3-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-3-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-3-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-3-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-3-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-3-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-3-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-3-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-3-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-3-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-3-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-3-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-3-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-3-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-3-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-3-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-3-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-3-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-3-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-3-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-3-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-3-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  },
  {
    id: "wrap-4",
    slug: "high-protein-breakfast",
    name: "High Protein Breakfast Tortilla",
    description: "Scrambled eggs with spring onion, cottage cheese, avocado, baby spinach, macon, cheddar cheese",
    price: 98.00,
    image: "/images/wraps/high-protein-breakfast.jpg",
    addOns: [
      { id: "addon-4-1", name: "Extra scrambled eggs", price: 15.00 },
      { id: "addon-4-2", name: "Extra avocado", price: 18.00 },
      { id: "addon-4-3", name: "Extra macon", price: 22.00 }
    ],
    friesUpsell: [
      { id: "fries-4-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-4-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-4-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-4-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-4-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-4-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-4-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-4-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-4-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-4-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-4-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-4-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-4-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-4-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-4-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-4-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-4-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-4-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-4-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-4-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-4-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-4-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-4-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  },
  {
    id: "wrap-5",
    slug: "mediterranean-veg",
    name: "Mediterranean Veg Wrap",
    description: "Tortilla wrap, hummus, with chopped cucumbers, tomatoes, red onions, bell peppers, olives, feta cheese, & baby spinach",
    price: 95.00,
    image: "/images/wraps/mediterranean-veg.jpg",
    addOns: [
      { id: "addon-5-1", name: "Extra feta cheese", price: 18.00 },
      { id: "addon-5-2", name: "Extra hummus", price: 15.00 },
      { id: "addon-5-3", name: "Extra olives", price: 12.00 }
    ],
    friesUpsell: [
      { id: "fries-5-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-5-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-5-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-5-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-5-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-5-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-5-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-5-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-5-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-5-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-5-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-5-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-5-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-5-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-5-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-5-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-5-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-5-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-5-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-5-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-5-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-5-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-5-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  },
  {
    id: "wrap-6",
    slug: "chicken-avocado",
    name: "Chicken Avocado Wrap",
    description: "Tortilla wrap, chicken breast sliced, avocado sliced, sautéed cherry tomatoes, pickled red onions, baby spinach, & greek yoghurt",
    price: 112.00,
    image: "/images/wraps/chicken-avocado.jpg",
    addOns: [
      { id: "addon-6-1", name: "Extra chicken breast", price: 35.00 },
      { id: "addon-6-2", name: "Extra avocado", price: 18.00 },
      { id: "addon-6-3", name: "Extra greek yoghurt", price: 12.00 }
    ],
    friesUpsell: [
      { id: "fries-6-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-6-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-6-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-6-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-6-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-6-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-6-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-6-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-6-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-6-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-6-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-6-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-6-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-6-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-6-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-6-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-6-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-6-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-6-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-6-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-6-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-6-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-6-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  },
  {
    id: "wrap-7",
    slug: "crunchy-quesadilla",
    name: "Crunchy Quesadilla Wrap",
    description: "Tortilla filled with a choice of protein, melted cheese, tangy pickles, roasted peppers, caramelized onions",
    price: 108.00,
    image: "/images/wraps/crunchy-quesadilla.jpg",
    addOns: [
      { id: "addon-7-1", name: "Seasoned beef mince", price: 30.00 },
      { id: "addon-7-2", name: "Pulled chicken", price: 35.00 },
      { id: "addon-7-3", name: "Pulled beef", price: 38.00 }
    ],
    friesUpsell: [
      { id: "fries-7-1", name: "Skinny Potato Chips", price: 45.00 },
      { id: "fries-7-2", name: "Sweet Potato Fries", price: 59.00 },
      { id: "fries-7-3", name: "No Sauce", price: 0, optional: true },
      { id: "fries-7-4", name: "Garden & Grains Mayo", price: 0, optional: true },
      { id: "fries-7-5", name: "Tomato Sauce", price: 0, optional: true },
      { id: "fries-7-6", name: "Garlic Aioli", price: 5.00, optional: true },
      { id: "fries-7-7", name: "BBQ Sauce", price: 5.00, optional: true },
      { id: "fries-7-8", name: "Peri Peri Sauce", price: 5.00, optional: true }
    ],
    juiceUpsell: [
      {
        size: "250ml",
        options: [
          { id: "juice-7-1", name: "Orange Juice", price: 35.00 },
          { id: "juice-7-2", name: "Carrot & Ginger Juice", price: 38.00 },
          { id: "juice-7-3", name: "Mango Juice", price: 37.00 },
          { id: "juice-7-4", name: "Apple & Pear Juice", price: 36.00 },
          { id: "juice-7-5", name: "Green Mile Juice", price: 40.00 }
        ]
      },
      {
        size: "350ml",
        options: [
          { id: "juice-7-6", name: "Orange Juice", price: 45.00 },
          { id: "juice-7-7", name: "Carrot & Ginger Juice", price: 48.00 },
          { id: "juice-7-8", name: "Mango Juice", price: 47.00 },
          { id: "juice-7-9", name: "Apple & Pear Juice", price: 46.00 },
          { id: "juice-7-10", name: "Green Mile Juice", price: 50.00 }
        ]
      },
      {
        size: "500ml",
        options: [
          { id: "juice-7-11", name: "Orange Juice", price: 55.00 },
          { id: "juice-7-12", name: "Carrot & Ginger Juice", price: 58.00 },
          { id: "juice-7-13", name: "Mango Juice", price: 57.00 },
          { id: "juice-7-14", name: "Apple & Pear Juice", price: 56.00 },
          { id: "juice-7-15", name: "Green Mile Juice", price: 60.00 }
        ]
      }
    ]
  }
];