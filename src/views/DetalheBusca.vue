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
            color="secondary"
            variant="tonal"
            prepend-icon="mdi-pencil-outline"
            size="small"
            class="mr-2"
            @click="abrirEdicao"
          >
            Editar busca
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
              <v-list-item v-if="busca.examinadorMatricula">
                <v-list-item-title class="text-caption text-medium-emphasis">Matrícula</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ busca.examinadorMatricula }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="busca.examinadorCpf">
                <v-list-item-title class="text-caption text-medium-emphasis">CPF</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ formatCpf(busca.examinadorCpf) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="busca.examinadorInstituicao">
                <v-list-item-title class="text-caption text-medium-emphasis">Instituição</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ busca.examinadorInstituicao }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">Criado em</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ formatDate(busca.criadoEm) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="busca.canceladaEm">
                <v-list-item-title class="text-caption text-medium-emphasis">Cancelado em</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">{{ formatDate(busca.canceladaEm) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">Sexo</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">
                  {{ busca.sexoFiltro === 1 ? 'Masculino' : busca.sexoFiltro === 2 ? 'Feminino' : 'Todos' }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">Faixa etária</v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mt-0">
                  <template v-if="busca.idadeMin != null || busca.idadeMax != null">
                    {{ busca.idadeMin ?? '—' }} a {{ busca.idadeMax ?? '—' }} anos
                  </template>
                  <template v-else>Todas as idades</template>
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
            :examinador-matricula="busca.examinadorMatricula"
            :examinador-cpf="busca.examinadorCpf"
            :examinador-instituicao="busca.examinadorInstituicao"
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

    <!-- Edit dialog -->
    <v-dialog v-model="editDialog" max-width="960" scrollable>
      <v-card>
        <v-card-title class="pa-4 pb-2">
          Editar Busca — NIC {{ busca?.nic }}
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Filters -->
          <v-row class="mb-2">
            <v-col cols="12" sm="6">
              <v-select
                v-model="editSexo"
                :items="sexoOptions"
                label="Sexo"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="editFaixas"
                :items="faixaOptions"
                item-title="label"
                item-value="value"
                label="Faixas etárias"
                variant="outlined"
                density="comfortable"
                multiple
                chips
                closable-chips
              >
                <template #prepend-item>
                  <v-list-item
                    title="Todas as faixas"
                    :prepend-icon="todasSelecionadas ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                    @click="toggleTodas"
                  />
                  <v-divider class="mt-1" />
                </template>
              </v-select>
            </v-col>
          </v-row>

          <!-- Odontogram -->
          <v-card variant="outlined">
            <v-card-title class="text-subtitle-2 pa-3 pb-1">
              Diagrama Odontológico
              <span class="text-body-2 text-medium-emphasis ml-2">
                {{ editSelectedCount }} dente{{ editSelectedCount !== 1 ? 's' : '' }} selecionado{{ editSelectedCount !== 1 ? 's' : '' }}
              </span>
            </v-card-title>
            <v-card-text class="pa-2">
              <Odontogram
                ref="editOdontogramRef"
                mode="edit"
                :dentes="editDentes"
                @change="onEditTeethChange"
              />
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-3 pt-0">
          <v-spacer />
          <v-btn variant="text" :disabled="recalcLoading" @click="editDialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-calculator"
            :loading="recalcLoading"
            :disabled="editSelectedCount === 0"
            @click="recalcular"
          >
            Recalcular
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted } from 'vue'
import type { BuscaDetalhe, DenteResult, ToothState } from '@/types'
import { getBusca, cancelarBusca, atualizarBusca, calcularBusca } from '@/api/client'
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

// ─── Edit dialog ──────────────────────────────────────────────────────────────

const editDialog = ref(false)
const recalcLoading = ref(false)
const editOdontogramRef = ref<InstanceType<typeof Odontogram> | null>(null)

const editDentes = ref<DenteResult[]>([])
const editTeeth = ref<ToothState[]>([])
const editSexo = ref<1 | 2 | null>(null)
const editFaixas = ref<string[]>([])

const sexoOptions = [
  { title: 'Ambos', value: null },
  { title: 'Masculino', value: 1 },
  { title: 'Feminino', value: 2 },
]

const faixaOptions = [
  { label: '12 anos',    value: '12'    },
  { label: '15–19 anos', value: '15-19' },
  { label: '35–44 anos', value: '35-44' },
  { label: '65–74 anos', value: '65-74' },
]

const ALL_FAIXAS = faixaOptions.map((f) => f.value)

const FAIXA_MAP: Record<string, { min: number; max: number }> = {
  '12':    { min: 12, max: 12 },
  '15-19': { min: 15, max: 19 },
  '35-44': { min: 35, max: 44 },
  '65-74': { min: 65, max: 74 },
}

const todasSelecionadas = computed(() =>
  ALL_FAIXAS.every((v) => editFaixas.value.includes(v)),
)

function toggleTodas() {
  editFaixas.value = todasSelecionadas.value ? [] : [...ALL_FAIXAS]
}

const editSelectedCount = computed(
  () => editTeeth.value.filter((t) => t.statusInformado !== null || t.ignorar).length,
)

function reverseMapFaixas(idadeMin?: number | null, idadeMax?: number | null): string[] {
  if (idadeMin == null && idadeMax == null) return []
  return Object.entries(FAIXA_MAP)
    .filter(([, r]) => (idadeMin == null || r.max >= idadeMin) && (idadeMax == null || r.min <= idadeMax))
    .map(([k]) => k)
}

function abrirEdicao() {
  if (!busca.value) return
  editDentes.value = busca.value.dentes
  editTeeth.value = busca.value.dentes.map((d) => ({
    numeroIso: d.numeroIso,
    statusInformado: d.statusInformado,
    ignorar: d.ignorar,
  }))
  editSexo.value = busca.value.sexoFiltro ?? null
  editFaixas.value = reverseMapFaixas(busca.value.idadeMin, busca.value.idadeMax)
  editDialog.value = true
}

function onEditTeethChange(updated: ToothState[]) {
  editTeeth.value = updated
}

async function recalcular() {
  recalcLoading.value = true
  try {
    const dentesPayload = editTeeth.value
      .filter((t) => t.statusInformado !== null || t.ignorar)
      .map((t) => ({
        numeroIso: t.numeroIso,
        statusInformado: t.statusInformado,
        ignorar: t.ignorar,
      }))

    const ranges = editFaixas.value.map((v) => FAIXA_MAP[v])
    const idadeMin = ranges.length ? Math.min(...ranges.map((r) => r.min)) : undefined
    const idadeMax = ranges.length ? Math.max(...ranges.map((r) => r.max)) : undefined

    await atualizarBusca(props.id, {
      sexoFiltro: editSexo.value ?? undefined,
      idadeMin,
      idadeMax,
      dentes: dentesPayload,
    })

    await calcularBusca(props.id)
    busca.value = await getBusca(props.id)
    editDialog.value = false
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      showError(err.response?.data?.detail ?? 'Erro ao recalcular busca.')
    } else {
      showError('Erro ao recalcular busca.')
    }
  } finally {
    recalcLoading.value = false
  }
}

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

function formatCpf(cpf: string | null | undefined): string {
  if (!cpf || cpf.length !== 11) return cpf ?? ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
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
