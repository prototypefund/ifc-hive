<template>
  <v-app v-if="route && route.name">
    <v-app-bar color="grey-lighten-2">toolbar > {{ $t(route.name) }}
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list-item title="Navigation" value="Navigation">
        <template v-slot:append>
          <v-btn v-if="!rail" variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
          <v-btn v-if="rail" variant="text" icon="mdi-chevron-right" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-for="item in navItems" link :key="item.title" :prepend-icon="item.icon" :title="$t(item.title)"
          :value="item.title" @click="navigate(item)">
        </v-list-item>
      </v-list>
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
    route: false,
    drawer: true,
    rail: true,
    navItems: [
      {
        icon: 'mdi-view-dashboard',
        title: "dashboard",
        route: 'app.dashboard',
        params: {
          msg: 'fromNav'
        }
      },
      {
        icon: 'mdi-account',
        title: "settings",
        route: 'app.settings',
        params: {
          msg: 'fromNav'
        }
      }

    ]
  }),
  created() {
    this.$store.select(state => state['route']).subscribe((val) => {
      this.route = val
    })
  },
  methods: {
    navigate(item) {
      this.$router.push({
        name: item.route,
        params: item.params
      })
    }
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

