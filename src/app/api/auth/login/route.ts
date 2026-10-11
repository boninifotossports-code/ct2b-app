import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const usuarioRaw = body.usuario ? String(body.usuario).trim().toLowerCase() : "";
    const senhaRaw = body.senha ? String(body.senha).trim() : "";

    if (!usuarioRaw || !senhaRaw) {
      return NextResponse.json(
        { error: "Nome de usuário e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = await prisma.usuario.findFirst({
      where: {
        usuario: {
          equals: usuarioRaw,
          mode: "insensitive",
        },
      },
      include: {
        atletas: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 401 }
      );
    }

    if (String(user.senha).trim() !== senhaRaw) {
      return NextResponse.json(
        { error: "Senha incorreta." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      id: user.id,
      nome: user.nome,
      usuario: user.usuario,
      role: user.role,
      primeiroAcesso: user.primeiroAcesso,
      atletas: user.atletas,
    });

    response.cookies.set(
      "ct2b_session",
      JSON.stringify({
        id: user.id,
        usuario: user.usuario,
        role: user.role,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error: any) {
    console.error("Erro interno no POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao autenticar.", detalhes: error.message },
      { status: 500 }
    );
  }
}