import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1A5C6A',
          secondary: '#5AADAD',
          accent: '#5AADAD',
          error: '#D32F2F',
          warning: '#F57C00',
          info: '#0277BD',
          success: '#388E3C',
        },
      },
    },
  },
})
