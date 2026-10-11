import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ct2b_session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    if (session.role === "RESPONSAVEL") {
      redirect("/portal-pais");
    }
  } catch {
    redirect("/login");
  }

  // Se for professor/comissão técnica autenticado, segue para a página inicial pretendida:
  redirect("/presenca");
}