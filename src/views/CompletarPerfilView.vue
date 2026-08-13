<template>
  <v-container class="d-flex justify-center align-center py-8">
    <v-card width="480" rounded="xl" elevation="4" class="pa-2">
      <v-card-text class="pa-6 pb-4">

        <div class="text-center mb-6">
          <v-icon icon="mdi-account-edit-outline" size="40" color="primary" class="mb-2" />
          <div class="text-h6 font-weight-bold">Completar perfil</div>
          <div class="text-caption text-medium-emphasis">
            Para continuar, informe seus dados profissionais.
          </div>
        </div>

        <v-form ref="formRef" @submit.prevent="salvar">
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
            :class="instituicao === 'Outros' ? 'mb-2' : 'mb-4'"
          />
          <v-text-field
            v-if="instituicao === 'Outros'"
            v-model="instituicaoCustom"
            label="Qual instituição?"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-pencil-outline"
            :rules="[required]"
            class="mb-4"
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
            Salvar e continuar
          </v-btn>
        </v-form>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { completarPerfil } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const matricula = ref('')
const cpf = ref('')
const instituicao = ref('')
const instituicaoCustom = ref('')
const loading = ref(false)
const erro = ref('')

const instituicoes = [
  'Numol/IPC - João Pessoa',
  'Numol/IPC - Campina Grande',
  'Numol/IPC - Patos',
  'Numol/IPC - Guarabira',
  'Numol/IPC - Cajazeiras',
  'Outros',
]

const required = (v: string) => !!v?.trim() || 'Campo obrigatório'
const cpfRule = (v: string) => /^\d{11}$/.test(v) || 'CPF deve ter 11 dígitos'

async function salvar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  erro.value = ''

  try {
    const res = await completarPerfil({
      matricula: matricula.value.trim(),
      cpf: cpf.value,
      instituicao: instituicao.value === 'Outros' ? instituicaoCustom.value.trim() : instituicao.value,
    })
    authStore.setAuth(res.token, {
      id: res.id,
      nome: res.nome,
      email: res.email,
      perfil: res.perfil as any,
      perfilCompleto: true,
    })
    router.push({ name: 'home' })
  } catch (err: unknown) {
    erro.value = axios.isAxiosError(err)
      ? (err.response?.data?.detail ?? 'Erro ao salvar perfil.')
      : 'Erro inesperado. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
