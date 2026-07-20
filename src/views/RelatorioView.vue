<template>
  <div class="relatorio-page">

    <!-- Screen-only header -->
    <div class="d-flex align-center mb-5 no-print">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        :to="{ name: 'detalhe-busca', params: { id } }"
        class="mr-2"
      />
      <div>
        <div class="text-h6 font-weight-bold">Relatório de Identificação</div>
        <div v-if="busca" class="text-caption text-medium-emphasis">NIC {{ busca.nic }}</div>
      </div>
      <v-spacer />
      <v-btn
        v-if="busca?.resultado"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-file-pdf-box"
        @click="exportarPdf"
      >
        Exportar PDF
      </v-btn>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Not found -->
    <v-alert v-else-if="notFound" type="error" variant="tonal">
      Busca #{{ id }} não encontrada.
      <template #append>
        <v-btn variant="text" :to="{ name: 'historico' }">Voltar ao histórico</v-btn>
      </template>
    </v-alert>

    <!-- No result yet -->
    <v-alert
      v-else-if="busca && !busca.resultado"
      type="info"
      variant="tonal"
    >
      Esta busca ainda não possui um resultado calculado.
      <template #append>
        <v-btn variant="text" :to="{ name: 'detalhe-busca', params: { id } }">Ver busca</v-btn>
      </template>
    </v-alert>

    <!-- Report content -->
    <template v-else-if="busca?.resultado">

      <!-- Print-only page header -->
      <div class="print-header">
        <div class="print-header__title">OdontoSearch Brasil</div>
        <div class="print-header__subtitle">Laudo de Identificação por Padrão Dentário — SB Brasil 2023</div>
        <div class="print-header__meta">Emitido em: {{ dataEmissao }}</div>
      </div>

      <!-- 1. Resultado da análise (first in both screen and print) -->
      <ResultadoCard
        :resultado="busca.resultado"
        :nic="busca.nic"
        :examinador="busca.examinador"
        :sexo-filtro="busca.sexoFiltro"
        :idade-min="busca.idadeMin"
        :idade-max="busca.idadeMax"
        :dentes="busca.dentes"
        class="mb-4"
      />

      <!-- 2. Diagrama Odontológico (second) -->
      <v-card variant="outlined">
        <v-card-title class="text-subtitle-1 pa-4 pb-2">Diagrama Odontológico</v-card-title>
        <v-card-text class="pa-2">
          <Odontogram mode="readonly" :dentes="busca.dentes" />
        </v-card-text>
      </v-card>

    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BuscaDetalhe } from '@/types'
import { getBusca } from '@/api/client'
import Odontogram from '@/components/Odontogram.vue'
import ResultadoCard from '@/components/ResultadoCard.vue'
import axios from 'axios'

const props = defineProps<{ id: number }>()

const busca = ref<BuscaDetalhe | null>(null)
const loading = ref(false)
const notFound = ref(false)

const dataEmissao = new Date().toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

onMounted(async () => {
  loading.value = true
  try {
    busca.value = await getBusca(props.id)
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
})

function exportarPdf() {
  window.print()
}
</script>

<style>
/* ── Print-only header (hidden on screen) ── */
.print-header {
  display: none;
}

/* ── Print styles ── */
@media print {
  /* Hide browser chrome wrappers */
  .v-app-bar,
  .v-navigation-drawer,
  .v-footer,
  .no-print {
    display: none !important;
  }

  /* Remove Vuetify main padding */
  .v-main {
    padding: 0 !important;
  }

  /* Show the print-only header */
  .print-header {
    display: block;
    padding-bottom: 8pt;
    margin-bottom: 14pt;
    border-bottom: 1.5pt solid #333;
  }

  .print-header__title {
    font-size: 14pt;
    font-weight: bold;
    color: #000;
  }

  .print-header__subtitle {
    font-size: 9pt;
    color: #444;
    margin-top: 2pt;
  }

  .print-header__meta {
    font-size: 8pt;
    color: #666;
    margin-top: 4pt;
  }

  /* Cards: no shadow, thin border, avoid breaking across pages */
  .v-card {
    box-shadow: none !important;
    border: 0.75pt solid #ccc !important;
    break-inside: avoid;
  }

  /* Preserve colored badge backgrounds */
  .v-chip,
  [style*="background-color"] {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* The result card loses mt-4 from ResultadoCard default; we already apply mb-4 here */
  .resultado-card {
    margin-top: 0 !important;
  }
}
</style>
