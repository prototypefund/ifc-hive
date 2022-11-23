<template>
  <v-card flat class="quickListWrapper" :class="{ open: quickListRail }">
    <v-toolbar :collapse="!quickListRail" density="compact" class="quickListToolbar">
      <v-toolbar-title>Quicklist</v-toolbar-title>

      <v-btn icon @click.stop="handleQuicklist(!quickListRail)">
        <v-icon v-if="!quickListRail">mdi-chevron-left</v-icon>
        <v-icon v-if="quickListRail">mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs v-model="tab" fixed-tabs v-if="tabs.length > 0 && quickListRail">
      <v-tab v-for="(item, index) in tabs" :key="item" @click.middle="closeTab(index)" class="quickListTab">
        {{ item.type }} - {{ item.docUUID }}
        <v-icon class="tabHandler" @click="closeTab(index)">mdi-close-octagon</v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" class="tabScrollContainer" v-if="quickListRail">
      <v-window-item v-for="(item, index) in tabs" :key="item">
        <Detail v-if="item.type === 'detail'" :props="item.props" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script>
import Detail from "./types/detail.vue";
export default {
  inject: ["$api", "$store"],
  components: {
    Detail,
  },
  data: () => ({
    quickList: true,
    overlay: false,
    quickListRail: false,
    tabs: [],
    currStateTab: 0,
  }),
  computed: {
    tab: {
      get: function () {
        return this.currStateTab || 0;
      },
      set: function (newValue) {
        this.$store.dispatch({
          type: "quickList/update",
          payload: {
            tab: newValue,
          },
        });
      },
    },
  },
  created() {
    this.$store
      .select((state) => state["ui"].quickListOpen)
      .subscribe((val) => {
        this.quickListRail = val;
      });
    this.$store
      .select((state) => state["quickList"].tabs)
      .subscribe((val) => {
        this.tabs = val;
      });
    this.$store
      .select((state) => state["quickList"].tab)
      .subscribe((val) => {
        this.currStateTab = val;
      });
  },
  methods: {
    closeTabConfirmed(index) {
      this.overlay = false;
      this.$store.dispatch({
        type: "quickList/delete",
        payload: {
          tabIndex: index,
        },
      });
    },
    closeTab(index) {
      this.overlay = index;
      // TODO add confirm dialogue here, apparently overlay does not work atm in vuetify rc
      this.closeTabConfirmed(index);
    },
    handleQuicklist(val) {
      this.$store.dispatch({
        type: "ui/update",
        payload: {
          quickListOpen: val,
        },
      });
    },
  },
};
</script>
<style lang="css">
.quickListWrapper {
  position: fixed !important;
  z-index: 1007;
  right: 0 !important;
  top: 47px;
  max-width: 50%;
  overflow: auto;
  background-color: transparent;
}

.quickListWrapper.open {
  max-height: 100%;
  padding-bottom: 80px;
  border-left: 1px solid #E0E0E0 !important;
  border-bottom: 1px solid #E0E0E0 !important;
}

.quickListWrapper .v-toolbar--collapse {
  border-bottom-left-radius: 24px !important;
  border-bottom-right-radius: 0 !important;
}
</style>
<!--style>




.quickListWrapper.closed {
  top: 44px;
  width: 40px;
  height: 30px;
}

.quickListWrapper.closed > .quickListHandler > .v-btn {
  height: 100% !important;
}

.quickListTab:hover .tabHandler {
  display: block !important;
}

.tabHandler {
  display: none !important;
  position: absolute !important;
  top: 10px !important;
  cursor: pointer;
  right: 0px;
}
</!--style-->
