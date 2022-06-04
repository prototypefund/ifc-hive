<template>
  <v-app>
    {{ $t('messages.title') }}
    <v-app-bar color="grey-lighten-2">toolbar > {{ state.name }}</v-app-bar>
    <v-navigation-drawer color="grey-darken-2" permanent>navigation</v-navigation-drawer>
    <v-main>
      <v-card>
        <router-view />
      </v-card>
    </v-main>
  </v-app>
</template>
<script>

export default {
  inject: ['$api', '$store'],
  data: () => ({
    state: {}
  }),
  created() {
    this.$store.select(state => state['route']).subscribe(val => this.state = val)
  }
}
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  overflow: auto !important
}
</style>

