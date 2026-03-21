export type RiotAccountData = {
  puuid: string;
  name: string;
  tag: string;
  region: string;
  account_level: number;
};

export type RiotMMRData = {
  currenttierpatched: string;
  images: {
    small: string;
    large: string;
  };
};

export async function getRiotAccount(name: string, tag: string): Promise<RiotAccountData | null> {
  try {
    const headers: HeadersInit = {};
    if (process.env.HENRIK_API_KEY) {
      headers["Authorization"] = process.env.HENRIK_API_KEY;
    }

    const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      method: "GET",
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("HIÁNYZÓ_API_KULCS");
    }

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 200) return null;

    return data.data as RiotAccountData;
  } catch (error: any) {
    if (error.message === "HIÁNYZÓ_API_KULCS") throw error;
    console.error("Hiba a Riot Account lekérésekor:", error);
    return null;
  }
}

export async function getRiotMMR(region: string, name: string, tag: string): Promise<RiotMMRData | null> {
  try {
    const headers: HeadersInit = {};
    if (process.env.HENRIK_API_KEY) {
      headers["Authorization"] = process.env.HENRIK_API_KEY;
    }

    const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${encodeURIComponent(region)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      method: "GET",
      headers,
      next: { revalidate: 3600 }
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("HIÁNYZÓ_API_KULCS");
    }

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 200) return null;

    return data.data as RiotMMRData;
  } catch (error: any) {
    if (error.message === "HIÁNYZÓ_API_KULCS") throw error;
    console.error("Hiba a Riot MMR lekérésekor:", error);
    return null;
  }
}
