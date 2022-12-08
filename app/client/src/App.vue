<template>
  <v-app v-if="(page && page.uuid) || isInTest">
    <!-- Global Toolbar -->
    <v-app-bar
      density="compact"
      flat
      app
      color="grey-lighten-2"
      :class="{ appBarRel: isInTest }"
      ref="appAppbar"
    >
      <!-- Breadcrumb -->
      <v-app-bar-title>
        <router-link :to="{ path: '/' }" id="breadcrumb-home"
          ><v-icon icon="mdi-home" color="primary"></v-icon>
        </router-link>
        <v-icon color="grey" xsmall>mdi-chevron-right</v-icon>
        {{ $t("pages." + page.uuid) }}
      </v-app-bar-title>
      <v-spacer />
      <Camera v-if="$mobile" />
      <v-spacer />

      <v-switch flat hide-details v-model="theme" />
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
    <NavigationSideBar v-if="!isInTest" :nav-items="navItems" />

    <ToolBar :class="{ appBarRel: isInTest }" ref="appToolbar" />
    <!-- Main content -->
    <v-main>
      <v-card flat v-if="isInTest">
        <slot />
      </v-card>
      <v-card flat v-else>
        <router-view v-slot="{ Component }">
          <loading-skeleton v-if="loading" :height="viewPortHeight || 0" />
          <component :is="Component" :class="{ isLoading: loading }" />
        </router-view>
      </v-card>
    </v-main>
    <!-- quicklist Drawer -->
  </v-app>
</template>
<script>
// only needed for mobile and will be handled in mounted
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import Notifications from "@u/notifications/default.vue";
import NavigationSideBar from "@u/navigation/sidebar.vue";
import Camera from "@u/mobile/camera/icon.vue";
import ToolBar from "@u/toolbar/default.vue";
import loadingSkeleton from "@t/loadingSkeleton.vue";
export default {
  components: {
    Notifications,
    NavigationSideBar,
    ToolBar,
    Camera,
    loadingSkeleton,
  },
  inject: ["$api", "$store", "$mobile"],
  props: {
    isInTest: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    page: false,
    editMode: false,
    viewPortHeight: false,
    loading: false,
    currTheme: true,
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
        icon: "mdi-human-male-board-poll",
        route: "app.ticketboard",
        params: {
          urlParams: "navigation nach ticketboard von nav",
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
    this.$store
      .select((state) => state.ui.loading)
      .subscribe((val) => {
        this.loading = val;
      });
    this.$store
      .select((state) => state.ui.theme)
      .subscribe((val) => {
        this.$vuetify.theme.name = val;
        this.currTheme = val === "theme" ? true : false;
      });
  },
  computed: {
    theme: {
      get() {
        return this.currTheme;
      },
      set(newValue) {
        this.$store.dispatch({
          type: "ui/update",
          payload: {
            theme: newValue === false ? "light" : "theme",
          },
        });
      },
    },
  },
  mounted() {
    if (this.$mobile) {
      defineCustomElements(window);
      // TODO leave this here or move it to a hook file which comes from capacitor src?
      this.$mobile.Toast.show({
        text: "Capacitor ist ne geile Sau wenn das Grundframework ne geile Sau ist!",
        duration: "long",
      }).then(async () => {
        this.$mobile.SplashScreen.hide();
      });
    }
    // TODO find a way to have the quicklist handler know the uuid of the widget. As for now we need to set a uuid
    this.$store.dispatch({
      type: "toolbar/add",
      payload: {
        page: false,
        title: "quickList",
        icon: "mdi-text-box-search-outline",
        iconActive: "mdi-text-box-search",
        uuid: "quickList",
        widget: {
          name: "quickList",
        },
      },
    });
    window.addEventListener("resize", this.setDimensions, { passive: true });
    // TODO find a better way instead of this ugly timeOutBullshit
    setTimeout(() => this.setDimensions(), 500);
  },
  methods: {
    setDimensions: async function () {
      await this.$nextTick(function () {
        const appBarHeight = this.$refs.appAppbar.height || 0;
        const toolBarHeight = this.$refs.appToolbar.height || 0;
        const topBarHeight = appBarHeight + toolBarHeight;
        this.viewPortHeight = window.innerHeight - topBarHeight;
        const windowWidth = window.innerWidth;
        this.$store.dispatch({
          type: "ui/update",
          payload: {
            topBarHeight,
            viewPortHeight: this.viewPortHeight,
            windowWidth,
          },
        });
      });
    },
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
#breadcrumb-home {
  text-decoration: none;
}

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

.isLoading,
.isLoading * {
  visibility: hidden !important;
}

html,
body {
  overflow: auto !important;
}
</style>
