<template>
  <v-app v-if="route && route.name">
    <v-app-bar color="grey-lighten-2">
      <v-app-bar-title>Toolbar > {{ $t(route.name) }}</v-app-bar-title>
      <template v-slot:append>
        <notifications />
      </template>

    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent>
      <v-list-item title="Navigation" value="Navigation">
        <template v-slot:append>
          <v-btn v-if="!rail" variant="text" icon="mdi-chevron-left" @click.stop="handleNavigation(true)"></v-btn>
          <v-btn v-if="rail" variant="text" icon="mdi-chevron-right" @click.stop="handleNavigation(false)">
          </v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-for="item in navItems" link :key="item.title" :prepend-icon="item.icon" :title="$t(item.route)"
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
import notifications from '@/notifications.vue'
export default {
  components: {
    notifications
  },
  inject: ['$api', '$store'],
  data: () => ({
    route: false,
    drawer: true,
    rail: true,
    navItems: [
      {
        icon: 'mdi-view-dashboard',
        route: 'app.dashboard',
        params: {
          urlParams: 'navigation nach dashboard von nav'
        }
      },
      {
        icon: 'mdi-account',
        route: 'app.settings',
        params: {
          urlParams: 'navigation nach settings von nav'
        }
      }

    ]
  }),
  created() {
    this.$store.select(state => state['route']).subscribe((val) => {
      this.route = val
    })
    this.$store.select(state => state['ui'].navigationOpen).subscribe((val) => {
      this.rail = !val
    })
  },
  methods: {
    handleNavigation(val) {
      if (val !== this.rail) {
        this.$store.dispatch({
          type: 'updateUi',
          payload: {
            navigationOpen: !val
          }
        });
      }

    },
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

