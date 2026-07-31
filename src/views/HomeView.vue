<template>
  <div>
    <!-- Hero -->
    <v-sheet color="primary" rounded="xl" class="pa-8 pa-md-12 mb-8 text-white">
      <div class="d-flex flex-column flex-md-row align-center gap-6">
        <div style="flex: 1">
          <div class="text-h4 font-weight-bold mb-3">OdontoSearch Brasil</div>
          <div class="text-h6 font-weight-regular mb-4" style="opacity: 0.9">
            Frequência de padrões dentários na população brasileira
          </div>
          <p class="text-body-1 mb-6" style="opacity: 0.85; max-width: 520px">
            Baseado nos dados do <strong>Levantamento SB Brasil 2023</strong>, com 33.512 participantes
            e pesos amostrais representando ~65,8 milhões de adultos brasileiros.
          </p>
          <div class="d-flex flex-wrap gap-3">
            <template v-if="auth.isLoggedIn">
              <v-btn
                color="white"
                variant="flat"
                size="large"
                prepend-icon="mdi-magnify"
                :to="{ name: 'nova-busca' }"
              >
                Realizar busca
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                color="white"
                variant="flat"
                size="large"
                prepend-icon="mdi-login"
                :to="{ name: 'login' }"
              >
                Entrar
              </v-btn>
              <v-btn
                color="white"
                variant="outlined"
                size="large"
                prepend-icon="mdi-account-plus-outline"
                :to="{ name: 'cadastro' }"
              >
                Criar conta
              </v-btn>
            </template>
          </div>
        </div>
        <v-icon icon="mdi-tooth" size="120" style="opacity: 0.2" class="d-none d-md-flex" />
      </div>
    </v-sheet>

    <!-- Features -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card variant="outlined" rounded="xl" height="100%">
          <v-card-text class="pa-6">
            <v-icon icon="mdi-calculator-variant-outline" color="primary" size="32" class="mb-3" />
            <div class="text-subtitle-1 font-weight-bold mb-2">Cálculo de frequência</div>
            <p class="text-body-2 text-medium-emphasis">
              Informe o padrão dentário observado e descubra com que frequência ele ocorre na
              população brasileira, levando em conta correlações entre os dentes.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined" rounded="xl" height="100%">
          <v-card-text class="pa-6">
            <v-icon icon="mdi-filter-outline" color="primary" size="32" class="mb-3" />
            <div class="text-subtitle-1 font-weight-bold mb-2">Filtros demográficos</div>
            <p class="text-body-2 text-medium-emphasis">
              Restrinja a base de comparação por sexo e faixa etária para aumentar
              a precisão da estimativa de frequência.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined" rounded="xl" height="100%">
          <v-card-text class="pa-6">
            <v-icon icon="mdi-file-pdf-box" color="primary" size="32" class="mb-3" />
            <div class="text-subtitle-1 font-weight-bold mb-2">Laudo exportável</div>
            <p class="text-body-2 text-medium-emphasis">
              Gere um laudo de identificação com diagrama odontológico e estatísticas
              pronto para exportação em PDF.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- CTA bottom -->
    <v-card variant="tonal" color="primary" rounded="xl" class="pa-6 text-center">
      <template v-if="auth.isLoggedIn">
        <div class="text-subtitle-1 font-weight-bold mb-1">Pronto para continuar?</div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          Inicie uma nova busca ou consulte o guia do usuário.
        </div>
        <div class="d-flex justify-center flex-wrap gap-3">
          <v-btn color="primary" variant="flat" prepend-icon="mdi-magnify" :to="{ name: 'nova-busca' }">
            Nova busca
          </v-btn>
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-book-open-outline" :to="{ name: 'guia' }">
            Guia do usuário
          </v-btn>
        </div>
      </template>
      <template v-else>
        <div class="text-subtitle-1 font-weight-bold mb-1">Pronto para começar?</div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          Crie uma conta gratuita ou consulte o guia do usuário.
        </div>
        <div class="d-flex justify-center flex-wrap gap-3">
          <v-btn color="primary" variant="flat" prepend-icon="mdi-account-plus-outline" :to="{ name: 'cadastro' }">
            Criar conta
          </v-btn>
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-book-open-outline" :to="{ name: 'guia' }">
            Guia do usuário
          </v-btn>
        </div>
      </template>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
