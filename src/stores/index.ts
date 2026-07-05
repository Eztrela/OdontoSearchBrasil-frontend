import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Examinador, BuscaListItem } from '@/types'
import { getExaminadores, getBuscas } from '@/api/client'

// ─── Examinadores Store ───────────────────────────────────────────────────────

export const useExaminadoresStore = defineStore('examinadores', () => {
  const examinadores = ref<Examinador[]>([])
  const loaded = ref(false)

  async function fetchExaminadores() {
    if (loaded.value) return
    examinadores.value = await getExaminadores()
    loaded.value = true
  }

  async function refresh() {
    examinadores.value = await getExaminadores()
    loaded.value = true
  }

  return { examinadores, loaded, fetchExaminadores, refresh }
})

// ─── Histórico Store ──────────────────────────────────────────────────────────

export const useHistoricoStore = defineStore('historico', () => {
  const buscas = ref<BuscaListItem[]>([])
  const loaded = ref(false)

  async function fetchBuscas() {
    buscas.value = await getBuscas()
    loaded.value = true
  }

  return { buscas, loaded, fetchBuscas }
})
