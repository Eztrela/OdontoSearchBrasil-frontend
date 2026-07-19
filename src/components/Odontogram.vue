<template>
  <div class="odontogram-wrapper">

    <!-- ── Left: arch controls + SVG ────────────────────────────────────────── -->
    <div class="odontogram-main">

      <!-- Bulk arch buttons (edit mode only) -->
      <div v-if="!readonly" class="arch-btns mb-3">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-cursor-default-click-outline"
          @click="openArchMenu('superior')"
        >
          Arcada Superior
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-cursor-default-click-outline"
          @click="openArchMenu('inferior')"
        >
          Arcada Inferior
        </v-btn>
      </div>

      <div class="jaw-label text-caption text-medium-emphasis mb-1">
        <v-icon size="13" class="mr-1">mdi-arrow-up</v-icon>Superior
      </div>

      <div class="svg-container">
        <svg
          class="odontogram-svg"
          viewBox="0 0 400 680"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Diagrama Odontológico"
        >
          <!-- ── Q1 Upper Right (patient right, displayed LEFT) – no transform ── -->
          <g class="quadrant">
            <g
              v-for="pos in POSITIONS"
              :key="`q1-${pos}`"
              :class="['tooth-g', { 'tooth-g--edit': !readonly }]"
              @click="!readonly && openMenu(10 + pos)"
            >
              <path :d="TOOTH_PATHS[pos - 1].outline" :fill="toothFill(10 + pos)" class="tooth-outline" />
              <path :d="TOOTH_PATHS[pos - 1].shadow" class="tooth-shadow" />
            </g>
          </g>

          <!-- ── Q2 Upper Left (patient left, displayed RIGHT) – mirror x ── -->
          <g class="quadrant" transform="translate(400,0) scale(-1,1)">
            <g
              v-for="pos in POSITIONS"
              :key="`q2-${pos}`"
              :class="['tooth-g', { 'tooth-g--edit': !readonly }]"
              @click.stop="!readonly && openMenu(20 + pos)"
            >
              <path :d="TOOTH_PATHS[pos - 1].outline" :fill="toothFill(20 + pos)" class="tooth-outline" />
              <path :d="TOOTH_PATHS[pos - 1].shadow" class="tooth-shadow" />
            </g>
          </g>

          <!-- ── Q4 Lower Right (patient right, displayed LEFT) – flip y ── -->
          <g class="quadrant" transform="translate(0,680) scale(1,-1)">
            <g
              v-for="pos in POSITIONS"
              :key="`q4-${pos}`"
              :class="['tooth-g', { 'tooth-g--edit': !readonly }]"
              @click.stop="!readonly && openMenu(40 + pos)"
            >
              <path :d="TOOTH_PATHS[pos - 1].outline" :fill="toothFill(40 + pos)" class="tooth-outline" />
              <path :d="TOOTH_PATHS[pos - 1].shadow" class="tooth-shadow" />
            </g>
          </g>

          <!-- ── Q3 Lower Left (patient left, displayed RIGHT) – mirror both ── -->
          <g class="quadrant" transform="translate(400,680) scale(-1,-1)">
            <g
              v-for="pos in POSITIONS"
              :key="`q3-${pos}`"
              :class="['tooth-g', { 'tooth-g--edit': !readonly }]"
              @click.stop="!readonly && openMenu(30 + pos)"
            >
              <path :d="TOOTH_PATHS[pos - 1].outline" :fill="toothFill(30 + pos)" class="tooth-outline" />
              <path :d="TOOTH_PATHS[pos - 1].shadow" class="tooth-shadow" />
            </g>
          </g>

          <!-- ── Tooth labels (always in screen coordinates, on top) ── -->
          <!-- Q1 -->
          <text
            v-for="pos in POSITIONS"
            :key="`tq1-${pos}`"
            :x="TOOTH_PATHS[pos - 1].center.x"
            :y="TOOTH_PATHS[pos - 1].center.y"
            :class="['tooth-label', labelClass(10 + pos)]"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ 10 + pos }}{{ toothMap[10 + pos]?.ignorar ? '/' : '' }}</text>

          <!-- Q2 -->
          <text
            v-for="pos in POSITIONS"
            :key="`tq2-${pos}`"
            :x="400 - TOOTH_PATHS[pos - 1].center.x"
            :y="TOOTH_PATHS[pos - 1].center.y"
            :class="['tooth-label', labelClass(20 + pos)]"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ 20 + pos }}{{ toothMap[20 + pos]?.ignorar ? '/' : '' }}</text>

          <!-- Q4 -->
          <text
            v-for="pos in POSITIONS"
            :key="`tq4-${pos}`"
            :x="TOOTH_PATHS[pos - 1].center.x"
            :y="680 - TOOTH_PATHS[pos - 1].center.y"
            :class="['tooth-label', labelClass(40 + pos)]"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ 40 + pos }}{{ toothMap[40 + pos]?.ignorar ? '/' : '' }}</text>

          <!-- Q3 -->
          <text
            v-for="pos in POSITIONS"
            :key="`tq3-${pos}`"
            :x="400 - TOOTH_PATHS[pos - 1].center.x"
            :y="680 - TOOTH_PATHS[pos - 1].center.y"
            :class="['tooth-label', labelClass(30 + pos)]"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ 30 + pos }}{{ toothMap[30 + pos]?.ignorar ? '/' : '' }}</text>

          <!-- Midline / jaw separator guides -->
          <line x1="199" y1="0"   x2="201" y2="320" stroke="rgba(0,0,0,0.10)" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="199" y1="360" x2="201" y2="680" stroke="rgba(0,0,0,0.10)" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="0"   y1="340" x2="400" y2="340" stroke="rgba(0,0,0,0.13)" stroke-width="2" />
        </svg>
      </div>

      <div class="jaw-label text-caption text-medium-emphasis mt-1">
        <v-icon size="13" class="mr-1">mdi-arrow-down</v-icon>Inferior
      </div>
    </div>

    <!-- ── Right: legend ─────────────────────────────────────────────────────── -->
    <div class="legend-side">
      <p class="text-caption font-weight-medium text-medium-emphasis mb-2" style="letter-spacing:0.05em">LEGENDA</p>
      <div v-for="item in LEGEND" :key="item.key" class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: item.color }" />
        <span class="text-caption legend-text">{{ item.label }}</span>
      </div>
    </div>

    <!-- ── Arch bulk status dialog ───────────────────────────────────────────── -->
    <v-dialog v-model="archMenuOpen" max-width="280">
      <v-card>
        <v-card-title class="text-subtitle-2 pa-4 pb-1">
          <v-icon size="16" class="mr-1">
            {{ activeArch === 'superior' ? 'mdi-arrow-up-circle-outline' : 'mdi-arrow-down-circle-outline' }}
          </v-icon>
          Arcada {{ activeArch === 'superior' ? 'Superior' : 'Inferior' }}
        </v-card-title>
        <v-card-subtitle class="px-4 pb-1 text-caption">Aplicar a todos os dentes:</v-card-subtitle>
        <v-list density="compact" nav class="pa-2">
          <v-list-item
            v-for="option in ARCH_OPTIONS"
            :key="option.key"
            rounded="lg"
            class="mb-1"
            @click="applyToArch(option)"
          >
            <template #prepend>
              <span class="legend-dot mr-3" :style="{ backgroundColor: option.color }" />
            </template>
            <v-list-item-title class="text-body-2">{{ option.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-card-actions class="pa-3 pt-0">
          <v-spacer />
          <v-btn size="small" variant="text" @click="archMenuOpen = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Single tooth condition menu ──────────────────────────────────────── -->
    <CondicaoMenu
      v-if="menuOpen && selectedIso !== null"
      v-model="menuOpen"
      :tooth="toothMap[selectedIso]"
      @change="onToothChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ToothState, DenteResult, StatusDente } from '@/types'
import { STATUS_COLORS } from '@/types'
import CondicaoMenu from './CondicaoMenu.vue'
import { TOOTH_PATHS } from './toothPaths'

const props = defineProps<{
  mode?: 'edit' | 'readonly'
  dentes?: DenteResult[]
}>()

const emit = defineEmits<{
  change: [teeth: ToothState[]]
}>()

const readonly = computed(() => props.mode === 'readonly')

// ── FDI layout ────────────────────────────────────────────────────────────────
const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const

const Q1 = [18, 17, 16, 15, 14, 13, 12, 11]
const Q2 = [21, 22, 23, 24, 25, 26, 27, 28]
const Q3 = [31, 32, 33, 34, 35, 36, 37, 38]
const Q4 = [48, 47, 46, 45, 44, 43, 42, 41]
const ALL_TEETH = [...Q1, ...Q2, ...Q3, ...Q4]

const SUPERIOR_TEETH = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28]
const INFERIOR_TEETH = [31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48]

// ── State ─────────────────────────────────────────────────────────────────────

function makeDefaultMap(): Record<number, ToothState> {
  const map: Record<number, ToothState> = {}
  for (const iso of ALL_TEETH) {
    map[iso] = { numeroIso: iso, statusInformado: null, ignorar: false }
  }
  return map
}

const toothMap = ref<Record<number, ToothState>>(makeDefaultMap())

watch(
  () => props.dentes,
  (dentes) => {
    if (!dentes?.length) return
    const map = makeDefaultMap()
    for (const d of dentes) {
      if (map[d.numeroIso]) {
        map[d.numeroIso] = {
          numeroIso: d.numeroIso,
          statusInformado: d.statusInformado as StatusDente,
          ignorar: d.ignorar,
        }
      }
    }
    toothMap.value = map
  },
  { immediate: true },
)

// ── SVG helpers ───────────────────────────────────────────────────────────────

function toothFill(iso: number): string {
  const t = toothMap.value[iso]
  if (!t) return STATUS_COLORS['null']
  if (t.ignorar) return STATUS_COLORS['ignorar']
  if (t.statusInformado === null) return STATUS_COLORS['null']
  return STATUS_COLORS[String(t.statusInformado)] ?? STATUS_COLORS['null']
}

function labelClass(iso: number): string {
  const t = toothMap.value[iso]
  if (!t) return 'tooth-label--dark'
  if (t.ignorar) return 'tooth-label--dark'
  if (t.statusInformado === 4) return 'tooth-label--light'
  return 'tooth-label--dark'
}

// ── Single tooth menu ─────────────────────────────────────────────────────────

const menuOpen = ref(false)
const selectedIso = ref<number | null>(null)

function openMenu(iso: number) {
  if (readonly.value) return
  selectedIso.value = iso
  menuOpen.value = true
}

function onToothChange(updated: ToothState) {
  toothMap.value[updated.numeroIso] = updated
  emit('change', Object.values(toothMap.value))
}

// ── Arch bulk action ──────────────────────────────────────────────────────────

const archMenuOpen = ref(false)
const activeArch = ref<'superior' | 'inferior' | null>(null)

interface ArchOption {
  key: string
  label: string
  color: string
  statusInformado: StatusDente
  ignorar: boolean
}

const ARCH_OPTIONS: ArchOption[] = [
  { key: '0',       label: 'Hígido',               color: STATUS_COLORS['0'],       statusInformado: 0,    ignorar: false },
  { key: '1',       label: 'Cariado',              color: STATUS_COLORS['1'],       statusInformado: 1,    ignorar: false },
  { key: '2',       label: 'Restaurado c/ cárie',  color: STATUS_COLORS['2'],       statusInformado: 2,    ignorar: false },
  { key: '3',       label: 'Restaurado s/ cárie',  color: STATUS_COLORS['3'],       statusInformado: 3,    ignorar: false },
  { key: '4',       label: 'Ausente',              color: STATUS_COLORS['4'],       statusInformado: 4,    ignorar: false },
  { key: 'ignorar', label: 'Ignorar (/)',           color: STATUS_COLORS['ignorar'], statusInformado: null, ignorar: true  },
  { key: 'null',    label: 'Limpar',               color: STATUS_COLORS['null'],    statusInformado: null, ignorar: false },
]

function openArchMenu(arch: 'superior' | 'inferior') {
  activeArch.value = arch
  archMenuOpen.value = true
}

function applyToArch(option: ArchOption) {
  const teeth = activeArch.value === 'superior' ? SUPERIOR_TEETH : INFERIOR_TEETH
  for (const iso of teeth) {
    toothMap.value[iso] = { numeroIso: iso, statusInformado: option.statusInformado, ignorar: option.ignorar }
  }
  emit('change', Object.values(toothMap.value))
  archMenuOpen.value = false
}

// ── Reset ─────────────────────────────────────────────────────────────────────

function reset() {
  toothMap.value = makeDefaultMap()
  emit('change', Object.values(toothMap.value))
}

defineExpose({ reset })

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND = [
  { key: 'null',    label: 'Não informado',        color: STATUS_COLORS['null']    },
  { key: '0',       label: 'Hígido',               color: STATUS_COLORS['0']       },
  { key: '1',       label: 'Cariado',              color: STATUS_COLORS['1']       },
  { key: '2',       label: 'Restaurado c/ cárie',  color: STATUS_COLORS['2']       },
  { key: '3',       label: 'Restaurado s/ cárie',  color: STATUS_COLORS['3']       },
  { key: '4',       label: 'Ausente',              color: STATUS_COLORS['4']       },
  { key: 'ignorar', label: 'Ignorar (/)',           color: STATUS_COLORS['ignorar'] },
]
</script>

<style scoped>
/* ── Wrapper: horizontal layout ── */
.odontogram-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 8px 4px;
}

/* ── Main column (buttons + SVG) ── */
.odontogram-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.arch-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.jaw-label {
  display: flex;
  align-items: center;
  gap: 2px;
}

.svg-container {
  width: 100%;
  max-width: 320px;
}

.odontogram-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

/* ── Tooth paths ── */
.tooth-outline {
  stroke: rgba(0, 0, 0, 0.38);
  stroke-width: 1.5;
  transition: filter 0.15s;
}

.tooth-shadow {
  fill: rgba(0, 0, 0, 0.10);
  pointer-events: none;
}

.tooth-g--edit .tooth-outline {
  cursor: pointer;
}

.tooth-g--edit:hover .tooth-outline {
  filter: brightness(0.82);
  stroke-width: 2;
}

/* ── Labels ── */
.tooth-label {
  font-size: 11px;
  font-family: system-ui, sans-serif;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}

.tooth-label--dark  { fill: rgba(0, 0, 0, 0.75); }
.tooth-label--light { fill: rgba(255, 255, 255, 0.9); }

/* ── Legend column ── */
.legend-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 6px;
  flex-shrink: 0;
  min-width: 148px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 13px;
  height: 13px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
  display: inline-block;
}

.legend-text {
  white-space: nowrap;
}
</style>
