<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-3">
      <v-icon icon="mdi-magnify" class="mr-2" color="primary" />
      Nova Busca de Identificação
    </h1>

    <v-row>
      <!-- Left: form -->
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 pa-4 pb-2">Dados da Busca</v-card-title>
          <v-card-text>
            <!-- NIC -->
            <div class="mb-3">
              <div class="d-flex align-start" style="gap: 8px">
                <v-select
                  v-model="nicAno"
                  :items="nicAnoOptions"
                  label="Ano"
                  variant="outlined"
                  density="comfortable"
                  style="min-width: 110px; max-width: 110px"
                  @update:model-value="nicError = ''"
                />
                <div class="text-h6 text-medium-emphasis" style="padding-top: 18px; flex-shrink: 0">/</div>
                <v-text-field
                  v-model="nicNumero"
                  label="Número"
                  placeholder="0001"
                  :error-messages="nicError"
                  variant="outlined"
                  density="comfortable"
                  maxlength="4"
                  style="flex: 1"
                  @input="nicError = ''"
                />
              </div>
            </div>

            <!-- Optional filters -->
            <v-expansion-panels variant="accordion" class="mb-2">
              <v-expansion-panel title="Filtros opcionais">
                <v-expansion-panel-text>
                  <v-select
                    v-model="sexoFiltro"
                    :items="sexoOptions"
                    label="Sexo"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    class="mb-3"
                  />
                  <v-select
                    v-model="faixasEtarias"
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
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Submit -->
            <v-btn
              color="primary"
              block
              size="large"
              :disabled="!canSubmit"
              :loading="loading"
              prepend-icon="mdi-calculator"
              @click="calcular"
            >
              Calcular Frequência
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right: odontogram -->
      <v-col cols="12" md="8">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 pa-4 pb-2">
            Diagrama Odontológico
            <v-spacer />
            <span class="text-body-2 text-medium-emphasis">
              {{ selectedCount }} dente{{ selectedCount !== 1 ? 's' : '' }} selecionado{{ selectedCount !== 1 ? 's' : '' }}
            </span>
          </v-card-title>
          <v-card-text class="pa-2">
            <Odontogram
              ref="odontogramRef"
              mode="edit"
              @change="onTeethChange"
            />
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ToothState } from '@/types'
import { createBusca, calcularBusca, cancelarBusca } from '@/api/client'
import Odontogram from '@/components/Odontogram.vue'
import axios from 'axios'

const router = useRouter()

// ─── Form state ───────────────────────────────────────────────────────────────

const nicAno = ref<string>(String(new Date().getFullYear()))
const nicNumero = ref<string>('')
const sexoFiltro = ref<1 | 2 | null>(null)
const faixasEtarias = ref<string[]>([])
const teeth = ref<ToothState[]>([])

const nicError = ref('')
const loading = ref(false)
const odontogramRef = ref<InstanceType<typeof Odontogram> | null>(null)

const snackbar = ref(false)
const snackbarMsg = ref('')

// ─── NIC options ─────────────────────────────────────────────────────────────

const nicAnoOptions = (() => {
  const year = new Date().getFullYear()
  return Array.from({ length: year - 1980 + 1 }, (_, i) => String(year - i))
})()

// ─── Options ──────────────────────────────────────────────────────────────────

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

const todasSelecionadas = computed(
  () => ALL_FAIXAS.every((v) => faixasEtarias.value.includes(v)),
)

function toggleTodas() {
  faixasEtarias.value = todasSelecionadas.value ? [] : [...ALL_FAIXAS]
}

const FAIXA_MAP: Record<string, { min: number; max: number }> = {
  '12':    { min: 12, max: 12 },
  '15-19': { min: 15, max: 19 },
  '35-44': { min: 35, max: 44 },
  '65-74': { min: 65, max: 74 },
}

// ─── Validation ───────────────────────────────────────────────────────────────

const nicValid = computed(() => !!nicAno.value && /^\d{1,4}$/.test(nicNumero.value))

const selectedCount = computed(
  () => teeth.value.filter((t) => t.statusInformado !== null || t.ignorar).length,
)

const canSubmit = computed(
  () => nicValid.value && selectedCount.value > 0,
)

// ─── Handlers ─────────────────────────────────────────────────────────────────

function onTeethChange(updated: ToothState[]) {
  teeth.value = updated
}

async function calcular() {
  if (!canSubmit.value) return
  loading.value = true
  nicError.value = ''

  let buscaId: number | null = null

  try {
    const dentesPayload = teeth.value
      .filter((t) => t.statusInformado !== null || t.ignorar)
      .map((t) => ({
        numeroIso: t.numeroIso,
        statusInformado: t.statusInformado,
        ignorar: t.ignorar,
      }))

    const ranges = faixasEtarias.value.map((v) => FAIXA_MAP[v])
    const idadeMin = ranges.length ? Math.min(...ranges.map((r) => r.min)) : undefined
    const idadeMax = ranges.length ? Math.max(...ranges.map((r) => r.max)) : undefined

    const { id } = await createBusca({
      nic: `${nicAno.value}/${nicNumero.value.padStart(4, '0')}`,
      sexoFiltro: sexoFiltro.value ?? undefined,
      idadeMin,
      idadeMax,
      dentes: dentesPayload,
    })
    buscaId = id

    await calcularBusca(id)
    router.push({ name: 'relatorio-busca', params: { id } })
  } catch (err: unknown) {
    // Se a busca foi criada mas o cálculo falhou, cancela para não bloquear o NIC
    if (buscaId !== null) {
      try { await cancelarBusca(buscaId) } catch { /* ignora falha ao cancelar */ }
    }

    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const data = err.response?.data ?? {}
      if (status === 409 && buscaId === null) {
        // 409 veio do createBusca → NIC realmente em uso
        nicError.value = 'Este NIC já possui uma busca ativa'
        showError('Este NIC já possui uma busca ativa. Use um NIC diferente ou consulte o histórico.')
      } else if (status === 422) {
        const erros = data.erros as Record<string, string> | undefined
        const detalhe = erros
          ? Object.entries(erros).map(([k, v]) => `${k}: ${v}`).join(' | ')
          : (data.detail ?? 'Dados inválidos')
        showError(`Erro de validação — ${detalhe}`)
      } else {
        showError(data.detail ?? data.message ?? err.message ?? 'Erro inesperado ao calcular.')
      }
    } else {
      showError('Erro inesperado. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}

function showError(msg: string) {
  snackbarMsg.value = msg
  snackbar.value = true
}
</script>
