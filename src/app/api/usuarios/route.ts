import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista todos os usuários e os atletas cadastrados para seleção
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { atletas: true },
      orderBy: { createdAt: "desc" },
    });

    const atletas = await prisma.atleta.findMany({
      orderBy: { nomeCompleto: "asc" },
    });

    return NextResponse.json({ usuarios, atletas });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar dados." }, { status: 500 });
  }
}

// POST: Cria o novo usuário e vincula os atletas escolhidos
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, usuario, senhaInicial, role, telefone, atletasIds } = body;

    if (!nome || !usuario || !senhaInicial || !role) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const usuarioFormatado = usuario.toLowerCase().trim();

    const existe = await prisma.usuario.findUnique({
      where: { usuario: usuarioFormatado },
    });

    if (existe) {
      return NextResponse.json(
        { error: "Este nome de usuário já está em uso." },
        { status: 400 }
      );
    }

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        usuario: usuarioFormatado,
        senha: senhaInicial.trim(),
        role,
        telefone: telefone || null,
        primeiroAcesso: true,
        atletas: {
          connect: Array.isArray(atletasIds)
            ? atletasIds.map((id: string) => ({ id }))
            : [],
        },
      },
      include: { atletas: true },
    });

    return NextResponse.json(novoUsuario, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário.", detalhes: error.message },
      { status: 500 }
    );
  }
}