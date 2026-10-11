import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("ct2b_session");

  // 1. Recursos estáticos, ficheiros públicos e rotas de autenticação abertas
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/seed") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon.ico") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes(".svg")
  ) {
    return NextResponse.next();
  }

  // 2. Se NÃO houver cookie de sessão, força SEMPRE para /login
  if (!sessionCookie || !sessionCookie.value) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Validação do conteúdo da sessão
  try {
    const session = JSON.parse(sessionCookie.value);

    // Se a sessão não tiver role válido, invalida e manda para login
    if (!session || !session.role) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("ct2b_session");
      return response;
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Se for Responsável e tentar sair do portal dos pais
    if (session.role === "RESPONSAVEL" && !pathname.startsWith("/portal-pais")) {
      return NextResponse.redirect(new URL("/portal-pais", request.url));
    }

    // Se for Professor e tentar entrar no portal dos pais
    if (session.role === "PROFESSOR" && pathname.startsWith("/portal-pais")) {
      return NextResponse.redirect(new URL("/presenca", request.url));
    }
  } catch {
    // Se o cookie estiver corrompido, limpa e manda para login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("ct2b_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware a todas as rotas exceto ficheiros estáticos gerados
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};