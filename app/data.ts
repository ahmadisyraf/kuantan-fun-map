export const categories = [
  "Mall",
  "Mosque",
  "Museum",
  "Riverfront",
  "Zoo",
  "Park",
  "Beach",
  "Cafe",
  "Castle",
  "Landmark",
] as const;

export type CategoryType = (typeof categories)[number];

export interface Place {
  name: string;
  coordinates: [number, number];
  category: CategoryType;
}

export const places: Place[] = [
  {
    name: "Masjid Sultan Ahmad Shah",
    coordinates: [103.3280200212946, 3.8078377066555387],
    category: "Mosque",
  },
  {
    name: "Pahang Art Museum",
    coordinates: [103.32609175369788, 3.8075060941340784],
    category: "Museum",
  },
  {
    name: "Taman Gelora",
    coordinates: [103.34923415369789, 3.8092016091414744],
    category: "Park",
  },
  {
    name: "Teluk Cempedak",
    coordinates: [103.37208886566323, 3.813585706435654],
    category: "Beach",
  },
  {
    name: "Pantai Tembeling",
    coordinates: [103.36632153392985, 3.806280858688344],
    category: "Beach",
  },
  {
    name: "Dinosaur Encounter Zoo",
    coordinates: [103.36579654441898, 3.8088943884967223],
    category: "Zoo",
  },
  {
    name: "East Coast Mall",
    coordinates: [103.32623206718833, 3.8186465316414133],
    category: "Mall",
  },
  {
    name: "Istana Abdulaziz",
    coordinates: [103.28513967533186, 3.844517921455622],
    category: "Castle",
  },
  {
    name: "Laman Menara Kuantan 188",
    coordinates: [103.32690378757249, 3.803975746500227],
    category: "Park",
  },
  {
    name: "Menara Kuantan 188",
    coordinates: [103.32749086341559, 3.804188166603803],
    category: "Landmark",
  },
  {
    name: "Taman Bandar Kuantan",
    coordinates: [103.29664452486149, 3.835674287426583],
    category: "Park",
  },
  {
    name: "Tasek @ Kotasas",
    coordinates: [103.27411858253474, 3.870869292066598],
    category: "Park",
  },
  {
    name: "Muzium Sungai Lembing",
    coordinates: [103.03219045184264, 3.9139329380122265],
    category: "Museum",
  },
  {
    name: "Esplanade Kuantan",
    coordinates: [103.3234933960247, 3.800510611525935],
    category: "Riverfront",
  },
];
