<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="420" rounded="xl" elevation="4" class="pa-2">
      <v-card-text class="pa-6 pb-4">

        <div class="text-center mb-6">
          <v-icon icon="mdi-lock-check-outline" size="40" color="primary" class="mb-2" />
          <div class="text-h6 font-weight-bold">Redefinir senha</div>
          <div class="text-caption text-medium-emphasis">OdontoSearch Brasil</div>
        </div>

        <template v-if="!tokenPresente">
          <v-alert type="error" variant="tonal">
            Link inválido. Solicite um novo link de recuperação.
          </v-alert>
        </template>

        <template v-else-if="!concluido">
          <v-form ref="formRef" @submit.prevent="redefinir">
            <v-text-field
              v-model="novaSenha"
              label="Nova senha"
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
            <div v-if="novaSenha" class="mb-4 pl-1">
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
            <v-btn type="submit" color="primary" block size="large" :loading="loading">
              Redefinir senha
            </v-btn>
          </v-form>
        </template>

        <template v-else>
          <div class="text-center">
            <v-icon icon="mdi-check-circle-outline" size="48" color="success" class="mb-3" />
            <p class="text-body-2 text-medium-emphasis mb-6">
              Senha redefinida com sucesso! Faça login com sua nova senha.
            </p>
            <v-btn color="primary" variant="flat" :to="{ name: 'login' }">
              Fazer login
            </v-btn>
          </div>
        </template>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { redefinirSenha } from '@/api/client'
import axios from 'axios'

const route = useRoute()
const token = ((route.params.token || route.query.token) as string) ?? ''
const tokenPresente = computed(() => !!token)

const formRef = ref()
const novaSenha = ref('')
const mostrarSenha = ref(false)
const loading = ref(false)
const erro = ref('')
const concluido = ref(false)

const senhaCondicoes = computed(() => [
  { label: 'Mínimo 8 caracteres', ok: novaSenha.value.length >= 8 },
  { label: 'Letra maiúscula (A-Z)', ok: /[A-Z]/.test(novaSenha.value) },
  { label: 'Letra minúscula (a-z)', ok: /[a-z]/.test(novaSenha.value) },
  { label: 'Número (0-9)', ok: /\d/.test(novaSenha.value) },
  { label: 'Caractere especial (@$!%*?&#...)', ok: /[@$!%*?&#^()_\-+=]/.test(novaSenha.value) },
])

const required = (v: string) => !!v || 'Campo obrigatório'
const senhaRule = (v: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/.test(v) ||
  'Senha não atende todos os requisitos'

async function redefinir() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  erro.value = ''
  try {
    await redefinirSenha({ token, novaSenha: novaSenha.value })
    concluido.value = true
  } catch (err) {
    if (axios.isAxiosError(err)) {
      erro.value = err.response?.data?.detail ?? 'Erro ao redefinir senha.'
    } else {
      erro.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
