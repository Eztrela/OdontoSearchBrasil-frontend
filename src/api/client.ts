import axios from 'axios'
import type {
  AtualizarBuscaDto,
  CreateBuscaDto,
  ResultadoBusca,
  BuscaListItem,
  BuscaDetalhe,
  RegistroDto,
  RegistroResponse,
  LoginDto,
  AuthResponse,
  EsqueceuSenhaDto,
  RedefinirSenhaDto,
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
      const isAuthCall = err.config?.url?.includes('/auth/')
      if (!isAuthCall) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registrar = (dto: RegistroDto): Promise<RegistroResponse> =>
  api.post<RegistroResponse>('/auth/registro', dto).then((r) => r.data)

export const loginApi = (dto: LoginDto): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/login', dto).then((r) => r.data)

export const verificarEmail = (token: string): Promise<void> =>
  api.get(`/auth/verificar?token=${token}`).then(() => undefined)

export const esqueceuSenha = (dto: EsqueceuSenhaDto): Promise<void> =>
  api.post('/auth/esqueci-senha', dto).then(() => undefined)

export const redefinirSenha = (dto: RedefinirSenhaDto): Promise<void> =>
  api.post('/auth/redefinir-senha', dto).then(() => undefined)

export const loginComGoogle = (idToken: string): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/google', { idToken }).then((r) => r.data)

export const completarPerfil = (dto: {
  matricula: string
  cpf: string
  instituicao: string
}): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/completar-perfil', dto).then((r) => r.data)

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

export const atualizarBusca = (id: number, dto: AtualizarBuscaDto): Promise<void> =>
  api.patch(`/buscas/${id}`, dto).then(() => undefined)

export const cancelarBusca = (id: number): Promise<{ message: string }> =>
  api.patch<{ message: string }>(`/buscas/${id}/cancelar`).then((r) => r.data)

export default api
