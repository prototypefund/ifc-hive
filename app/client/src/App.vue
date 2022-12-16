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
        <span v-if="!loading">{{ $t("pages." + page.uuid) }}</span>
        <span v-if="loading"
          ><v-progress-circular indeterminate :size="20" :width="2" color="primary"
        /></span>
      </v-app-bar-title>
      <v-spacer />
      <Camera v-if="$mobile" />
      <v-spacer />

      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <NavigationSideBar v-if="!isInTest" :nav-items="navItems" />

    <ToolBar v-if="!loading" class="{ appBarRel: isInTest }" ref="appToolbar" />
    <loading-skeleton-bar v-else :class="{ appBarRel: isInTest }" ref="appToolbar" />
    <!-- Main content -->
    <v-main>
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
          <loading-skeleton v-if="loading" :height="viewPortHeight || 0" />
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
import loadingSkeleton from "@t/loadingSkeleton.vue";
import loadingSkeletonBar from "@t/loadingSkeletonBar.vue";
export default {
  components: {
    Notifications,
    NavigationSideBar,
    ToolBar,
    loadingSkeleton,
    loadingSkeletonBar,
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
    setTimeout(() => this.setDimensions(), 500);
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
      this.setScroll();
    },
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
