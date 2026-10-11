import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Retorna as presenças salvas para um treino específico
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const treinoId = searchParams.get("treinoId");

    if (!treinoId) {
      return NextResponse.json({ error: "treinoId é obrigatório." }, { status: 400 });
    }

    const presencas = await prisma.presenca.findMany({
      where: { treinoId },
    });

    return NextResponse.json(presencas);
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar presenças." }, { status: 500 });
  }
}

// POST: Salva ou atualiza a presença do atleta para aquele treino
export async function POST(req: Request) {
  try {
    const { treinoId, atletaId, status } = await req.json();

    if (!treinoId || !atletaId || !status) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const presenca = await prisma.presenca.upsert({
      where: {
        treinoId_atletaId: {
          treinoId,
          atletaId,
        },
      },
      update: { status },
      create: {
        treinoId,
        atletaId,
        status,
      },
    });

    return NextResponse.json(presenca);
  } catch (error: any) {
    console.error("Erro ao salvar presença:", error);
    return NextResponse.json({ error: "Erro ao registrar presença." }, { status: 500 });
  }
}