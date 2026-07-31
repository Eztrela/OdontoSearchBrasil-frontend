<template>
  <v-app>
    <!-- Mobile drawer -->
    <v-navigation-drawer v-model="drawer" temporary location="right">
      <v-list nav class="pt-2">
        <v-list-item
          prepend-icon="mdi-home-outline"
          title="Início"
          :to="{ name: 'home' }"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-book-open-outline"
          title="Guia"
          :to="{ name: 'guia' }"
          rounded="lg"
        />

        <template v-if="auth.isLoggedIn">
          <v-divider class="my-2" />
          <v-list-item
            prepend-icon="mdi-magnify"
            title="Nova Busca"
            :to="{ name: 'nova-busca' }"
            rounded="lg"
          />
          <v-list-item
            prepend-icon="mdi-history"
            title="Histórico"
            :to="{ name: 'historico' }"
            rounded="lg"
          />
          <v-divider class="my-2" />
          <v-list-item class="px-3 py-2">
            <template #prepend>
              <v-icon icon="mdi-account-circle-outline" class="mr-3" />
            </template>
            <v-list-item-title class="text-body-2 font-weight-bold">
              {{ auth.usuario?.nome }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ auth.usuario?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            rounded="lg"
            @click="sair"
          />
        </template>

        <template v-else>
          <v-divider class="my-2" />
          <v-list-item
            prepend-icon="mdi-login"
            title="Entrar"
            :to="{ name: 'login' }"
            rounded="lg"
          />
          <v-list-item
            prepend-icon="mdi-account-plus-outline"
            title="Criar conta"
            :to="{ name: 'cadastro' }"
            rounded="lg"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <router-link
          :to="{ name: 'home' }"
          class="text-white text-decoration-none d-flex align-center"
        >
          <v-icon icon="mdi-tooth" class="mr-2" />
          OdontoSearch Brasil
        </router-link>
      </v-app-bar-title>

      <template #append>
        <!-- Desktop nav -->
        <div class="d-none d-md-flex align-center" style="gap: 6px; padding-right: 4px">
          <v-btn
            :to="{ name: 'guia' }"
            :variant="route.name === 'guia' ? 'tonal' : 'text'"
            prepend-icon="mdi-book-open-outline"
          >
            Guia
          </v-btn>

          <template v-if="auth.isLoggedIn">
            <v-btn
              :to="{ name: 'nova-busca' }"
              :variant="route.name === 'nova-busca' ? 'tonal' : 'text'"
              prepend-icon="mdi-magnify"
            >
              Nova Busca
            </v-btn>
            <v-btn
              :to="{ name: 'historico' }"
              :variant="historicoActive ? 'tonal' : 'text'"
              prepend-icon="mdi-history"
            >
              Histórico
            </v-btn>

            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  variant="tonal"
                  color="white"
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
            <v-btn
              :to="{ name: 'login' }"
              :variant="route.name === 'login' ? 'tonal' : 'text'"
              prepend-icon="mdi-login"
            >
              Entrar
            </v-btn>
            <v-btn :to="{ name: 'cadastro' }" variant="tonal" color="white">
              Criar conta
            </v-btn>
          </template>
        </div>

        <!-- Mobile hamburger -->
        <v-btn icon class="d-flex d-md-none mr-1" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
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
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const drawer = ref(false)

const historicoActive = computed(() =>
  ['historico', 'detalhe-busca', 'relatorio-busca'].includes(route.name as string),
)

watch(route, () => {
  drawer.value = false
})

function sair() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
