export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  tags: string[];
  category: string;
  addOns?: { name: string; price: string }[];
}

export const menuItems: MenuItem[] = [
  {
    id: "salad-1",
    name: "Millet Salad",
    description: "Millet, tomatoes, cucumber, olives, crumbled feta, chopped fresh parsley, fresh mint, & a sprinkle of sesame seeds",
    price: "98",
    tags: ["V"],
    category: "salads",
    addOns: [
      { name: "Chicken", price: "50" },
      { name: "Beef", price: "55" },
      { name: "Avocado", price: "20" },
      { name: "Poached Egg", price: "15" }
    ]
  },
  {
    id: "salad-2",
    name: "Tabbouleh Salad",
    description: "Bulgar wheat, tomatoes, cucumber, scallions, chopped parsley & mint, with a sprinkle of sesame seeds",
    price: "98",
    tags: ["V"],
    category: "salads",
    addOns: [
      { name: "Chicken", price: "50" },
      { name: "Beef", price: "55" },
      { name: "Avocado", price: "20" },
      { name: "Poached Egg", price: "15" }
    ]
  },
  {
    id: "salad-3",
    name: "4 Bean Salad",
    description: "Fresh green beans, kidney beans, garbanzo beans, black beans, arugula, bell peppers, cucumber, red onion, fresh parsley, fresh oregano, sprinkle of sesame seeds",
    price: "115",
    tags: ["V"],
    category: "salads",
    addOns: [
      { name: "Beef", price: "55" },
      { name: "Avocado", price: "20" }
    ]
  },
  {
    id: "salad-4",
    name: "Free Range Chicken Salad",
    description: "Mixed greens, seasoned grilled chicken, avocado slices, black beans, corn kernels, diced tomatoes, grated mozzarella cheese, sprinkle of sesame seeds",
    price: "125",
    tags: [],
    category: "salads"
  },
  {
    id: "salad-5",
    name: "Protein Pack Salad",
    description: "Mixed greens, diced cucumber, corn kernels, grilled chicken, hard-boiled egg, avocado slices, cherry tomatoes, chickpeas, with a sprinkle of sesame seeds",
    price: "125",
    tags: ["Popular"],
    category: "salads"
  },
  {
    id: "salad-6",
    name: "Quinoa Feta Salad",
    description: "Cooked quinoa, diced cucumber, cherry tomatoes, red onion, olives, feta cheese, pickled radishes, chickpeas, and roasted peppers, with a sprinkle of sesame seeds",
    price: "122",
    tags: [],
    category: "salads",
    addOns: [
      { name: "Chicken", price: "50" },
      { name: "Beef", price: "55" },
      { name: "Poached Egg", price: "15" }
    ]
  },
  {
    id: "salad-7",
    name: "Protein Avocado Stack",
    description: "Avocado diced, cherry tomatoes, cucumber, red onion thinly sliced, bell peppers, fresh cilantro, sweet corn kernels, with a sprinkle of sesame seeds",
    price: "115",
    tags: ["V"],
    category: "salads",
    addOns: [
      { name: "Chicken", price: "50" },
      { name: "Beef", price: "55" }
    ]
  },
  {
    id: "salad-8",
    name: "Pesto Glow Salad",
    description: "Baby spinach & arugula, cherry tomatoes, cucumber, zucchini, red onion, quinoa, avocado, chickpeas & sunflower seeds, tossed in our house-made basil pesto, with a touch of lemon, sprinkle of sesame seeds",
    price: "125",
    tags: ["V"],
    category: "salads"
  },
  {
    id: "salad-9",
    name: "Live off the Land Salad",
    description: "Lettuce, cucumber, avocado, peppers, cherry tomatoes, carrot, roasted sunflower, pumpkin seeds, cashew nuts, with a sprinkle of sesame seeds",
    price: "113",
    tags: ["V"],
    category: "salads"
  },
  {
    id: "salad-10",
    name: "Greek Salad",
    description: "Lettuce, cherry tomatoes, bell peppers, cucumber, red onion, olives, and feta cheese, with a sprinkle of sesame seeds",
    price: "98",
    tags: ["V"],
    category: "salads"
  },
  {
    id: "salad-11",
    name: "Garden Salad",
    description: "Mixed greens, avocado slices, mozzarella cheese, cherry tomatoes, peppers, peas, cucumber, with a sprinkle of sesame seeds",
    price: "98",
    tags: [],
    category: "salads",
    addOns: [
      { name: "Chicken", price: "50" },
      { name: "Beef", price: "55" }
    ]
  },
  // Add more items for other categories (bowls, wraps, etc.)
  {
    id: "bowl-1",
    name: "Smoky Chipotle Chicken Bowl",
    description: "Cilantro-lime brown rice, grilled chipotle-marinated chicken strips, corn, black beans, grilled peppers & red onion, avocado slices, tomato salsa, shredded lettuce, cheddar",
    price: "125",
    tags: [],
    category: "bowls"
  },
  // Continue adding all items from your PDF...
];

export const saladItems = menuItems.filter(item => item.category === 'salads');
export const bowlItems = menuItems.filter(item => item.category === 'bowls');
// Add similar exports for other categories