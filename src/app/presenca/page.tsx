'use client';

import React, { useState } from 'react';
import { CalendarCheck, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export default function GuardianPresencePage() {
  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      date: 'Hoje, 29 de Setembro',
      weekday: 'Terça-feira',
      time: '16:30 - 18:00',
      modality: 'Futsal',
      theme: 'Passe Rápido & Transição',
      location: 'Quadra Principal - CT 2B',
      parentResponse: null as string | null,
      justificationReason: '',
    }
  ]);
  const [activeJustifyModal, setActiveJustifyModal] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const handleConfirm = (sessionId: string, response: string, reason?: string) => {
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, parentResponse: response, justificationReason: reason || '' } : s));
    setActiveJustifyModal(null);
    setReasonInput('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ct2b-orange to-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">LS</div>
          <div>
            <h2 className="text-lg font-bold text-white">Lucas Silva <span className="text-[10px] bg-white/10 text-white font-bold px-2 py-0.5 rounded-full border border-white/15">Sub-11</span></h2>
            <p className="text-xs text-ct2b-muted mt-0.5">Responsável: Carlos Silva</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-ct2b-bg/70 border border-ct2b-border rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-ct2b-orange shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-300">Confirme a presença para ajudar a planejar a sessão de hoje.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-ct2b-orange" /> Próximos Treinos</h3>
        {sessions.map((session) => (
          <div key={session.id} className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 transition-all shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-ct2b-orange">{session.modality} • {session.weekday}</span>
                <h4 className="text-base font-bold text-white mt-1">{session.date}</h4>
              </div>
              <div>
                {session.parentResponse === 'vai' && <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/15 border border-green-500/30 px-2.5 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Confirmado</span>}
                {session.parentResponse === 'nao_vai' && <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full"><AlertCircle className="w-3.5 h-3.5" /> Ausência</span>}
              </div>
            </div>
            <div className="my-3.5 py-3 border-y border-ct2b-border/60 space-y-1.5 text-xs text-ct2b-muted">
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-ct2b-orange" /> <span className="text-zinc-300">{session.time}</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-ct2b-orange" /> <span className="text-zinc-300">{session.location}</span></div>
            </div>
            {session.justificationReason && <p className="text-xs text-amber-400/90 italic bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 mb-3">Motivo: &quot;{session.justificationReason}&quot;</p>}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button onClick={() => handleConfirm(session.id, 'vai')} className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-ct2b-bg text-zinc-300 border border-ct2b-border hover:border-green-500/60"><CheckCircle className="w-4 h-4 text-green-400" /> Sim, vai</button>
              <button onClick={() => setActiveJustifyModal(session.id)} className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-ct2b-bg text-zinc-300 border border-ct2b-border hover:border-amber-500/60"><XCircle className="w-4 h-4 text-amber-400" /> Não poderá ir</button>
            </div>
          </div>
        ))}
      </div>

      {activeJustifyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">Justificar Ausência</h4>
            <textarea rows={3} value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} placeholder="Ex: Consulta médica..." className="w-full bg-ct2b-bg border border-ct2b-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ct2b-orange" />
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setActiveJustifyModal(null)} className="px-4 py-2 text-xs font-bold text-ct2b-muted hover:text-white">Voltar</button>
              <button onClick={() => handleConfirm(activeJustifyModal, 'nao_vai', reasonInput)} className="px-4 py-2 text-xs font-bold bg-amber-500 text-black rounded-xl">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}