// ─── Examinador ──────────────────────────────────────────────────────────────

export interface Examinador {
  id: number
  nome: string
  email: string
}

export interface CreateExaminadorDto {
  nome: string
  email: string
}

// ─── Dente ────────────────────────────────────────────────────────────────────

/** null = not informed (excluded), 0-4 = condition codes, ignorar = "/" code */
export type StatusDente = 0 | 1 | 2 | 3 | 4 | null

export interface DenteBusca {
  numeroIso: number
  statusInformado: StatusDente
  ignorar: boolean
}

export interface DenteResult {
  id: number
  numeroIso: number
  statusInformado: StatusDente
  ignorar: boolean
}

// ─── Busca ────────────────────────────────────────────────────────────────────

export interface CreateBuscaDto {
  nic: string
  examinadorId: number
  sexoFiltro?: 1 | 2 | null
  idadeMin?: number | null
  idadeMax?: number | null
  dentes: DenteBusca[]
}

export interface ResultadoBusca {
  frequenciaPercent: number
  raridade: 'muito_raro' | 'raro' | 'incomum' | 'comum'
  correspondencias: number
  totalPopulacao: number
  pesoCorrespondencias: number
  totalPeso: number
  dentesAvaliados: number
}

export interface BuscaListItem {
  id: number
  nic: string
  examinador: string
  criadoEm: string
  frequenciaPercent?: number
  raridade?: 'muito_raro' | 'raro' | 'incomum' | 'comum'
  correspondencias?: number
  totalPopulacao?: number
}

export interface BuscaDetalhe {
  id: number
  nic: string
  examinadorId: number
  examinador: string
  sexoFiltro?: 'M' | 'F' | null
  idadeMin?: number | null
  idadeMax?: number | null
  criadoEm: string
  canceladaEm?: string | null
  dentes: DenteResult[]
  resultado?: ResultadoBusca | null
}

// ─── Estado do odontograma (no componente) ────────────────────────────────────

export interface ToothState {
  numeroIso: number
  statusInformado: StatusDente
  ignorar: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  null: 'Não informado',
  '0': 'Hígido (saudável)',
  '1': 'Cariado',
  '2': 'Restaurado com cárie',
  '3': 'Restaurado sem cárie',
  '4': 'Ausente',
  ignorar: 'Ignorar (/)',
}

export const STATUS_COLORS: Record<string, string> = {
  null: '#E0E0E0',
  '0': '#4CAF50',
  '1': '#F44336',
  '2': '#FF9800',
  '3': '#2196F3',
  '4': '#212121',
  ignorar: '#FFC107',
}

export const RARIDADE_COLORS: Record<string, string> = {
  muito_raro: 'error',
  raro: 'warning',
  incomum: 'yellow-darken-2',
  comum: 'success',
}

export const RARIDADE_LABELS: Record<string, string> = {
  muito_raro: 'Muito Raro',
  raro: 'Raro',
  incomum: 'Incomum',
  comum: 'Comum',
}
