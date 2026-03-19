import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
  team: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = newsletterSchema.parse(json);

    // Vercel / Neon DB mentés
    await db.subscriber.upsert({
      where: { email: body.email },
      update: { team: body.team },
      create: {
        email: body.email,
        team: body.team,
      },
    });

    // Itt történne a Resend API / SendGrid meghívása élesben
    // pl. resend.emails.send({ from: "hello@gamerhirek.hu", to: body.email, ... })

    return NextResponse.json({ success: true, message: "Sikeres feliratkozás!" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Hiba történt a feliratkozás során." },
      { status: 400 }
    );
  }
}
