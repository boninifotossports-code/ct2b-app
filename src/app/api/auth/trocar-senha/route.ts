import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { usuarioId, novaSenha } = await req.json();

    if (!usuarioId || !novaSenha || novaSenha.trim().length < 4) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 4 caracteres." },
        { status: 400 }
      );
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        senha: novaSenha.trim(),
        primeiroAcesso: false,
      },
    });

    return NextResponse.json({
      sucesso: true,
      mensagem: "Senha atualizada com sucesso!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao atualizar senha." }, { status: 500 });
  }
}