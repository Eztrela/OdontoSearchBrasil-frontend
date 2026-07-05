<template>
  <div
    class="dente-cell"
    :class="{ 'dente-cell--readonly': readonly, 'dente-cell--active': !readonly }"
    :style="cellStyle"
    :title="tooltip"
    @click="!readonly && $emit('click')"
  >
    <span class="dente-numero" :style="textStyle">{{ numeroIso }}</span>
    <span v-if="tooth.ignorar" class="dente-slash" :style="textStyle">/</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ToothState } from '@/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/types'

const props = defineProps<{
  tooth: ToothState
  readonly?: boolean
}>()

defineEmits<{
  click: []
}>()

const numeroIso = computed(() => props.tooth.numeroIso)

const colorKey = computed(() => {
  if (props.tooth.ignorar) return 'ignorar'
  if (props.tooth.statusInformado === null) return 'null'
  return String(props.tooth.statusInformado)
})

const bgColor = computed(() => STATUS_COLORS[colorKey.value] ?? '#E0E0E0')

const textStyle = computed(() => ({
  color: colorKey.value === '4' || colorKey.value === 'ignorar' ? '#000' : '#1a1a1a',
  fontWeight: colorKey.value === '4' ? '700' : '600',
}))

const cellStyle = computed(() => ({
  backgroundColor: bgColor.value,
  cursor: props.readonly ? 'default' : 'pointer',
}))

const tooltip = computed(() => {
  const label = STATUS_LABELS[colorKey.value] ?? 'Desconhecido'
  return `Dente ${numeroIso.value} — ${label}`
})
</script>

<style scoped>
.dente-cell {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  transition: filter 0.15s, transform 0.1s;
  flex-shrink: 0;
}

.dente-cell--active:hover {
  filter: brightness(0.88);
  transform: scale(1.08);
  z-index: 1;
}

.dente-numero {
  font-size: 11px;
  line-height: 1;
}

.dente-slash {
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  margin-top: 1px;
}
</style>
