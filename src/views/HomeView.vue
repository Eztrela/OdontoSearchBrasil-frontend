<template>
  <div class="landing-page">

    <!-- ── Hero ───────────────────────────────────────────── -->
    <section id="inicio" class="hero-section">
      <v-container max-width="1200" class="hero-container">
        <v-row align="center" class="fill-height" style="min-height: 88vh">

          <!-- Left: text -->
          <v-col cols="12" md="6" class="hero-text">
            <div class="hero-logo mb-5">
              <span class="hero-logo-odonto">Odonto</span><span class="hero-logo-peritus">Peritus</span>
            </div>
            <p class="hero-desc mb-8">
              Utilizando os dados epidemiológicos do <strong>SB Brasil 2023</strong>,
              a plataforma estima a frequência de padrões odontológicos na população brasileira,
              subsidiando análises de probabilidade em processos de identificação humana.
            </p>
            <div class="hero-actions">
              <v-btn
                :to="auth.isLoggedIn ? { name: 'nova-busca' } : { name: 'login' }"
                color="primary"
                variant="flat"
                size="large"
                rounded="lg"
                class="mr-3 mb-2"
              >
                Acessar Plataforma
              </v-btn>
              <v-btn
                href="#sobre"
                variant="outlined"
                color="primary"
                size="large"
                rounded="lg"
                class="mb-2"
              >
                Saiba mais &rarr;
              </v-btn>
            </div>
          </v-col>

          <!-- Right: monitor mockup -->
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <div class="monitor-wrapper">
              <div class="monitor-frame">
                <div class="monitor-camera" />
                <div class="monitor-screen">
                  <div class="app-mockup">
                    <div class="mockup-header">
                      <v-icon color="primary" size="18" class="mr-2">mdi-magnify</v-icon>
                      <span class="mockup-title">Nova Busca de Identificação</span>
                    </div>
                    <div class="mockup-body mockup-body--grid">

                      <!-- Painel esquerdo: formulário -->
                      <div class="mkp-left">
                        <div class="mkp-card">
                          <div class="mkp-card-title">Dados da Busca</div>
                          <!-- Ano / Número -->
                          <div class="mkp-ano-num-row">
                            <div class="mkp-outlined-field mkp-field--ano">
                              <span class="mkp-float-label">Ano</span>
                              <div class="mkp-select-row">
                                <span class="mkp-field-val">2026</span>
                                <span class="mkp-chevron">▾</span>
                              </div>
                            </div>
                            <span class="mkp-slash">/</span>
                            <div class="mkp-outlined-field mkp-field--num">
                              <span class="mkp-float-label">Número</span>
                              <span class="mkp-placeholder">0001</span>
                            </div>
                          </div>
                          <!-- Filtros opcionais -->
                          <div class="mkp-filtros mkp-mt">
                            <div class="mkp-select-row">
                              <span>Filtros opcionais</span>
                              <span class="mkp-chevron">▾</span>
                            </div>
                          </div>
                          <!-- Calcular -->
                          <div class="mkp-calc-btn mkp-mt">⊞ CALCULAR FREQUÊNCIA</div>
                        </div>
                      </div>

                      <!-- Painel direito: Odontogram real escalado -->
                      <div class="mkp-right">
                        <div class="mkp-card mkp-card--full">
                          <div class="mkp-card-header">
                            <span class="mkp-card-title">Diagrama Odontológico</span>
                            <span class="mkp-card-sub">0 dentes selecionados</span>
                          </div>
                          <div class="mkp-odonto-clip">
                            <div class="mkp-odonto-scale">
                              <Odontogram mode="edit" />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div class="monitor-neck" />
              <div class="monitor-foot" />
            </div>
          </v-col>

        </v-row>
      </v-container>
    </section>

    <!-- ── Features / Sobre ───────────────────────────────── -->
    <section id="sobre" class="features-section">
      <v-container max-width="1200">
        <v-row>
          <v-col v-for="f in features" :key="f.title" cols="12" md="4">
            <div class="feature-card-h">
              <div class="feature-icon-sq">
                <v-icon :icon="f.icon" size="28" color="white" />
              </div>
              <div>
                <div class="feature-title mb-1">{{ f.title }}</div>
                <div class="feature-desc">{{ f.desc }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ── Como Funciona ──────────────────────────────────── -->
    <section id="como-funciona" class="how-section">
      <v-container max-width="1200">
        <v-row justify="center" class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="section-title">Como funciona</h2>
            <div class="section-underline" />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="s in steps" :key="s.num" cols="12" md="4">
            <div class="step-card">
              <div class="step-icon-wrap mb-5">
                <v-icon :icon="s.icon" size="40" color="primary" />
              </div>
              <div class="step-header mb-4">
                <span class="step-num">{{ s.num }}</span>
                <span class="step-title">{{ s.title }}</span>
              </div>
              <p class="step-desc">{{ s.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Disclaimer -->
      <div id="plataforma" class="disclaimer-bar">
        <v-container max-width="1000">
          <div class="disclaimer-inner">
            <div class="disclaimer-icon-wrap">
              <v-icon icon="mdi-shield-check" size="36" color="white" />
            </div>
            <p class="disclaimer-text">
              A OdontoPeritus é uma ferramenta de apoio à decisão e não substitui
              a análise técnica realizada pelo cirurgião-dentista perito.
            </p>
          </div>
        </v-container>
      </div>
    </section>

    <!-- ── Footer ─────────────────────────────────────────── -->
    <footer id="contato" class="landing-footer">
      <v-container max-width="1200">
        <v-row class="footer-cols">

          <!-- Col 1: Logo + tagline -->
          <v-col cols="12" sm="6" md="3">
            <div class="footer-logo mb-3">
              <span class="logo-odonto">Odonto</span><span class="logo-peritus">Peritus</span>
            </div>
            <p class="footer-tagline">
              Plataforma de apoio à identificação em Odontologia Legal.
            </p>
            <div class="footer-socials mt-4">
              <a href="mailto:odontoperitus@ccs.ufpb.br" class="social-link" title="E-mail">
                <v-icon icon="mdi-email-outline" size="22" />
              </a>
            </div>
          </v-col>

          <!-- Col 2: Instituição -->
          <v-col cols="12" sm="6" md="3">
            <div class="footer-heading">Instituição</div>
            <ul class="footer-list">
              <li>Universidade Federal da Paraíba</li>
              <li>Centro de Ciências da Saúde</li>
              <li>Programa de Pós-Graduação em Odontologia</li>
            </ul>
          </v-col>

          <!-- Col 3: Links rápidos -->
          <v-col cols="12" sm="6" md="3">
            <div class="footer-heading">Links rápidos</div>
            <ul class="footer-list">
              <li><a href="#inicio" class="footer-link">Início</a></li>
              <li><a href="#sobre" class="footer-link">Sobre</a></li>
              <li><a href="#plataforma" class="footer-link">Plataforma</a></li>
              <li><a href="#como-funciona" class="footer-link">Como Funciona</a></li>
              <li><a href="#contato" class="footer-link">Contato</a></li>
            </ul>
          </v-col>

          <!-- Col 4: Contato -->
          <v-col cols="12" sm="6" md="3">
            <div class="footer-heading">Contato</div>
            <ul class="footer-list">
              <li>
                <v-icon icon="mdi-email-outline" size="14" class="mr-1" />
                odontoperitus@ccs.ufpb.br
              </li>
              <li>
                <v-icon icon="mdi-phone-outline" size="14" class="mr-1" />
                (83) 3216-7797
              </li>
              <li>
                <v-icon icon="mdi-map-marker-outline" size="14" class="mr-1" />
                Cidade Universitária, João Pessoa – PB, Brasil
              </li>
            </ul>
          </v-col>

        </v-row>

        <v-divider class="footer-divider" />

        <div class="footer-bottom">
          <span>&copy; {{ new Date().getFullYear() }} OdontoPeritus. Todos os direitos reservados.</span>
          <div class="footer-bottom-links">
            <a href="#" class="footer-link">Política de Privacidade</a>
            <span class="mx-2">·</span>
            <a href="#" class="footer-link">Termos de Uso</a>
          </div>
        </div>
      </v-container>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Odontogram from '@/components/Odontogram.vue'

const auth = useAuthStore()


const features = [
  {
    icon: 'mdi-chart-bar',
    title: 'Base Científica',
    desc: 'Baseado nos dados do SB Brasil 2023, com 33.512 participantes representando a população brasileira adulta.',
  },
  {
    icon: 'mdi-account-outline',
    title: 'Gratuito',
    desc: 'Acesso gratuito mediante cadastro, disponível para cirurgiões-dentistas peritos em todo o Brasil.',
  },
  {
    icon: 'mdi-school',
    title: 'Desenvolvimento',
    desc: 'Desenvolvido no PPGO da UFPB com rigor metodológico e validação científica.',
  },
]

const steps = [
  {
    num: '01',
    icon: 'mdi-tooth-outline',
    title: 'Registra as características odontológicas',
    desc: 'Registra as condições clínicas de cada elemento dentário, incluindo dentes hígidos, cariados, restaurados, ausentes e excluídos da análise, permitindo a composição de padrões odontológicos para a identificação humana.',
  },
  {
    num: '02',
    icon: 'mdi-chart-bar',
    title: 'Uso de dados epidemiológicos para estimativa de frequência',
    desc: 'Utilize os dados do SB Brasil 2023 para estimar a frequência esperada de um padrão odontológico na população brasileira, subsidiando a análise da probabilidade de ocorrência desse padrão em processos de identificação humana.',
  },
  {
    num: '03',
    icon: 'mdi-file-pdf-box',
    title: 'Relatório exportável',
    desc: 'Gere um relatório de identificação com diagrama odontológico e estatísticas pronto para exportação em PDF.',
  },
]
</script>

<style scoped>
/* ── General ────────────────────────────────────────────── */
.landing-page {
  overflow-x: hidden;
}

/* ── Hero ───────────────────────────────────────────────── */
.hero-section {
  background: linear-gradient(150deg, #ffffff 50%, #e8f6f8 100%);
  background-image:
    linear-gradient(150deg, #ffffff 50%, #e8f6f8 100%);
  padding: 40px 0 60px;
}

.hero-logo {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 1;
  letter-spacing: -1px;
}

.hero-logo-odonto {
  color: #68B5B5;
  font-weight: 600;
}

.hero-logo-peritus {
  color: #1A5C6A;
  font-weight: 800;
}

.hero-desc {
  font-size: 1.05rem;
  color: #546e7a;
  max-width: 480px;
  line-height: 1.7;
}

/* ── Monitor frame ──────────────────────────────────────── */
.monitor-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 540px;
}

.monitor-frame {
  width: 100%;
  background: linear-gradient(180deg, #e4e4e4 0%, #d0d0d0 100%);
  border-radius: 14px;
  padding: 10px 10px 10px;
  border: 1.5px solid #c0c0c0;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.85),
    0 24px 72px rgba(0,0,0,0.20),
    0 6px 18px rgba(0,0,0,0.10);
}

.monitor-camera {
  width: 7px;
  height: 7px;
  background: #a8a8a8;
  border-radius: 50%;
  margin: 0 auto 8px;
  border: 1px solid #909090;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.25);
}

.monitor-screen {
  background: linear-gradient(160deg, #f0f9fa 0%, #ffffff 55%);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.10);
}

.monitor-neck {
  width: 64px;
  height: 30px;
  background: linear-gradient(180deg, #d4d4d4 0%, #c4c4c4 100%);
  clip-path: polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%);
}

.monitor-foot {
  width: 200px;
  height: 12px;
  background: linear-gradient(180deg, #cccccc 0%, #b8b8b8 100%);
  border-radius: 0 0 8px 8px;
  border: 1px solid #b0b0b0;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
}

/* ── App mockup (inside monitor) ───────────────────────── */
.app-mockup {
  background: #ffffff;
  width: 100%;
  overflow: hidden;
}

.mockup-header {
  background: #f5fbfc;
  border-bottom: 1px solid #e0f0f3;
  padding: 14px 18px;
  display: flex;
  align-items: center;
}

.mockup-title {
  font-size: 13px;
  font-weight: 600;
  color: #1A5C6A;
}

.mockup-body {
  padding: 16px 18px 8px;
}

.mockup-body--grid {
  display: grid;
  grid-template-columns: 145px 1fr;
  gap: 10px;
  padding: 10px 12px 12px;
}

/* ── Painel esquerdo ────────────────────────────────────── */
.mkp-left {
  display: flex;
  flex-direction: column;
}

/* Card genérico */
.mkp-card {
  border: 1px solid #e0e7ea;
  border-radius: 6px;
  background: #fff;
  padding: 10px 12px;
}

.mkp-card--full {
  display: flex;
  flex-direction: column;
}

.mkp-card-title {
  font-size: 10.5px;
  font-weight: 600;
  color: #37474f;
  margin-bottom: 8px;
}

.mkp-card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}

.mkp-card-sub {
  font-size: 8px;
  color: #90a4ae;
}

/* Linha Ano / Número */
.mkp-ano-num-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mkp-field--ano {
  min-width: 55px;
  max-width: 55px;
}

.mkp-field--num {
  flex: 1;
}

.mkp-slash {
  font-size: 13px;
  color: #607d8b;
  flex-shrink: 0;
  line-height: 1;
}

/* Campos outlined (imitam Vuetify outlined) */
.mkp-outlined-field {
  border: 1px solid #b0bec5;
  border-radius: 4px;
  padding: 4px 7px 4px;
}

.mkp-float-label {
  display: block;
  font-size: 7px;
  color: #607d8b;
  line-height: 1;
  margin-bottom: 2px;
}

.mkp-field-val {
  font-size: 9.5px;
  color: #263238;
  font-weight: 500;
}

.mkp-placeholder {
  font-size: 9.5px;
  color: #b0bec5;
}

.mkp-select-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9.5px;
  color: #263238;
}

.mkp-chevron {
  font-size: 8px;
  color: #90a4ae;
}

/* Filtros opcionais (imita v-expansion-panel) */
.mkp-filtros {
  border: 1px solid #e0e7ea;
  border-radius: 4px;
  padding: 7px 10px;
}

.mkp-mt { margin-top: 8px; }

.mkp-calc-btn {
  background: #1A5C6A;
  color: white;
  border-radius: 5px;
  padding: 9px 4px;
  text-align: center;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: default;
}

/* ── Painel direito (Odontogram real escalado) ───────────── */
.mkp-right {
  min-width: 0;
}

.mkp-odonto-clip {
  position: relative;
  /* Altura visível = altura natural do Odontogram (edit, ~580px) × scale (0.74) ≈ 430px */
  height: 430px;
  overflow: hidden;
}

.mkp-odonto-scale {
  position: absolute;
  top: 0;
  left: 0;
  /* Largura natural do Odontogram: SVG(280) + gap(20) + legenda(148) = 448px */
  width: 448px;
  transform: scale(0.74);
  transform-origin: top left;
  pointer-events: none;
}

/* ── Features ───────────────────────────────────────────── */
.features-section {
  background: #f5fbfc;
  padding: 60px 0;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: #1A5C6A;
  margin-bottom: 48px;
}

.feature-card-h {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #fff;
  border-radius: 16px;
  padding: 28px 22px;
  box-shadow: 0 2px 16px rgba(26, 92, 106, 0.08);
  height: 100%;
  box-sizing: border-box;
  transition: box-shadow 0.2s, transform 0.2s;
}

.feature-card-h:hover {
  box-shadow: 0 8px 32px rgba(26, 92, 106, 0.14);
  transform: translateY(-3px);
}

.feature-icon-sq {
  width: 54px;
  height: 54px;
  background: #1A5C6A;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1A5C6A;
}

.feature-desc {
  font-size: 0.875rem;
  color: #546e7a;
  line-height: 1.65;
}

/* ── Como Funciona ───────────────────────────────────────── */
.how-section {
  background: #f5fbfc;
  padding: 80px 0 0;
}

.section-underline {
  width: 48px;
  height: 3px;
  background: #1A5C6A;
  margin: -36px auto 56px;
  border-radius: 2px;
}

.step-card {
  background: #ffffff;
  border: 1px solid #e0f0f3;
  border-radius: 16px;
  padding: 36px 28px;
  height: 100%;
  box-sizing: border-box;
}

.step-icon-wrap {
  width: 80px;
  height: 80px;
  background: #e8f7f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-num {
  background: #1A5C6A;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1A5C6A;
  line-height: 1.35;
}

.step-desc {
  font-size: 0.875rem;
  color: #546e7a;
  line-height: 1.7;
  margin: 0;
}

/* ── Disclaimer ─────────────────────────────────────────── */
.disclaimer-bar {
  background: #1A5C6A;
  padding: 36px 0;
  margin-top: 64px;
}

.disclaimer-inner {
  display: flex;
  align-items: center;
  gap: 20px;
}

.disclaimer-icon-wrap {
  width: 56px;
  height: 56px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.disclaimer-text {
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.95;
}

/* ── Footer ─────────────────────────────────────────────── */
.landing-footer {
  background: #0f3840;
  padding: 64px 0 0;
  color: rgba(255,255,255,0.85);
}

.footer-logo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  letter-spacing: -0.5px;
}

.logo-odonto {
  color: #68B5B5;
  font-weight: 600;
}

.logo-peritus {
  color: #ffffff;
  font-weight: 800;
}

.footer-tagline {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
  margin: 0;
}

.footer-socials {
  display: flex;
  gap: 8px;
}

.social-link {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color 0.2s;
}

.social-link:hover {
  color: #5AADAD;
}

.footer-heading {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #5AADAD;
  margin-bottom: 16px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
}

.footer-link {
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #5AADAD;
}

.footer-divider {
  border-color: rgba(255,255,255,0.1) !important;
  margin: 48px 0 24px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 28px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
}

.footer-bottom-links {
  display: flex;
  align-items: center;
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 959px) {
  .hero-section {
    padding: 48px 0;
    text-align: center;
  }

  .hero-desc {
    margin: 0 auto 2rem;
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .monitor-wrapper {
    max-width: 380px;
    margin-top: 40px;
  }

  .disclaimer-inner {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
