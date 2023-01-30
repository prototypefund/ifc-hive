<template>
  <v-app-bar
    density="compact"
    flat
    color="grey-lighten-2"
    class="toolBar"
    id="appToolbar"
    data-test-container="utils/toolbar/default"
  >
    <v-toolbar-title class="d-none d-sm-none d-md-flex d-lg-flex d-xl-flex"
      >{{ $t("widgets.tools.title") }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-slide-x-transition>
      <v-progress-linear
        v-if="loading"
        class="loader"
        indeterminate
        color="primary"
      ></v-progress-linear>
    </v-slide-x-transition>
    <v-slide-x-transition>
      <v-tabs
        v-if="!loading"
        :density="!currentTool ? 'compact' : 'default'"
        v-model="currentTool"
        fixed-tabs
      >
        <v-tab
          class="closeBtnWrapper active"
          :class="{ hidden: currentTool === false }"
          :value="false"
        >
          <v-btn
            variant="plain"
            icon="mdi-chevron-right"
            @click.stop="currentTool = false"
          />
        </v-tab>
        <template v-for="(tool, key) in state">
          <v-tab
            :class="{ active: currentTool === key }"
            v-if="checkVisibility(tool)"
            :value="key"
          >
            <a
              v-if="currentTool === key"
              class="closeOverlay"
              @click.stop="currentTool = false"
            ></a>
            <span class="d-none d-sm-flex d-md-flex d-lg-flex d-xl-flex"
              >{{ $t("widgets." + tool.title) }}
            </span>
            <v-icon v-if="currentTool === key">{{ tool.iconActive }}</v-icon>
            <v-icon v-else>{{ tool.icon }}</v-icon>
          </v-tab>
        </template>
      </v-tabs>
    </v-slide-x-transition>
  </v-app-bar>

  <v-container
    v-if="currentTool && currentComponent"
    fluid
    :class="{ hidden: loading }"
    class="toolContent primary"
    :style="{
      height: viewPortHeight + 'px',
      width: viewPortWidth < 800 ? viewPortWidth + 'px' : '60%',
    }"
  >
    <hr class="contentLine" />
    <v-slide-x-reverse-transition>
      <v-card flat>
        <component
          :is="currentComponent"
          :uuid="currentTool"
          :props="state[currentTool].widget.props || {}"
          class="toolComponentWrapper"
        >
        </component>
      </v-card>
    </v-slide-x-reverse-transition>
  </v-container>
</template>
<script>
import { defineAsyncComponent } from "vue";
import toolLoader from "@lib/toolLoader";
export default {
  inject: ["$api", "$store"],
  data: () => ({
    state: {},
    route: {},
    viewPortHeight: 0,
    viewPortWidth: 0,
    loading: true,
    currTool: false,
    stateSubscriber$: false,
    routeSubscriber$: false,
    currentToolSubscriber$: false,
  }),
  computed: {
    currentTool: {
      get() {
        return this.currTool;
      },
      set(newValue) {
        if (this.currTool !== newValue) {
          this.$store.dispatch({
            type: "ui/update",
            payload: {
              currentTool: newValue,
            },
          });
        }
      },
    },
  },
  created() {
    this.stateSubscriber$ = this.$store
      .select((state) => state.toolbar)
      .subscribe((val) => {
        this.state = val;
      });
    this.routeSubscriber$ = this.$store
      .select((state) => state.route)
      .subscribe((val) => {
        this.route = val;
      });
    this.currentToolSubscriber$ = this.$store
      .select((state) => state.ui.currentTool)
      .subscribe((val) => {
        if (val !== this.currTool) {
          this.currTool = val;
          this.activateTool(val);
        }
      });
    this.viewPortHeightSubscriber$ = this.$store
      .select((state) => state.ui.viewPortHeight)
      .subscribe((val) => {
        this.viewPortHeight = val;
      });
    this.viewPortWidthSubscriber$ = this.$store
      .select((state) => state.ui.viewPortWidth)
      .subscribe((val) => {
        this.viewPortWidth = val;
      });
    this.loadingSuibscriber$ = this.$store
      .select((state) => state.ui.loading)
      .subscribe((val) => {
        this.loading = val;
      });
  },
  destroyed() {
    this.stateSubscriber$.unsubscribe();
    this.routeSubscriber$.unsubscribe();
    this.currentToolSubscriber$.unsubscribe();
    this.viewPortHeightSubscriber$.unsubscribe();
    this.viewPortWidthSubscriber$.unsubscribe();
    this.loadingSuibscriber$.unsubscribe();
  },
  methods: {
    activateTool(name) {
      if (name) {
        this.currentComponent = defineAsyncComponent(() => {
          return toolLoader(
            this.state[name].widget.name,
            this.state[name].widget.type,
            this.state[name].widget.face
          );
        });
      }
    },
    checkVisibility(tool) {
      // if we have no page set to this tool or page set matches current route name we are good to go!
      if (!tool.page || tool.page.indexOf(this.route.name) > -1) {
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
.active {
  background-color: #9e9e9e;
  border-bottom: 1px solid #9e9e9e !important;
  height: 100% !important;
}

.contentLine {
  border: 3px solid #9e9e9e;
}

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

.toolContent {
  position: fixed;
  padding: 0 !important;
  right: 0;
  top: 96px;
  z-index: 900;
  border: 1px solid #e0e0e0;
  border-top: 0px;
  overflow: hidden;
}

.toolContent > .v-card {
  height: 100%;
  padding-bottom: 5px;
}

.toolComponentWrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.loader {
  position: absolute;
  left: 0;
  bottom: 0;
}

.hidden {
  visibility: hidden !important;
}

.hidden * {
  visibility: hidden !important;
}
</style>
