<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <router-link :to="{ name: 'home' }" class="text-white text-decoration-none d-flex align-center">
          <v-icon icon="mdi-tooth" class="mr-2" />
          OdontoSearch Brasil
        </router-link>
      </v-app-bar-title>
      <template #append>
        <v-btn :to="{ name: 'guia' }" variant="text" prepend-icon="mdi-book-open-outline">
          Guia
        </v-btn>

        <template v-if="auth.isLoggedIn">
          <v-btn :to="{ name: 'nova-busca' }" variant="text" prepend-icon="mdi-magnify">
            Nova Busca
          </v-btn>
          <v-btn :to="{ name: 'historico' }" variant="text" prepend-icon="mdi-history">
            Histórico
          </v-btn>

          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="tonal"
                color="white"
                class="ml-1"
                prepend-icon="mdi-account-circle-outline"
                append-icon="mdi-chevron-down"
              >
                {{ auth.usuario?.nome.split(' ')[0] }}
              </v-btn>
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

        <template v-else>
          <v-btn :to="{ name: 'login' }" variant="text" prepend-icon="mdi-login">
            Entrar
          </v-btn>
          <v-btn :to="{ name: 'cadastro' }" variant="tonal" color="white" class="ml-1">
            Criar conta
          </v-btn>
        </template>
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" max-width="1200">
        <router-view />
      </v-container>
    </v-main>

    <v-footer color="primary" class="text-center d-flex justify-center py-3">
      <span class="text-body-2 text-white">
        OdontoSearch Brasil &copy; {{ new Date().getFullYear() }} — Identificação Forense por Padrão Dentário
      </span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function sair() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
