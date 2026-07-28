export type Subject = {
  id: string;
  slug: string;
  name: string;
  short: string;
  weight: number;
  topics: string[];
  color: string;
};

export const subjects: Subject[] = [
  {
    id: "cardio",
    slug: "cardiologia",
    name: "Cardiología",
    short: "Cardio",
    weight: 8.5,
    color: "#0E7C86",
    topics: [
      "Síndromes coronarios",
      "Insuficiencia cardíaca",
      "Arritmias",
      "Valvulopatías",
      "Hipertensión",
    ],
  },
  {
    id: "neumo",
    slug: "neumologia",
    name: "Neumología",
    short: "Neumo",
    weight: 6.2,
    color: "#2A6F97",
    topics: ["EPOC", "Asma", "Neumonías", "TEP", "Cáncer de pulmón"],
  },
  {
    id: "digestivo",
    slug: "digestivo",
    name: "Digestivo",
    short: "Digestivo",
    weight: 7.1,
    color: "#3D6B4F",
    topics: ["Hepatitis", "IBD", "Páncreas", "Úlcera péptica", "Cirrosis"],
  },
  {
    id: "neuro",
    slug: "neurologia",
    name: "Neurología",
    short: "Neuro",
    weight: 7.8,
    color: "#5B4B8A",
    topics: ["Ictus", "Epilepsia", "Cefaleas", "Parkinson", "Esclerosis múltiple"],
  },
  {
    id: "endo",
    slug: "endocrinologia",
    name: "Endocrinología",
    short: "Endo",
    weight: 5.4,
    color: "#B45309",
    topics: ["Diabetes", "Tiroides", "Suprarrenal", "Hipófisis", "Osteoporosis"],
  },
  {
    id: "nefro",
    slug: "nefrologia",
    name: "Nefrología",
    short: "Nefro",
    weight: 5.9,
    color: "#0F766E",
    topics: ["IRA", "ERC", "Glomerulonefritis", "Litiasis", "Trastornos hidroelectrolíticos"],
  },
  {
    id: "infec",
    slug: "infecciosas",
    name: "Infecciosas",
    short: "Infecciosas",
    weight: 6.5,
    color: "#9A3412",
    topics: ["Sepsis", "VIH", "TB", "Antibióticos", "Infecciones nosocomiales"],
  },
  {
    id: "heme",
    slug: "hematologia",
    name: "Hematología",
    short: "Hematología",
    weight: 4.8,
    color: "#9F1239",
    topics: ["Anemias", "Leucemias", "Linfomas", "Coagulación", "Transfusión"],
  },
  {
    id: "reuma",
    slug: "reumatologia",
    name: "Reumatología",
    short: "Reuma",
    weight: 4.2,
    color: "#7C2D12",
    topics: ["AR", "LES", "Espondiloartritis", "Vasculitis", "Artrosis"],
  },
  {
    id: "gine",
    slug: "ginecologia",
    name: "Ginecología y Obstetricia",
    short: "Gine",
    weight: 5.6,
    color: "#BE185D",
    topics: ["Gestación", "Parto", "Cáncer ginecológico", "Anticoncepción", "SOP"],
  },
  {
    id: "pedia",
    slug: "pediatria",
    name: "Pediatría",
    short: "Pediatría",
    weight: 6.0,
    color: "#0369A1",
    topics: ["Neonatología", "Infecciones pediátricas", "Vacunas", "Crecimiento", "Urgencias"],
  },
  {
    id: "psiquiatria",
    slug: "psiquiatria",
    name: "Psiquiatría",
    short: "Psiquiatría",
    weight: 3.8,
    color: "#6D28D9",
    topics: ["Depresión", "Esquizofrenia", "Ansiedad", "Trastornos de personalidad", "Urgencias"],
  },
];

export function getSubject(slugOrId: string) {
  return subjects.find((s) => s.slug === slugOrId || s.id === slugOrId);
}
