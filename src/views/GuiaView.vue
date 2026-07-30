<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">
      <v-icon icon="mdi-book-open-outline" class="mr-2" color="primary" />
      Guia do Usuário
    </h1>

    <v-row>
      <v-col cols="12" md="8">

        <v-card variant="outlined" rounded="xl" class="mb-4">
          <v-card-text class="pa-6">
            <div class="text-subtitle-1 font-weight-bold mb-3">O que é o OdontoSearch Brasil?</div>
            <p class="text-body-2 text-medium-emphasis">
              O OdontoSearch Brasil é uma ferramenta de apoio à identificação forense por padrão dentário.
              Dado um conjunto de condições dentárias observadas em um indivíduo (ex.: dente 16 restaurado,
              dente 26 hígido, dente 36 ausente), o sistema calcula com que frequência esse padrão ocorre
              na população brasileira adulta.
            </p>
            <p class="text-body-2 text-medium-emphasis mt-2">
              Quanto mais raro o padrão, maior sua capacidade de individualização forense.
              O cálculo é baseado nos dados do <strong>Levantamento SB Brasil 2023</strong>.
            </p>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" rounded="xl" class="mb-4">
          <v-card-text class="pa-6">
            <div class="text-subtitle-1 font-weight-bold mb-3">Como realizar uma busca</div>
            <v-timeline density="compact" side="end" class="mt-2">
              <v-timeline-item dot-color="primary" size="small">
                <div class="text-body-2 font-weight-medium">Informe o NIC</div>
                <div class="text-caption text-medium-emphasis">Número de identificação do caso no formato AAAA/NNNN.</div>
              </v-timeline-item>
              <v-timeline-item dot-color="primary" size="small">
                <div class="text-body-2 font-weight-medium">Preencha o odontograma</div>
                <div class="text-caption text-medium-emphasis">
                  Clique em cada dente para definir sua condição: hígido, cariado, restaurado com cárie,
                  restaurado sem cárie, ausente ou ignorado (/). Use os botões de arcada para preencher
                  vários dentes de uma vez.
                </div>
              </v-timeline-item>
              <v-timeline-item dot-color="primary" size="small">
                <div class="text-body-2 font-weight-medium">Aplique filtros (opcional)</div>
                <div class="text-caption text-medium-emphasis">
                  Restrinja a base de comparação por sexo ou faixa etária para resultados mais precisos.
                </div>
              </v-timeline-item>
              <v-timeline-item dot-color="success" size="small">
                <div class="text-body-2 font-weight-medium">Calcule e exporte</div>
                <div class="text-caption text-medium-emphasis">
                  Clique em "Calcular Frequência". O resultado exibirá a frequência na população e a
                  classificação de raridade. Acesse o relatório para exportar em PDF.
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" rounded="xl" class="mb-4">
          <v-card-text class="pa-6">
            <div class="text-subtitle-1 font-weight-bold mb-3">Classificação de raridade</div>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Classificação</th>
                  <th>Frequência na população</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><v-chip color="success" size="x-small" class="font-weight-bold">Comum</v-chip></td><td class="text-body-2">&gt; 1%</td></tr>
                <tr><td><v-chip color="yellow-darken-2" size="x-small" class="font-weight-bold">Incomum</v-chip></td><td class="text-body-2">0,1% – 1%</td></tr>
                <tr><td><v-chip color="warning" size="x-small" class="font-weight-bold">Raro</v-chip></td><td class="text-body-2">0,01% – 0,1%</td></tr>
                <tr><td><v-chip color="error" size="x-small" class="font-weight-bold">Muito Raro</v-chip></td><td class="text-body-2">&lt; 0,01% ou zero correspondências</td></tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" rounded="xl">
          <v-card-text class="pa-6">
            <div class="text-subtitle-1 font-weight-bold mb-3">Sobre os dados</div>
            <p class="text-body-2 text-medium-emphasis">
              O cálculo utiliza <strong>frequência empírica ponderada</strong>, não multiplicação de
              probabilidades independentes. Isso é importante porque as condições dentárias são correlacionadas —
              multiplicar probabilidades independentes superestimaria a raridade em até 5×.
            </p>
            <p class="text-body-2 text-medium-emphasis mt-2">
              Os pesos amostrais (campo <code>wi_pesodel</code> do SB Brasil) representam quantos
              adultos brasileiros cada participante representa. A frequência é calculada como:
            </p>
            <v-sheet color="surface-variant" rounded class="pa-3 mt-2 font-weight-medium text-body-2" style="font-family: monospace">
              f = SOMA(peso dos participantes que batem o padrão) / SOMA(peso da população filtrada)
            </v-sheet>
          </v-card-text>
        </v-card>

      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="tonal" color="primary" rounded="xl" class="mb-4">
          <v-card-text class="pa-5">
            <div class="text-subtitle-2 font-weight-bold mb-2">28 dentes permanentes</div>
            <p class="text-caption text-medium-emphasis">
              ISO/FDI 11–17, 21–27, 31–37, 41–47. Terceiros molares (sisos) e dentes decíduos
              excluídos do modelo.
            </p>
          </v-card-text>
        </v-card>
        <v-card variant="tonal" color="primary" rounded="xl" class="mb-4">
          <v-card-text class="pa-5">
            <div class="text-subtitle-2 font-weight-bold mb-2">Idade ≥ 12 anos</div>
            <p class="text-caption text-medium-emphasis">
              O grupo de 5 anos (dentição decídua) é excluído. As faixas disponíveis são:
              12 anos, 15–19, 35–44 e 65–74 anos.
            </p>
          </v-card-text>
        </v-card>
        <v-card variant="tonal" color="primary" rounded="xl">
          <v-card-text class="pa-5">
            <div class="text-subtitle-2 font-weight-bold mb-2">Código "/" (ignorar)</div>
            <p class="text-caption text-medium-emphasis">
              Dentes marcados como "Ignorar" não são incluídos no cálculo de correspondência,
              permitindo lidar com dentes de condição desconhecida.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
// Static guide page — no logic needed
</script>
