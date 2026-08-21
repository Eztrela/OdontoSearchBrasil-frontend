<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="100%" max-width="460" rounded="xl" elevation="4" class="pa-2 text-center">
      <v-card-text class="pa-8">
        <v-icon icon="mdi-email-fast-outline" size="56" color="primary" class="mb-4" />
        <div class="text-h6 font-weight-bold mb-2">Verifique seu e-mail</div>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Enviamos um link de ativação para <strong>{{ email }}</strong>.
          Acesse seu e-mail e clique no link para ativar sua conta.
        </p>
        <v-alert type="info" variant="tonal" density="compact" class="text-left mb-4">
          Não recebeu? Verifique a pasta de spam. O link é válido por 24 horas.
        </v-alert>

        <v-alert v-if="sucesso" type="success" variant="tonal" density="compact" class="mb-4">
          E-mail reenviado! Verifique sua caixa de entrada.
        </v-alert>
        <v-alert v-if="erro" type="error" variant="tonal" density="compact" class="mb-4">
          {{ erro }}
        </v-alert>

        <v-btn
          color="primary"
          variant="tonal"
          :loading="loading"
          :disabled="cooldown > 0"
          class="mb-3"
          block
          @click="reenviar"
        >
          {{ cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar e-mail' }}
        </v-btn>

        <v-btn variant="text" color="primary" :to="{ name: 'login' }">
          Voltar para o login
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { reenviarVerificacao } from '@/api/client'
import axios from 'axios'

const route = useRoute()
const email = route.query.email as string ?? ''

const loading = ref(false)
const sucesso = ref(false)
const erro = ref('')
const cooldown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function iniciarCooldown() {
  cooldown.value = 60
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

async function reenviar() {
  if (!email || cooldown.value > 0) return
  loading.value = true
  sucesso.value = false
  erro.value = ''
  try {
    await reenviarVerificacao(email)
    sucesso.value = true
    iniciarCooldown()
  } catch (err: unknown) {
    erro.value = axios.isAxiosError(err)
      ? (err.response?.data?.detail ?? 'Erro ao reenviar. Tente novamente.')
      : 'Erro inesperado. Tente novamente.'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>
