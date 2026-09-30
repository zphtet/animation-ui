import type { Accessory, Species } from "@/art/Critter";

export interface Pal {
  species: Species;
  body?: string;
  accent?: string;
  accessory?: Accessory;
}

/** Named colour variants used across scenes (deterministic, so SSR/tests are stable). */
export const PALS: Pal[] = [
  { species: "cat", body: "#2b2b35", accent: "#4a4a5c" },
  { species: "panda" },
  { species: "dog", accent: "#b87b4b" },
  { species: "bunny", accessory: "bow" },
  { species: "cat", body: "#ffffff", accent: "#c9ced9" },
  { species: "bear" },
  { species: "fox" },
  { species: "pig" },
  { species: "chick" },
  { species: "cat", body: "#9aa3b5", accent: "#6b7385" },
  { species: "dog", accent: "#2b2b35" },
  { species: "cat" },
  { species: "bear", body: "#f2d4b3", accent: "#fff" },
  { species: "bunny", body: "#e9e4ff", accent: "#c9b8ff" },
];

export interface CollectionItem extends Pal {
  id: number;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  /** Card background gradient. */
  bg: [string, string];
}

export const COLLECTION: CollectionItem[] = [
  {
    id: 2907,
    name: "Mochi",
    species: "cat",
    accessory: "headphones",
    rarity: "Legendary",
    bg: ["#ffe3a3", "#ffb7a1"],
  },
  {
    id: 481,
    name: "Bamboo",
    species: "panda",
    accessory: "crown",
    rarity: "Epic",
    bg: ["#c9f2d6", "#8fd6c1"],
  },
  {
    id: 1227,
    name: "Biscuit",
    species: "dog",
    accessory: "scarf",
    rarity: "Rare",
    bg: ["#a9dcff", "#7aa7ff"],
  },
  {
    id: 2800,
    name: "Clover",
    species: "bunny",
    accessory: "bow",
    rarity: "Rare",
    bg: ["#ffd6ec", "#ff8fc7"],
  },
  {
    id: 76,
    name: "Ember",
    species: "fox",
    accessory: "headphones",
    rarity: "Epic",
    bg: ["#ffe0c2", "#ff9a6b"],
  },
  {
    id: 1666,
    name: "Nori",
    species: "cat",
    body: "#2b2b35",
    accent: "#4a4a5c",
    accessory: "crown",
    rarity: "Legendary",
    bg: ["#c9b8ff", "#7d6bff"],
  },
  {
    id: 342,
    name: "Truffle",
    species: "pig",
    accessory: "scarf",
    rarity: "Common",
    bg: ["#fff1c9", "#ffd27a"],
  },
  {
    id: 3001,
    name: "Pudding",
    species: "bear",
    accessory: "bow",
    rarity: "Common",
    bg: ["#f3e6d8", "#e0c1a1"],
  },
  {
    id: 999,
    name: "Sunny",
    species: "chick",
    accessory: "crown",
    rarity: "Rare",
    bg: ["#fffbd1", "#ffe56b"],
  },
  {
    id: 2222,
    name: "Smokey",
    species: "cat",
    body: "#9aa3b5",
    accent: "#6b7385",
    accessory: "scarf",
    rarity: "Epic",
    bg: ["#dfe7f5", "#a6b5d6"],
  },
];
