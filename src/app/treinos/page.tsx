// Forçando atualização
'use client';

import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, Clock, Sparkles, Save, Layers, CheckCircle2, Flame, Package } from 'lucide-react';
import { DrillCategory } from '@/types/training';

export default function TrainingBuilderPage() {
  const [modality, setModality] = useState('Futsal');
  const [category, setCategory] = useState('Sub-11');
  const [mainTheme, setMainTheme] = useState('Passe Rápido, Apoio e Transição');
  const [intensity, setIntensity] = useState('Alta');
  const [isSaved, setIsSaved] = useState(false);

  const [drills, setDrills] = useState([
    { id: '1', title: 'Rondo 4x2', category: 'Aquecimento', durationMinutes: 15, materialsNeeded: ['Cones', 'Bolas'] }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ct2b-orange/15 text-ct2b-orange border border-ct2b-orange/30 mb-2">Planejamento</span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Dumbbell className="w-5 h-5 text-ct2b-orange" /> Montador de Treino</h2>
          </div>
          <button onClick={() => setIsSaved(true)} className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg ${isSaved ? 'bg-green-600 text-white' : 'bg-ct2b-orange hover:bg-ct2b-orange-hover text-white'}`}>
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />} {isSaved ? 'Salvo!' : 'Salvar Treino'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-ct2b-border/60">
          <div>
            <label className="text-[11px] font-bold text-ct2b-muted uppercase block mb-1.5">Modalidade</label>
            <div className="flex bg-ct2b-bg p-1 rounded-xl border border-ct2b-border">
              {['Futsal', 'Campo'].map((m) => (
                <button key={m} onClick={() => setModality(m)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${modality === m ? 'bg-ct2b-orange text-white' : 'text-ct2b-muted'}`}>{m}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-ct2b-border/60">
          <label className="text-[11px] font-bold text-ct2b-muted uppercase block mb-1.5">Tema Central</label>
          <div className="relative">
            <input type="text" value={mainTheme} onChange={(e) => setMainTheme(e.target.value)} className="w-full bg-ct2b-bg text-white text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-ct2b-border focus:border-ct2b-orange pl-9" />
            <Sparkles className="w-4 h-4 text-ct2b-orange absolute left-3 top-3" />
          </div>
        </div>
      </div>
    </div>
  );
}