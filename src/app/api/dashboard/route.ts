import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Contagem real de alunos
    const totalAlunos = await prisma.usuario.count({
      where: { role: "RESPONSAVEL" } // ou baseado no modelo Atleta
    });
    const totalAtletas = await prisma.atleta.count();

    // 2. Contagem de planos e exercícios
    const totalPlanos = await prisma.planoTreino.count();
    const totalExercicios = await prisma.exercicio.count();

    // 3. Obter o próximo treino (com base na data mais recente futura ou última registada)
    const proximoTreino = await prisma.planoTreino.findFirst({
      orderBy: { data: "desc" }, // No mundo real, buscaria a data >= hoje
    });

    // 4. Últimos planos para o feed rápido
    const ultimosPlanos = await prisma.planoTreino.findMany({
      take: 3,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      alunos: totalAtletas || 0,
      planosCount: totalPlanos || 0,
      exerciciosCount: totalExercicios || 0,
      proximoTreino: proximoTreino || null,
      ultimosPlanos: ultimosPlanos || []
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao obter métricas" }, { status: 500 });
  }
}