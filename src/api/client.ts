import axios from 'axios'
import type {
  CreateBuscaDto,
  ResultadoBusca,
  BuscaListItem,
  BuscaDetalhe,
  RegistroDto,
  LoginDto,
  AuthResponse,
} from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear session and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const isLoginCall = err.config?.url?.includes('/auth/login')
      if (!isLoginCall) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registrar = (dto: RegistroDto): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/registro', dto).then((r) => r.data)

export const loginApi = (dto: LoginDto): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/login', dto).then((r) => r.data)

// ─── Buscas ───────────────────────────────────────────────────────────────────

export const getBuscas = (): Promise<BuscaListItem[]> =>
  api.get<BuscaListItem[]>('/buscas').then((r) => r.data)

export const getBusca = (id: number): Promise<BuscaDetalhe> =>
  api.get<any>(`/buscas/${id}`).then((r) => {
    const d = r.data
    return { ...d, examinador: d.examinador ?? d.examinadorNome ?? '' } as BuscaDetalhe
  })

export const createBusca = (dto: CreateBuscaDto): Promise<{ id: number }> =>
  api.post<{ id: number }>('/buscas', dto).then((r) => r.data)

export const calcularBusca = (id: number): Promise<ResultadoBusca> =>
  api.post<ResultadoBusca>(`/buscas/${id}/calcular`).then((r) => r.data)

export const cancelarBusca = (id: number): Promise<{ message: string }> =>
  api.patch<{ message: string }>(`/buscas/${id}/cancelar`).then((r) => r.data)

export default api
