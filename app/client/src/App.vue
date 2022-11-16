<template>
  <v-app v-if="(page && page.uuid) || isInTest">
    <!-- Global Toolbar -->
    <v-app-bar density="compact" flat app color="grey-lighten-2" :class="{ appBarRel: isInTest }">
      <!-- Breadcrumb -->
      <v-app-bar-title>
        Journal
        <v-icon color="grey" xsmall>mdi-chevron-right</v-icon>
        {{ $t("pages." + page.uuid) }}
      </v-app-bar-title>
      <v-btn v-if="!editMode" flat icon="mdi-view-dashboard-edit-outline" @click="changeEditMode" />
      <v-btn v-if="editMode" flat icon="mdi-view-dashboard-edit" @click="changeEditMode" />
      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <NavigationSideBar v-if="!isInTest" :nav-items="navItems" />

    <!-- Main content -->
    <v-main>
      <v-card flat v-if="isInTest">
        <slot />
      </v-card>
      <v-card flat v-else>
        <router-view />
      </v-card>
    </v-main>
    <!-- quickList Drawer -->
    <QuickListSideBar :class="{ appBarRel: isInTest }" />
  </v-app>
</template>
<script>
import Notifications from "@u/notifications/default.vue";
import NavigationSideBar from "@u/navigation/sidebar.vue";
import QuickListSideBar from "@u/quicklist/sidebar.vue";
export default {
  components: {
    Notifications,
    NavigationSideBar,
    QuickListSideBar,
  },
  inject: ["$api", "$store"],
  props: {
    isInTest: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    page: false,
    editMode: false,
    navItems: [
      {
        icon: "mdi-home",
        route: "app.dashboard",
        params: {
          urlParams: "navigation nach dashboard von nav",
        },
      },
      {
        icon: "mdi-file-document-multiple",
        route: "app.journal",
        params: {},
      },
      {
        icon: "mdi-chili-hot",
        route: "app.testboard",
        params: {
          urlParams: "navigation nach testboard von nav",
        },
      },
      {
        icon: "mdi-cog",
        route: "app.settings",
        params: {
          urlParams: "navigation nach settings von nav",
        },
      },
    ],
  }),
  created() {
    this.$store
      .select((state) => state.currentPage)
      .subscribe((val) => {
        this.page = val;
      });
    this.$store
      .select((state) => state.ui.editMode)
      .subscribe((val) => {
        this.editMode = val;
      });
  },
  methods: {
    changeEditMode: function () {
      this.$store.dispatch({
        type: "ui/update",
        payload: {
          editMode: !this.editMode,
        },
      });
    },
  },
};
</script>
<style>
.appBarRel {
  position: absolute !important;
}

.appBarRel.quickListWrapper {
  position: absolute !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  overflow: auto !important;
}
</style>
