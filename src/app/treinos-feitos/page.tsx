'use client';

import React, { useState } from 'react';
import { History, CheckCircle, Clock, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function PastTrainingsPage() {
  const [expandedId, setExpandedId] = useState<string | null>('t1');

  const trainingsHistory = [
    {
      id: 't1',
      date: '24 de Setembro de 2026',
      weekday: 'Quinta-feira',
      modality: 'Futsal',
      theme: 'Passe Rápido, Apoio e Transição Ofensiva',
      durationMinutes: 90,
      coachNotes: 'Excelente participação do atleta na movimentação sem bola.',
      drillsCompleted: [
        { title: 'Rondo 4x2', category: 'Aquecimento', description: 'Manutenção de posse com escape rápido.' },
        { title: 'Circuito Técnico', category: 'Técnico', description: 'Recepção orientada e quebra de linhas.' },
      ],
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ct2b-blue/15 text-blue-400 border border-ct2b-blue/30 mb-2">Área da Família</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><History className="w-5 h-5 text-ct2b-orange" /> Histórico de Treinos</h2>
        </div>
      </div>

      <div className="space-y-4">
        {trainingsHistory.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="bg-ct2b-surface border border-ct2b-border rounded-2xl overflow-hidden transition-all shadow-md">
              <div onClick={() => setExpandedId(isExpanded ? null : item.id)} className="p-5 cursor-pointer hover:bg-white/5 transition-colors flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-ct2b-orange/15 text-ct2b-orange">{item.modality}</span>
                    <span className="text-xs text-zinc-400">• {item.weekday}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.theme}</h3>
                  <p className="text-xs text-ct2b-muted mt-1">{item.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/15 px-2.5 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Presente</span>
                  <div className="text-zinc-400 p-1">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                </div>
              </div>
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-ct2b-border/60 bg-ct2b-bg/40 space-y-4">
                  <div className="p-3 bg-ct2b-bg rounded-xl border border-ct2b-border">
                    <span className="text-[10px] font-bold text-ct2b-orange uppercase block mb-1">Comentário do Treinador:</span>
                    <p className="text-xs text-zinc-300 italic">&quot;{item.coachNotes}&quot;</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-1.5 mb-2.5"><Layers className="w-3.5 h-3.5 text-ct2b-orange" /> Exercícios</h4>
                    <div className="space-y-2">
                      {item.drillsCompleted.map((drill, idx) => (
                        <div key={idx} className="p-3 bg-ct2b-surface rounded-xl border border-ct2b-border text-xs">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 mr-2">{drill.category}</span>
                          <span className="font-bold text-white">{drill.title}</span>
                          <p className="text-zinc-400 text-[11px] mt-1">{drill.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}