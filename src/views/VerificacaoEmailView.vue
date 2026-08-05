<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="440" rounded="xl" elevation="4" class="pa-2 text-center">
      <v-card-text class="pa-8">

        <template v-if="status === 'pending'">
          <v-icon icon="mdi-email-check-outline" size="56" color="primary" class="mb-4" />
          <div class="text-h6 font-weight-bold mb-2">Ativar conta</div>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Clique no botão abaixo para confirmar seu e-mail e ativar sua conta no Odontoperitus.
          </p>
          <v-btn color="primary" variant="flat" size="large" @click="confirmar">
            Confirmar e-mail
          </v-btn>
        </template>

        <template v-else-if="status === 'loading'">
          <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
          <div class="text-body-1">Ativando sua conta…</div>
        </template>

        <template v-else-if="status === 'ok'">
          <v-icon icon="mdi-check-circle-outline" size="56" color="success" class="mb-4" />
          <div class="text-h6 font-weight-bold mb-2">E-mail verificado!</div>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Sua conta está ativa. Faça login para começar.
          </p>
          <v-btn color="primary" variant="flat" :to="{ name: 'login' }">
            Fazer login
          </v-btn>
        </template>

        <template v-else>
          <v-icon icon="mdi-alert-circle-outline" size="56" color="error" class="mb-4" />
          <div class="text-h6 font-weight-bold mb-2">Link inválido</div>
          <p class="text-body-2 text-medium-emphasis mb-6">
            {{ erro }}
          </p>
          <v-btn color="primary" variant="tonal" :to="{ name: 'login' }">
            Voltar para o login
          </v-btn>
        </template>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { verificarEmail } from '@/api/client'
import axios from 'axios'

const route = useRoute()
const status = ref<'pending' | 'loading' | 'ok' | 'error'>('pending')
const erro = ref('O link de verificação é inválido ou já foi utilizado.')

const token = (route.params.token || route.query.token) as string

onMounted(() => {
  if (!token) status.value = 'error'
})

async function confirmar() {
  status.value = 'loading'
  try {
    await verificarEmail(token)
    status.value = 'ok'
  } catch (err) {
    status.value = 'error'
    if (axios.isAxiosError(err)) {
      erro.value = err.response?.data?.detail ?? erro.value
    }
  }
}
</script>
