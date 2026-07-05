<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">
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
            <v-text-field
              v-model="nic"
              label="NIC"
              placeholder="2024/0001"
              :rules="[nicRule]"
              :error-messages="nicError"
              hint="Formato: AAAA/NNNN"
              persistent-hint
              variant="outlined"
              density="comfortable"
              class="mb-3"
              @input="nicError = ''"
            />

            <!-- Examiner -->
            <v-autocomplete
              v-model="examinadorId"
              :items="examinadoresStore.examinadores"
              item-title="nome"
              item-value="id"
              label="Examinador"
              variant="outlined"
              density="comfortable"
              :loading="loadingExaminadores"
              clearable
              no-data-text="Nenhum examinador encontrado"
              class="mb-1"
            >
              <template #item="{ item, props: itemProps }">
                <v-list-item v-bind="itemProps" :subtitle="item.raw.email" />
              </template>
            </v-autocomplete>
            <div class="mb-3">
              <v-btn
                size="small"
                variant="text"
                color="primary"
                prepend-icon="mdi-plus"
                @click="novoExaminadorDialog = true"
              >
                Novo examinador
              </v-btn>
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
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="idadeMin"
                        label="Idade mín."
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="0"
                        max="120"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="idadeMax"
                        label="Idade máx."
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="0"
                        max="120"
                      />
                    </v-col>
                  </v-row>
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

        <!-- Result -->
        <ResultadoCard v-if="resultado" :resultado="resultado" />
      </v-col>
    </v-row>

    <!-- New examiner dialog -->
    <v-dialog v-model="novoExaminadorDialog" max-width="420">
      <v-card>
        <v-card-title class="pa-4 pb-2">Novo Examinador</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="novoNome"
            label="Nome completo"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-text-field
            v-model="novoEmail"
            label="E-mail"
            type="email"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="pa-3 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="novoExaminadorDialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="loadingNovoExaminador"
            :disabled="!novoNome.trim() || !novoEmail.trim()"
            @click="salvarNovoExaminador"
          >
            Salvar
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
import type { ToothState, ResultadoBusca } from '@/types'
import { createBusca, calcularBusca, createExaminador } from '@/api/client'
import { useExaminadoresStore } from '@/stores'
import Odontogram from '@/components/Odontogram.vue'
import ResultadoCard from '@/components/ResultadoCard.vue'
import axios from 'axios'

const examinadoresStore = useExaminadoresStore()

// ─── Form state ───────────────────────────────────────────────────────────────

const nic = ref('')
const examinadorId = ref<number | null>(null)
const sexoFiltro = ref<'M' | 'F' | null>(null)
const idadeMin = ref<number | null>(null)
const idadeMax = ref<number | null>(null)
const teeth = ref<ToothState[]>([])

const nicError = ref('')
const loading = ref(false)
const loadingExaminadores = ref(false)
const resultado = ref<ResultadoBusca | null>(null)
const odontogramRef = ref<InstanceType<typeof Odontogram> | null>(null)

const snackbar = ref(false)
const snackbarMsg = ref('')

// ─── New examiner dialog ──────────────────────────────────────────────────────

const novoExaminadorDialog = ref(false)
const novoNome = ref('')
const novoEmail = ref('')
const loadingNovoExaminador = ref(false)

// ─── Options ──────────────────────────────────────────────────────────────────

const sexoOptions = [
  { title: 'Ambos', value: null },
  { title: 'Masculino', value: 'M' },
  { title: 'Feminino', value: 'F' },
]

// ─── Validation ───────────────────────────────────────────────────────────────

const NIC_REGEX = /^\d{4}\/\d{4}$/

function nicRule(v: string): boolean | string {
  if (!v) return 'NIC é obrigatório'
  if (!NIC_REGEX.test(v)) return 'Formato: AAAA/NNNN (ex: 2024/0001)'
  return true
}

const nicValid = computed(() => NIC_REGEX.test(nic.value))

const selectedCount = computed(
  () => teeth.value.filter((t) => t.statusInformado !== null || t.ignorar).length,
)

const canSubmit = computed(
  () => nicValid.value && examinadorId.value !== null && selectedCount.value > 0,
)

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
  loadingExaminadores.value = true
  try {
    await examinadoresStore.fetchExaminadores()
  } catch {
    showError('Erro ao carregar examinadores.')
  } finally {
    loadingExaminadores.value = false
  }
})

// ─── Handlers ─────────────────────────────────────────────────────────────────

function onTeethChange(updated: ToothState[]) {
  teeth.value = updated
}

async function calcular() {
  if (!canSubmit.value) return
  loading.value = true
  resultado.value = null
  nicError.value = ''

  try {
    const dentesPayload = teeth.value
      .filter((t) => t.statusInformado !== null || t.ignorar)
      .map((t) => ({
        numeroIso: t.numeroIso,
        statusInformado: t.statusInformado,
        ignorar: t.ignorar,
      }))

    const { id } = await createBusca({
      nic: nic.value,
      examinadorId: examinadorId.value!,
      sexoFiltro: sexoFiltro.value ?? undefined,
      idadeMin: idadeMin.value ?? undefined,
      idadeMax: idadeMax.value ?? undefined,
      dentes: dentesPayload,
    })

    resultado.value = await calcularBusca(id)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 409) {
        nicError.value = 'Este NIC já possui uma busca ativa'
        showError('Este NIC já possui uma busca ativa. Use um NIC diferente ou consulte o histórico.')
      } else {
        const msg = err.response?.data?.message ?? err.message
        showError(`Erro ao calcular: ${msg}`)
      }
    } else {
      showError('Erro inesperado. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}

async function salvarNovoExaminador() {
  if (!novoNome.value.trim() || !novoEmail.value.trim()) return
  loadingNovoExaminador.value = true
  try {
    const { id } = await createExaminador({ nome: novoNome.value.trim(), email: novoEmail.value.trim() })
    await examinadoresStore.refresh()
    examinadorId.value = id
    novoExaminadorDialog.value = false
    novoNome.value = ''
    novoEmail.value = ''
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      showError(err.response?.data?.message ?? 'Erro ao criar examinador.')
    } else {
      showError('Erro ao criar examinador.')
    }
  } finally {
    loadingNovoExaminador.value = false
  }
}

function showError(msg: string) {
  snackbarMsg.value = msg
  snackbar.value = true
}
</script>
