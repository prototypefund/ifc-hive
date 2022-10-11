<template>
  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="navigationDrawer" :rail="navigationRail" permanent>
    <!-- Title -->
    <v-list-item title="Navigation" value="Navigation">
      <!-- Close icon -->
      <template v-slot:append>
        <v-btn
          v-if="!navigationRail"
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="handleNavigation(true)"
        >
        </v-btn>

        <!-- open icon -->
        <v-btn
          v-if="navigationRail"
          variant="text"
          icon="mdi-chevron-right"
          @click.stop="handleNavigation(false)"
        >
        </v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <!-- Navigation List -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        link
        :key="item.title"
        :prepend-icon="item.icon"
        :title="$t('pages.' + item.route.replace('.', '-'))"
        :value="item.title"
        class="nav-link"
        @click="navigate(item)"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  inject: ["$api", "$store"],
  data: () => ({
    navigationDrawer: true,
    navigationRail: true,
  }),
  props: {
    navItems: {
      default: () => [],
      type: Array,
    },
  },
  created() {
    this.$store
      .select((state) => state["ui"].navigationOpen)
      .subscribe((val) => {
        this.navigationRail = !val;
      });
  },
  methods: {
    handleNavigation(val) {
      if (val !== this.navigationRail) {
        this.$store.dispatch({
          type: "ui/update",
          payload: {
            navigationOpen: !val,
          },
        });
      }
    },
    navigate(item) {
      this.$router.push({
        name: item.route,
        params: item.params,
      });
    },
  },
};
</script>
<style></style>
