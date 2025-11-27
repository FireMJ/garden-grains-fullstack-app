export interface Soup {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns: { id: string; name: string; price: number; }[];
}

export const soups: Soup[] = [
  {
    id: "soup1",
    slug: "creamy-broccoli-cauliflower-soup",
    name: "Creamy Broccoli and Cauliflower Soup",
    price: 65,
    description: "Broccoli, cauliflower, onion, garlic, dried thyme, olive oil, and chicken stock, topped with blue cheese, fresh cream, & olive oil. Served with a toasted slice of sourdough bread.",
    image: "/images/soups/creamy-broccoli-cauliflower.png",
    addOns: [
      { id: "addon1", name: "Garlic Bread", price: 20 },
      { id: "addon2", name: "Avocado Slices", price: 25 },
      { id: "addon3", name: "Vegan Cheese", price: 22 },
    ]
  },
  {
    id: "soup2",
    slug: "butternut-sage-soup",
    name: "Butternut & Sage Soup",
    price: 72,
    description: "Smooth roasted butternut blended with sage and a touch of coconut cream.",
    image: "/images/soups/butternut.png",
    addOns: [
      { id: "addon4", name: "Seeded Bread Roll", price: 18 },
      { id: "addon5", name: "Chili Flakes", price: 8 },
      { id: "addon6", name: "Pumpkin Seeds", price: 15 },
    ]
  },
  {
    id: "soup3",
    slug: "miso-mushroom-soup",
    name: "Miso & Mushroom Soup",
    price: 78,
    description: "A comforting Japanese-inspired miso broth with shiitake mushrooms, seaweed, and spring onions.",
    image: "/images/soups/miso.png",
    addOns: [
      { id: "addon7", name: "Tofu Cubes", price: 22 },
      { id: "addon8", name: "Noodles", price: 25 },
      { id: "addon9", name: "Sesame Seeds", price: 10 },
    ]
  },
  {
    id: "soup4",
    slug: "tomato-basil-soup",
    name: "Tomato & Basil Soup",
    price: 58,
    description: "Classic tomato soup with fresh basil and a hint of garlic, served with croutons.",
    image: "/images/soups/tomato-basil.png",
    addOns: [
      { id: "addon10", name: "Parmesan Cheese", price: 15 },
      { id: "addon11", name: "Fresh Basil", price: 8 },
      { id: "addon12", name: "Grilled Cheese", price: 25 },
    ]
  },
  {
    id: "soup5",
    slug: "lentil-vegetable-soup",
    name: "Lentil & Vegetable Soup",
    price: 62,
    description: "Hearty lentil soup with carrots, celery, and potatoes in a rich vegetable broth.",
    image: "/images/soups/lentil-vegetable.png",
    addOns: [
      { id: "addon13", name: "Lemon Wedge", price: 5 },
      { id: "addon14", name: "Fresh Herbs", price: 8 },
      { id: "addon15", name: "Crusty Bread", price: 18 },
    ]
  },
  {
    id: "soup6",
    slug: "chicken-noodle-soup",
    name: "Chicken Noodle Soup",
    price: 75,
    description: "Classic comfort food with tender chicken, egg noodles, carrots, and celery in a savory broth.",
    image: "/images/soups/chicken-noodle.png",
    addOns: [
      { id: "addon16", name: "Extra Chicken", price: 25 },
      { id: "addon17", name: "Fresh Parsley", price: 8 },
      { id: "addon18", name: "Lemon Zest", price: 5 },
    ]
  }
];
