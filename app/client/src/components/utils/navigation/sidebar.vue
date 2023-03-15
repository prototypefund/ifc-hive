<template>
  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="navigationDrawer" data-test-container="utils/navigation/sidebar" :rail="navigationRail"
    id="navSideBar" permanent>
    <!-- Title -->
    <template v-slot:prepend>
      <v-list-item density="comfortable" :title="$t('navigation')" :value="$t('navigation')">
        <!-- Close icon -->
        <template v-slot:append>
          <v-btn v-if="!navigationRail" density="comfortable" variant="plain" icon="mdi-chevron-left"
            @click.stop="handleNavigation(true)" />
          <v-btn v-if="navigationRail" density="comfortable" variant="plain" icon="mdi-chevron-right"
            @click.stop="handleNavigation(false)" />
        </template>
      </v-list-item>
      <v-divider />
      <ConnectionBar v-if="$mobile && !navigationRail" />
      <!-- <Socket-ConnectionBar v-if="!navigationRail" /> -->
      <v-divider />
    </template>

    <!-- Navigation List -->
    <v-list density="compact" nav>
      <v-list-item :disabled="currentRoute === item.route || !item.route" :active="currentRoute === item.route"
        active-color="primary" v-for="item in navItems" link :key="item.route" :value="item.route || ''"
        class="nav-link" :data-test-id="item.route ? 'sidebar_nav-' + item.route.replace('.', '-') : ''"
        @click="navigate(item)">
        <template v-if="item.icon" v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title v-if="item.route">{{
  $t("pages." + item.route.replace(".", "-"))
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list density="compact">
        <v-list-item :disabled="currentRoute === item.route || !item.route" :active="currentRoute === item.route"
          active-color="primary" v-for="item in footerItems" link :key="item.route" :value="item.route || ''"
          class="nav-link" :data-test-id="item.route ? 'sidebar_nav-' + item.route.replace('.', '-') : ''"
          @click="navigate(item)">
          <template v-if="item.icon" v-slot:prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title v-if="item.route">{{
  $t("pages." + item.route.replace(".", "-"))
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
<script>
import { useRouter } from "vue-router";
import { defineAsyncComponent } from "vue";
export default {
  inject: ["$api", "$store", "$mobile"],
  components: {
    ConnectionBar: defineAsyncComponent(() => import("../mobile/connection/iconbar.vue")),
  },
  data: () => ({
    navigationDrawer: true,
    navigationRail: true,
    navigationRailSubscriber$: false,
  }),
  computed: {
    currentRoute: () => {
      return useRouter().currentRoute.value.name;
    },
  },
  props: {
    navItems: {
      default: () => [],
      type: Array,
    },
    footerItems: {
      default: () => [],
      type: Array,
    },
  },
  created() {
    this.navigationRailSubscriber$ = this.$store
      .select((state) => state.ui.navigationOpen)
      .subscribe((val) => {
        this.navigationRail = !val;
      });
  },
  destroyed() {
    this.navigationRailSubscriber$.unsubscribe();
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
