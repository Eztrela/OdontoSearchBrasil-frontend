<template>
  <div class="odontogram-wrapper">
    <div class="jaw-label text-caption text-medium-emphasis mb-1">
      <v-icon size="14" class="mr-1">mdi-arrow-up</v-icon>Superior
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
            <path
              :d="TOOTH_PATHS[pos - 1].outline"
              :fill="toothFill(10 + pos)"
              class="tooth-outline"
            />
            <path
              :d="TOOTH_PATHS[pos - 1].shadow"
              class="tooth-shadow"
            />
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
            <path
              :d="TOOTH_PATHS[pos - 1].outline"
              :fill="toothFill(20 + pos)"
              class="tooth-outline"
            />
            <path
              :d="TOOTH_PATHS[pos - 1].shadow"
              class="tooth-shadow"
            />
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
            <path
              :d="TOOTH_PATHS[pos - 1].outline"
              :fill="toothFill(40 + pos)"
              class="tooth-outline"
            />
            <path
              :d="TOOTH_PATHS[pos - 1].shadow"
              class="tooth-shadow"
            />
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
            <path
              :d="TOOTH_PATHS[pos - 1].outline"
              :fill="toothFill(30 + pos)"
              class="tooth-outline"
            />
            <path
              :d="TOOTH_PATHS[pos - 1].shadow"
              class="tooth-shadow"
            />
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
        <line x1="199" y1="0" x2="201" y2="320" stroke="rgba(0,0,0,0.10)" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="199" y1="360" x2="201" y2="680" stroke="rgba(0,0,0,0.10)" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="0" y1="340" x2="400" y2="340" stroke="rgba(0,0,0,0.13)" stroke-width="2" />
      </svg>
    </div>

    <div class="jaw-label text-caption text-medium-emphasis mt-1">
      <v-icon size="14" class="mr-1">mdi-arrow-down</v-icon>Inferior
    </div>

    <!-- Legend -->
    <div class="legend mt-4">
      <div v-for="item in LEGEND" :key="item.key" class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: item.color }" />
        <span class="legend-text text-caption">{{ item.label }}</span>
      </div>
    </div>

    <!-- Condition menu dialog -->
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

// ── Menu ──────────────────────────────────────────────────────────────────────

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

function reset() {
  toothMap.value = makeDefaultMap()
  emit('change', Object.values(toothMap.value))
}

defineExpose({ reset })

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND = [
  { key: 'null',    label: 'Não informado',        color: STATUS_COLORS['null'] },
  { key: '0',       label: 'Hígido',               color: STATUS_COLORS['0'] },
  { key: '1',       label: 'Cariado',              color: STATUS_COLORS['1'] },
  { key: '2',       label: 'Restaurado c/ cárie',  color: STATUS_COLORS['2'] },
  { key: '3',       label: 'Restaurado s/ cárie',  color: STATUS_COLORS['3'] },
  { key: '4',       label: 'Ausente',              color: STATUS_COLORS['4'] },
  { key: 'ignorar', label: 'Ignorar (/)',           color: STATUS_COLORS['ignorar'] },
]
</script>

<style scoped>
.odontogram-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.jaw-label {
  width: 100%;
  text-align: center;
}

.svg-container {
  width: 100%;
  max-width: 280px;
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
  font-size: 8.5px;
  font-family: system-ui, sans-serif;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}

.tooth-label--dark {
  fill: rgba(0, 0, 0, 0.75);
}

.tooth-label--light {
  fill: rgba(255, 255, 255, 0.9);
}

/* ── Legend ── */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 13px;
  height: 13px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
}

.legend-text {
  white-space: nowrap;
}
</style>
