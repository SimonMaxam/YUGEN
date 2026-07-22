/** Content shown when a guest clicks a table inside the 3D restaurant scene. */
export interface TableExperience {
  id: string;
  seat: string;
  name: string;
  jp: string;
  duration: string;
  courses: string;
  price: string;
  summary: string;
  highlights: string[];
  pairing: string;
}

export const experiences: TableExperience[] = [
  {
    id: "counter",
    seat: "The Counter · 8 seats",
    name: "Omakase Yūgen",
    jp: "おまかせ 幽玄",
    duration: "≈ 2 hours",
    courses: "17 courses",
    price: "$285 per guest",
    summary:
      "Our flagship seating directly across the hinoki counter. The itamae reads the room and the season, and the meal is composed in real time.",
    highlights: [
      "Live counter interaction with Chef Arata",
      "Daily catch flown from Toyosu market",
      "Two warm courses from the back kitchen",
    ],
    pairing: "Optional sake flight · +$120",
  },
  {
    id: "window",
    seat: "Garden Window · table for 2",
    name: "Tsuki Tasting",
    jp: "月 会席",
    duration: "≈ 1.5 hours",
    courses: "12 courses",
    price: "$210 per guest",
    summary:
      "A quieter kaiseki-style progression beside the floor-to-ceiling window, framed by the moss garden and dusk light.",
    highlights: [
      "Seasonal kaiseki narrative",
      "Vegetarian progression available",
      "Best seat for the golden-hour light",
    ],
    pairing: "Tea ceremony pairing · +$60",
  },
  {
    id: "private",
    seat: "Private Room · up to 6",
    name: "Kura Private Dining",
    jp: "蔵 個室",
    duration: "≈ 2.5 hours",
    courses: "17 courses + canapés",
    price: "From $2,400 (room)",
    summary:
      "A screened tatami room behind the shoji wall for celebrations and private negotiations, with a dedicated server and personalised menu cards.",
    highlights: [
      "Dedicated host & sommelier",
      "Custom printed menus",
      "Corkage and cake service available",
    ],
    pairing: "Reserve sommelier pairing on request",
  },
];
