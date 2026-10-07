// Forçando atualização
'use client';

import React, { useState } from 'react';
import { Video, Play, Plus, Search, Tag } from 'lucide-react';
import { DrillVideo, VideoCategory } from '@/types/video';

export default function VideosBankPage() {
  const [videos, setVideos] = useState<DrillVideo[]>([
    {
      id: 'v1',
      title: 'Rondo 4x2 com Pressão',
      category: 'Aquecimento',
      modality: 'Ambos',
      duration: '01:45',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      description: 'Manutenção de posse em espaço reduzido.',
      coachingPoints: ['Orientação corporal', 'Comunicação ativa'],
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-ct2b-surface border border-ct2b-border rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ct2b-orange/15 text-ct2b-orange border border-ct2b-orange/30 mb-2">Acervo</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Video className="w-5 h-5 text-ct2b-orange" /> Banco de Vídeos</h2>
        </div>
        <button className="text-xs font-bold px-4 py-2.5 rounded-xl bg-ct2b-orange hover:bg-ct2b-orange-hover text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Cadastrar Novo</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <div key={video.id} className="bg-ct2b-surface border border-ct2b-border rounded-2xl overflow-hidden hover:border-ct2b-orange/40 transition-all shadow-md group">
            <div className="relative aspect-video bg-black/60 cursor-pointer overflow-hidden">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-ct2b-orange text-white flex items-center justify-center"><Play className="w-5 h-5 fill-white ml-0.5" /></div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ct2b-muted flex items-center gap-1"><Tag className="w-3 h-3 text-ct2b-orange" /> {video.category}</span>
              <h3 className="text-sm font-bold text-white group-hover:text-ct2b-orange line-clamp-1">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}