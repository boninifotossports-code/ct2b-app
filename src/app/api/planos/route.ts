import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const plano = await prisma.planoTreino.findUnique({ where: { id } });
      if (!plano) {
        return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });
      }
      return NextResponse.json(plano);
    }

    const planos = await prisma.planoTreino.findMany({
      orderBy: { numeroPlano: "asc" },
    });
    return NextResponse.json(planos);
  } catch (error: any) {
    console.error("Erro ao carregar planos:", error);
    return NextResponse.json({ error: "Erro ao carregar planos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      numeroPlano,
      data,
      hora,
      microciclo,
      mesociclo,
      periodo,
      clima,
      volume,
      jogadores,
      material,
      objetivosGerais,
      objetivosEspecificos,
      observacoes,
      atividades,
    } = body;

    const numFormatado = parseInt(String(numeroPlano), 10) || 1;

    if (id) {
      const atualizado = await prisma.planoTreino.update({
        where: { id },
        data: {
          numeroPlano: numFormatado,
          data: data || "",
          hora: hora || "",
          microciclo: microciclo || "",
          mesociclo: mesociclo || "",
          periodo: periodo || "",
          clima: clima || "",
          volume: volume || "",
          jogadores: jogadores || "",
          material: material || "",
          objetivosGerais: objetivosGerais || "",
          objetivosEspecificos: objetivosEspecificos || "",
          observacoes: observacoes || "",
          atividades: atividades || [],
        },
      });
      return NextResponse.json(atualizado);
    }

    const novo = await prisma.planoTreino.upsert({
      where: { numeroPlano: numFormatado },
      update: {
        data: data || "",
        hora: hora || "",
        microciclo: microciclo || "",
        mesociclo: mesociclo || "",
        periodo: periodo || "",
        clima: clima || "",
        volume: volume || "",
        jogadores: jogadores || "",
        material: material || "",
        objetivosGerais: objetivosGerais || "",
        objetivosEspecificos: objetivosEspecificos || "",
        observacoes: observacoes || "",
        atividades: atividades || [],
      },
      create: {
        numeroPlano: numFormatado,
        data: data || "",
        hora: hora || "",
        microciclo: microciclo || "",
        mesociclo: mesociclo || "",
        periodo: periodo || "",
        clima: clima || "",
        volume: volume || "",
        jogadores: jogadores || "",
        material: material || "",
        objetivosGerais: objetivosGerais || "",
        objetivosEspecificos: objetivosEspecificos || "",
        observacoes: observacoes || "",
        atividades: atividades || [],
      },
    });

    return NextResponse.json(novo, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao salvar plano:", error);
    return NextResponse.json({ error: "Erro ao salvar plano.", detalhes: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
    }

    await prisma.planoTreino.delete({ where: { id } });
    return NextResponse.json({ sucesso: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao eliminar plano." }, { status: 500 });
  }
}