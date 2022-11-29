<template>
  <v-app v-if="(page && page.uuid) || isInTest">
    <!-- Global Toolbar -->
    <v-app-bar density="compact" flat app color="grey-lighten-2" :class="{ appBarRel: isInTest }">
      <!-- Breadcrumb -->
      <v-app-bar-title>
        <router-link :to="{ path: '/' }">
          Journal
        </router-link>
        <v-icon color="grey" xsmall>mdi-chevron-right</v-icon>
        {{ $t("pages." + page.uuid) }}
      </v-app-bar-title>
      <v-spacer />
      <Camera v-if="$mobile" />
      <v-spacer />
      <v-btn v-if="!editMode" flat icon="mdi-view-dashboard-edit-outline" @click="changeEditMode" />
      <v-btn v-if="editMode" flat icon="mdi-view-dashboard-edit" @click="changeEditMode" />
      <!-- notifications -->
      <Notifications />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <NavigationSideBar v-if="!isInTest" :nav-items="navItems" />
    <ToolBar :class="{ appBarRel: isInTest }" />
    <!-- Main content -->
    <v-main>

      <v-card flat v-if="isInTest">
        <slot />
      </v-card>
      <v-card flat v-else>
        <Suspense>
          <template #default>
            <Transition>
              <router-view />
            </Transition>
          </template>
          <template #fallback>
            <Transition>
              <loading-skeleton />
            </Transition>

          </template>
        </Suspense>
      </v-card>
    </v-main>
    <!-- quicklist Drawer -->
  </v-app>
</template>
<script>
// only needed for mobile and will be handled in mounted
import { defineCustomElements } from '@ionic/pwa-elements/loader';
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
    loadingSkeleton
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
  mounted() {
    if (this.$mobile) {
      defineCustomElements(window);
      // TODO leave this here or move it to a hook file which comes from capacitor src?
      this.$mobile.Toast.show({
        text: 'Capacitor ist ne geile Sau wenn das Grundframework ne geile Sau ist!',
        duration: 'long'
      }).then(async () => {
        this.$mobile.SplashScreen.hide();
      })
    }
    // TODO find a way to have the quicklist handler know the uuid of the widget. As for now we need to set a uuid
    this.$store.dispatch({
      type: "toolbar/add",
      payload: {
        page: false,
        title: 'quickList',
        icon: 'mdi-text-box-search-outline',
        iconActive: 'mdi-text-box-search',
        widget: {
          name: 'quickList',
          uuid: 'quickList'
        }
      },
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
