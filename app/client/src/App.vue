<template>
  <v-app v-if="(page && page.uuid)">
    <!-- Global Toolbar -->
    <v-app-bar density="compact" flat app color="grey-lighten-2" id="appAppbar">
      <v-app-bar-title>
        <!-- Breadcrumb -->
        <br />
        <v-row no-gutters>
          <v-col cols="auto"> <router-link :to="{ path: '/' }" id="breadcrumb-home">
              <v-icon icon="mdi-home" color="primary" />
            </router-link></v-col>

          <v-col cols="3">
            <project-switch class="ml-10" />
          </v-col>
          <v-btn color="red darken-2" @click="saveLocalProjectConfig" class="ml-4">
            <v-icon>mdi-upload-multiple</v-icon> Save local project config
          </v-btn>

          <!-- <v-col cols="auto"><v-icon color="grey" xsmall>mdi-chevron-right</v-icon></v-col> -->
          <v-col cols="auto">
            <v-fade-transition>
              <!-- <span v-if="!loading">{{ $t("pages." + page.uuid) }}</span> -->
            </v-fade-transition>
            <v-fade-transition>
              <span v-if="loading"><v-progress-circular indeterminate :size="20" :width="2" color="primary" /></span>
            </v-fade-transition>
          </v-col>
        </v-row>



      </v-app-bar-title>
      <!--v-text-field :loading="searching" density="compact" variant="solo" label="Search" append-inner-icon="mdi-magnify"
        single-line hide-details></!--v-text-field-->
      <v-spacer />
      <p style="width: 15%">
        <status-bar />
      </p>

      <socket-status />
      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <PageNavigation :nav-items="navItems" :footer-items="footerItems" />
    <navigation-tools-sidebar v-if="currentNavigationTool" />
    <!-- Main content -->
    <mock />
    <v-main id="appMain">
      <v-btn class="backToTop" v-if="hasScrolled" @click="scrollTop" icon="mdi-chevron-up" color="primary" />
      <template v-if="isInTest">
        <slot />
      </template>
      <template v-else>
        <router-view v-slot="{ Component }">
          <component :is="Component" :class="{ isLoading: loading }" id="appComponent"
            :style="{ height: viewPortHeight + 'px' }" @scroll.passive="setScroll($event)" />
        </router-view>
      </template>
    </v-main>
    <inspector-tools-sidebar v-if="page.hasInspector" />
    <mobile-startup v-if="$mobile" />
    <!-- quicklist Drawer -->
  </v-app>
</template>
<script>
// only needed for mobile and will be handled in mounted

import { defineAsyncComponent } from "vue";
import Notifications from "@u/notifications/default.vue";
import PageNavigation from "@u/pageNavigationSidebar/default.vue";
import navigationToolsSidebar from "@u/navigationToolsSidebar/default.vue";
import inspectorToolsSidebar from "@u/inspectorToolsSidebar/default.vue";
import StatusBar from "@u/uploader/statusBar.vue";
import ProgressBar from "@u/uploader/progressBar.vue";
import { globalTools } from "./setup/application";
import mock from "./mock.vue";
import socketStatus from "@u/socketStatus.vue"
import projectSwitch from "@u/projectSwitch/select.vue"

export default {
  components: {
    Notifications,
    PageNavigation,
    navigationToolsSidebar,
    inspectorToolsSidebar,
    StatusBar,
    ProgressBar,
    mock,
    socketStatus,
    projectSwitch,
    mobileStartup: defineAsyncComponent(() =>
      import("./components/utils/mobile/startup.vue")),
  },
  inject: ["$api", "$store", "$mobile", "$eventbus"],
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
    currentNavigationTool: false,
    currentInspectorTool: false,
    searching: false,
    hasScrolled: false,
    footerItems: [
      {
        icon: "mdi-account-cog",
        route: "app.accountSettings",
        params: {},
      },
      {
        icon: "mdi-cog",
        route: "app.settings",
        params: {},
      },
    ],
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
    this.$store
      .select((state) => state.ui.currentNavigationTool)
      .subscribe((val) => {
        this.currentNavigationTool = val;
      });
    this.$store
      .select((state) => state.ui.currentInspectorTool)
      .subscribe((val) => {
        this.currentInspectorTool = val;
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

    saveLocalProjectConfig: function () {
      this.$eventbus.emit('saveLocalProjectConfig')
    },

    setDimensions: async function () {
      await this.$nextTick(function () {
        //TODO find out why we can't properly use the $refs for size read here.
        const appBarHeight = document.getElementById("appAppbar").offsetHeight;
        const HackyShit =
          document.getElementById("appMain").offsetWidth -
          document.getElementById("navSideBar").offsetWidth;
        const windowWidth = window.innerWidth;
        this.viewPortHeight = window.innerHeight - appBarHeight;
        this.viewPortWidth = HackyShit;
        this.$store.dispatch({
          type: "ui/update",
          payload: {
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

#app .v-toolbar__content>.v-btn:last-child {
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
