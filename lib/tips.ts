export const VALORANT_TIPS = [
  {
    title: "Eco kör gazdálkodás",
    content: "Ha vesztettetek egy kört és a következőn spórolnotok kell, mindig tartsd észben a 'Next Round Min' összeget a boltban. Célozz minimum 3900 kreditre, hogy a következő körben biztosan tudj venni egy Vandalt/Phantomot és egy Heavy Shieldet.",
    agent: "Chamber",
  },
  {
    title: "Kereszt-tűz (Crossfire) felállás",
    content: "Védekezésnél soha ne álljatok ugyanabban a szögből fogni egy bejáratot. Keressetek két olyan pozíciót, amivel az ellenfélnek 180 fokot kell fordulnia, ha mindkettőtökre lőni akar. Ha az egyikőtökre rálőnek, a másik azonnal büntethet.",
    agent: "Killjoy",
  },
  {
    title: "Csendes Drop a magaslati pontokról",
    content: "Ha egy magas dobozról ugrasz le (pl. Ascent A Heaven), a falhoz simulva csússz le a 'S' és a megfelelő oldalirányú gomb nyomva tartásával. Ha elég közel maradsz a felülethez, hangtalanul érkezel a földre.",
    agent: "Omen",
  },
  {
    title: "Defaultolás támadásnál",
    content: "Ne rusholjatok be mind az öt emberrel ugyanazon az útvonalon az első másodpercben. Osszátok szét a csapatot a térképen, tartsatok pozíciót, hogy információt gyűjtsetek a védők rotációjáról, és csak ezután válasszatok célpontot.",
    agent: "Cypher",
  },
  {
    title: "Jump Peeking információszerzéshez",
    content: "Sarkokon kinézésnél ne fuss ki egyszerűen, mert egy Operator azonnal leszed. Használd a ugrásos kinézést (jump peek) úgy, hogy elugrasz a fal mellett és a levegőben visszafelé húzod az irányt. Így rálátsz a szögre, de a tested nagy része takarásban marad.",
    agent: "Jett",
  },
  {
    title: "Trade-elés a harcban",
    content: "Soha ne hagyd a csapattársad egyedül meghalni! Ha ő belép egy területre, menj szorosan utána (pár méter lemaradással), hogy ha őt lelövik, te azonnal 'trade'-elni tudd a gyilkosságot. Az 5v4 sokkal jobb, mint a 4v5.",
    agent: "Reyna",
  },
  {
    title: "Spike időzítés",
    content: "A Spike pontosan 45 másodperc alatt detinál. Körülbelül az utolsó 7 másodperc az, amitől már nem lehet hatástalanítani egy teljesen felszedetlen mód esetén. A hangjelzések is felgyorsulnak: ha a negyedik szintű, nagyon gyors sípolást hallod, fuss!",
    agent: "Gekko",
  }
];

export function getDailyTip() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24
  );
  
  return VALORANT_TIPS[dayOfYear % VALORANT_TIPS.length];
}
