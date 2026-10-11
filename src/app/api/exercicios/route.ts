import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista todos os exercícios salvos da biblioteca
export async function GET() {
  try {
    const exercicios = await prisma.exercicio.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(exercicios);
  } catch (error: any) {
    console.error("Erro ao listar exercícios:", error);
    return NextResponse.json({ error: "Erro ao buscar exercícios." }, { status: 500 });
  }
}

// POST: Salva um novo exercício montado na prancheta
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      time,
      players,
      space,
      specificObjective,
      description,
      image,
    } = body;

    // Garante que a imagem exista (ou seja um fallback válido)
    if (!image) {
      return NextResponse.json(
        { error: "A imagem da prancheta não foi capturada corretamente." },
        { status: 400 }
      );
    }

    // Cria o exercício com valores de fallback para evitar quebra por campos vazios
    const novoExercicio = await prisma.exercicio.create({
      data: {
        title: title?.trim() || "Exercício Tático",
        time: time?.trim() || "15 min",
        players: players?.trim() || "Geral",
        space: space?.trim() || "Meio Campo",
        specificObjective: specificObjective?.trim() || "Desenvolvimento técnico/tático",
        description: description?.trim() || "Sem descrição metodológica.",
        image,
      },
    });

    return NextResponse.json(novoExercicio, { status: 201 });
  } catch (error: any) {
    console.error("ERRO DETALHADO AO SALVAR EXERCÍCIO:", error);
    return NextResponse.json(
      { error: "Erro ao guardar na base de dados.", detalhes: error.message },
      { status: 500 }
    );
  }
}