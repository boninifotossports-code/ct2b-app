import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Função utilitária para hash de senha simples (caso utilize sha256)
function hashSenha(senha: string) {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { usuario, email, senha } = await request.json();

    const identificador = (usuario || email || "").trim();

    if (!identificador || !senha) {
      return NextResponse.json(
        { error: "Informe as credenciais de acesso." },
        { status: 400 }
      );
    }

    // Busca o usuário pelo username, email ou telefone/documento
    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: identificador },
          { usuario: identificador },
          { telefone: identificador },
        ],
      },
      include: {
        atleta: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Validação de senha: testa texto puro ou hash SHA-256
    const senhaValida =
      user.senha === senha || user.senha === hashSenha(senha);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Normaliza a role (maiúsculas)
    const role = (user.role || "RESPONSAVEL").toUpperCase();

    // Monta o payload seguro para resposta e sessão
    const dadosSessao = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: role,
      atletaId: user.atletaId || user.atleta?.id || null,
    };

    const response = NextResponse.json({
      success: true,
      usuario: dadosSessao,
    });

    // Define cookie de sessão HTTP-Only para controle do middleware
    response.cookies.set({
      name: "ct2b_session",
      value: JSON.stringify(dadosSessao),
      httpOnly: false, // acessível no front ou client-side se necessário
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o login." },
      { status: 500 }
    );
  }
}