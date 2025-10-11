// src/data/cateringData.ts

export interface EventType {
  title: string;
  description: string;
  image: string;
  meals: string[];
}

export interface MealCourse {
  title: string;
  description: string;
  examples: string[];
}

// Event-specific catering options
export const eventTypes: EventType[] = [
  {
    title: "Board Meetings",
    description:
      "Keep your team energized with light, wholesome meals designed for focus and productivity. Perfect for morning or afternoon sessions.",
    image: "/images/catering/board-meeting.jpg",
    meals: ["Protein-packed salads", "Mini wraps & sandwiches", "Fresh fruit platters", "Assorted juices & smoothies"],
  },
  {
    title: "Private Events",
    description:
      "Celebrate milestones with healthy yet indulgent options that delight your guests without compromising wellness.",
    image: "/images/catering/private-event.jpg",
    meals: ["Signature salads", "Grilled wraps & bowls", "Mini toasties & finger foods", "Cold-pressed juices"],
  },
  {
    title: "Conferences",
    description:
      "Fuel your attendees with nutritious meals that keep energy levels high throughout long sessions. Options for all dietary needs.",
    image: "/images/catering/conference.jpg",
    meals: ["Hearty bowls & stir-fries", "Assorted sandwiches & wraps", "Snack boxes with fruits & nuts", "Smoothies & fresh juices"],
  },
];

// Detailed meal courses
export const mealCourses: MealCourse[] = [
  {
    title: "Starters / Light Bites",
    description:
      "Delicate and wholesome starters to kick off your event. Fresh, colorful, and nutritious.",
    examples: ["Mini avocado toast", "Hummus & veggie cups", "Fruit skewers", "Mini salad jars"],
  },
  {
    title: "Main Courses",
    description: "Hearty and balanced options to satisfy diverse palates.",
    examples: ["Grilled chicken & quinoa bowls", "Vegan protein stack salads", "Wholegrain wraps & sandwiches", "Warm stir-fry bowls"],
  },
  {
    title: "Desserts / Sweet Treats",
    description: "Indulgent yet healthy desserts that leave a lasting impression.",
    examples: ["Fruit parfaits", "Dark chocolate energy bites", "Oat & nut bars", "Chia pudding cups"],
  },
  {
    title: "Beverages",
    description: "Refreshing drinks to complement your meal and keep everyone hydrated.",
    examples: ["Cold-pressed juices", "Smoothies", "Herbal teas", "Sparkling water with fruit infusions"],
  },
];
