import axios from 'axios'
import type {
  Examinador,
  CreateExaminadorDto,
  CreateBuscaDto,
  ResultadoBusca,
  BuscaListItem,
  BuscaDetalhe,
} from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Examinadores ─────────────────────────────────────────────────────────────

export const getExaminadores = (): Promise<Examinador[]> =>
  api.get<Examinador[]>('/examinadores').then((r) => r.data)

export const createExaminador = (dto: CreateExaminadorDto): Promise<{ id: number }> =>
  api.post<{ id: number }>('/examinadores', dto).then((r) => r.data)

// ─── Buscas ───────────────────────────────────────────────────────────────────

export const getBuscas = (): Promise<BuscaListItem[]> =>
  api.get<BuscaListItem[]>('/buscas').then((r) => r.data)

export const getBusca = (id: number): Promise<BuscaDetalhe> =>
  api.get<BuscaDetalhe>(`/buscas/${id}`).then((r) => r.data)

export const createBusca = (dto: CreateBuscaDto): Promise<{ id: number }> =>
  api.post<{ id: number }>('/buscas', dto).then((r) => r.data)

export const calcularBusca = (id: number): Promise<ResultadoBusca> =>
  api.post<ResultadoBusca>(`/buscas/${id}/calcular`).then((r) => r.data)

export const cancelarBusca = (id: number): Promise<{ message: string }> =>
  api.patch<{ message: string }>(`/buscas/${id}/cancelar`).then((r) => r.data)

export default api
