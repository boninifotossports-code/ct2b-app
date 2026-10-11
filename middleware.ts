import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("ct2b_session");

  // Rotas e recursos abertos
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

  // Redireciona a rota legada /chamada para a oficial /presenca
  if (pathname.startsWith("/chamada")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/presenca", request.url));
  }

  // Sem sessão, reencaminha obrigatoriamente para /login
  if (!sessionCookie || !sessionCookie.value) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const session = JSON.parse(sessionCookie.value);

    if (!session || !session.role) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("ct2b_session");
      return response;
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    if (session.role === "RESPONSAVEL" && !pathname.startsWith("/portal-pais")) {
      return NextResponse.redirect(new URL("/portal-pais", request.url));
    }

    if (session.role === "PROFESSOR" && pathname.startsWith("/portal-pais")) {
      return NextResponse.redirect(new URL("/presenca", request.url));
    }
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("ct2b_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};