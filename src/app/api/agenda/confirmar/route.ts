import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { treinoId, atletaId, status } = await req.json();

    if (!treinoId || !atletaId || !status) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const confirmacao = await prisma.confirmacaoTreino.upsert({
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

    return NextResponse.json(confirmacao);
  } catch (error: any) {
    console.error("Erro ao confirmar presença:", error);
    return NextResponse.json({ error: "Erro ao registar confirmação." }, { status: 500 });
  }
}