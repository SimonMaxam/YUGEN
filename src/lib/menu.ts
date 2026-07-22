export type Dietary = "vegetarian" | "vegan" | "gluten-free" | "raw" | "shellfish";

export interface MenuItem {
  id: string;
  name: string;
  jp?: string;
  description: string;
  price: number;
  spice?: 0 | 1 | 2 | 3;
  dietary?: Dietary[];
  popular?: boolean;
  chef?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  jp: string;
  blurb: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "signature-rolls",
    name: "Signature Rolls",
    jp: "特選巻き",
    blurb: "Compositions built over years — our most requested creations.",
    items: [
      {
        id: "kintsugi",
        name: "Kintsugi",
        jp: "金継ぎ",
        description:
          "Bluefin toro, gold leaf, smoked soy pearls and shiso, seamed like repaired porcelain.",
        price: 42,
        dietary: ["raw"],
        popular: true,
        chef: true,
      },
      {
        id: "ember",
        name: "Ember & Yuzu",
        jp: "炭と柚子",
        description: "Torched salmon belly, yuzu kosho, crisp leek ash, ikura.",
        price: 34,
        spice: 2,
        dietary: ["raw"],
        popular: true,
      },
      {
        id: "garden",
        name: "Quiet Garden",
        jp: "静園",
        description: "Grilled aubergine, pickled plum, avocado, toasted sesame.",
        price: 26,
        dietary: ["vegan"],
      },
    ],
  },
  {
    id: "nigiri",
    name: "Nigiri",
    jp: "握り",
    blurb: "Single breaths of fish over warm, vinegared rice.",
    items: [
      {
        id: "otoro",
        name: "Ōtoro",
        jp: "大トロ",
        description: "The fattiest cut of bluefin tuna belly. Melts at body temperature.",
        price: 18,
        dietary: ["raw"],
        chef: true,
        popular: true,
      },
      {
        id: "uni",
        name: "Hokkaido Uni",
        jp: "雲丹",
        description: "Sea urchin from Rausu, cold-brined nori, a whisper of wasabi.",
        price: 16,
        dietary: ["raw", "shellfish"],
        popular: true,
      },
      {
        id: "hotate",
        name: "Hotate",
        jp: "帆立",
        description: "Diver scallop, brushed with brown-butter soy and sea salt.",
        price: 12,
        dietary: ["raw", "shellfish"],
      },
      {
        id: "tamago",
        name: "Tamago",
        jp: "玉子",
        description: "Layered sweet omelette, slow-folded over forty minutes.",
        price: 8,
        dietary: ["vegetarian"],
      },
    ],
  },
  {
    id: "sashimi",
    name: "Sashimi",
    jp: "刺身",
    blurb: "Fish in its purest state, cut with the grain of the season.",
    items: [
      {
        id: "madai",
        name: "Madai",
        jp: "真鯛",
        description: "Aged sea bream, kombu-cured three days, finished with citrus.",
        price: 22,
        dietary: ["raw", "gluten-free"],
        chef: true,
      },
      {
        id: "buri",
        name: "Buri",
        jp: "鰤",
        description: "Winter yellowtail, marbled and cool, with fresh wasabi.",
        price: 20,
        dietary: ["raw", "gluten-free"],
      },
    ],
  },
  {
    id: "maki",
    name: "Maki & Hand Rolls",
    jp: "巻物",
    blurb: "Warm rice, crisp nori, rolled to order at the counter.",
    items: [
      {
        id: "spicy-toro",
        name: "Spicy Toro Temaki",
        jp: "辛トロ手巻き",
        description: "Chopped toro, house chili oil, chive, wrapped in toasted nori.",
        price: 19,
        spice: 3,
        dietary: ["raw"],
        popular: true,
      },
      {
        id: "negihama",
        name: "Negihama",
        jp: "葱はま",
        description: "Yellowtail and scallion, clean and bright.",
        price: 14,
        dietary: ["raw"],
      },
    ],
  },
  {
    id: "warm",
    name: "From the Kitchen",
    jp: "温物",
    blurb: "Ramen, tempura and small warm plates from the back kitchen.",
    items: [
      {
        id: "tori-paitan",
        name: "Tori Paitan Ramen",
        jp: "鶏白湯",
        description: "Twelve-hour chicken broth, confit thigh, ajitama, black garlic.",
        price: 24,
        spice: 1,
      },
      {
        id: "tempura",
        name: "Seasonal Tempura",
        jp: "天ぷら",
        description: "Feather-light vegetables and prawn, matcha salt.",
        price: 21,
        dietary: ["shellfish"],
        chef: true,
      },
      {
        id: "udon",
        name: "Nikomi Udon",
        jp: "煮込みうどん",
        description: "Hand-cut udon, dashi, wilted greens, shaved bonito.",
        price: 19,
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    jp: "甘味",
    blurb: "Quiet, barely-sweet endings.",
    items: [
      {
        id: "kuromitsu",
        name: "Warabi Mochi",
        jp: "わらび餅",
        description: "Bracken-starch mochi, kuromitsu, toasted kinako.",
        price: 13,
        dietary: ["vegetarian"],
        popular: true,
      },
      {
        id: "matcha",
        name: "Matcha & Yuzu",
        jp: "抹茶柚子",
        description: "Ceremonial matcha parfait, yuzu curd, black sesame tuile.",
        price: 14,
        dietary: ["vegetarian"],
      },
    ],
  },
  {
    id: "drinks",
    name: "Sake, Wine & Cocktails",
    jp: "飲み物",
    blurb: "A cellar built for umami — poured to your progression.",
    items: [
      {
        id: "junmai",
        name: "Junmai Daiginjō",
        jp: "純米大吟醸",
        description: "Yamada Nishiki rice polished to 35%. Silk and white peach.",
        price: 26,
        dietary: ["vegan", "gluten-free"],
        chef: true,
      },
      {
        id: "highball",
        name: "Charcoal Highball",
        jp: "ハイボール",
        description: "Japanese whisky, binchōtan-filtered soda, sudachi.",
        price: 18,
      },
      {
        id: "riesling",
        name: "Mosel Riesling",
        jp: "リースリング",
        description: "Off-dry, mineral, cut for fatty fish and spice.",
        price: 22,
        dietary: ["vegan"],
      },
    ],
  },
];

export const dietaryMeta: Record<Dietary, { label: string; symbol: string }> = {
  vegetarian: { label: "Vegetarian", symbol: "V" },
  vegan: { label: "Vegan", symbol: "Ve" },
  "gluten-free": { label: "Gluten free", symbol: "GF" },
  raw: { label: "Raw / served cold", symbol: "R" },
  shellfish: { label: "Contains shellfish", symbol: "S" },
};
