'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  CalendarCheck, 
  User, 
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function MyAthletePage() {
  const athlete = {
    name: 'Lucas Silva',
    nickname: 'Luquinhas',
    category: 'Sub-11',
    modality: 'Futsal & Campo',
    position: 'Fixo / Zagueiro',
    dominantFoot: 'Destro',
    birthDate: '14/05/2015 (11 anos)',
    guardianName: 'Carlos Silva (Pai)',
    phone: '(21) 98765-4321',
    medicalNotes: 'Sem restrições médicas cadastradas.',
    attendanceRate: 95,
    totalTrainings: 36,
    averageGrade: 8.3,
  };

  const latestFeedback = {
    period: '1º Bimestre - 2026',
    strengths: 'Excelente leitura dos espaços, forte compromisso tático na cobertura e passe de primeira muito assertivo.',
    toImprove: 'Intensificar a confiança na finalização de média distância com a perna não dominante.',
    coachMessage: 'Atleta com liderança positiva no grupo, assiduidade exemplar nos treinos e enorme dedicação aos exercícios propostos.',
    scores: [
      { name: 'Passe & Precisão', score: 8 },
      { name: 'Domínio com a Sola', score: 7 },
      { name: 'Tomada de Decisão', score: 8 },
      { name: 'Visão de Jogo', score: 9 },
      { name: 'Agilidade & Reação', score: 8 },
      { name: 'Disciplina & Postura', score: 10 },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Card Principal de Perfil do Atleta */}
      <div className="bg-ct2b-surface border border-ct2b-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-ct2b-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-ct2b-orange to-amber-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-ct2b-orange/20 shrink-0">
            LS
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-white">{athlete.name}</h2>
              <span className="text-xs bg-ct2b-orange/15 text-ct2b-orange border border-ct2b-orange/30 font-bold px-2.5 py-0.5 rounded-full">
                {athlete.category}
              </span>
            </div>

            <p className="text-xs text-ct2b-muted mt-1">
              Posição: <span className="text-zinc-200 font-semibold">{athlete.position}</span> • Pé: <span className="text-zinc-200 font-semibold">{athlete.dominantFoot}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-ct2b-orange" /> {athlete.birthDate}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-ct2b-orange" /> {athlete.guardianName}
              </span>
            </div>
          </div>

          {/* Atalho Rápido para Confirmação de Presença */}
          <Link
            href="/presenca"
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-ct2b-orange hover:bg-ct2b-orange-hover text-white text-xs font-bold transition-all shadow-lg shadow-ct2b-orange/20 flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            Confirmar Próximo Treino
          </Link>
        </div>

        {/* Métricas do Atleta */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-ct2b-border/60 text-center">
          <div className="p-3 bg-ct2b-bg/70 rounded-2xl border border-ct2b-border">
            <p className="text-[10px] text-ct2b-muted uppercase font-bold">Assiduidade</p>
            <p className="text-xl font-black text-green-400 mt-0.5">{athlete.attendanceRate}%</p>
          </div>
          <div className="p-3 bg-ct2b-bg/70 rounded-2xl border border-ct2b-border">
            <p className="text-[10px] text-ct2b-muted uppercase font-bold">Treinos no Ano</p>
            <p className="text-xl font-black text-white mt-0.5">{athlete.totalTrainings}</p>
          </div>
          <div className="p-3 bg-ct2b-bg/70 rounded-2xl border border-ct2b-border">
            <p className="text-[10px] text-ct2b-muted uppercase font-bold">Nota Média</p>
            <p className="text-xl font-black text-ct2b-orange mt-0.5">{athlete.averageGrade}</p>
          </div>
        </div>
      </div>

      {/* Seção do Boletim Oficial Vigente */}
      <div className="bg-ct2b-surface border border-ct2b-border rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-ct2b-border pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ct2b-orange">
              Última Avaliação Registrada
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Award className="w-5 h-5 text-ct2b-orange" />
              Boletim de Desenvolvimento • {latestFeedback.period}
            </h3>
          </div>

          <Link
            href="/treinos-feitos"
            className="text-xs font-semibold text-ct2b-muted hover:text-white flex items-center gap-1"
          >
            Ver treinos feitos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pilares de Notas */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Avaliação Técnica e Comportamental
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {latestFeedback.scores.map((s) => (
              <div key={s.name} className="p-3 bg-ct2b-bg rounded-xl border border-ct2b-border flex items-center justify-between">
                <span className="text-xs text-zinc-300 font-medium truncate pr-2">{s.name}</span>
                <span className="text-xs font-black text-ct2b-orange bg-ct2b-surface px-2 py-0.5 rounded-md border border-ct2b-border">
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comentários dos Professores */}
        <div className="space-y-3 pt-2">
          <div className="p-3.5 bg-ct2b-bg rounded-xl border border-ct2b-border">
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block mb-1">
              ✓ Pontos Fortes do Atleta
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {latestFeedback.strengths}
            </p>
          </div>

          <div className="p-3.5 bg-ct2b-bg rounded-xl border border-ct2b-border">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              ⚡ Foco para as Próximas Sessões
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {latestFeedback.toImprove}
            </p>
          </div>

          <div className="p-3.5 bg-ct2b-bg rounded-xl border border-ct2b-border">
            <span className="text-[10px] font-bold text-ct2b-orange uppercase tracking-wider block mb-1">
              ★ Recado da Comissão Técnica para a Família
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {latestFeedback.coachMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}