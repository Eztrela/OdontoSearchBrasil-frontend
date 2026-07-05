<template>
  <v-card variant="outlined" class="resultado-card mt-4">
    <v-card-title class="d-flex align-center gap-2 pa-4 pb-2">
      <v-icon icon="mdi-chart-bar" color="primary" class="mr-1" />
      Resultado da Análise
      <v-spacer />
      <v-chip
        :color="raridadeColor"
        size="small"
        variant="flat"
        class="font-weight-bold"
      >
        {{ raridadeLabel }}
      </v-chip>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-4">
      <v-row dense>
        <!-- Frequency -->
        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal" color="primary" class="pa-3 text-center">
            <div class="text-h5 font-weight-bold">
              {{ frequenciaFormatada }}%
            </div>
            <div class="text-caption text-medium-emphasis mt-1">Frequência na população</div>
          </v-card>
        </v-col>

        <!-- Matches -->
        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal" color="secondary" class="pa-3 text-center">
            <div class="text-h5 font-weight-bold">
              {{ resultado.correspondencias.toLocaleString('pt-BR') }}
            </div>
            <div class="text-caption text-medium-emphasis mt-1">
              Correspondências de {{ resultado.totalPopulacao.toLocaleString('pt-BR') }}
            </div>
          </v-card>
        </v-col>

        <!-- Weight -->
        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal" color="accent" class="pa-3 text-center">
            <div class="text-h5 font-weight-bold">
              {{ resultado.pesoCorrespondencias.toLocaleString('pt-BR') }}
            </div>
            <div class="text-caption text-medium-emphasis mt-1">
              Peso corr. de {{ resultado.totalPeso.toLocaleString('pt-BR') }}
            </div>
          </v-card>
        </v-col>

        <!-- Evaluated teeth -->
        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal" color="success" class="pa-3 text-center">
            <div class="text-h5 font-weight-bold">
              {{ resultado.dentesAvaliados }}
            </div>
            <div class="text-caption text-medium-emphasis mt-1">Dentes avaliados</div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResultadoBusca } from '@/types'
import { RARIDADE_COLORS, RARIDADE_LABELS } from '@/types'

const props = defineProps<{
  resultado: ResultadoBusca
}>()

const frequenciaFormatada = computed(() =>
  props.resultado.frequenciaPercent.toFixed(4),
)

const raridadeColor = computed(
  () => RARIDADE_COLORS[props.resultado.raridade] ?? 'grey',
)

const raridadeLabel = computed(
  () => RARIDADE_LABELS[props.resultado.raridade] ?? props.resultado.raridade,
)
</script>

<style scoped>
.resultado-card {
  border-radius: 12px;
}
</style>
