<template>
  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="navigationDrawer" data-test-container="utils/pageNavigationSidebar/default"
    :rail="navigationRail" id="navSideBar" permanent color="page-nav-bg">
    <!-- Title -->
    <template v-slot:prepend>

      <!--v-list-item density="comfortable" :title="$t('navigation')" :value="$t('navigation')">
        <template v-slot:append>
          <v-btn v-if="!navigationRail" density="comfortable" variant="plain" flat icon="mdi-chevron-left"
            @click.stop="handleNavigation(true)" />
          <v-btn v-else density="compact" variant="plain" flat icon="mdi-menu" @click.stop="handleNavigation(false)" />
          <v-btn v-if="!navigationRail" density="compact" variant="plain" flat icon="mdi-dock-left"
            @click.stop="handleNavigationToolsSidebar()" />
        </template>
      </!--v-list-item-->
      <v-row no-gutters class="border-bottom">
        <v-list-item density="compact" v-if="navigationRail" @click.stop="handleNavigationToolsSidebar()"
          class="sideBarToggle">
          <v-icon icon="mdi-dock-left"></v-icon>
        </v-list-item>
      </v-row>
      <v-divider v-if="$mobile && !navigationRail" />
      <ConnectionBar v-if="$mobile && !navigationRail" />
      <!-- <Socket-ConnectionBar v-if="!navigationRail" /> -->
      <v-divider v-if="$mobile && !navigationRail" />
    </template>

    <!-- Navigation List -->
    <v-list density="compact" nav>
      <!-- item -->
      <v-list-item v-for="item in navItems" :disabled="currentRoute === item.route || !item.route"
        :active="currentRoute === item.route" :key="item.route" :value="item.route || ''"
        :data-test-id="item.route ? 'sidebar_nav-' + item.route.replace('.', '-') : ''" @click="navigate(item)"
        active-color="primary" link class="nav-link">
        <!-- item prepend icon -->
        <template v-if="item.icon" v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>

        <!-- item title -->
        <v-list-item-title v-if="item.route">{{
          $t("pages." + item.route.replace(".", "-"))
        }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list density="compact">
        <v-list-item v-for="item in footerItems" :disabled="currentRoute === item.route || !item.route"
          :active="currentRoute === item.route"
          :data-test-id="item.route ? 'sidebar_nav-' + item.route.replace('.', '-') : ''" :key="item.route"
          :value="item.route || ''" @click="navigate(item)" active-color="primary" link class="nav-link">
          <!-- item prepend icon -->
          <template v-if="item.icon" v-slot:prepend>
            <v-icon :icon="item.icon" />
          </template>

          <!-- item title -->
          <v-list-item-title v-if="item.route">{{
            $t("pages." + item.route.replace(".", "-")) }}
          </v-list-item-title>
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
    handleNavigationToolsSidebar() {
      this.$store.dispatch({
        type: "ui/toggle",
        payload: {
          list: ['currentNavigationTool'],
        },
      });
    },
    handleNavigation(val) {/*
      if (val !== this.navigationRail) {
        this.$store.dispatch({
          type: "ui/update",
          payload: {
            navigationOpen: !val,
          },
        });
      }*/
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
<style lang="css" scoped>
.toggleButtons>.v-list-item__append {
  flex-direction: column;
}

.hidden {
  display: none
}

.sideBarToggle {
  padding-top: 10px;
  padding-bottom: 9px
}
</style>
