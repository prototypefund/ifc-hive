<template>
  <v-navigation-drawer width="400" data-test-container="utils/navigationToolsSidebar/default" id="navigationToolsSidebar"
    permanent v-if="state">
    <v-slide-x-transition>
      <v-row no-gutters class="border-bottom">
        <v-tabs v-model="currentTool" density="comfortable" center-active>
          <!-- iterate over page widget tools and display a button for each widget -->
          <template v-for="(tool, key) in state">
            <v-tab class="text-caption" :class="{ active: currentTool === key }" v-if="checkVisibility(tool)" :value="key"
              :key="tool">
              <a v-if="currentTool === key" class="closeOverlay" @click.stop="currentTool = false" />

              <!-- widget icon for currently opened and other tools -->
              <v-icon>{{ tool.icon }}</v-icon>
            </v-tab>
          </template>
        </v-tabs>
      </v-row>
    </v-slide-x-transition>
    <v-container v-if="currentTool && currentComponent && currentTool !== true" fluid class="toolContent primary">
      <component :is="currentComponent" :uuid="currentTool" :props="state[currentTool].widget.props || {}"
        class="toolComponentWrapper">
      </component>
    </v-container>
  </v-navigation-drawer>
</template>
<script>
import { defineAsyncComponent } from "vue";
import toolLoader from "@lib/toolLoader";
export default {
  inject: ["$api", "$store"],
  components: {

  },
  data: () => ({
    openTool: false,
    state: false,
    route: false,
    navigationRailSubscriber$: false,
  }),
  computed: {
    currentComponent: {
      get() {
        const currWidget = this.state[this.currentTool].widget
        return defineAsyncComponent(function () {
          return toolLoader(
            currWidget.name,
            currWidget.type,
            currWidget.face
          );
        })
      },
      set(newValue) {
        if (this.openTool !== newValue) {
          this.$store.dispatch({
            type: "ui/update",
            payload: {
              currentInspectorTool: newValue,
            },
          });
        }
      },
    },
    currentTool: {
      get() {
        let currTool = this.openTool
        if (currTool === true) {
          currTool = Object.keys(this.state)[0]
        }
        return currTool;
      },
      set(newValue) {
        if (this.openTool !== newValue) {
          this.$store.dispatch({
            type: "ui/update",
            payload: {
              currentNavigationTool: newValue,
            },
          });
        }
      },
    },
  },
  created() {
    this.openToolSubscriber$ = this.$store
      .select((state) => state.ui.currentNavigationTool)
      .subscribe((val) => {
        this.openTool = val;
      });
    this.routeSubscriber$ = this.$store
      .select((state) => state.route)
      .subscribe((val) => {
        this.route = val;
      });
    this.stateSubscriber$ = this.$store
      .select((state) => state.navigationTools)
      .subscribe((val) => {
        this.state = val;
      });
  },
  destroyed() {
    this.stateSubscriber$.unsubscribe();
    this.openToolSubscriber$.unsubscribe();
    this.stateSubscriber$.unsubscribe();
  },
  methods: {
    checkVisibility(tool) {
      if (!tool) {
        return false
      }
      // if we have no page set to this tool or page set matches current route name we are good to go!
      if (!tool.pages || tool.pages.indexOf(this.route.name) > -1) {
        return true;
      }
      if (this.currentTool === tool.widget.uuid) {
        // if the currentTool is not visible on this page, remove currentTool
        this.currentTool = false;
      }
      return false;
    },
  },
};
</script>
<style lang="css" scoped>
.closeOverlay {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  left: 0;
}

.v-tab.v-tab {
  min-width: 30px
}

.toolContent {
  padding: 0
}

.hidden {
  display: none;
}
</style>
