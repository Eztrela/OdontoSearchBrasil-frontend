<template>
  <v-container class="d-flex justify-center align-center py-8">
    <v-card width="480" rounded="xl" elevation="4" class="pa-2">
      <v-card-text class="pa-6 pb-4">

        <div class="text-center mb-6">
          <v-icon icon="mdi-account-plus-outline" size="40" color="primary" class="mb-2" />
          <div class="text-h6 font-weight-bold">Criar conta</div>
          <div class="text-caption text-medium-emphasis">Odontoperitus</div>
        </div>

        <v-form ref="formRef" @submit.prevent="cadastrar">
          <v-text-field
            v-model="nome"
            label="Nome completo"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account-outline"
            :rules="[required]"
            class="mb-3"
            autocomplete="name"
          />
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
            v-model="matricula"
            label="Número de matrícula"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-card-account-details-outline"
            :rules="[required]"
            class="mb-3"
          />
          <v-text-field
            v-model="cpf"
            label="CPF (somente números)"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-identifier"
            maxlength="11"
            :rules="[required, cpfRule]"
            class="mb-3"
            @input="cpf = cpf.replace(/\D/g, '').slice(0, 11)"
          />
          <v-select
            v-model="instituicao"
            label="Instituição"
            :items="instituicoes"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-hospital-building"
            :rules="[required]"
            class="mb-3"
          />
          <v-text-field
            v-model="senha"
            label="Senha"
            :type="mostrarSenha ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="[required, senhaRule]"
            class="mb-1"
            autocomplete="new-password"
            @click:append-inner="mostrarSenha = !mostrarSenha"
          />
          <div v-if="senha" class="mb-4 pl-1">
            <div
              v-for="cond in senhaCondicoes"
              :key="cond.label"
              class="d-flex align-center mb-1"
              style="font-size: 12px"
            >
              <v-icon
                :icon="cond.ok ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"
                :color="cond.ok ? 'success' : 'error'"
                size="16"
                class="mr-1"
              />
              <span :class="cond.ok ? 'text-success' : 'text-error'">{{ cond.label }}</span>
            </div>
          </div>

          <v-alert v-if="erro" type="error" variant="tonal" density="compact" class="mb-4">
            {{ erro }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            Criar conta
          </v-btn>
        </v-form>

      </v-card-text>
      <v-divider />
      <v-card-text class="pa-6 pt-4">
        <div class="d-flex align-center mb-4" style="gap: 8px">
          <v-divider />
          <span class="text-caption text-medium-emphasis px-2">ou cadastre-se com</span>
          <v-divider />
        </div>
        <div id="google-btn-cadastro" class="d-flex justify-center" />
      </v-card-text>
      <v-divider />
      <v-card-text class="text-center py-3">
        <span class="text-caption text-medium-emphasis">Já tem conta? </span>
        <v-btn variant="text" size="small" color="primary" :to="{ name: 'login' }">
          Entrar
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { registrar, loginComGoogle } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

declare global { interface Window { google: any } }

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const nome = ref('')
const email = ref('')
const matricula = ref('')
const cpf = ref('')
const instituicao = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const loading = ref(false)
const erro = ref('')

const instituicoes = [
  'Numol/IPC - João Pessoa',
  'Numol/IPC - Campina Grande',
  'Numol/IPC - Patos',
  'Numol/IPC - Guarabira',
  'Numol/IPC - Cajazeiras',
]

const senhaCondicoes = computed(() => [
  { label: 'Mínimo 8 caracteres', ok: senha.value.length >= 8 },
  { label: 'Letra maiúscula (A-Z)', ok: /[A-Z]/.test(senha.value) },
  { label: 'Letra minúscula (a-z)', ok: /[a-z]/.test(senha.value) },
  { label: 'Número (0-9)', ok: /\d/.test(senha.value) },
  { label: 'Caractere especial (@$!%*?&#...)', ok: /[@$!%*?&#^()_\-+=]/.test(senha.value) },
])

onMounted(() => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || !window.google) return
  window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogle })
  window.google.accounts.id.renderButton(
    document.getElementById('google-btn-cadastro'),
    { theme: 'outline', size: 'large', text: 'signup_with', width: 400 },
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
    erro.value = axios.isAxiosError(err)
      ? (err.response?.data?.detail ?? 'Erro ao entrar com Google.')
      : 'Erro inesperado. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const required = (v: string) => !!v?.trim() || 'Campo obrigatório'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'
const cpfRule = (v: string) => /^\d{11}$/.test(v) || 'CPF deve ter 11 dígitos'
const senhaRule = (v: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/.test(v) ||
  'Senha não atende todos os requisitos'

async function cadastrar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  erro.value = ''

  try {
    await registrar({
      nome: nome.value.trim(),
      email: email.value.trim(),
      matricula: matricula.value.trim(),
      cpf: cpf.value,
      instituicao: instituicao.value,
      senha: senha.value,
    })
    router.push({ name: 'aguarde-verificacao', query: { email: email.value.trim() } })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data ?? {}
      if (data.erros) {
        const first = Object.values(data.erros as Record<string, string>)[0]
        erro.value = first
      } else {
        erro.value = data.detail ?? 'Erro ao criar conta.'
      }
    } else {
      erro.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
