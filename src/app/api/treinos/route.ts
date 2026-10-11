import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista todos os treinos agendados ou filtra por data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");

    const treinos = await prisma.agendamentoTreino.findMany({
      where: data ? { data } : {},
      include: {
        confirmacoes: {
          include: {
            atleta: true,
          },
        },
      },
      orderBy: [{ data: "asc" }, { hora: "asc" }],
    });

    return NextResponse.json(treinos);
  } catch (error: any) {
    console.error("Erro ao procurar treinos:", error);
    return NextResponse.json(
      { error: "Erro ao procurar treinos." },
      { status: 500 }
    );
  }
}

// POST: Cria um novo treino utilizando o modelo agendamentoTreino
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      titulo,
      categoria,
      data,
      hora,
      local,
      vagasTotais,
      professorConvidado,
      recorrente,
    } = body;

    if (!data || !hora || !local) {
      return NextResponse.json(
        { error: "Data, horário e local são obrigatórios." },
        { status: 400 }
      );
    }

    const novoTreino = await prisma.agendamentoTreino.create({
      data: {
        titulo: titulo || "Treino CT 2B",
        categoria: categoria || "Geral",
        data,
        hora,
        local,
        vagasTotais: vagasTotais ? parseInt(vagasTotais, 10) : 12,
        professorConvidado: professorConvidado?.trim() || null,
        recorrente: Boolean(recorrente),
      },
    });

    return NextResponse.json(novoTreino, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar treino:", error);
    return NextResponse.json(
      { error: "Erro ao guardar treino.", detalhes: error.message },
      { status: 500 }
    );
  }
}