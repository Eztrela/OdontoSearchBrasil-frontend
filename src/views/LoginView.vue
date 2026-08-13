<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="420" rounded="xl" elevation="4" class="pa-2">
      <v-card-text class="pa-6 pb-4">

        <div class="text-center mb-6">
          <v-icon icon="mdi-tooth" size="40" color="primary" class="mb-2" />
          <div class="text-h6 font-weight-bold">Entrar na plataforma</div>
          <div class="text-caption text-medium-emphasis">Odontoperitus</div>
        </div>

        <v-form ref="formRef" @submit.prevent="entrar">
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-email-outline"
            :rules="[required, emailRule]"
            class="mb-3"
            autocomplete="email"
          />
          <v-text-field
            v-model="senha"
            label="Senha"
            :type="mostrarSenha ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="[required]"
            class="mb-4"
            autocomplete="current-password"
            @click:append-inner="mostrarSenha = !mostrarSenha"
          />

          <v-alert v-if="erro" :type="erroTipo" variant="tonal" density="compact" class="mb-2">
            {{ erro }}
          </v-alert>
          <div v-if="mostrarReenvio" class="mb-4 text-center">
            <v-btn
              variant="text"
              size="small"
              color="warning"
              :loading="loadingReenvio"
              :disabled="cooldownReenvio > 0"
              @click="reenviar"
            >
              {{ cooldownReenvio > 0 ? `Reenviar em ${cooldownReenvio}s` : 'Reenviar e-mail de verificação' }}
            </v-btn>
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            Entrar
          </v-btn>

          <div class="text-center mt-3">
            <v-btn variant="text" size="small" color="primary" :to="{ name: 'esqueci-senha' }">
              Esqueci minha senha
            </v-btn>
          </div>
        </v-form>

        <div class="d-flex align-center my-4" style="gap: 8px">
          <v-divider />
          <span class="text-caption text-medium-emphasis px-2">ou</span>
          <v-divider />
        </div>

        <div id="google-btn-login" class="d-flex justify-center" />

      </v-card-text>
      <v-divider />
      <v-card-text class="text-center py-3">
        <span class="text-caption text-medium-emphasis">Não tem conta? </span>
        <v-btn variant="text" size="small" color="primary" :to="{ name: 'cadastro' }">
          Criar conta
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi, loginComGoogle, reenviarVerificacao } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

declare global { interface Window { google: any } }

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const loading = ref(false)
const erro = ref('')
const erroTipo = ref<'error' | 'warning'>('error')
const mostrarReenvio = ref(false)
const loadingReenvio = ref(false)
const cooldownReenvio = ref(0)
let timerReenvio: ReturnType<typeof setInterval> | null = null

const required = (v: string) => !!v || 'Campo obrigatório'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'

function iniciarCooldownReenvio() {
  cooldownReenvio.value = 60
  timerReenvio = setInterval(() => {
    cooldownReenvio.value--
    if (cooldownReenvio.value <= 0 && timerReenvio) {
      clearInterval(timerReenvio)
      timerReenvio = null
    }
  }, 1000)
}

async function reenviar() {
  if (!email.value || cooldownReenvio.value > 0) return
  loadingReenvio.value = true
  try {
    await reenviarVerificacao(email.value)
    erro.value = 'E-mail reenviado! Verifique sua caixa de entrada.'
    erroTipo.value = 'warning'
    iniciarCooldownReenvio()
  } catch {
    erro.value = 'Erro ao reenviar. Tente novamente.'
    erroTipo.value = 'error'
  } finally {
    loadingReenvio.value = false
  }
}

onUnmounted(() => { if (timerReenvio) clearInterval(timerReenvio) })

onMounted(() => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || !window.google) return
  window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogle })
  window.google.accounts.id.renderButton(
    document.getElementById('google-btn-login'),
    { theme: 'outline', size: 'large', text: 'signin_with', width: 360 },
  )
})

async function handleGoogle(response: { credential: string }) {
  loading.value = true
  erro.value = ''
  try {
    const res = await loginComGoogle(response.credential)
    authStore.setAuth(res.token, { id: res.id, nome: res.nome, email: res.email, perfil: res.perfil as any, perfilCompleto: res.perfilCompleto })
    router.push({ name: res.perfilCompleto ? 'home' : 'completar-perfil' })
  } catch (err: unknown) {
    erroTipo.value = 'error'
    erro.value = axios.isAxiosError(err)
      ? (err.response?.data?.detail ?? 'Erro ao entrar com Google.')
      : 'Erro inesperado. Tente novamente.'
  } finally {
    loading.value = false
  }
}

async function entrar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  erro.value = ''
  mostrarReenvio.value = false

  try {
    const res = await loginApi({ email: email.value, senha: senha.value })
    authStore.setAuth(res.token, { id: res.id, nome: res.nome, email: res.email, perfil: res.perfil as any, perfilCompleto: res.perfilCompleto })
    router.push({ name: 'home' })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 401) {
        erroTipo.value = 'error'
        mostrarReenvio.value = false
        erro.value = 'E-mail ou senha incorretos.'
      } else if (status === 403) {
        erroTipo.value = 'warning'
        mostrarReenvio.value = true
        erro.value = err.response?.data?.detail ?? 'E-mail não verificado. Verifique sua caixa de entrada.'
      } else {
        erroTipo.value = 'error'
        erro.value = err.response?.data?.detail ?? 'Erro ao tentar entrar.'
      }
    } else {
      erroTipo.value = 'error'
      erro.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
