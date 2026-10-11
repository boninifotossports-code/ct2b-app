import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("ct2b_session");

  // Rotas públicas que não precisam de login
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

  // Se não existir cookie de sessão, redireciona sempre para /login
  if (!sessionCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const session = JSON.parse(sessionCookie.value);

    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Responsáveis só podem ver o portal dos pais
    if (session.role === "RESPONSAVEL" && !pathname.startsWith("/portal-pais")) {
      return NextResponse.redirect(new URL("/portal-pais", request.url));
    }

    // Professores não acedem ao portal dos pais
    if (session.role === "PROFESSOR" && pathname.startsWith("/portal-pais")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};