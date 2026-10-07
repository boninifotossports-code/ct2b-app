import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona a tela inicial diretamente para o módulo de chamada
  redirect('/chamada');
}