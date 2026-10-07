'use client';

import React, { useState } from 'react';
import { FileText, Award, Share2, Save, Sliders } from 'lucide-react';
import { SkillScore } from '@/types/feedback';

export default function FeedbackModulePage() {
  const [selectedAthleteId, setSelectedAthleteId] = useState('1');
  const [evaluationPeriod, setEvaluationPeriod] = useState('Bimestre 1 - 2026');
  const [isGenerated, setIsGenerated] = useState(false);

  const athletes = [
    { id: '1', name: 'Lucas Silva', category: 'Sub-11', pos: 'Fixo / Zagueiro' },
    { id: '2', name: 'Matheus Oliveira', category: 'Sub-11', pos: 'Ala / Ponta' },
    { id: '3', name: 'Enzo Gabriel', category: 'Sub-11', pos: 'Pivô / Centroavante' },
  ];

  const [scores, setScores] = useState<SkillScore[]>([
    { name: 'Passe & Precisão', category: 'Técnico', score: 8 },
    { name: 'Domínio Orientado (Sola/Peito)', category: 'Técnico', score: 7 },
    { name: 'Tomada de Decisão', category: 'Tático', score: 8 },
    { name: 'Visão de Jogo & Posicionamento', category: 'Tático', score: 9 },
    { name: 'Agilidade & Mudança de Direção', category: 'Físico/Motor', score: 8 },
    { name: 'Disciplina, Pontualidade & Foco', category: 'Comportamental', score: 10 },
  ]);

  const [strengths, setStrengths] = useState('Excelente leitura dos espaços, forte compromisso tático na cobertura e passe de primeira muito assertivo.');
  const [areasToImprove, setAreasToImprove] = useState('Intensificar a confiança na finalização de média distância com a perna não dominante.');
  const [generalObservations, setGeneralObservations] = useState('Atleta com liderança positiva no grupo, assiduidade exemplar nos treinos e enorme dedicação aos exercícios propostos.');

  const handleScoreChange = (index: number, newScore: number) => {
    setIsGenerated(false);
    const updated = [...scores];
    updated[index].score = newScore;
    setScores(updated);
  };

  const currentAthlete = athletes.find((a) => a.id === selectedAthleteId) || athletes[0];
  const averageScore = (scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ct2b-orange/15 text-ct2b-orange border border-ct2b-orange/30 mb-2">
            Avaliação Pedagógica
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-ct2b-orange" />
            Feedbacks & Boletim Oficial
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
            className="bg-ct2b-bg text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-ct2b-border focus:outline-none focus:border-ct2b-orange"
          >
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.category} - {a.pos})</option>
            ))}
          </select>
          <select
            value={evaluationPeriod}
            onChange={(e) => setEvaluationPeriod(e.target.value)}
            className="bg-ct2b-bg text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-ct2b-border focus:outline-none focus:border-ct2b-orange"
          >
            <option value="Bimestre 1 - 2026">1º Bimestre</option>
            <option value="Bimestre 2 - 2026">2º Bimestre</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-ct2b-border/60 pb-3">
              <Sliders className="w-4 h-4 text-ct2b-orange" /> Critérios (Nota 1 a 10)
            </h3>
            <div className="space-y-3.5">
              {scores.map((item, idx) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-200">{item.name}</span>
                    <span className="font-black text-ct2b-orange bg-ct2b-bg px-2 py-0.5 rounded-md border border-ct2b-border">{item.score} / 10</span>
                  </div>
                  <input type="range" min="1" max="10" value={item.score} onChange={(e) => handleScoreChange(idx, Number(e.target.value))} className="w-full accent-ct2b-orange bg-ct2b-bg h-1.5 rounded-lg cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-md space-y-3.5">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Pontos Fortes</label>
              <textarea rows={2} value={strengths} onChange={(e) => setStrengths(e.target.value)} className="w-full bg-ct2b-bg border border-ct2b-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-ct2b-orange" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">A Desenvolver</label>
              <textarea rows={2} value={areasToImprove} onChange={(e) => setAreasToImprove(e.target.value)} className="w-full bg-ct2b-bg border border-ct2b-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-ct2b-orange" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Parecer Geral</label>
              <textarea rows={3} value={generalObservations} onChange={(e) => setGeneralObservations(e.target.value)} className="w-full bg-ct2b-bg border border-ct2b-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-ct2b-orange" />
            </div>
            <button onClick={() => setIsGenerated(true)} className="w-full py-2.5 rounded-xl bg-ct2b-orange hover:bg-ct2b-orange-hover text-white text-xs font-bold flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Atualizar Prévia
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2"><Award className="w-4 h-4 text-ct2b-orange" /> Boletim Oficial</h3>
            <button className="p-2 bg-green-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5" /> Compartilhar</button>
          </div>
          <div className="bg-ct2b-surface border-2 border-ct2b-border rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-ct2b-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black border-2 border-ct2b-orange flex items-center justify-center font-black text-ct2b-orange text-lg">2B</div>
                <div>
                  <h4 className="text-sm font-black uppercase text-white tracking-wider">Centro de Treinamento 2B</h4>
                </div>
              </div>
              <span className="text-[11px] font-bold text-ct2b-orange bg-ct2b-orange/10 px-2.5 py-1 rounded-full">{evaluationPeriod}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-ct2b-bg/70 p-3.5 rounded-2xl border border-ct2b-border text-center">
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold">Atleta</p><p className="text-xs font-bold text-white mt-0.5">{currentAthlete.name}</p></div>
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold">Categoria</p><p className="text-xs font-bold text-ct2b-orange mt-0.5">{currentAthlete.category}</p></div>
              <div><p className="text-[10px] text-zinc-500 uppercase font-bold">Média</p><p className="text-xs font-black text-green-400 mt-0.5">{averageScore}</p></div>
            </div>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-ct2b-bg rounded-xl border border-ct2b-border">
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block mb-1">✓ Pontos Fortes</span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{strengths}</p>
              </div>
              <div className="p-3 bg-ct2b-bg rounded-xl border border-ct2b-border">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">⚡ A Evoluir</span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{areasToImprove}</p>
              </div>
              <div className="p-3 bg-ct2b-bg rounded-xl border border-ct2b-border">
                <span className="text-[10px] font-bold text-ct2b-orange uppercase tracking-wider block mb-1">★ Mensagem</span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{generalObservations}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-ct2b-border/60 flex items-center justify-between text-[10px] text-zinc-500">
              <span>CT 2B</span><span className="font-bold text-blue-500">Software by AB LABS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}