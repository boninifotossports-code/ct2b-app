import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashSenha(senha: string) {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const loginDigitado = (body.usuario || body.email || "").toString().trim();
    const senha = (body.senha || "").toString();

    if (!loginDigitado || !senha) {
      return NextResponse.json(
        { error: "Informe o utilizador e a palavra-passe." },
        { status: 400 }
      );
    }

    // Busca pelo campo 'usuario' ou 'nome' de acordo com o schema
    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { usuario: { equals: loginDigitado, mode: "insensitive" } },
          { nome: { equals: loginDigitado, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilizador não encontrado." },
        { status: 401 }
      );
    }

    // Valida texto puro ou hash SHA-256
    const senhaValida =
      user.senha === senha || user.senha === hashSenha(senha);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Palavra-passe incorreta." },
        { status: 401 }
      );
    }

    const role = (user.role || "ADMIN").toUpperCase();

    const dadosSessao = {
      id: user.id,
      nome: user.nome,
      usuario: user.usuario,
      role: role,
    };

    const response = NextResponse.json({
      success: true,
      usuario: dadosSessao,
    });

    response.cookies.set({
      name: "ct2b_session",
      value: JSON.stringify(dadosSessao),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: `Erro no servidor: ${error?.message || "Falha interna"}` },
      { status: 500 }
    );
  }
}