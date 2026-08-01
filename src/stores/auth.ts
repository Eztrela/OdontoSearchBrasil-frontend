import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UsuarioLogado } from '@/types'
import { useHistoricoStore } from './index'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const usuario = ref<UsuarioLogado | null>(
    JSON.parse(localStorage.getItem('auth_user') ?? 'null'),
  )

  const isLoggedIn = computed(() => !!token.value)
  const isDesenvolvedor = computed(() => usuario.value?.perfil === 'DESENVOLVEDOR')

  function setAuth(t: string, u: UsuarioLogado) {
    token.value = t
    usuario.value = u
    localStorage.setItem('auth_token', t)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  function setPerfilCompleto() {
    if (usuario.value) {
      usuario.value = { ...usuario.value, perfilCompleto: true }
      localStorage.setItem('auth_user', JSON.stringify(usuario.value))
    }
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    useHistoricoStore().clear()
  }

  return { token, usuario, isLoggedIn, isDesenvolvedor, setAuth, setPerfilCompleto, logout }
})
