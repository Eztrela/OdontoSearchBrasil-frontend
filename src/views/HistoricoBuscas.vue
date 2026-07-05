<template>
  <div>
    <div class="d-flex align-center mb-6">
      <h1 class="text-h5 font-weight-bold">
        <v-icon icon="mdi-history" class="mr-2" color="primary" />
        Histórico de Buscas
      </h1>
      <v-spacer />
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="reload"
      >
        Atualizar
      </v-btn>
    </div>

    <v-card variant="outlined">
      <v-data-table
        :headers="headers"
        :items="historicoStore.buscas"
        :loading="loading"
        loading-text="Carregando buscas..."
        no-data-text="Nenhuma busca encontrada"
        hover
        @click:row="onRowClick"
      >
        <!-- NIC -->
        <template #item.nic="{ item }">
          <span class="font-weight-medium font-mono">{{ item.nic }}</span>
        </template>

        <!-- Date -->
        <template #item.criadoEm="{ item }">
          {{ formatDate(item.criadoEm) }}
        </template>

        <!-- Frequency -->
        <template #item.frequenciaPercent="{ item }">
          <span v-if="item.frequenciaPercent != null">
            {{ item.frequenciaPercent.toFixed(4) }}%
          </span>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <!-- Rarity chip -->
        <template #item.raridade="{ item }">
          <v-chip
            v-if="item.raridade"
            :color="raridadeColor(item.raridade)"
            size="small"
            variant="flat"
          >
            {{ raridadeLabel(item.raridade) }}
          </v-chip>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <!-- Matches -->
        <template #item.matches="{ item }">
          <span v-if="item.correspondencias != null && item.totalPopulacao != null">
            {{ item.correspondencias.toLocaleString('pt-BR') }} /
            {{ item.totalPopulacao.toLocaleString('pt-BR') }}
          </span>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <!-- Row action -->
        <template #item.actions="{}">
          <v-icon size="18" color="primary">mdi-chevron-right</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Error snackbar -->
    <v-snackbar v-model="snackbar" color="error" timeout="5000">
      {{ snackbarMsg }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoricoStore } from '@/stores'
import { RARIDADE_COLORS, RARIDADE_LABELS } from '@/types'

const router = useRouter()
const historicoStore = useHistoricoStore()

const loading = ref(false)
const snackbar = ref(false)
const snackbarMsg = ref('')

const headers = [
  { title: 'NIC', key: 'nic', sortable: true },
  { title: 'Examinador', key: 'examinador', sortable: true },
  { title: 'Data', key: 'criadoEm', sortable: true },
  { title: 'Frequência', key: 'frequenciaPercent', sortable: true },
  { title: 'Raridade', key: 'raridade', sortable: false },
  { title: 'Corresp. / Total', key: 'matches', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
]

onMounted(async () => {
  await reload()
})

async function reload() {
  loading.value = true
  try {
    await historicoStore.fetchBuscas()
  } catch {
    snackbarMsg.value = 'Erro ao carregar histórico.'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

function onRowClick(_event: Event, { item }: { item: { id: number } }) {
  router.push({ name: 'detalhe-busca', params: { id: item.id } })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function raridadeColor(r: string): string {
  return RARIDADE_COLORS[r] ?? 'grey'
}

function raridadeLabel(r: string): string {
  return RARIDADE_LABELS[r] ?? r
}
</script>
