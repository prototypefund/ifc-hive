<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <v-app>
    <v-container fluid class="ma-0 pa-0">
      <v-row>

        <v-col cols="12" md="12" class="bg-green-lighten-2">
          <HelloWorld msg="Hello IFC Hive" />
        </v-col>

        <v-col cols="12" md="4" class="bg-grey-lighten-3">left</v-col>
        <v-col cols="12" md="4">
            <v-btn flat class="bg-red text-shades-white">Else</v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="something" />
              <v-icon large class="mr-2">mdi-android-studio</v-icon>
              <v-icon large class="mr-2">mdi-tray-arrow-up</v-icon>
              <v-icon large>mdi-filter-variant</v-icon>
        </v-col>
      </v-row>
    </v-container>
    </v-app>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html, body { overflow: auto!important }
</style>

