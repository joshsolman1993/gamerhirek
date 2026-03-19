export interface MapPoint {
  id: string;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  label: string;
  description: string;
  type: "callout" | "lineup" | "strategy";
  attackerSide?: boolean;
}

export interface ValorantMap {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  minimapUrl: string;
  points: MapPoint[];
}

export const MAPS: Record<string, ValorantMap> = {
  ascent: {
    id: "ascent",
    name: "Ascent",
    description: "Klasszikus két bombaterületes pálya egy hatalmas, nyitott középső udvarral. A Mid dominanciája kulcsfontosságú az A és B lerakók megközelítéséhez. Az ajtók mechanikája miatt sok taktikai lehetőség van.",
    imageUrl: "https://images.unsplash.com/photo-1628269389531-bc575f0a7cce?q=80&w=2070&auto=format&fit=crop", // placeholder
    minimapUrl: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png",
    points: [
      { id: "p1", x: 50, y: 50, label: "Mid Courtyard", description: "Az egész pálya központja. Ha a támadók átveszik az irányítást, bármelyik lerakó felé tovább tudnak menni. Operatorral tartani a legjobb.", type: "strategy" },
      { id: "p2", x: 75, y: 30, label: "A Main", description: "Fő támadási útvonal az 'A' lerakóra. Vigyázni kell a Peak-ekkel, gyakran védenek itt agresszíven.", type: "callout", attackerSide: true },
      { id: "p3", x: 25, y: 70, label: "B Main / B Lobby", description: "Szűk bejárat 'B' lerakóra. Sova felderítő nyila és Fade hauntjai elengedhetetlenek a behatoláshoz.", type: "callout", attackerSide: true },
      { id: "p4", x: 80, y: 20, label: "A Heaven", description: "Védők fő felállási pontja A lerakón. Magaslati előny és szinte az egész lerakóra rálátás.", type: "callout" },
      { id: "p5", x: 45, y: 30, label: "Tree / Link", description: "Összeköti a Mid-et az 'A' lerakóval. Itt található a bezárható mechanikus ajtó.", type: "strategy" },
      { id: "p6", x: 30, y: 65, label: "Killjoy Nanoswarm (B)", description: "B Main elzárására tökéletes Nanoswarm pozíció a bejárat melletti láda mögött.", type: "lineup" }
    ],
  },
  bind: {
    id: "bind",
    name: "Bind",
    description: "Két lerakó, Mid nélkül. Helyette kétirányú teleporterek teszik egyedivé a rotálást és a támadást. Nagyon gyors játékmenetre és váratlan flank-ekre kell számítani.",
    imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop", // placeholder
    minimapUrl: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/displayicon.png",
    points: [
      { id: "p1", x: 75, y: 55, label: "A Showers", description: "Veszélyes, szűk alagút. Az irányítása kulcsfontosságú az A lerakó ostromához.", type: "callout", attackerSide: true },
      { id: "p2", x: 65, y: 35, label: "A Short", description: "Gyors csapásirány az A lerakóra. Cypher csapdák kedvenc helye.", type: "callout" },
      { id: "p3", x: 25, y: 45, label: "B Hookah", description: "Az ablak, ami a B lerakóra néz. Őrült tűzharcok helyszíne. Nincs kiút, ha gránátot dobnak be.", type: "strategy" },
      { id: "p4", x: 30, y: 65, label: "B Long", description: "Hosszú lőtáv. Operatorok és Chamberek kedvelt vadászterülete a támadók megállítására.", type: "callout" },
      { id: "p5", x: 50, y: 50, label: "A Teleporter", description: "A teleporter, ami A Short-ról B Hookah elé visz. Egyirányú és nagyon hangos.", type: "strategy" },
      { id: "p6", x: 80, y: 30, label: "Sova Dart (A)", description: "Gyors felderítő nyíl a támadók spawnjából az A Lamps terület feltérképezésére.", type: "lineup", attackerSide: true }
    ],
  }
};

export async function getAllMaps(): Promise<ValorantMap[]> {
  return Object.values(MAPS);
}

export async function getMapById(id: string): Promise<ValorantMap | null> {
  return MAPS[id] || null;
}
