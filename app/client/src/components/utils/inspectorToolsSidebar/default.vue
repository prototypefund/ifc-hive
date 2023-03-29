<template>
  <v-navigation-drawer data-test-container="utils/inspectorToolsSidebar/default" id="navigationToolsSidebar"
    :rail="currentTool === false" permanent location="right">
    <template v-slot:prepend>
      <v-list-item density="compact" v-if="currentTool === false">
        <template v-slot:append>
          <v-btn density="compact" flat icon="mdi-dock-right" @click.stop="handleToolSidebar()" />
        </template>
      </v-list-item>
      <v-list-item v-for="(tool, key) in state" density="compact" v-if="currentTool === false">
        <template v-slot:append>
          <v-btn density="compact" flat :icon="tool.icon" :value="key" :key="tool" @click.stop="currentTool = key" />
        </template>
      </v-list-item>

    </template>
    <template v-if="currentTool !== false">
      <v-slide-x-transition>
        <v-tabs density="comfortable" v-model="currentTool" center-active>
          <!-- iterate over page widget tools and display a button for each widget -->
          <template v-for="(tool, key) in state">
            <v-tab :class="{ active: currentTool === key }" v-if="checkVisibility(tool)" :value="key" :key="tool">
              <a v-if="currentTool === key" class="closeOverlay" @click.stop="currentTool = false" />

              <!-- widget icon for currently opened and other tools -->
              <v-icon>{{ tool.icon }}</v-icon>
            </v-tab>
          </template>
          <v-tab class="closeBtnWrapper active" :class="{ hidden: currentTool === false }" :value="false">
            <v-btn variant="plain" icon="mdi-dock-right" @click.stop="currentTool = false" />
          </v-tab>
        </v-tabs>
      </v-slide-x-transition>
    </template>
    <v-container v-if="currentTool" fluid :class="{ hidden: loading }" class="toolContent primary">
      <hr class="contentLine" />
      <v-slide-x-reverse-transition>
        <v-card flat>
          <pre>{{ state }}</pre>
        </v-card>
      </v-slide-x-reverse-transition>
    </v-container>

  </v-navigation-drawer>
</template>
<script>
import { defineAsyncComponent } from "vue";
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
    currentTool: {
      get() {
        return this.openTool;
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
    this.routeSubscriber$ = this.$store
      .select((state) => state.route)
      .subscribe((val) => {
        this.route = val;
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
  },
  methods: {
    checkVisibility(tool) {
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

.hidden {
  display: none;
}
</style>
