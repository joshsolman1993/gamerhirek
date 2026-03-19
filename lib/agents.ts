export interface ValorantAgent {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

export const AGENTS: ValorantAgent[] = [
  { id: "jett", name: "Jett", role: "Duelist", imageUrl: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayiconsmall.png" },
  { id: "reyna", name: "Reyna", role: "Duelist", imageUrl: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayiconsmall.png" },
  { id: "clove", name: "Clove", role: "Controller", imageUrl: "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayiconsmall.png" },
  { id: "omen", name: "Omen", role: "Controller", imageUrl: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayiconsmall.png" },
  { id: "sova", name: "Sova", role: "Initiator", imageUrl: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayiconsmall.png" },
  { id: "fade", name: "Fade", role: "Initiator", imageUrl: "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayiconsmall.png" },
  { id: "killjoy", name: "Killjoy", role: "Sentinel", imageUrl: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayiconsmall.png" },
  { id: "cypher", name: "Cypher", role: "Sentinel", imageUrl: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayiconsmall.png" },
  { id: "raze", name: "Raze", role: "Duelist", imageUrl: "https://media.valorant-api.com/agents/f94c3b30-42be-e959-8e18-c0bca871b6d0/displayiconsmall.png" },
];

export const TIER_ROWS = [
  { id: "s-tier", label: "S", color: "#FF7F7F" },
  { id: "a-tier", label: "A", color: "#FFBF7F" },
  { id: "b-tier", label: "B", color: "#FFDF7F" },
  { id: "c-tier", label: "C", color: "#FFFF7F" },
  { id: "d-tier", label: "D", color: "#BFFF7F" },
];
