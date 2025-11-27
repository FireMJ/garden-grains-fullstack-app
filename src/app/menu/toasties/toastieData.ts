export const toasties = [
  {
    id: "pressed-beef-cheese",
    name: "Pressed Beef and Cheese",
    description: "Sourdough, ham slices, gouda cheese, dijon mustard, sliced tomatoes, mayonnaise",
    image: "/images/toasties/pressed-beef-cheese.jpg",
    price: 118,
    addOns: [
      { id: "extra-cheese", name: "Extra Cheese", price: 15 },
      { id: "avocado", name: "Avocado", price: 18 },
      { id: "bacon", name: "Extra Bacon", price: 20 },
      { id: "caramelized-onions", name: "Caramelized Onions", price: 12 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "truffle-fries", name: "Truffle Fries", price: 55, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "green-detox", name: "Green Detox Juice (500ml)", price: 55 }
    ]
  },
  {
    id: "chicken-cheese-mayo",
    name: "Chicken, Cheese & Mayo",
    description: "Sourdough, roasted chicken, mayonnaise, dijon mustard, shredded cheddar cheese, baby spinach",
    image: "/images/toasties/chicken-cheese-mayo.jpg",
    price: 128,
    addOns: [
      { id: "avocado", name: "Avocado", price: 18 },
      { id: "bacon", name: "Bacon", price: 20 },
      { id: "caramelized-onions", name: "Caramelized Onions", price: 12 },
      { id: "jalapenos", name: "Jalapeños", price: 10 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "truffle-fries", name: "Truffle Fries", price: 55, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "carrot-ginger", name: "Carrot Ginger Juice (500ml)", price: 48 }
    ]
  },
  {
    id: "tomato-basil-mozzarella",
    name: "Tomato, Basil & Mozzarella",
    description: "Sourdough, mozzarella cheese, tomato slices, fresh basil leaves, balsamic glaze, olive oil",
    image: "/images/toasties/tomato-basil-mozzarella.jpg",
    price: 125,
    addOns: [
      { id: "avocado", name: "Avocado", price: 18 },
      { id: "pesto", name: "Extra Pesto", price: 12 },
      { id: "roasted-peppers", name: "Roasted Peppers", price: 15 },
      { id: "olives", name: "Kalamata Olives", price: 10 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "truffle-fries", name: "Truffle Fries", price: 55, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "watermelon-cooler", name: "Watermelon Cooler (500ml)", price: 46 }
    ]
  },
  {
    id: "mushroom-mozzarella",
    name: "Mushroom and Mozzarella",
    description: "Sourdough, sautéed mushrooms, mozzarella cheese, caramelised onions, fresh thyme, butter grilled cherry tomatoes",
    image: "/images/toasties/mushroom-mozzarella.jpg",
    price: 125,
    addOns: [
      { id: "truffle-oil", name: "Truffle Oil", price: 15 },
      { id: "goats-cheese", name: "Goat's Cheese", price: 20 },
      { id: "spinach", name: "Fresh Spinach", price: 10 },
      { id: "balsamic-glaze", name: "Balsamic Glaze", price: 8 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "truffle-fries", name: "Truffle Fries", price: 55, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "beetroot-boost", name: "Beetroot Boost (500ml)", price: 53 }
    ]
  },
  {
    id: "chicken-pesto",
    name: "Chicken and Pesto",
    description: "Sourdough, grilled chicken breast slices, pesto, sun-dried tomatoes, cheddar cheese, arugula",
    image: "/images/toasties/chicken-pesto.jpg",
    price: 128,
    addOns: [
      { id: "avocado", name: "Avocado", price: 18 },
      { id: "mozzarella", name: "Fresh Mozzarella", price: 15 },
      { id: "roasted-peppers", name: "Roasted Peppers", price: 15 },
      { id: "pine-nuts", name: "Toasted Pine Nuts", price: 12 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "truffle-fries", name: "Truffle Fries", price: 55, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "tropical-sunrise", name: "Tropical Sunrise (500ml)", price: 50 }
    ]
  },
  {
    id: "macon-egg-cheese",
    name: "Macon, Egg, and Cheese",
    description: "Sourdough, crispy bacon, two fried eggs, cheddar cheese, sliced tomato, avocado",
    image: "/images/toasties/macon-egg-cheese.jpg",
    price: 129,
    weight: "410g",
    addOns: [
      { id: "extra-egg", name: "Extra Egg", price: 12 },
      { id: "extra-bacon", name: "Extra Bacon", price: 20 },
      { id: "caramelized-onions", name: "Caramelized Onions", price: 12 },
      { id: "hash-brown", name: "Hash Brown", price: 15 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "breakfast-potatoes", name: "Breakfast Potatoes", price: 40, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "berry-blast", name: "Berry Blast Smoothie (500ml)", price: 52 }
    ]
  },
  {
    id: "pulled-lamb-onion",
    name: "Pulled Lamb & Caramelized Onion",
    description: "Sourdough, spiced pulled lamb with rosemary, garlic, paprika, caramelized onion, rocket, cheddar cheese & pickled cucumber ribbons",
    image: "/images/toasties/pulled-lamb-onion.jpg",
    price: 135,
    addOns: [
      { id: "feta-cheese", name: "Feta Cheese", price: 15 },
      { id: "tzatziki", name: "Tzatziki Sauce", price: 12 },
      { id: "mint-sauce", name: "Mint Sauce", price: 10 },
      { id: "roasted-peppers", name: "Roasted Peppers", price: 15 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "garlic-fries", name: "Garlic Fries", price: 50, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "carrot-ginger", name: "Carrot Ginger Juice (500ml)", price: 48 }
    ]
  },
  {
    id: "pulled-beef-slaw",
    name: "Pulled Beef and Slaw",
    description: "Sourdough, pulled beef, slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese",
    image: "/images/toasties/pulled-beef-slaw.jpg",
    price: 128,
    addOns: [
      { id: "avocado", name: "Avocado", price: 18 },
      { id: "pickles", name: "Extra Pickles", price: 8 },
      { id: "bbq-sauce", name: "BBQ Sauce", price: 8 },
      { id: "jalapenos", name: "Jalapeños", price: 10 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "onion-rings", name: "Onion Rings", price: 45, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "beetroot-boost", name: "Beetroot Boost (500ml)", price: 53 }
    ]
  },
  {
    id: "beef-onion",
    name: "Beef and Onion",
    description: "Sourdough, thinly sliced beef, bbq sauce, pickles, caramelized onions, rocket, cheddar cheese",
    image: "/images/toasties/beef-onion.jpg",
    price: 132,
    addOns: [
      { id: "bacon", name: "Bacon", price: 20 },
      { id: "mushrooms", name: "Sautéed Mushrooms", price: 15 },
      { id: "blue-cheese", name: "Blue Cheese", price: 18 },
      { id: "fried-onions", name: "Crispy Fried Onions", price: 12 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "cheese-fries", name: "Cheese Fries", price: 55, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "green-detox", name: "Green Detox Juice (500ml)", price: 55 }
    ]
  },
  {
    id: "spinach-feta",
    name: "Spinach and Feta",
    description: "Sourdough, fresh baby spinach, crumbled feta cheese, pickled red onion, olives, olive oil, cheddar cheese",
    image: "/images/toasties/spinach-feta.jpg",
    price: 126,
    addOns: [
      { id: "sun-dried-tomatoes", name: "Sun-dried Tomatoes", price: 15 },
      { id: "artichokes", name: "Artichoke Hearts", price: 18 },
      { id: "pine-nuts", name: "Toasted Pine Nuts", price: 12 },
      { id: "roasted-garlic", name: "Roasted Garlic", price: 10 }
    ],
    friesUpsell: [
      { id: "regular-fries", name: "Regular Fries", price: 35 },
      { id: "sweet-potato-fries", name: "Sweet Potato Fries", price: 45 },
      { id: "herb-fries", name: "Herb-infused Fries", price: 48, optional: true },
      { id: "no-fries", name: "No Fries", price: 0, optional: true }
    ],
    juiceUpsell: [
      { id: "orange-juice", name: "Orange Juice (500ml)", price: 45 },
      { id: "apple-juice", name: "Apple Juice (500ml)", price: 42 },
      { id: "watermelon-cooler", name: "Watermelon Cooler (500ml)", price: 46 }
    ]
  }
];
