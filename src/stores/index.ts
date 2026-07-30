import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BuscaListItem } from '@/types'
import { getBuscas } from '@/api/client'

export const useHistoricoStore = defineStore('historico', () => {
  const buscas = ref<BuscaListItem[]>([])
  const loaded = ref(false)

  async function fetchBuscas() {
    buscas.value = await getBuscas()
    loaded.value = true
  }

  return { buscas, loaded, fetchBuscas }
})
