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
    const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      method: "GET",
      // Optional: Add HenrikDev API key if required in the future via headers
      next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.status !== 200) {
      return null;
    }

    return data.data as RiotAccountData;
  } catch (error) {
    console.error("Hiba a Riot Account lekérésekor:", error);
    return null;
  }
}

export async function getRiotMMR(region: string, name: string, tag: string): Promise<RiotMMRData | null> {
  try {
    const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${encodeURIComponent(region)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      method: "GET",
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.status !== 200) {
      return null;
    }

    return data.data as RiotMMRData;
  } catch (error) {
    console.error("Hiba a Riot MMR lekérésekor:", error);
    return null;
  }
}
