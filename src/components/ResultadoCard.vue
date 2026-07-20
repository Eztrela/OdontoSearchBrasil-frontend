<template>
  <v-card variant="flat" class="resultado-card mt-4" rounded="xl" elevation="2">
    <v-card-text class="pa-5 pb-4">

      <!-- Header: title + rarity badge -->
      <div class="d-flex align-start justify-space-between mb-4">
        <div>
          <div class="text-h6 font-weight-bold">Resultado da análise</div>
          <div class="text-caption text-medium-emphasis">Identificação por padrão dentário</div>
        </div>
        <v-chip
          :color="raridadeColor"
          size="small"
          variant="flat"
          class="font-weight-bold mt-1 ml-2 flex-shrink-0"
        >
          {{ raridadeLabel }}
        </v-chip>
      </div>

      <!-- Examiner + NIC -->
      <div class="info-grid mb-4">
        <div class="info-cell">
          <v-icon size="15" class="mr-1 text-medium-emphasis">mdi-account-outline</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Examinador</span>
          <span v-if="examinador" class="text-body-2 font-weight-medium">{{ examinador }}</span>
          <span v-else class="text-caption text-disabled font-style-italic">não informado</span>
        </div>
        <div class="info-cell">
          <v-icon size="15" class="mr-1 text-medium-emphasis">mdi-file-document-outline</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Número do exame (NIC)</span>
          <span class="text-body-2 font-weight-medium" style="font-family:monospace">{{ nic }}</span>
        </div>
      </div>

      <!-- Applied filters -->
      <div class="mb-4">
        <div class="text-caption text-medium-emphasis mb-2 d-flex align-center gap-1">
          <v-icon size="13">mdi-filter-outline</v-icon>
          Filtros aplicados na base de comparação
        </div>
        <div class="d-flex flex-wrap gap-1">
          <v-chip size="x-small" variant="tonal" color="secondary">
            Sexo: {{ sexoLabel }}
          </v-chip>
          <v-chip size="x-small" variant="tonal" color="secondary">
            Faixa etária: {{ faixasLabel }}
          </v-chip>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-box">
          <div class="text-h5 font-weight-bold stat-freq">{{ frequenciaFormatada }}%</div>
          <div class="text-caption text-medium-emphasis mt-1">Frequência na população</div>
        </div>
        <v-divider vertical class="mx-3 align-self-stretch" />
        <div class="stat-box">
          <div class="text-h5 font-weight-bold">{{ resultado.correspondencias.toLocaleString('pt-BR') }}</div>
          <div class="text-caption text-medium-emphasis mt-1">Correspondências</div>
          <div class="text-caption text-disabled">de {{ resultado.totalPopulacao.toLocaleString('pt-BR') }}</div>
        </div>
        <v-divider vertical class="mx-3 align-self-stretch" />
        <div class="stat-box">
          <div class="text-h5 font-weight-bold">{{ resultado.dentesAvaliados }}</div>
          <div class="text-caption text-medium-emphasis mt-1">Dentes avaliados</div>
        </div>
      </div>

    </v-card-text>

    <v-divider />

    <!-- Dentes analisados table -->
    <v-card-text class="pa-0">
      <div class="px-5 pt-4 pb-2 text-subtitle-2 font-weight-bold">Dentes analisados</div>
      <v-list density="compact" lines="one" class="pa-0 pb-2">
        <v-list-item
          v-for="d in dentesAnalisados"
          :key="d.numeroIso"
          :ripple="false"
          class="dente-row px-5"
        >
          <template #prepend>
            <span class="iso-num text-body-2 font-weight-bold mr-4">{{ d.numeroIso }}</span>
          </template>
          <v-list-item-title class="text-body-2">{{ d.nome }}</v-list-item-title>
          <template #append>
            <v-chip
              size="x-small"
              variant="flat"
              :style="{ backgroundColor: d.color, color: d.textColor }"
              class="font-weight-medium"
            >
              {{ d.statusLabel }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResultadoBusca, StatusDente } from '@/types'
