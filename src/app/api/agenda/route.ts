import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dataInicio = searchParams.get("inicio");
    const dataFim = searchParams.get("fim");

    const treinos = await prisma.agendamentoTreino.findMany({
      where: dataInicio && dataFim ? {
        data: {
          gte: dataInicio,
          lte: dataFim,
        },
      } : {},
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
    console.error("Erro no GET /api/agenda:", error);
    return NextResponse.json({ error: "Erro ao obter treinos." }, { status: 500 });
  }
}

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
      semanasRecorrencia = 4,
    } = body;

    if (!data || !hora || !local || !vagasTotais) {
      return NextResponse.json({ error: "Campos obrigatórios em falta." }, { status: 400 });
    }

    const grupoRecorrenciaId = recorrente ? `rec_${Date.now()}` : null;
    const dataObj = new Date(`${data}T12:00:00Z`);
    const diaSemana = dataObj.getUTCDay();

    if (!recorrente) {
      const treino = await prisma.agendamentoTreino.create({
        data: {
          titulo: titulo || "Treino CT 2B",
          categoria: categoria || "Geral",
          data,
          hora,
          local,
          vagasTotais: parseInt(vagasTotais, 10),
          professorConvidado: professorConvidado?.trim() || null,
          recorrente: false,
        },
      });
      return NextResponse.json(treino, { status: 201 });
    }

    const treinosCriar = [];
    for (let i = 0; i < semanasRecorrencia; i++) {
      const d = new Date(dataObj);
      d.setUTCDate(d.getUTCDate() + i * 7);
      const dataFormatada = d.toISOString().split("T")[0];

      treinosCriar.push({
        titulo: titulo || "Treino CT 2B",
        categoria: categoria || "Geral",
        data: dataFormatada,
        hora,
        local,
        vagasTotais: parseInt(vagasTotais, 10),
        professorConvidado: i === 0 && professorConvidado ? professorConvidado.trim() : null,
        recorrente: true,
        diaSemana,
        grupoRecorrenciaId,
      });
    }

    await prisma.agendamentoTreino.createMany({ data: treinosCriar });
    return NextResponse.json({ sucesso: true, criados: treinosCriar.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao criar treino.", detalhes: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      local,
      hora,
      vagasTotais,
      professorConvidado,
      bloqueado,
      escopoEdicao,
    } = body;

    const treinoAtual = await prisma.agendamentoTreino.findUnique({ where: { id } });
    if (!treinoAtual) {
      return NextResponse.json({ error: "Treino não encontrado." }, { status: 404 });
    }

    if (escopoEdicao === "TODOS_RECORRENTES" && treinoAtual.grupoRecorrenciaId) {
      await prisma.agendamentoTreino.updateMany({
        where: {
          grupoRecorrenciaId: treinoAtual.grupoRecorrenciaId,
          data: { gte: treinoAtual.data },
        },
        data: {
          local,
          hora,
          vagasTotais: parseInt(vagasTotais, 10),
          bloqueado,
        },
      });

      if (professorConvidado !== undefined) {
        await prisma.agendamentoTreino.update({
          where: { id },
          data: { professorConvidado: professorConvidado?.trim() || null },
        });
      }
    } else {
      await prisma.agendamentoTreino.update({
        where: { id },
        data: {
          local,
          hora,
          vagasTotais: parseInt(vagasTotais, 10),
          bloqueado,
          professorConvidado: professorConvidado?.trim() || null,
        },
      });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao atualizar treino." }, { status: 500 });
  }
}