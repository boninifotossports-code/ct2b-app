import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const planos = await prisma.planoTreino.findMany({
      orderBy: { createdAt: 'desc' } // Mostra os mais recentes primeiro
    });
    
    return NextResponse.json(planos);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar os planos de treino." }, { status: 500 });
  }
}