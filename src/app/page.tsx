import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ct2b_session");

  // Se não tem cookie, manda para o login
  if (!sessionCookie || !sessionCookie.value) {
    redirect("/login");
  }

  try {
    const session = JSON.parse(sessionCookie.value);

    if (session.role === "RESPONSAVEL") {
      redirect("/portal-pais");
    }

    if (session.role === "PROFESSOR") {
      redirect("/presenca");
    }
  } catch {
    redirect("/login");
  }

  redirect("/login");
}