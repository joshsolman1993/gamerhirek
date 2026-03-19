import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const tag = searchParams.get('tag');
  const region = searchParams.get('region') || 'eu';

  if (!name || !tag) {
    return NextResponse.json({ error: 'Név és Tag kötelező.' }, { status: 400 });
  }

  const apiKey = process.env.HENRIK_API_KEY;

  if (!apiKey) {
    console.error("Hiányzik a HENRIK_API_KEY környezeti változó.");
    return NextResponse.json({ error: 'Szerver konfigurációs hiba.' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=15`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      // Cache this request for 5 minutes (300 seconds)
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Játékos nem található vagy privát profil.' }, { status: 404 });
      }
      throw new Error(`API hiba: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Hiba a meccstörténet lekérdezésekor:', error);
    return NextResponse.json({ error: 'Nem sikerült betölteni a meccseket. Kérjük próbáld később.' }, { status: 500 });
  }
}
