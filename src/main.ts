import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Normaliza barras duplas no path (ex: //verificar-email → /verificar-email) causadas
// por emails enviados antes do fix de trailing slash no FRONTEND_URL do backend.
const raw = window.location.href
const normalized = raw.replace(/(https?:\/\/[^/]+)\/\/+/, '$1/')
if (normalized !== raw) {
  window.location.replace(normalized)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
