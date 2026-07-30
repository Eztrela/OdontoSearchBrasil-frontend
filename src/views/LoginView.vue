<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="420" rounded="xl" elevation="4" class="pa-2">
      <v-card-text class="pa-6 pb-4">

        <div class="text-center mb-6">
          <v-icon icon="mdi-tooth" size="40" color="primary" class="mb-2" />
          <div class="text-h6 font-weight-bold">Entrar na plataforma</div>
          <div class="text-caption text-medium-emphasis">OdontoSearch Brasil</div>
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
            Entrar
          </v-btn>
        </v-form>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const loading = ref(false)
const erro = ref('')

const required = (v: string) => !!v || 'Campo obrigatório'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'

async function entrar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  erro.value = ''

  try {
    const res = await loginApi({ email: email.value, senha: senha.value })
    authStore.setAuth(res.token, { id: res.id, nome: res.nome, email: res.email, perfil: res.perfil })
    router.push({ name: 'nova-busca' })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      erro.value = status === 401
        ? 'E-mail ou senha incorretos.'
        : (err.response?.data?.detail ?? 'Erro ao tentar entrar.')
    } else {
      erro.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
