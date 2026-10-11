export interface DrillVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  modality: string;
  description?: string | null;
  category?: string | null;
  data?: string | Date;
  // Campos alternativos de retrocompatibilidade
  titulo?: string;
  thumbnail?: string | null;
  descricao?: string | null;
  categoria?: string | null;
}

export interface VideoCategory {
  id?: string;
  name?: string;
  nome?: string;
  slug?: string;
  videos?: DrillVideo[];
}

export interface VideoItem extends DrillVideo {}
export interface VideoCategoria extends VideoCategory {}