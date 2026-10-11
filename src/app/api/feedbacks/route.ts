import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const atletaId = searchParams.get("atletaId");
    const atletaIds = searchParams.get("atletaIds");
    const treinoId = searchParams.get("treinoId");

    const where: any = {};

    if (atletaId) {
      where.atletaId = atletaId;
    } else if (atletaIds) {
      where.atletaId = { in: atletaIds.split(",") };
    }

    if (treinoId) {
      where.treinoId = treinoId;
    }

    const feedbacks = await prisma.feedback.findMany({
      where,
      include: {
        atleta: true,
        treino: true,
      },
      orderBy: { data: "desc" },
    });

    return NextResponse.json(feedbacks);
  } catch (error: any) {
    console.error("Erro ao buscar feedbacks:", error);
    return NextResponse.json({ error: "Erro ao carregar feedbacks." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { atletaId, treinoId, nota, tags, comentario, tipo } = body;

    if (!comentario && !tags) {
      return NextResponse.json(
        { error: "Insira ao menos uma tag de destaque ou comentário." },
        { status: 400 }
      );
    }

    const novoFeedback = await prisma.feedback.create({
      data: {
        tipo: tipo || "INDIVIDUAL",
        nota: nota ? parseInt(nota, 10) : 5,
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
        comentario: comentario?.trim() || "",
        atletaId: atletaId || null,
        treinoId: treinoId || null,
      },
      include: {
        atleta: true,
      },
    });

    return NextResponse.json(novoFeedback, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao salvar feedback:", error);
    return NextResponse.json({ error: "Erro ao salvar feedback.", detalhes: error.message }, { status: 500 });
  }
}