import { RARIDADE_COLORS, RARIDADE_LABELS, STATUS_COLORS, TOOTH_NAMES } from '@/types'

interface DenteInfo {
  numeroIso: number
  statusInformado: StatusDente
  ignorar: boolean
}

const props = defineProps<{
  resultado: ResultadoBusca
  nic: string
  examinador: string
  sexoFiltro?: 1 | 2 | null
  faixas?: string[]
  idadeMin?: number | null
  idadeMax?: number | null
  dentes?: DenteInfo[]
}>()

// ── Rarity ────────────────────────────────────────────────────────────────────

const raridadeColor = computed(() => RARIDADE_COLORS[props.resultado.raridade] ?? 'grey')
const raridadeLabel = computed(() => RARIDADE_LABELS[props.resultado.raridade] ?? props.resultado.raridade)

// ── Frequency formatting ──────────────────────────────────────────────────────

const frequenciaFormatada = computed(() =>
  props.resultado.frequenciaPercent.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }),
)

// ── Filters display ───────────────────────────────────────────────────────────

const sexoLabel = computed(() => {
  if (props.sexoFiltro === 1) return 'Masculino'
  if (props.sexoFiltro === 2) return 'Feminino'
  return 'Ambos'
})

const FAIXA_DEFS = [
  { label: '12 anos',    min: 12, max: 12  },
  { label: '15–19 anos', min: 15, max: 19  },
  { label: '35–44 anos', min: 35, max: 44  },
  { label: '65–74 anos', min: 65, max: 74  },
]

const faixasNormalizadas = computed((): string[] => {
  if (props.faixas?.length) return props.faixas
  const min = props.idadeMin ?? null
  const max = props.idadeMax ?? null
  if (min === null && max === null) return []
  return FAIXA_DEFS
    .filter(f => (min === null || f.max >= min) && (max === null || f.min <= max))
    .map(f => f.label)
})

const faixasLabel = computed((): string => {
  const faixas = faixasNormalizadas.value
  if (!faixas.length) return 'Todas'
  // Short form: strip " anos" from all but the last, then join
  if (faixas.length === 1) return faixas[0]
  const semAnos = faixas.slice(0, -1).map(f => f.replace(' anos', ''))
  return `${semAnos.join(', ')} e ${faixas[faixas.length - 1]}`
})

// ── Dentes table ──────────────────────────────────────────────────────────────

const BADGE_LABELS: Record<string, string> = {
  null:    'Não inf.',
  '0':     'Hígido',
  '1':     'Cariado',
  '2':     'Restaurado c/ cárie',
  '3':     'Restaurado s/ cárie',
  '4':     'Ausente',
  ignorar: 'Ignorar',
}

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b < 160 ? '#ffffff' : '#000000'
}

const dentesAnalisados = computed(() =>
  (props.dentes ?? [])
    .filter(d => d.statusInformado !== null || d.ignorar)
    .sort((a, b) => a.numeroIso - b.numeroIso)
    .map(d => {
      const key = d.ignorar ? 'ignorar' : String(d.statusInformado)
      const color = STATUS_COLORS[key] ?? STATUS_COLORS['null']
      return {
        numeroIso: d.numeroIso,
        nome: TOOTH_NAMES[d.numeroIso] ?? `Dente ${d.numeroIso}`,
        statusLabel: BADGE_LABELS[key] ?? key,
        color,
        textColor: contrastColor(color),
      }
    }),
)
</script>

<style scoped>
.resultado-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* Examiner + NIC row */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-cell {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

/* Stats row */
.stats-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-box {
  min-width: 100px;
}

.stat-freq {
  color: rgb(var(--v-theme-primary));
}

/* Dentes table */
.dente-row {
  border-bottom: 1px solid rgba(var(--v-border-color), calc(var(--v-border-opacity) * 0.5));
}

.dente-row:last-child {
  border-bottom: none;
}

.iso-num {
  min-width: 28px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
