import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Elimina qualquer registo inconsistente com esse username
    await prisma.usuario.deleteMany({
      where: { usuario: "prof.arthur" }
    });

    // Cria o utilizador com dados limpos
    const admin = await prisma.usuario.create({
      data: {
        nome: "Professor Arthur",
        usuario: "prof.arthur",
        senha: "123",
        role: "PROFESSOR",
        telefone: "21999999999"
      }
    });

    console.log("UTILIZADOR SEED CRIADO:", admin);

    return NextResponse.json({
      sucesso: true,
      mensagem: "Utilizador administrador criado com sucesso na base de dados!",
      dados: {
        id: admin.id,
        usuario: admin.usuario,
        senha: admin.senha,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error("Erro fatal no seed:", error);
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}