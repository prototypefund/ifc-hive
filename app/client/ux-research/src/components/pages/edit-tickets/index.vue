<template>

  <v-layout :style="{ height: `${height - 54}px` }">
    <v-main>

      <!-- Tabs -->
      <v-tabs class="pl-0 border-bottom" align="left" slider-color="primary">

        <!-- tab 1 -->
        <v-tab>
          <v-icon x-small class="text-primary">mdi-text-box-outline</v-icon>
          <span class="text-primary d-inline-block mr-2">123</span>
          <span class="text-grey-darken-1 text-body-2">
            Das hier ist der Titel...
          </span>
        </v-tab>

        <!-- tab 2 -->
        <v-tab>
          <v-icon x-small class="text-primary">mdi-text-box-outline</v-icon>
          <span class="text-primary d-inline-block mr-2">43</span>
          <span class="text-grey-darken-1 text-body-2">
            Zweites Dokument...
          </span>
        </v-tab>

        <!-- tab 2 -->
        <v-tab>
          <v-icon x-small class="text-primary">mdi-text-box-outline</v-icon>
          <span class="text-primary d-inline-block mr-2">105</span>
          <span class="text-grey-darken-1 text-body-2">
            Meilenstein...
          </span>
        </v-tab>

        <v-tab>
          <v-icon>mdi-plus</v-icon>
        </v-tab>

        <v-spacer />
      </v-tabs>

      <v-container>
        <v-row justify="center">
          <v-col cols="6" class="pt-6">
            <v-breadcrumbs :items="['LP3', 'Sprint 2', 'Dokumentation', '']" class="pl-0">
              <template v-slot:prepend>
              </template>
                <v-icon x-small class="text-primary">mdi-text-box-outline</v-icon>
                <span class="text-primary d-inline-block mr-4">123</span>
            </v-breadcrumbs>

            <h1 class="text-h4 mb-4">Das hier ist der Titel</h1>

            <v-row>
              <v-col cols="8">
                <div class="m5-4 mb-6">
                  <div class="mb-4">
                    <v-chip label class="bg-blue mr-1 mb-1">milestone</v-chip>
                    <v-chip label class="bg-yellow-darken-1 mr-1 mb-1">doing</v-chip>
                    <v-chip label class="bg-red-lighten-1 mr-1 mb-1">design document</v-chip>
                  </div>
                  <div class="text-body-2">
                    Weitere Meta information<br />
                    Verdichtet oder ausführlich auf mehreren Zeilen
                  </div>
                </div>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn flat>
                  <v-icon size="large">mdi-attachment</v-icon>
                  <v-badge
                    color="error"
                    content="3"
                    inline
                  ></v-badge>
                   Attachments
                </v-btn>
              </v-col>
            </v-row>

            <h2 class="text-subtitle-1  mb-4">
              <v-avatar size="30">
                <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img>
              </v-avatar>
              Hans Mustermann (Faul & Träge GmbH)
            </h2>

            <div class="mt-4">
              <v-avatar size="30">
                <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img>
              </v-avatar>
              Hans Mustermann (Faul & Träge GmbH)
              <v-icon color="success">mdi-check-circle</v-icon> 
            </div>

            <div class="mt-4">
              <v-avatar size="30">
                <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img>
              </v-avatar>
              Hans Mustermann (Faul & Träge GmbH)
              <v-icon color="warning">mdi-help-circle</v-icon> 
            </div>



            <p class="text-body-1 mt-6">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diaor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.m voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd
              gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
              amet. Lorem ipsum dol
            </p>

            <v-img
              class="mt-6"
              aspect-ratio="16/9"
              cover
              src="https://www.agcs.allianz.com/content/onemarketing/agcs/agcs/en_GB/news-and-insights/expert-risk-articles/construction-claims-trends.thumb.1280.1280.png?ck=1674229805"
            ></v-img>
            <div class="text-caption mt-1">Baustelle am 30.3.2023</div>

            <p class="text-body-1 mt-4">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diaor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.m voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd
              gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
              amet. Lorem ipsum dol
            </p>

          </v-col>
        </v-row>
      </v-container>

    </v-main>

    <v-navigation-drawer permanent with="400">
      <v-tabs class="border-bottom">
        <v-tab class="text-caption">
          <v-icon>mdi-file-tree</v-icon>
        </v-tab>
        <v-tab class="text-caption">
          <v-icon>mdi-list-status</v-icon>
        </v-tab>
        <v-tab class="text-caption">
          <v-icon>mdi-magnify</v-icon>
        </v-tab>
        <v-tab class="text-caption">
          <v-icon>mdi-history</v-icon>
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>

    <v-navigation-drawer permanent with="400" location="right">
      <v-tabs class="border-bottom">
        <v-tab class="text-caption">
          <v-icon>mdi-checkbox-multiple-marked-outline</v-icon>
        </v-tab>
        <v-tab class="text-caption">
          <v-icon>mdi-attachment</v-icon>
        </v-tab>
        <v-tab class="text-caption">
          <v-icon>mdi-comment-multiple-outline</v-icon>
        </v-tab>
        <v-tab class="text-caption">
          <v-icon>mdi-history</v-icon>
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>
  </v-layout>

</template>
<script>
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  setup() {
    const { height, width } = useDisplay()

    return { height, width }
  }
}
</script>

<style scoped>
.v-tab.v-tab {
  min-width: 30px
}
</style>
