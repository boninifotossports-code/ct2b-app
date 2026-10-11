"use client";

import { useState } from "react";

export default function MontadorDeTreinos() {
  const [date, setDate] = useState("");
  const [modality, setModality] = useState("Fut 7");
  const [theme, setTheme] = useState("");
  const [location, setLocation] = useState("CT 2B - Quadra Principal");
  const [coachNotes, setCoachNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/treinos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, modality, theme, location, coachNotes }),
    });

    if (response.ok) {
      alert("Sessão de treino registada com sucesso!");
      setDate("");
      setTheme("");
      setCoachNotes("");
    } else {
      alert("Erro ao salvar o treino.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-gray-900 text-white rounded-lg shadow-md border border-orange-500">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">Montador de Treinos</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Data da Sessão</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Modalidade</label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500 text-white"
          >
            <option value="Fut 7">Fut 7</option>
            <option value="Futsal">Futsal</option>
            <option value="Campo">Campo</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tema Central</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Funil Defensivo, Compactação, Transição..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Localização</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Observações Técnicas</label>
          <textarea
            value={coachNotes}
            onChange={(e) => setCoachNotes(e.target.value)}
            placeholder="Anotações para a categoria..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500 text-white h-24 resize-none"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors mt-4"
        >
          Registar Treino
        </button>
      </form>
    </div>
  );
}