<template>
  <v-navigation-drawer width="400" data-test-container="utils/inspectorToolsSidebar/default" id="inspectorToolsSidebar"
    :rail="currentTool === false" permanent location="right" v-if="state">
    <template v-slot:prepend>
      <template v-if="currentTool === false">
        <v-list-item density="compact" @click.stop="handleToolSidebar()" class="sideBarToggle border-bottom">
          <v-icon icon="mdi-dock-right"></v-icon>
        </v-list-item>
        <template v-for="(tool, key) in state" :key="key">
          <v-list-item density="compact" v-if="checkVisibility(tool)">
            <template v-slot:append>
              <v-btn density="compact" flat variant="plain" :icon="tool.icon" :value="key" :key="tool"
                @click.stop="currentTool = key" />
            </template>
          </v-list-item>
        </template>
      </template>
    </template>
    <template v-if="currentTool !== false">
      <v-slide-x-transition>
        <v-row no-gutters class="border-bottom">
          <v-tabs density="compact">
            <v-tab class="fakeTab" />
            <v-tab class="closeBtnWrapper" @click.stop="currentTool = false">
              <v-icon>mdi-dock-right</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs density="compact" v-model="currentTool" center-active>
            <!-- iterate over page widget tools and display a button for each widget -->
            <template v-for="(tool, key) in state" :key="key">
              <v-tab class="text-caption" :class="{ active: currentTool === key }" v-if="checkVisibility(tool)"
                :value="key" :key="tool">
                <a v-if="currentTool === key" class="closeOverlay" @click.stop="currentTool = false" />

                <!-- widget icon for currently opened and other tools -->
                <v-icon>{{ tool.icon }}</v-icon>
              </v-tab>
            </template>
          </v-tabs>

        </v-row>

      </v-slide-x-transition>
    </template>
    <v-container v-if="currentTool && currentComponent && currentTool !== true" fluid :class="{ hidden: loading }"
      class="toolContent primary">
      <v-slide-x-reverse-transition>
        <component v-if="currentTool" :is="currentComponent" :key="currentTool" :uuid="currentTool"
          :props="state[currentTool].widget.props || {}" class="toolComponentWrapper">
        </component>
      </v-slide-x-reverse-transition>
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
    loading: true,
  }),
  computed: {
    currentComponent: {
      get() {
        if (!this.currentTool) {
          return false
        }
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
              currentInspectorTool: newValue,
            },
          });
        }
      },
    },
  },
  created() {
    this.loadingSuibscriber$ = this.$store
      .select((state) => state.ui.loading)
      .subscribe((val) => {
        this.loading = val;
      });
    this.openToolSubscriber$ = this.$store
      .select((state) => state.ui.currentInspectorTool)
      .subscribe((val) => {
        this.openTool = val;
      });
    this.stateSubscriber$ = this.$store
      .select((state) => state.inspectorTools)
      .subscribe((val) => {
        this.state = val;
      });
  },
  destroyed() {
    this.loadingSuibscriber$.unsubscribe();
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
      if (!tool.pages || tool.pages.indexOf(this.$router.currentRoute.value.name) > -1) {
        return true;
      }
      if (this.currentTool === tool.widget.uuid) {
        // if the currentTool is not visible on this page, remove currentTool
        this.currentTool = false;
      }
      return false;
    },
    handleToolSidebar() {
      this.$store.dispatch({
        type: "ui/toggle",
        payload: {
          list: ['currentInspectorTool'],
        },
      });
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
  top: 0;
}

.v-tab.v-tab {
  min-width: 30px
}

.toolContent {
  padding: 0
}

.hidden * {
  visibility: hidden !important
}

.fakeTab {
  display: none
}
</style>
