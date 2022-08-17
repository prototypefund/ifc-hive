<template>
  <v-app v-if="page && page.pageName">
    <!-- Global Toolbar -->
    <v-app-bar app color="grey-lighten-2">
      <!-- Breadcrumb -->
      <v-app-bar-title>
        Journal
        <v-icon color="grey" xsmall>mdi-chevron-right</v-icon>
        {{ $t("pages." + page.pageName) }}
      </v-app-bar-title>
      <v-btn
        v-if="!editMode"
        flat
        icon="mdi-view-dashboard-edit-outline"
        @click="changeEditMode"
      />
      <v-btn
        v-if="editMode"
        flat
        icon="mdi-view-dashboard-edit"
        @click="changeEditMode"
      />
      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <NavigationSideBar :nav-items="navItems" />

    <!-- Main content -->
    <v-main>
      <v-card flat>
        <router-view />
      </v-card>
    </v-main>
    <!-- quickList Drawer -->
    <QuickListSideBar />
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
        icon: "mdi-format-list-bulleted",
        route: "app.projects",
        params: {
          urlParams: "navigation nach settings von nav",
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
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  overflow: auto !important;
}
</style>
