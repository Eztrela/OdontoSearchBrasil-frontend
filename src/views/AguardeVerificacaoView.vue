<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card width="460" rounded="xl" elevation="4" class="pa-2 text-center">
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
        <v-btn variant="text" color="primary" :to="{ name: 'login' }">
          Voltar para o login
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const email = route.query.email as string ?? ''
</script>
