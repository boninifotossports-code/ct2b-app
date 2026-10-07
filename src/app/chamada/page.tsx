'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Save, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { AthleteAttendance, AttendanceStatus } from '@/types/attendance';

export default function AttendancePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('Sub-11');
  const [modalityFilter, setModalityFilter] = useState<'Futsal' | 'Campo'>('Futsal');
  const [isSaved, setIsSaved] = useState(false);

  // Lista de atletas da turma
  const [athletes, setAthletes] = useState<AthleteAttendance[]>([
    {
      id: '1',
      name: 'Lucas Silva',
      category: 'Sub-11',
      position: 'Fixo / Zagueiro',
      parentConfirmed: true,
      status: 'presente',
    },
    {
      id: '2',
      name: 'Matheus Oliveira',
      category: 'Sub-11',
      position: 'Ala / Ponta',
      parentConfirmed: true,
      status: 'presente',
    },
    {
      id: '3',
      name: 'Enzo Gabriel',
      category: 'Sub-11',
      position: 'Pivô / Centroavante',
      parentConfirmed: false,
      status: 'justificada',
    },
    {
      id: '4',
      name: 'Gabriel Costa',
      category: 'Sub-11',
      position: 'Goleiro',
      parentConfirmed: null,
      status: null,
    },
    {
      id: '5',
      name: 'Thiago Mendes',
      category: 'Sub-11',
      position: 'Ala / Meio-campo',
      parentConfirmed: true,
      status: null,
    },
  ]);

  // Função para marcar presença em 1 toque
  const handleMarkStatus = (athleteId: string, newStatus: AttendanceStatus) => {
    setIsSaved(false);
    setAthletes((prev) =>
      prev.map((item) =>
        item.id === athleteId
          ? { ...item, status: item.status === newStatus ? null : newStatus }
          : item
      )
    );
  };

  // Marcar todos como presentes
  const handleMarkAllPresent = () => {
    setIsSaved(false);
    setAthletes((prev) =>
      prev.map((item) => ({ ...item, status: 'presente' }))
    );
  };

  // Indicadores
  const total = athletes.length;
  const presentes = athletes.filter((a) => a.status === 'presente').length;
  const faltas = athletes.filter((a) => a.status === 'falta').length;
  const taxaPresenca = total > 0 ? Math.round((presentes / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Sessão */}
      <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ct2b-orange/15 text-ct2b-orange border border-ct2b-orange/30 mb-2">
              Sessão de Treino Ativa
            </span>
            <h2 className="text-xl font-bold text-white">Chamada e Presença</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-ct2b-muted mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-ct2b-orange" /> Terça-feira, 29 de Setembro
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ct2b-orange" /> 16:30 - 18:00
              </span>
            </div>
          </div>

          {/* Filtros de Turma */}
          <div className="flex items-center gap-2">
            <div className="flex bg-ct2b-bg p-1 rounded-xl border border-ct2b-border">
              {(['Futsal', 'Campo'] as const).map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setModalityFilter(mod)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modalityFilter === mod
                      ? 'bg-ct2b-orange text-white'
                      : 'text-ct2b-muted hover:text-white'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-ct2b-bg text-white text-xs font-bold px-3 py-2 rounded-xl border border-ct2b-border focus:outline-none focus:border-ct2b-orange"
              >
                <option value="Sub-9">Sub-9</option>
                <option value="Sub-11">Sub-11</option>
                <option value="Sub-13">Sub-13</option>
                <option value="Sub-15">Sub-15</option>
              </select>
            </div>
          </div>
        </div>

        {/* Indicadores Rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-ct2b-border/60">
          <div className="bg-ct2b-bg/80 p-3 rounded-xl border border-ct2b-border">
            <p className="text-[11px] text-ct2b-muted font-medium">Total Atletas</p>
            <p className="text-xl font-bold text-white mt-0.5">{total}</p>
          </div>
          <div className="bg-ct2b-bg/80 p-3 rounded-xl border border-green-500/20">
            <p className="text-[11px] text-green-400 font-medium">Presentes</p>
            <p className="text-xl font-bold text-green-400 mt-0.5">{presentes}</p>
          </div>
          <div className="bg-ct2b-bg/80 p-3 rounded-xl border border-red-500/20">
            <p className="text-[11px] text-red-400 font-medium">Faltas</p>
            <p className="text-xl font-bold text-red-400 mt-0.5">{faltas}</p>
          </div>
          <div className="bg-ct2b-bg/80 p-3 rounded-xl border border-ct2b-orange/20">
            <p className="text-[11px] text-ct2b-orange font-medium">Assiduidade</p>
            <p className="text-xl font-bold text-ct2b-orange mt-0.5">{taxaPresenca}%</p>
          </div>
        </div>
      </div>

      {/* Ações em Lote */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleMarkAllPresent}
          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-ct2b-border transition-all flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          Marcar Todos Presentes
        </button>

        <button
          type="button"
          onClick={() => setIsSaved(true)}
          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg ${
            isSaved
              ? 'bg-green-600 text-white shadow-green-600/20'
              : 'bg-ct2b-orange hover:bg-ct2b-orange-hover text-white shadow-ct2b-orange/20'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Chamada Salva!' : 'Finalizar Chamada'}
        </button>
      </div>

      {/* Lista de Atletas */}
      <div className="space-y-2.5">
        {athletes.map((athlete) => {
          const isPresent = athlete.status === 'presente';
          const isAbsent = athlete.status === 'falta';
          const isExcused = athlete.status === 'justificada';

          return (
            <div
              key={athlete.id}
              className="bg-ct2b-surface border border-ct2b-border hover:border-ct2b-border/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-ct2b-bg border border-ct2b-border flex items-center justify-center font-bold text-ct2b-orange text-base flex-shrink-0">
                  {athlete.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{athlete.name}</h4>
                  <p className="text-xs text-ct2b-muted mt-0.5">
                    {athlete.position} • <span className="text-zinc-400">{athlete.category}</span>
                  </p>

                  <div className="mt-1.5">
                    {athlete.parentConfirmed === true && (
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                        Responsável confirmou presença
                      </span>
                    )}
                    {athlete.parentConfirmed === false && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        Responsável justificou ausência
                      </span>
                    )}
                    {athlete.parentConfirmed === null && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-500/10 px-2 py-0.5 rounded-md border border-zinc-500/20">
                        Aguardando retorno da família
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de Toque */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkStatus(athlete.id, 'presente')}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isPresent
                      ? 'bg-green-500 text-white border-green-400 shadow-md shadow-green-500/20'
                      : 'bg-ct2b-bg text-zinc-400 border-ct2b-border hover:border-green-500/40'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Presente
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkStatus(athlete.id, 'falta')}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isAbsent
                      ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20'
                      : 'bg-ct2b-bg text-zinc-400 border-ct2b-border hover:border-red-500/40'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Falta
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkStatus(athlete.id, 'justificada')}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isExcused
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-ct2b-bg text-zinc-400 border-ct2b-border hover:border-amber-500/40'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Justificada
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}