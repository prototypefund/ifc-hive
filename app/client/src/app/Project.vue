<template>
  <v-app v-if="(page && page.uuid)">
    <!-- Global Toolbar -->
    <v-app-bar density="compact" flat id="appAppbar" app>
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

          <!--v-col cols="auto">
            <v-fade-transition>
              <span v-if="loading"><v-progress-circular indeterminate :size="20" :width="2" color="primary" /></span>
            </v-fade-transition>
          </!--v-col-->
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

      <v-btn @click="logout">logout</v-btn>

      <!-- User menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props">
            <v-avatar image="https://randomuser.me/api/portraits/men/34.jpg" class="mr-2"></v-avatar>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="pb-0">
          <v-list-item @click="toggleTheme">
            <template v-slot:prepend> <v-icon>mdi-theme-light-dark</v-icon> </template>
            <v-list-item-title>Toggle light / dark</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend> <v-icon>mdi-account-circle</v-icon> </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend> <v-icon>mdi-cog</v-icon> </template>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item @click="saveLocalProjectConfig">
            <template v-slot:prepend> <v-icon>mdi-content-save-cog</v-icon> </template>
            <v-list-item-title>Save Project config</v-list-item-title>
          </v-list-item>
          <v-list-item class="bg-error" @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

    <v-toolbar density="compact" flat class="loadingBar" v-if="loading">
      <v-row class="loaderBar_wrapper">
        <v-slide-x-transition>
          <v-progress-linear class="loaderBar" indeterminate color="primary" />
        </v-slide-x-transition>
      </v-row>
    </v-toolbar>

    <v-divider />
    <template v-if="batchLoading">
      <v-main id="appMain">
        <v-container>
          <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              Getting your files
            </v-col>
            <v-col cols="6">
              <v-progress-linear color="primary" v-model="batchProgress" indeterminate rounded height="20">
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
              {{ batchCurrent }}/{{ batchCount }}
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </template>
    <template v-else>
      <!-- Navigation Drawer -->
      <PageNavigation :nav-items="navItems" :footer-items="footerItems" />
      <navigation-tools-sidebar v-if="currentNavigationTool" />
      <!-- Main content -->
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

    </template>
    <mobile-startup v-if="$mobile" />
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
import socketStatus from "@u/socketStatus.vue"
import projectSwitch from "@u/projectSwitch/select.vue"
import { useTheme } from 'vuetify'
export default {
  components: {
    Notifications,
    PageNavigation,
    navigationToolsSidebar,
    inspectorToolsSidebar,
    StatusBar,
    ProgressBar,
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
    batchLoading: false,
    batchCount: 0,
    batchCurrent: 0,
    editMode: false,
    viewPortHeight: false,
    viewPortWidth: false,
    loading: false,
    currentNavigationTool: false,
    currentInspectorTool: false,
    searching: false,
    hasScrolled: false,
    theme: useTheme(),
    footerItems: [
      {
        icon: "mdi-account-cog",
        route: "app.project.account.settings",
        params: {},
      },
      {
        icon: "mdi-cog",
        route: "app.project.settings",
        params: {},
      },
    ],
    navItems: [
      {
        icon: "mdi-home",
        route: "app.project.dashboard",
        params: {},
      },
      {
        icon: "mdi-file-document-multiple",
        route: "app.project.journal",
        params: {},
      },
      {
        icon: "mdi-human-male-board-poll",
        route: "app.project.ticketboard",
        params: {},
      },
    ],
  }),
  computed: {
    batchProgress() {
      return this.batchCurrent * 100 / this.batchCount
    }
  },
  created() {
    // request project data by project id via the socket
    this.$eventbus.emit('socketJoinRoom', this.$route.params.id)
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
    //this.$eventbus.emit('socketGetProjectData', this.$route.params.id)

    this.$eventbus.on('switchProject', (data) => {
      this.$eventbus.emit('socketJoinRoom', this.$route.params.id)
      this.setupProject()
    })
    this.setupProject()
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
    setupProject: function () {
      this.batchLoading = true
      this.$store.dispatch({
        type: "project/setId",
        payload: this.$route.params.id,
      });
      this.$eventbus.on('batchDataStart', (data) => {
        this.batchCount = data.expect
      })
      this.$eventbus.on('batchDataItemPush', (currentCount) => {
        this.batchCurrent = currentCount
      })
      this.$eventbus.on('batchDataStop', (data) => {
        this.batchLoading = false
        this.$eventbus.emit('setLastProjectId', this.$route.params.id)
        this.$router.push({ name: 'app.project.dashboard', params: this.$route.params })
      })
    },
    toggleTheme: function () {
      this.theme.global.name = this.theme.global.current.dark ? 'light' : 'dark';
    },
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

    logout: async function () {
      this.$router.push({ name: 'public.logout', params: this.$route.params })
    },

    setDimensions: async function () {
      // TODO REPLACE THIS WITH PROPER VUETIFY LOGIC OR REMOVE FROM HERE
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
#app .backToTop {
  position: fixed !important;
  z-index: 100;
  right: 70px;
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

#app .loadingBar {
  height: 2px !important;
  top: 49px;
}

#app .loaderBar_wrapper .loaderBar {
  position: absolute;
  left: 0;
  bottom: 0;
}

#app .mdi-drag {
  cursor: pointer;
}

.v-theme--light .border-bottom,
.v-toolbar.v-theme--light {
  border-bottom: 1px solid #CCC
}

.v-theme--dark .border-bottom,
.v-toolbar.v-theme--dark {
  border-bottom: 1px solid #444
}

#app .sideBarToggle {
  padding-top: 6px;
  padding-bottom: 5px
}
</style>