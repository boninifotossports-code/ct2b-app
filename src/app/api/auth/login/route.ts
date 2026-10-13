import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashSenha(senha: string) {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identificador = (body.usuario || body.email || "").toString().trim();
    const senha = (body.senha || "").toString();

    if (!identificador || !senha) {
      return NextResponse.json(
        { error: "Informe utilizador/email e palavra-passe." },
        { status: 400 }
      );
    }

    // Busca direta sem 'include' para não estourar erro se a relação não existir
    // Procura por email ou username/nome
    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: { equals: identificador, mode: "insensitive" } },
          // caso o campo no seu schema seja 'nome' ou 'usuario'
          { nome: { equals: identificador, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Validação flexível: texto puro ou SHA-256
    const senhaCorreta =
      user.senha === senha || user.senha === hashSenha(senha);

    if (!senhaCorreta) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Extrai o papel (role ou tipo) de forma segura
    const anyUser = user as any;
    const rawRole = anyUser.role || anyUser.tipo || anyUser.perfil || "ADMIN";
    const role = String(rawRole).toUpperCase();

    const dadosSessao = {
      id: user.id,
      nome: user.nome,
      email: user.email,
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
    console.error("Erro detalhado no login:", error);
    return NextResponse.json(
      { error: `Erro no servidor: ${error?.message || "Falha ao consultar banco"}` },
      { status: 500 }
    );
  }
}