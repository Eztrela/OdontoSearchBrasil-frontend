import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '@/views/HomeView.vue'
import GuiaView from '@/views/GuiaView.vue'
import LoginView from '@/views/LoginView.vue'
import CadastroView from '@/views/CadastroView.vue'
import AguardeVerificacaoView from '@/views/AguardeVerificacaoView.vue'
import VerificacaoEmailView from '@/views/VerificacaoEmailView.vue'
import EsqueceuSenhaView from '@/views/EsqueceuSenhaView.vue'
import RedefinirSenhaView from '@/views/RedefinirSenhaView.vue'
import NovaBusca from '@/views/NovaBusca.vue'
import HistoricoBuscas from '@/views/HistoricoBuscas.vue'
import DetalheBusca from '@/views/DetalheBusca.vue'
import RelatorioView from '@/views/RelatorioView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── Public ──────────────────────────────────────────────────────────────
    { path: '/',                  name: 'home',                component: HomeView },
    { path: '/guia',              name: 'guia',                component: GuiaView },
    { path: '/login',             name: 'login',               component: LoginView,               meta: { guestOnly: true } },
    { path: '/cadastro',          name: 'cadastro',            component: CadastroView,            meta: { guestOnly: true } },
    { path: '/aguarde-verificacao', name: 'aguarde-verificacao', component: AguardeVerificacaoView },
    { path: '/verificar-email/:token', name: 'verificar-email',        component: VerificacaoEmailView },
    { path: '/verificar-email',        name: 'verificar-email-legacy', component: VerificacaoEmailView },
    { path: '/esqueci-senha',     name: 'esqueci-senha',       component: EsqueceuSenhaView,       meta: { guestOnly: true } },
    { path: '/redefinir-senha/:token', name: 'redefinir-senha',        component: RedefinirSenhaView },
    { path: '/redefinir-senha',        name: 'redefinir-senha-legacy', component: RedefinirSenhaView },

    // ── Protected ────────────────────────────────────────────────────────────
    { path: '/busca',   name: 'nova-busca',   component: NovaBusca,       meta: { requiresAuth: true } },
    { path: '/historico',name: 'historico',   component: HistoricoBuscas, meta: { requiresAuth: true } },
    {
      path: '/buscas/:id',
      name: 'detalhe-busca',
      component: DetalheBusca,
      props: (route) => ({ id: Number(route.params.id) }),
      meta: { requiresAuth: true },
    },
    {
      path: '/buscas/:id/relatorio',
      name: 'relatorio-busca',
      component: RelatorioView,
      props: (route) => ({ id: Number(route.params.id) }),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'login' }
  if (to.meta.guestOnly && auth.isLoggedIn) return { name: 'nova-busca' }
})

export default router
