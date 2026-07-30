<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="420" rounded="xl" elevation="4" class="pa-2">
      <v-card-text class="pa-6 pb-4">

        <div class="text-center mb-6">
          <v-icon icon="mdi-lock-reset" size="40" color="primary" class="mb-2" />
          <div class="text-h6 font-weight-bold">Recuperar senha</div>
          <div class="text-caption text-medium-emphasis">OdontoSearch Brasil</div>
        </div>

        <template v-if="!enviado">
          <p class="text-body-2 text-medium-emphasis mb-4">
            Informe o e-mail da sua conta e enviaremos um link para redefinir sua senha.
          </p>
          <v-form ref="formRef" @submit.prevent="enviar">
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              :rules="[required, emailRule]"
              class="mb-4"
              autocomplete="email"
            />
            <v-alert v-if="erro" type="error" variant="tonal" density="compact" class="mb-4">
              {{ erro }}
            </v-alert>
            <v-btn type="submit" color="primary" block size="large" :loading="loading">
              Enviar link
            </v-btn>
          </v-form>
        </template>

        <template v-else>
          <div class="text-center">
            <v-icon icon="mdi-email-check-outline" size="48" color="success" class="mb-3" />
            <p class="text-body-2 text-medium-emphasis mb-4">
              Se o e-mail <strong>{{ email }}</strong> estiver cadastrado,
              você receberá um link de recuperação em instantes.
            </p>
            <v-alert type="info" variant="tonal" density="compact" class="text-left mb-4">
              Não recebeu? Verifique o spam. O link expira em 1 hora.
            </v-alert>
          </div>
        </template>

      </v-card-text>
      <v-divider />
      <v-card-text class="text-center py-3">
        <v-btn variant="text" size="small" color="primary" :to="{ name: 'login' }">
          Voltar para o login
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { esqueceuSenha } from '@/api/client'
import axios from 'axios'

const formRef = ref()
const email = ref('')
const loading = ref(false)
const erro = ref('')
const enviado = ref(false)

const required = (v: string) => !!v || 'Campo obrigatório'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'

async function enviar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  erro.value = ''
  try {
    await esqueceuSenha({ email: email.value })
    enviado.value = true
  } catch (err) {
    if (axios.isAxiosError(err)) {
      erro.value = err.response?.data?.detail ?? 'Erro ao enviar e-mail. Tente novamente.'
    } else {
      erro.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
