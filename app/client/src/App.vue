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
        <v-fade-transition>
          <span v-if="!loading">{{ $t("pages." + page.uuid) }}</span>
        </v-fade-transition>
        <v-fade-transition>
          <span v-if="loading"
            ><v-progress-circular indeterminate :size="20" :width="2" color="primary"
          /></span>
        </v-fade-transition>
      </v-app-bar-title>
      <v-spacer />
      <Camera v-if="$mobile" />
      <v-spacer />
      <status-bar />
      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <NavigationSideBar v-if="!isInTest" :nav-items="navItems" />
    <ToolBar class="{ appBarRel: isInTest }" ref="appToolbar" />
    <!-- Main content -->
    <v-main id="appMain">
      <v-btn
        class="backToTop"
        v-if="hasScrolled"
        @click="scrollTop"
        icon="mdi-chevron-up"
        color="primary"
      />
      <template v-if="isInTest">
        <slot />
      </template>
      <template v-else>
        <router-view v-slot="{ Component }">
          <component :is="Component" :class="{ isLoading: loading }" />
        </router-view>
      </template>
    </v-main>
    <mobile-startup v-if="$mobile" />
    <!-- quicklist Drawer -->
  </v-app>
</template>
<script>
// only needed for mobile and will be handled in mounted

import { defineAsyncComponent } from "vue";
import Notifications from "@u/notifications/default.vue";
import NavigationSideBar from "@u/navigation/sidebar.vue";
import ToolBar from "@u/toolbar/default.vue";
import StatusBar from "@u/uploader/statusBar.vue";
import ProgressBar from "@u/uploader/progressBar.vue";
export default {
  components: {
    Notifications,
    NavigationSideBar,
    ToolBar,
    StatusBar,
    ProgressBar,
    Camera: defineAsyncComponent(() =>
      import("./components/utils/mobile/camera/icon.vue")
    ),
    mobileStartup: defineAsyncComponent(() =>
      import("./components/utils/mobile/startup.vue")
    ),
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
    viewPortWidth: false,
    loading: false,
    hasScrolled: false,
    navItems: [
      {
        icon: "mdi-home",
        route: "app.dashboard",
        params: {},
      },
      {
        icon: "mdi-file-document-multiple",
        route: "app.journal",
        params: {},
      },
      {
        icon: "mdi-human-male-board-poll",
        route: "app.ticketboard",
        params: {},
      },
      {
        icon: "mdi-cog",
        route: "app.settings",
        params: {},
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
      .select((state) => state.ui.loading)
      .subscribe((val) => {
        this.loading = val;
      });
  },
  mounted() {
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
    window.addEventListener("scroll", this.setScroll, { passive: true });
    // TODO find a better way instead of this ugly timeOutBullshit
    setTimeout(() => this.setDimensions(), 800);
  },
  methods: {
    setScroll: async function () {
      if (window.scrollY > 0) {
        this.hasScrolled = true;
      } else {
        this.hasScrolled = false;
      }
    },
    scrollTop: async function () {
      window.scrollTo(0, 0);
      this.hasScrolled = false;
    },
    setDimensions: async function () {
      await this.$nextTick(function () {
        if (this.$refs.appAppbar && this.$refs.appToolbar) {
          const appBarHeight = this.$refs.appAppbar.height || 0;
          const toolBarHeight = this.$refs.appToolbar.height || 0;
          //TODO find out why we can't get the width of the navBar via ref here
          const HackyShit =
            document.getElementById("appMain").offsetWidth -
            document.getElementById("navSideBar").offsetWidth;
          const topBarHeight = appBarHeight + toolBarHeight;
          this.viewPortHeight = window.innerHeight - topBarHeight;
          const windowWidth = window.innerWidth;
          console.log(HackyShit);
          this.viewPortWidth = HackyShit;
          this.$store.dispatch({
            type: "ui/update",
            payload: {
              topBarHeight,
              viewPortHeight: this.viewPortHeight,
              viewPortWidth: this.viewPortWidth,
              windowWidth,
            },
          });
        }
      });
    },
  },
};
</script>
<style>
#breadcrumb-home {
  text-decoration: none;
}

.backToTop {
  position: fixed !important;
  z-index: 100;
  right: 30px;
  bottom: 30px;
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
