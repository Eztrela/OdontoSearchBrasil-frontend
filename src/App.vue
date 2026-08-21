<template>
  <v-app>
    <!-- Mobile drawer -->
    <v-navigation-drawer v-model="drawer" temporary location="right">
      <v-list nav class="pt-2">
        <!-- Links públicos (sempre visíveis) -->
        <v-list-item prepend-icon="mdi-home-outline" title="Início" href="/#inicio" rounded="lg" @click="drawer = false" />
        <v-list-item prepend-icon="mdi-information-outline" title="Sobre" href="/#sobre" rounded="lg" @click="drawer = false" />
        <v-list-item prepend-icon="mdi-help-circle-outline" title="Como Funciona" href="/#como-funciona" rounded="lg" @click="drawer = false" />
        <v-list-item prepend-icon="mdi-book-open-outline" title="Saiba mais" :to="{ name: 'guia' }" rounded="lg" />
        <v-list-item prepend-icon="mdi-email-outline" title="Contato" href="/#contato" rounded="lg" @click="drawer = false" />

        <v-divider class="my-2" />

        <!-- Logado -->
        <template v-if="auth.isLoggedIn">
          <v-list-item prepend-icon="mdi-magnify" title="Nova Busca" :to="{ name: 'nova-busca' }" rounded="lg" />
          <v-list-item prepend-icon="mdi-history" title="Histórico" :to="{ name: 'historico' }" rounded="lg" />
          <v-divider class="my-2" />
          <v-list-item class="px-3 py-2">
            <template #prepend>
              <v-icon icon="mdi-account-circle-outline" class="mr-3" />
            </template>
            <v-list-item-title class="text-body-2 font-weight-bold">{{ auth.usuario?.nome }}</v-list-item-title>
            <v-list-item-subtitle>{{ auth.usuario?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item prepend-icon="mdi-logout" title="Sair" rounded="lg" @click="sair" />
        </template>

        <!-- Não logado -->
        <template v-else>
          <v-list-item prepend-icon="mdi-login" title="Entrar" :to="{ name: 'login' }" rounded="lg" />
          <v-list-item prepend-icon="mdi-account-plus-outline" title="Criar conta" :to="{ name: 'cadastro' }" rounded="lg" />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="white" :elevation="0" class="border-b">
      <!-- Desktop: logo → links (left) ··· Entrar/user (right) -->
      <div class="nav-bar-inner d-none d-md-flex align-center">
        <router-link :to="{ name: 'home' }" class="text-decoration-none d-flex align-center">
          <img :src="'/logo.png'" alt="OdontoPeritus" class="nav-logo-img" />
        </router-link>

        <nav class="landing-nav">
          <a href="/#inicio" :class="['nav-lnk', { 'nav-lnk--active': activeSection === 'inicio' }]">Início</a>
          <a href="/#sobre" :class="['nav-lnk', { 'nav-lnk--active': activeSection === 'sobre' }]">Sobre</a>
          <a href="/#como-funciona" :class="['nav-lnk', { 'nav-lnk--active': activeSection === 'como-funciona' }]">Como Funciona</a>
          <RouterLink :to="{ name: 'guia' }" :class="['nav-lnk', { 'nav-lnk--active': activeSection === 'guia' }]">Saiba mais</RouterLink>
          <a href="/#contato" :class="['nav-lnk', { 'nav-lnk--active': activeSection === 'contato' }]">Contato</a>
        </nav>

        <span class="nav-spacer" />

        <!-- Opções exclusivas para usuário logado -->
        <template v-if="auth.isLoggedIn">
          <nav class="app-nav">
            <RouterLink :to="{ name: 'nova-busca' }" class="app-lnk">
              <v-icon size="17" class="app-lnk-icon">mdi-magnify</v-icon>
              Nova Busca
            </RouterLink>
            <RouterLink
              :to="{ name: 'historico' }"
              class="app-lnk"
              :class="{ 'router-link-active': historicoActive }"
            >
              <v-icon size="17" class="app-lnk-icon">mdi-history</v-icon>
              Histórico
            </RouterLink>
          </nav>
          <v-menu>
            <template #activator="{ props: menuProps }">
              <button v-bind="menuProps" class="user-btn">
                <v-icon size="17" class="mr-1">mdi-account-circle-outline</v-icon>
                {{ auth.usuario?.nome.split(' ')[0] }}
                <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
              </button>
            </template>
            <v-list min-width="220">
              <v-list-item :subtitle="auth.usuario?.email">
                <template #title>
                  <span class="text-body-2 font-weight-bold">{{ auth.usuario?.nome }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-chip
                  :color="auth.isDesenvolvedor ? 'warning' : 'primary'"
                  size="x-small"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  {{ auth.isDesenvolvedor ? 'Desenvolvedor' : 'Examinador' }}
                </v-chip>
              </v-list-item>
              <v-divider class="my-1" />
              <v-list-item prepend-icon="mdi-logout" title="Sair" @click="sair" />
            </v-list>
          </v-menu>
        </template>

        <!-- Não logado: botão Entrar -->
        <RouterLink v-else :to="{ name: 'login' }" class="nav-entrar">
          <i class="mdi mdi-lock-outline" />
          Entrar
        </RouterLink>
      </div>

      <!-- Mobile: logo ··· hamburger -->
      <div class="nav-bar-mobile d-flex d-md-none align-center">
        <router-link :to="{ name: 'home' }" class="text-decoration-none">
          <img :src="'/logo.png'" alt="OdontoPeritus" class="nav-logo-img" />
        </router-link>
        <span class="nav-spacer" />
        <button class="hamburger" @click="drawer = !drawer">
          <v-icon color="primary">mdi-menu</v-icon>
        </button>
      </div>
    </v-app-bar>

    <v-main>
      <template v-if="route.name === 'home'">
        <router-view />
      </template>
      <div v-else class="platform-bg">
        <v-container class="py-6" max-width="1200">
          <router-view />
        </v-container>
      </div>
    </v-main>

    <v-footer v-if="route.name !== 'home'" color="primary" class="py-3">
      <v-container class="d-flex flex-column align-center" style="gap: 4px">
        <span class="text-body-2 text-white">
          &copy; {{ new Date().getFullYear() }} OdontoPeritus. Todos os direitos reservados.
        </span>
        <div class="d-flex align-center">
          <a href="#" class="text-caption footer-app-link">Política de Privacidade</a>
          <span class="mx-2 text-caption" style="color: rgba(255,255,255,0.45)">·</span>
          <a href="#" class="text-caption footer-app-link">Termos de Uso</a>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const drawer = ref(false)

const isLandingNav = computed(() => !auth.isLoggedIn)

const historicoActive = computed(() =>
  ['historico', 'detalhe-busca', 'relatorio-busca'].includes(route.name as string),
)

// ── Scroll-spy ────────────────────────────────────────
const ANCHOR_SECTIONS = ['contato', 'como-funciona', 'sobre', 'inicio'] as const
const activeSection = ref('inicio')
let scrollCleanup: (() => void) | null = null

function detectSection() {
  const scrollPos = window.scrollY + 90
  for (const id of ANCHOR_SECTIONS) {
    const el = document.getElementById(id)
    if (el && el.offsetTop <= scrollPos) {
      activeSection.value = id
      return
    }
  }
  activeSection.value = 'inicio'
}

watch(
  () => route.name,
  (name) => {
    scrollCleanup?.()
    scrollCleanup = null

    if (name === 'home') {
      activeSection.value = 'inicio'
      const handler = () => detectSection()
      window.addEventListener('scroll', handler, { passive: true })
      scrollCleanup = () => window.removeEventListener('scroll', handler)
    } else if (name === 'login' || name === 'cadastro') {
      activeSection.value = 'plataforma'
    } else if (name === 'guia') {
      activeSection.value = 'guia'
    } else {
      activeSection.value = ''
    }
  },
  { immediate: true },
)

onUnmounted(() => scrollCleanup?.())

watch(route, () => {
  drawer.value = false
})

function sair() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style>
html {
  scroll-behavior: smooth;
}

/* ── App bar border ──────────────────────────────────── */
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* ── Logo ────────────────────────────────────────────── */
.nav-logo-img {
  height: 34px;
  width: auto;
  display: block;
}

/* ── Nav bar containers ──────────────────────────────── */
.nav-bar-inner {
  flex: 1;
  height: 100%;
  padding: 0 16px;
}

.nav-bar-mobile {
  flex: 1;
  height: 100%;
  padding: 0 12px;
}

.nav-spacer {
  flex: 1;
}

/* ── Landing nav ─────────────────────────────────────── */
.landing-nav {
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: 20px;
}

.nav-lnk {
  display: inline-block;
  color: #1A5C6A;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0;
  text-decoration: none;
  padding: 8px 13px;
  line-height: 1;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.nav-lnk:hover {
  color: #1A5C6A;
  border-bottom: 2.5px solid #1A5C6A;
  padding-bottom: 4px;
}

.nav-lnk--active {
  color: #1A5C6A;
  font-weight: 500;
  border-bottom: 2.5px solid #1A5C6A;
  padding-bottom: 4px;
}

.nav-entrar {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;
  padding: 9px 18px;
  background: #1A5C6A;
  border-radius: 8px;
  line-height: 1;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.nav-entrar:hover {
  background: #154f5c;
}

/* ── App nav ─────────────────────────────────────────── */
.app-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.app-lnk {
  display: inline-flex;
  align-items: center;
  color: #475569;
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: none;
  padding: 7px 12px;
  border-radius: 7px;
  line-height: 1;
  white-space: nowrap;
  transition: color 0.15s ease, background 0.12s ease;
}

.app-lnk-icon {
  margin-right: 5px;
  opacity: 0.75;
}

.app-lnk:hover {
  color: #1A5C6A;
  background: rgba(26, 92, 106, 0.06);
}

.app-lnk.router-link-active {
  color: #1A5C6A;
  font-weight: 600;
  background: rgba(26, 92, 106, 0.08);
}

/* ── User menu button ────────────────────────────────── */
.user-btn {
  display: inline-flex;
  align-items: center;
  color: #1A5C6A;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: 0;
  padding: 7px 14px;
  border: 1.5px solid #1A5C6A;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  margin-left: 8px;
  line-height: 1;
  transition: background 0.15s ease, color 0.15s ease;
  font-family: inherit;
}

.user-btn:hover {
  background: #1A5C6A;
  color: #ffffff;
}

/* ── App footer links ────────────────────────────────── */
.footer-app-link {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-app-link:hover {
  color: rgba(255, 255, 255, 0.95);
}

/* ── Mobile hamburger ────────────────────────────────── */
.hamburger {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
}

/* ── Platform background ─────────────────────────────── */
.platform-bg {
  min-height: 100%;
  background: linear-gradient(160deg, #f0f9fa 0%, #ffffff 55%);
}
</style>
