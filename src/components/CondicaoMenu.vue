<template>
  <v-dialog v-model="dialog" max-width="320">
    <v-card>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">
        Dente {{ tooth.numeroIso }} — Condição
      </v-card-title>
      <v-card-text class="pa-2">
        <v-list density="compact" nav>
          <v-list-item
            v-for="option in options"
            :key="option.key"
            :value="option.key"
            rounded="lg"
            :active="isActive(option)"
            active-color="primary"
            @click="select(option)"
          >
            <template #prepend>
              <span
                class="color-dot mr-3"
                :style="{ backgroundColor: option.color }"
              />
            </template>
            <v-list-item-title>{{ option.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="pa-3 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ToothState, StatusDente } from '@/types'
import { STATUS_COLORS } from '@/types'

const props = defineProps<{
  modelValue: boolean
  tooth: ToothState
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [tooth: ToothState]
}>()

const dialog = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => (dialog.value = v),
)
watch(dialog, (v) => emit('update:modelValue', v))

interface Option {
  key: string
  label: string
  color: string
  status: StatusDente | null
  ignorar: boolean
}

const options: Option[] = [
  { key: 'null', label: 'Não informado (excluído)', color: STATUS_COLORS['null'], status: null, ignorar: false },
  { key: '0', label: 'Hígido (saudável)', color: STATUS_COLORS['0'], status: 0, ignorar: false },
  { key: '1', label: 'Cariado', color: STATUS_COLORS['1'], status: 1, ignorar: false },
  { key: '2', label: 'Restaurado com cárie', color: STATUS_COLORS['2'], status: 2, ignorar: false },
  { key: '3', label: 'Restaurado sem cárie', color: STATUS_COLORS['3'], status: 3, ignorar: false },
  { key: '4', label: 'Ausente', color: STATUS_COLORS['4'], status: 4, ignorar: false },
  { key: 'ignorar', label: 'Ignorar (/)', color: STATUS_COLORS['ignorar'], status: null, ignorar: true },
]

function isActive(option: Option) {
  if (props.tooth.ignorar) return option.key === 'ignorar'
  if (props.tooth.statusInformado === null) return option.key === 'null'
  return option.key === String(props.tooth.statusInformado)
}

function select(option: Option) {
  emit('change', {
    numeroIso: props.tooth.numeroIso,
    statusInformado: option.status,
    ignorar: option.ignorar,
  })
  dialog.value = false
}
</script>

<style scoped>
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: inline-block;
  flex-shrink: 0;
}
</style>
