/**
 * Single source of truth for brand, contact and SEO details.
 * Update these values to rebrand the entire site.
 */

export const site = {
  name: "YŪGEN",
  nameJp: "幽玄",
  tagline: "Omakase in the key of stillness",
  // Meaning behind the name — used in the Story section.
  concept:
    "Yūgen (幽玄) — the profound, mysterious grace of the universe, felt but never fully seen.",
  description:
    "YŪGEN is an intimate Tokyo-inspired omakase counter where seasonal fish, quiet architecture and cinematic light become a single, unhurried ritual.",
  // Live production domain. Update this if you attach a custom domain later.
  url: "https://yugen-6b9.pages.dev",
  locale: "en_US",
  email: "reservations@yugen.dining",
  phoneDisplay: "+1 (415) 555-0192",
  phone: "+14155550192",
  address: {
    street: "88 Ashgrove Lane",
    district: "Hayes Valley",
    city: "San Francisco",
    region: "CA",
    postalCode: "94102",
    country: "US",
    countryName: "United States",
  },
  geo: {
    latitude: 37.7765,
    longitude: -122.4241,
  },
  priceRange: "$$$$",
  cuisine: ["Japanese", "Sushi", "Omakase"],
  hours: [
    { day: "Tuesday – Thursday", value: "Seatings 17:30 · 20:15" },
    { day: "Friday – Saturday", value: "Seatings 17:00 · 19:30 · 21:45" },
    { day: "Sunday", value: "Seatings 17:30 · 20:00" },
    { day: "Monday", value: "Closed" },
  ],
  // Structured-data friendly opening hours
  openingHours: [
    { days: ["Tuesday", "Wednesday", "Thursday"], opens: "17:30", closes: "22:30" },
    { days: ["Friday", "Saturday"], opens: "17:00", closes: "23:30" },
    { days: ["Sunday"], opens: "17:30", closes: "22:00" },
  ],
  social: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
  },
  founded: "2019",
} as const;

export type NavLink = { label: string; href: string; jp?: string };

export const navLinks: NavLink[] = [
  { label: "Story", href: "/#story", jp: "物語" },
  { label: "Chef", href: "/#chef", jp: "板前" },
  { label: "Menu", href: "/menu", jp: "献立" },
  { label: "Experience", href: "/#experience", jp: "体験" },
  { label: "Gallery", href: "/gallery", jp: "写真" },
  { label: "FAQ", href: "/#faq", jp: "質問" },
  { label: "Reserve", href: "/reservations", jp: "予約" },
  { label: "Contact", href: "/contact", jp: "連絡" },
];

export const awards = [
  { year: "2024", title: "Two Michelin Stars", org: "Michelin Guide" },
  { year: "2024", title: "World's 50 Best · No. 31", org: "50 Best Restaurants" },
  { year: "2023", title: "Site of the Day", org: "Awwwards" },
  { year: "2023", title: "Best Fine Dining", org: "Eater SF" },
  { year: "2022", title: "Chef of the Year", org: "James Beard Foundation" },
];
