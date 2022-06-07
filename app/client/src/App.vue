<template>
  <v-app>
    <v-app-bar color="grey-lighten-2">toolbar > {{ route.name }}
    </v-app-bar>
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
    route: {}
  }),
  created() {
    this.$store.select(state => state['route']).subscribe((val) => {
      this.route = val
      console.log(this.$t(val.name))
    })
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

