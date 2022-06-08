<template>
  <v-app v-if="route && route.name">
    <v-app-bar color="grey-lighten-2">toolbar > {{ $t(route.name) }}
    </v-app-bar>
    <v-navigation-drawer color="grey-darken-2" permanent>
      <ul>
        <li>
          <router-link :to="{ name: 'app.dashboard', params: { msg: 'fromNav' } }">{{ $t('app.dashboard') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'app.settings', params: { msg: 'fromNav' } }">{{ $t('app.settings') }}</router-link>
        </li>
      </ul>

    </v-navigation-drawer>
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
    route: false
  }),
  created() {
    this.$store.select(state => state['route']).subscribe((val) => {
      this.route = val
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

