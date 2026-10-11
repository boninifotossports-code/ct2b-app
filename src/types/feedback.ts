export interface SkillScore {
  name: string;
  score: number;
  categoria?: string;
}

export interface FeedbackItem {
  id: string;
  tipo: "INDIVIDUAL" | "COLETIVO";
  nota?: number | null;
  tags?: string | null;
  comentario: string;
  data: string | Date;
  atletaId?: string | null;
  treinoId?: string | null;
  planoTreinoId?: string | null;
  skills?: SkillScore[];
  atleta?: {
    id: string;
    nomeCompleto: string;
    categoria: string;
    posicao?: string | null;
  } | null;
  treino?: {
    id: string;
    titulo: string;
    data: string;
    hora: string;
    local: string;
  } | null;
}

export type TipoFeedback = "INDIVIDUAL" | "COLETIVO";