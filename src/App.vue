<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <v-icon icon="mdi-tooth" class="mr-2" />
        OdontoSearch Brasil
      </v-app-bar-title>
      <template #append>
        <v-btn
          :to="{ name: 'nova-busca' }"
          variant="text"
          prepend-icon="mdi-magnify"
        >
          Nova Busca
        </v-btn>
        <v-btn
          :to="{ name: 'historico' }"
          variant="text"
          prepend-icon="mdi-history"
        >
          Histórico
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
// App root — no logic needed here
</script>
