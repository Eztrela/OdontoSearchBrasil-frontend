import { createRouter, createWebHistory } from 'vue-router'
import NovaBusca from '@/views/NovaBusca.vue'
import HistoricoBuscas from '@/views/HistoricoBuscas.vue'
import DetalheBusca from '@/views/DetalheBusca.vue'
import RelatorioView from '@/views/RelatorioView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'nova-busca',
      component: NovaBusca,
    },
    {
      path: '/historico',
      name: 'historico',
      component: HistoricoBuscas,
    },
    {
      path: '/buscas/:id',
      name: 'detalhe-busca',
      component: DetalheBusca,
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/buscas/:id/relatorio',
      name: 'relatorio-busca',
      component: RelatorioView,
      props: (route) => ({ id: Number(route.params.id) }),
    },
  ],
})

export default router
