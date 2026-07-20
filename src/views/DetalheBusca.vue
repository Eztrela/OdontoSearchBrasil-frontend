<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Not found -->
    <v-alert v-else-if="notFound" type="error" variant="tonal" class="mb-4">
      Busca #{{ id }} não encontrada.
      <template #append>
        <v-btn variant="text" :to="{ name: 'historico' }">Voltar ao histórico</v-btn>
      </template>
    </v-alert>

    <!-- Content -->
    <template v-else-if="busca">
      <div class="d-flex align-center mb-6 flex-wrap gap-2">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          :to="{ name: 'historico' }"
          class="mr-1"
        />
        <h1 class="text-h5 font-weight-bold">
          <v-icon icon="mdi-file-search" class="mr-2" color="primary" />
          Busca — NIC {{ busca.nic }}
        </h1>
        <v-spacer />
        <v-chip
          v-if="busca.canceladaEm"
          color="error"
          size="small"
          variant="flat"
          prepend-icon="mdi-cancel"
        >
          Cancelada
        </v-chip>
        <template v-else>
          <v-btn
            v-if="busca.resultado"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-file-eye-outline"
            size="small"
            class="mr-2"
            :to="{ name: 'relatorio-busca', params: { id } }"
          >
            Ver relatório
          </v-btn>
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-cancel"
            size="small"
            :loading="cancelLoading"
            @click="confirmarCancelamento = true"
          >
            Cancelar busca
          </v-btn>
        </template>
      </div>

      <v-row>
        <!-- Info card -->
        <v-col cols="12" md="4">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="text-subtitle-1 pa-4 pb-2">Informações</v-card-title>
            <v-list density="compact" class="pa-2">
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">NIC</v-list-item-title>
                <v-list-item-subtitle class="font-weight-medium font-mono text-body-2 mt-0">
                  {{ busca.nic }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">Examinador</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ busca.examinador }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">Criado em</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ formatDate(busca.criadoEm) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="busca.canceladaEm">
                <v-list-item-title class="text-caption text-medium-emphasis">Cancelado em</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ formatDate(busca.canceladaEm) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="busca.sexoFiltro">
                <v-list-item-title class="text-caption text-medium-emphasis">Sexo</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">
                  {{ busca.sexoFiltro === 1 ? 'Masculino' : 'Feminino' }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="busca.idadeMin != null || busca.idadeMax != null">
                <v-list-item-title class="text-caption text-medium-emphasis">Faixa etária</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">
                  {{ busca.idadeMin ?? '—' }} a {{ busca.idadeMax ?? '—' }} anos
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Odontogram + result summary -->
        <v-col cols="12" md="8">
          <v-card variant="outlined">
            <v-card-title class="text-subtitle-1 pa-4 pb-2">Diagrama Odontológico</v-card-title>
            <v-card-text class="pa-2">
              <Odontogram mode="readonly" :dentes="busca.dentes" />
            </v-card-text>
          </v-card>

          <ResultadoCard
            v-if="busca.resultado"
            :resultado="busca.resultado"
            :nic="busca.nic"
            :examinador="busca.examinador"
            :sexo-filtro="busca.sexoFiltro"
            :idade-min="busca.idadeMin"
            :idade-max="busca.idadeMax"
            :dentes="busca.dentes"
          />

          <v-alert
            v-else-if="!busca.canceladaEm"
            type="info"
            variant="tonal"
            class="mt-4"
            text="Resultado não disponível. A busca pode não ter sido calculada."
          />
        </v-col>
      </v-row>
    </template>

    <!-- Confirm cancel dialog -->
    <v-dialog v-model="confirmarCancelamento" max-width="380">
      <v-card>
        <v-card-title class="pa-4 pb-2">Confirmar cancelamento</v-card-title>
        <v-card-text>
          Deseja cancelar a busca NIC <strong>{{ busca?.nic }}</strong>? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions class="pa-3 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="confirmarCancelamento = false">Não</v-btn>
          <v-btn color="error" variant="flat" :loading="cancelLoading" @click="cancelar">
            Sim, cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error snackbar -->
    <v-snackbar v-model="snackbar" color="error" timeout="5000" multi-line>
      {{ snackbarMsg }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BuscaDetalhe } from '@/types'
import { getBusca, cancelarBusca } from '@/api/client'
import Odontogram from '@/components/Odontogram.vue'
import ResultadoCard from '@/components/ResultadoCard.vue'
import axios from 'axios'

const props = defineProps<{ id: number }>()

const busca = ref<BuscaDetalhe | null>(null)
const loading = ref(false)
const notFound = ref(false)
const cancelLoading = ref(false)
const confirmarCancelamento = ref(false)
const snackbar = ref(false)
const snackbarMsg = ref('')

onMounted(async () => {
  loading.value = true
  try {
    busca.value = await getBusca(props.id)
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      notFound.value = true
    } else {
      showError('Erro ao carregar busca.')
    }
  } finally {
    loading.value = false
  }
})

async function cancelar() {
  if (!busca.value) return
  cancelLoading.value = true
  try {
    await cancelarBusca(props.id)
    busca.value = await getBusca(props.id)
    confirmarCancelamento.value = false
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      showError(err.response?.data?.message ?? 'Erro ao cancelar busca.')
    } else {
      showError('Erro ao cancelar busca.')
    }
  } finally {
    cancelLoading.value = false
  }
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

function showError(msg: string) {
  snackbarMsg.value = msg
  snackbar.value = true
}
</script>
