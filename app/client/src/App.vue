<template>
  <v-app v-if="(page && page.uuid) || isInTest">
    <!-- Global Toolbar -->
    <v-app-bar
      density="compact"
      flat
      app
      color="grey-lighten-2"
      :class="{ appBarRel: isInTest }"
      id="appAppbar"
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
      <status-bar />
      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <NavigationSideBar v-if="!isInTest" :nav-items="navItems" />
    <ToolBar :class="{ appBarRel: isInTest }" />
    <!-- Main content -->
    <mock />
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
          <component
            :is="Component"
            :class="{ isLoading: loading }"
            id="appComponent"
            :style="{ height: viewPortHeight + 'px' }"
            @scroll.passive="setScroll($event)"
          />
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
import { globalTools } from "./setup/application";
import mock from "./mock.vue";
export default {
  components: {
    Notifications,
    NavigationSideBar,
    ToolBar,
    StatusBar,
    ProgressBar,
    mock,
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
        this.scrollTop();
        this.page = val;
      });

    this.$store
      .select((state) => state.ui.loading)
      .subscribe((val) => {
        this.loading = val;
      });
  },
  mounted() {
    globalTools(this.$store);
    window.addEventListener("resize", this.setDimensions, { passive: true });
    // TODO find a better way instead of this ugly timeOutBullshit
    setTimeout(() => this.setDimensions(), 800);
    if (this.$mobile !== false) {
      this.$store.dispatch({
        type: "ui/update",
        payload: {
          mobile: true,
        },
      });
    }
  },
  methods: {
    setScroll: async function (e) {
      if (e.currentTarget.scrollTop > 0) {
        this.hasScrolled = true;
      } else {
        this.hasScrolled = false;
      }
    },
    scrollTop: async function () {
      if (document.getElementById("appComponent")) {
        document.getElementById("appComponent").scrollTo(0, 0);
        this.hasScrolled = false;
      }
    },
    setDimensions: async function () {
      await this.$nextTick(function () {
        //TODO find out why we can't properly use the $refs for size read here.
        const appBarHeight = document.getElementById("appAppbar").offsetHeight;
        const toolBarHeight = document.getElementById("appToolbar").offsetHeight;
        const HackyShit =
          document.getElementById("appMain").offsetWidth -
          document.getElementById("navSideBar").offsetWidth;
        const topBarHeight = appBarHeight + toolBarHeight;
        const windowWidth = window.innerWidth;
        this.viewPortHeight = window.innerHeight - topBarHeight;
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
      });
    },
  },
};
</script>
<style>
body,
html {
  overflow: hidden !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app #appComponent {
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

#app .backToTop {
  position: fixed !important;
  z-index: 100;
  right: 30px;
  bottom: 30px;
}

#app #breadcrumb-home {
  text-decoration: none;
}

#app .appBarRel {
  position: absolute !important;
}

#app .appBarRel.quickListWrapper {
  position: absolute !important;
}

#app .v-toolbar__content > .v-btn:last-child {
  margin-inline-end: 0;
}

#app .isLoading,
#app .isLoading * {
  visibility: hidden !important;
}

#app .mdi-drag {
  cursor: pointer;
}
</style>
