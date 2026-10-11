import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Retorna todos os atletas com os dados dos seus responsáveis (se houver)
export async function GET() {
  try {
    const atletas = await prisma.atleta.findMany({
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            usuario: true,
            telefone: true,
          },
        },
      },
      orderBy: { nomeCompleto: "asc" },
    });

    return NextResponse.json(atletas);
  } catch (error: any) {
    console.error("Erro ao buscar atletas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar atletas.", detalhes: error.message },
      { status: 500 }
    );
  }
}

// POST: Cadastra um novo atleta
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomeCompleto, categoria, posicao, dataNascimento, responsavelId } = body;

    if (!nomeCompleto || !categoria) {
      return NextResponse.json(
        { error: "Nome completo e categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const novoAtleta = await prisma.atleta.create({
      data: {
        nomeCompleto: nomeCompleto.trim(),
        categoria,
        posicao: posicao?.trim() || null,
        dataNascimento: dataNascimento || null,
        responsavelId: responsavelId || null,
      },
      include: {
        responsavel: true,
      },
    });

    return NextResponse.json(novoAtleta, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao cadastrar atleta:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar atleta.", detalhes: error.message },
      { status: 500 }
    );
  }
}