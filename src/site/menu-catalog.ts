export interface MenuPriceVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price?: number;
  variants?: MenuPriceVariant[];
}

export interface MenuCategory {
  id: string;
  label: string;
  description: string;
  media: string;
  items: MenuItem[];
}

export interface OrderSelection {
  itemId: string;
  quantity: number;
}

export const menuCatalog = [
  {
    "id": "breakfast",
    "label": "Breakfast",
    "description": "Slow mornings, bright plates, and substantial starts.",
    "media": "/media/garden-grains/vineyard-table.jpeg",
    "items": [
      {
        "id": "breakfast-breakfast-1",
        "name": "Avo 'n Toast",
        "description": "Poached egg, smashed avocado, toasted sourdough.",
        "price": 99
      },
      {
        "id": "breakfast-breakfast-2",
        "name": "Egg Benedict",
        "description": "Arugula, bacon, two poached eggs, hollandaise sauce, toasted sourdough.",
        "price": 139
      },
      {
        "id": "breakfast-breakfast-3",
        "name": "Florentine",
        "description": "Sautéed spinach, two poached eggs, toasted sourdough.",
        "price": 119
      },
      {
        "id": "breakfast-breakfast-4",
        "name": "Wine Maker's Breakfast",
        "description": "Two scrambled eggs, mushrooms, grilled cherry tomatoes, toasted sourdough.",
        "price": 149
      },
      {
        "id": "breakfast-breakfast-5",
        "name": "Harvest Bowl",
        "description": "Chia seeds, Greek yoghurt, honey, fresh berries, banana, and seeds (flaxseeds, pumpkin & sunflower), cinnamon.",
        "price": 137
      },
      {
        "id": "breakfast-breakfast-6",
        "name": "Nutritious Breakfast Bowl",
        "description": "Peanut butter quinoa, chia seeds, Greek yogurt, fresh berries, banana, apple, flaxseeds, almond flakes, peanuts, roasted sunflower seeds, unsweetened coconut flakes, honey, cinnamon.",
        "price": 145
      },
      {
        "id": "breakfast-breakfast-7",
        "name": "High Protein Breakfast",
        "description": "Tortilla, scrambled eggs with spring onion, cottage cheese, avocado, baby spinach, bacon, cheddar cheese.",
        "price": 130
      }
    ]
  },
  {
    "id": "bowls",
    "label": "Signature Bowls",
    "description": "Layered, generous bowls built around grains, greens, and thoughtful dressings.",
    "media": "/media/garden-grains/bowls-spread.jpeg",
    "items": [
      {
        "id": "bowls-chipotle1",
        "name": "Smoky Chipotle Chicken Bowl",
        "description": "Grilled chipotle-marinated chicken strips with corn, black beans, grilled peppers & red onion. Topped with avocado slices, tomato salsa, shredded lettuce, cheddar cheese. Served with your choice of dressing, lime wedge and sesame seeds.",
        "price": 163
      },
      {
        "id": "bowls-chipotle2",
        "name": "Beef Glow Bowl",
        "description": "Pan-fried spicy beef with roasted sweet potato cubes, red cabbage, cucumber. Topped with corn salsa, guacamole, grated carrot. Served with your choice of dressing, fresh coriander and sesame seeds.",
        "price": 163
      },
      {
        "id": "bowls-chipotle3",
        "name": "Fiery Chickpea Bowl (V)",
        "description": "Spicy roasted chickpeas with baby spinach, tomatoes, cucumber, grilled zucchini, black beans. Topped with avocado, hummus. Served with your choice of dressing and sesame seeds. A vegetarian delight with a kick!",
        "price": 140
      },
      {
        "id": "bowls-poke1",
        "name": "Boiled Egg & Tofu Power Bowl",
        "description": "Soft-boiled egg halves and cubed marinated tofu with cherry tomatoes, radish, baby spinach, carrots. Topped with avocado, pickled onion. Served with your choice of dressing, sesame seeds and chili flakes.",
        "price": 148
      },
      {
        "id": "bowls-poke2",
        "name": "Grilled Chicken Poke Bowl",
        "description": "Teriyaki-glazed grilled chicken strips with cucumber, corn, avocado, edamame, slaw. Topped with pineapple salsa, chopped chives. Served with your choice of dressing and sesame seeds.",
        "price": 163
      }
    ]
  },
  {
    "id": "chicken",
    "label": "Grilled Chicken",
    "description": "Pan-grilled chicken with bright vegetables and your choice of basting.",
    "media": "/media/garden-grains/chicken-broccoli.jpeg",
    "items": [
      {
        "id": "chicken-chicken-1",
        "name": "Grilled Chicken Strips & Fries",
        "description": "300g pan-grilled chicken fillet strips served with a generous heap of fries. Choose your basting for the perfect flavor!",
        "price": 139
      },
      {
        "id": "chicken-chicken-2",
        "name": "Vitality Chic-Broco Bowl",
        "description": "Pan-grilled chicken fillet strips with your choice of basting, served with steamed broccoli and your choice of dressing. A healthy and nutritious meal!",
        "price": 145
      }
    ]
  },
  {
    "id": "fries",
    "label": "Fries",
    "description": "Crisp sides for sharing, dipping, or keeping to yourself.",
    "media": "/media/garden-grains/toastie.jpeg",
    "items": [
      {
        "id": "fries-fries-1",
        "name": "Skinny French Fries",
        "description": "Crispy, golden skinny fries made from premium potatoes. Perfectly salted and served hot.",
        "price": 39
      },
      {
        "id": "fries-fries-2",
        "name": "Sweet Potato Fries",
        "description": "Crispy sweet potato fries with a hint of sea salt. A healthier, delicious alternative.",
        "price": 45
      },
      {
        "id": "fries-fries-3",
        "name": "Curly Fries",
        "description": "Fun, curly-cut fries seasoned with special spices. Crispy outside, tender inside.",
        "price": 42
      },
      {
        "id": "fries-fries-4",
        "name": "Cheddar Bacon Fries",
        "description": "Loaded fries topped with melted cheddar cheese, crispy bacon bits, and green onions.",
        "price": 59
      }
    ]
  },
  {
    "id": "juices",
    "label": "Fresh Juices",
    "description": "Cold-pressed fruit, vegetables, roots, and herbs made fresh.",
    "media": "/media/garden-grains/prawn-plate-rose.jpeg",
    "items": [
      {
        "id": "juices-co",
        "name": "CO.",
        "description": "Carrots, oranges, lemon, ginger & turmeric — revitalise your day!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-the-green-mile",
        "name": "The Green Mile",
        "description": "Apple, pear, cucumber, spinach, celery, lemon & ginger — for health conscious customers.",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-ginger-shot",
        "name": "Ginger Shot (50ml)",
        "description": "Our ginger shot is a fiery fusion of fresh ginger & a slight hint of lemon — your daily dose of bold, natural energy.",
        "variants": [
          {
            "label": "50ml · 50ml",
            "price": 60
          }
        ]
      },
      {
        "id": "juices-fruit-punch",
        "name": "Fruit Punch",
        "description": "A vibrant blend of the season's freshest fruits and veggies.",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-up-beet-juice",
        "name": "Up Beet Juice",
        "description": "Beetroot, carrot, lemon, apple and ginger — popular among health enthusiasts.",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-apple-lemon",
        "name": "Apple & Lemon Juice",
        "description": "Granny Smith apples, lemon & celery — a classic, always in demand ;)",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-glow",
        "name": "GLOW",
        "description": "Naartjies, fresh lemon, orange, turmeric and ginger — nature's perfect power blend!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-apple-pear",
        "name": "Apple & Pear Juice",
        "description": "Apples, pears, lemon and ginger — known for its health benefits and vibrant colour.",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-oj",
        "name": "OJ",
        "description": "Classic orange juice — always in demand.",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 59
          },
          {
            "label": "Medium · 350ml",
            "price": 73
          },
          {
            "label": "Large · 500ml",
            "price": 89
          }
        ]
      },
      {
        "id": "juices-immunity-elixir",
        "name": "Immunity Boost Elixir",
        "description": "Orange, fresh lemon, ginger, turmeric root, green apple, carrot, garlic, celery, pinch of cayenne, honey & coconut water — a full-spectrum immunity blend.",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 75
          },
          {
            "label": "Medium · 350ml",
            "price": 85
          },
          {
            "label": "Large · 500ml",
            "price": 95
          }
        ]
      }
    ]
  },
  {
    "id": "pastas",
    "label": "Fresh Pastas",
    "description": "Comforting bowls of pasta with vegetables, herbs, and generous sauces.",
    "media": "/media/garden-grains/couscous-salad.jpeg",
    "items": [
      {
        "id": "pastas-pasta-1",
        "name": "Garlic Beef Pasta",
        "description": "Penne pasta, sliced beef, zucchini, button mushrooms, red onions, bell peppers, feta cheese, garlic creamy sauce, topped with parmesan cheese",
        "price": 165
      },
      {
        "id": "pastas-pasta-2",
        "name": "Chicken & Spinach Pasta",
        "description": "Penne pasta, chicken breast, garlic, spinach purée, button mushroom, red onions, bell pepper, cheddar cheese, topped with parmesan",
        "price": 150
      },
      {
        "id": "pastas-pasta-3",
        "name": "Veggie Penne",
        "description": "Penne pasta, sun-dried tomatoes, garlic, spinach purée, button mushroom, red onions, bell pepper, cheddar cheese, topped with parmesan",
        "price": 135
      },
      {
        "id": "pastas-pasta-4",
        "name": "Basilico Pasta",
        "description": "Linguine pasta, zucchini, garlic, button mushroom, red onions, bell pepper, sweet tomato, fresh basil & garlic passata, topped with parmesan",
        "price": 145
      }
    ]
  },
  {
    "id": "salads",
    "label": "Fresh Salads",
    "description": "Crisp, colourful combinations made for the Cape sunshine.",
    "media": "/media/garden-grains/couscous-salad.jpeg",
    "items": [
      {
        "id": "salads-salad-1",
        "name": "Couscous Salad (V)",
        "description": "Couscous, roasted butternut, thinly sliced onion, chickpeas, cherry tomatoes, smoked paprika, cinnamon, garlic, feta cheese, topped with roasted pumpkin seeds and sesame seeds",
        "price": 135
      },
      {
        "id": "salads-salad-2",
        "name": "Free Range Chicken Salad",
        "description": "Mixed greens, grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, grated mozzarella cheese, topped with sesame seeds",
        "price": 153
      },
      {
        "id": "salads-salad-3",
        "name": "Pesto Glow Salad (V)",
        "description": "Baby spinach, arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas, sunflower seeds, house-made basil pesto, with a touch of lemon and sesame seeds",
        "price": 150
      },
      {
        "id": "salads-salad-4",
        "name": "Greek Salad",
        "description": "Lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, feta cheese, topped with sesame seeds",
        "price": 125
      },
      {
        "id": "salads-salad-5",
        "name": "Protein Pack Salad",
        "description": "Mixed greens, cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas, topped with sesame seeds",
        "price": 155
      },
      {
        "id": "salads-salad-6",
        "name": "Quinoa Feta Salad",
        "description": "Quinoa, cucumber, corn kernels, red onion, olives, feta cheese, radishes, chickpeas, roasted peppers, topped with sesame seeds",
        "price": 140
      },
      {
        "id": "salads-salad-7",
        "name": "Avocado Stack",
        "description": "Avocado diced, cherry tomatoes, cucumber, red onion thinly sliced, bell peppers, fresh cilantro, sweet corn kernels, sprinkle of sesame seeds",
        "price": 135
      }
    ]
  },
  {
    "id": "smoothies",
    "label": "Smoothies",
    "description": "Fruit-forward blends with nourishing additions.",
    "media": "/media/garden-grains/rose-garden-mountain.jpeg",
    "items": [
      {
        "id": "smoothies-smoothie-1",
        "name": "Berry Bloom",
        "description": "mixed berries, greek yoghurt, almonds & honey. A burst of berry goodness in every sip!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      },
      {
        "id": "smoothies-smoothie-2",
        "name": "The Hulk",
        "description": "peanut butter, vanilla whey protein, almonds, chia seeds, cinnamon, banana, honey & greek yoghurt. A filling breakfast in a glass!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      },
      {
        "id": "smoothies-smoothie-3",
        "name": "Sunshine",
        "description": "mango, pineapple, passion fruit & orange juice. A tropical ray of sunshine!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      },
      {
        "id": "smoothies-smoothie-4",
        "name": "Green Goddess",
        "description": "kiwi, pineapple, banana, apple juice & mint. Your daily dose of greens!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      },
      {
        "id": "smoothies-smoothie-5",
        "name": "Charlie Brown",
        "description": "peanut butter, blue berries, vanilla whey protein, dates & banana. A nutty, berrylicious delight!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      },
      {
        "id": "smoothies-smoothie-6",
        "name": "Choco & Banana",
        "description": "peanut butter, greek yoghurt, dark chocolate, cocoa powder & banana. Decadent yet nutritious!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      },
      {
        "id": "smoothies-smoothie-7",
        "name": "The Golden Girl",
        "description": "ginger, pineapple, carrot, banana, lemon, honey, chia seeds & tumeric. Golden and glorious!",
        "variants": [
          {
            "label": "Small · 250ml",
            "price": 65
          },
          {
            "label": "Medium · 350ml",
            "price": 80
          },
          {
            "label": "Large · 500ml",
            "price": 93
          }
        ]
      }
    ]
  },
  {
    "id": "soups",
    "label": "Hearty Soups",
    "description": "Seasonal, warming bowls served with Garden & Grains care.",
    "media": "/media/garden-grains/vineyard-table.jpeg",
    "items": [
      {
        "id": "soups-soup-1",
        "name": "Creamy Broccoli Soup",
        "description": "fresh broccoli florets, onion, potato, garlic, stock, cream, cheddar cheese, wholegrain mustard. topped with blue cheese, fresh cream & olive oil.",
        "price": 125
      },
      {
        "id": "soups-soup-2",
        "name": "Creamy Butternut Soup",
        "description": "Roasted butternut, onion, garlic, carrot, apple, vegetable stock, cinnamon, nutmeg, smoked paprika, topped with parmesan, fresh cream & roasted pumpkin seeds.",
        "price": 120
      },
      {
        "id": "soups-soup-3",
        "name": "Pea & Bacon Soup",
        "description": "Peas, chopped bacon, garlic, chicken stock, topped with fresh cream & parmesan cheese.",
        "price": 129
      },
      {
        "id": "soups-soup-4",
        "name": "Spiced Sweet Potato Soup",
        "description": "Roasted sweet potatoes, carrot, onion, garlic, ginger, orange juice, vegetable broth, ground coriander, ground cumin, smoked paprika, coconut milk, cinnamon.",
        "price": 125
      }
    ]
  },
  {
    "id": "stirfries",
    "label": "Stir Fries",
    "description": "Fast, fragrant, wok-tossed plates with plenty of crunch.",
    "media": "/media/garden-grains/chicken-broccoli.jpeg",
    "items": [
      {
        "id": "stirfries-stirfry-1",
        "name": "Chicken & Veg Stir-fry",
        "description": "Chicken breast, broccoli, carrots, bell peppers, green onions, low sodium soy sauce, honey, sesame oil, ginger, garlic, cornstarch, sprinkle of sesame seeds",
        "price": 145
      },
      {
        "id": "stirfries-stirfry-2",
        "name": "Beef & Veg Stir-fry",
        "description": "Tender beef strips, broccoli, carrots, bell peppers, green onions, low sodium soy sauce, honey, sesame oil, ginger, garlic, cornstarch, sprinkle of sesame seeds",
        "price": 159
      },
      {
        "id": "stirfries-stirfry-3",
        "name": "Veg Stir-fry",
        "description": "Egg noodles, tofu, broccoli, carrots, bell peppers, green onions, low sodium soy sauce, honey, sesame oil, ginger, garlic, cornstarch, sprinkle of sesame seeds",
        "price": 143
      }
    ]
  },
  {
    "id": "toasties",
    "label": "Toasties",
    "description": "Golden sourdough, melted fillings, and crisp edges.",
    "media": "/media/garden-grains/toastie.jpeg",
    "items": [
      {
        "id": "toasties-toastie-1",
        "name": "Bacon, Egg & Cheese",
        "description": "Sourdough, crispy bacon rashers, two sunny side eggs, cheddar cheese, sliced tomato, avocado",
        "price": 129
      },
      {
        "id": "toasties-toastie-2",
        "name": "Beef & Onion",
        "description": "Sourdough, sliced beef, bba sauce, pickles, caramelised onions, arugula, cheddar cheese",
        "price": 132
      },
      {
        "id": "toasties-toastie-3",
        "name": "Chicken & Pesto",
        "description": "Sourdough, grilled chicken breast, house-made pesto, sun-dried tomato, cheddar cheese, arugula",
        "price": 128
      },
      {
        "id": "toasties-toastie-4",
        "name": "Chicken, Cheese & Mayo",
        "description": "Sourdough, grilled chicken breast, cheddar cheese, mayonnaise, lettuce, tomato",
        "price": 128
      },
      {
        "id": "toasties-toastie-5",
        "name": "Pulled Beef & Slaw",
        "description": "Sourdough, pulled beef, house-made slaw (cabbage, onions, carrots, raisins, apple, mayo), cheddar cheese",
        "price": 135
      },
      {
        "id": "toasties-toastie-6",
        "name": "Pulled Lamb & Caramelised Onion",
        "description": "Sourdough, spiced pulled lamb, garlic, caramelised onion, arugula, cheddar cheese & pickled cucumber ribbons",
        "price": 139
      },
      {
        "id": "toasties-toastie-7",
        "name": "Pulled Pork",
        "description": "Sourdough, spiced bbq pulled pork, caramelised onions, cheddar cheese & chillies",
        "price": 133
      },
      {
        "id": "toasties-toastie-8",
        "name": "Spinach & Feta",
        "description": "Sourdough, baby spinach, crumbled feta cheese, pickled red onion, olives, olive oil, cheddar cheese",
        "price": 126
      }
    ]
  },
  {
    "id": "wraps",
    "label": "Wraps & Quesadillas",
    "description": "Fresh, satisfying fillings wrapped and pressed to order.",
    "media": "/media/garden-grains/bowls-spread.jpeg",
    "items": [
      {
        "id": "wraps-wrap-1",
        "name": "Chicken Avocado Wrap",
        "description": "Tortilla, sliced chicken breast, avocado, sautéed cherry tomatoes, pickled red onions, baby spinach & Greek yoghurt",
        "price": 135
      },
      {
        "id": "wraps-wrap-2",
        "name": "Pulled Beef & Slaw",
        "description": "Tortilla, pulled beef, house-made slaw (cabbage, onions, carrots, raisins, apple, mayo), caramelised onions & cheddar cheese",
        "price": 145
      },
      {
        "id": "wraps-wrap-3",
        "name": "Mediterranean Veg (V)",
        "description": "Tortilla, hummus, cucumber, tomatoes, red onions, bell peppers, olives, feta cheese & baby spinach",
        "price": 130
      },
      {
        "id": "wraps-wrap-4",
        "name": "The Nomad",
        "description": "Tortilla, pulled lamb, house-made slaw (cabbage, onions, carrots, raisins, apple, garlic yoghurt), pickled red onions, cherry tomatoes & tahini",
        "price": 148
      },
      {
        "id": "wraps-wrap-5",
        "name": "Crunchy Quesadilla",
        "description": "Tortilla filled with your choice of protein or veg, cheddar cheese, tangy pickles, roasted peppers, caramelised onions",
        "price": 139
      }
    ]
  }
] satisfies MenuCategory[];

export const flatMenuItems = menuCatalog.flatMap((category) =>
  category.items.map((item) => ({ ...item, categoryId: category.id, categoryLabel: category.label })),
);

export const getMenuItem = (itemId: string) => flatMenuItems.find((item) => item.id === itemId);

export const formatMenuPrice = (item: MenuItem) => {
  if (item.variants?.length) {
    return item.variants.map((variant) => `${variant.label} R${variant.price}`).join("  /  ");
  }

  return typeof item.price === "number" ? `R${item.price}` : "Ask us";
};
