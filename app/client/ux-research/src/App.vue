<template>
  <v-app id="inspire" dark="true">
    <v-card flat>
      <v-layout>

        <!-- toolbar -->
        <app-bar />

        <v-navigation-drawer permanent rail >
          <v-list density="compact">
            <v-list-item class="mb-6" prepend-icon="mdi-menu" > </v-list-item>

            <v-list-item active-color="primary" :to="{ name: 'edit' }" prepend-icon="mdi-pencil"></v-list-item>
            <v-list-item active-color="primary" :to="{ name: 'page1' }" prepend-icon="mdi-chart-gantt"></v-list-item>
            <v-list-item active-color="primary" :to="{ name: 'page2' }" prepend-icon="mdi-lock"></v-list-item>
            <v-list-item prepend-icon="mdi-magnify"></v-list-item>
            <v-list-item prepend-icon="mdi-timeline-clock"></v-list-item>
            <v-list-item active-color="primary" prepend-icon="mdi-human-male-board-poll"></v-list-item>
            <v-list-item active-color="primary" prepend-icon="mdi-file-tree"></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main style="min-height: 1000px">

        <router-view></router-view>

        </v-main>
      </v-layout>
    </v-card>
  </v-app>
    <!-- <router-view></router-view> -->
</template>

<script>
import { useTheme } from 'vuetify'
import { inject, reactive } from 'vue'
import AppBar from './components/templates/toolbar/index.vue'
// import TicketTree from './components/templates/sidebar-left/tree.vue'

export default {
  components: {
    AppBar, 
  },

  setup () {
    const theme = useTheme()
    const open = reactive(['public'])

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark',
    }
  }
}

</script>

<style>
.v-theme--light .border-bottom,
.v-toolbar.v-theme--light
{
  border-bottom: 1px solid #CCC
}

.v-theme--dark .border-bottom,
.v-toolbar.v-theme--dark
{
  border-bottom: 1px solid #444
}

</style>
