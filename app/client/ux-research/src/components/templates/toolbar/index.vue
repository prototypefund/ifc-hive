<template>
  <v-app-bar density="compact" flat>

    <div lass="pl-4 pr-4 ">
    <v-avatar class="mr-4 ml-4" image="project-logo-2.png" />
    <h4 class="d-inline-block mx-4">
      Grunsdchule Blankenburg
    </h4>
    <v-icon size="small">mdi-chevron-down</v-icon>
  </div>

  <v-spacer />

  <!-- toolbar global search -->
  <div class="flex-grow-1" style="margin-left: -200px">
    <v-text-field
      hide-details
      light
      solo
      placeholder="Search in project..."
    >
      <template v-slot:prepend>
        <v-icon
          class="ml-3"
          icon="mdi-magnify"
        />
      </template>
      <template v-slot:append>
        <v-icon
          class="ml-3"
          icon="mdi-filter-variant"
        />
      </template>
    </v-text-field>
  </div>

  <v-spacer />

    <v-icon
      icon="mdi-sync"
      color="success"
      size="small" />

  <v-toolbar-items>
    <v-btn class="text-none" stacked>
      <v-badge content="2" color="error">
        <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
    </v-btn>
    <v-btn @click="toggleTheme" icon="mdi-theme-light-dark"></v-btn>

    <v-btn>
      <v-avatar image="user/alexander.jpg" class="mr-2"></v-avatar>
      <v-icon>mdi-chevron-down</v-icon>
    </v-btn>
  </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { useTheme } from 'vuetify'
import { inject } from 'vue'

export default {
  setup () {
    const theme = useTheme()

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  }
}

</script>
