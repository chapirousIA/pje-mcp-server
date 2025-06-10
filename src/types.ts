export interface PJEProcesso {
  id: string;
  numero: string;
  classe: string;
  assunto: string;
  dataDistribuicao: string;
  valorCausa: number;
  partes: PJEParte[];
  movimentos: PJEMovimento[];
}

export interface PJEParte {
  tipo: "ATIVO" | "PASSIVO";
  nome: string;
  cpfCnpj?: string;
  advogados?: PJEAdvogado[];
}

export interface PJEAdvogado {
  nome: string;
  oab: string;
}

export interface PJEMovimento {
  data: string;
  descricao: string;
  tipo: string;
  documentos?: PJEDocumento[];
}

export interface PJEDocumento {
  id: string;
  nome: string;
  tipo: string;
  dataJuntada: string;
}

export interface PJEOrgaoJulgador {
  id: string;
  nome: string;
  tipo: string;
  competencia: string;
}

export interface PJEClasse {
  id: string;
  codigo: string;
  nome: string;
  sigla: string;
}

export interface PJEAssunto {
  id: string;
  codigo: string;
  nome: string;
  codigoPai?: string;
} 