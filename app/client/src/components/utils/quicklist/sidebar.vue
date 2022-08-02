<template>
  <v-card
    color="grey-lighten-2"
    :class="{ closed: !quickListRail }"
    flat
    class="quickListWrapper"
  >
    <div class="quickListHandler">
      <v-btn
        v-if="!quickListRail"
        variant="text"
        icon="mdi-chevron-left"
        @click.stop="handleQuicklist(true)"
      >
      </v-btn>
      <v-btn
        v-if="quickListRail"
        variant="text"
        icon="mdi-chevron-right"
        @click.stop="handleQuicklist(false)"
      >
      </v-btn>
    </div>

    <v-card-title> Quicklist </v-card-title>
    <v-card-subtitle> </v-card-subtitle>
    <v-tabs v-model="tab" fixed-tabs v-if="tabs.length > 0">
      <v-tab
        v-for="(item, index) in tabs"
        :key="item"
        @click.middle="closeTab(index)"
        class="quickListTab"
      >
        {{ item.type }} - {{ item.docUUID }}
        <v-icon class="tabHandler" @click="closeTab(index)">mdi-close-octagon</v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" class="tabScrollContainer">
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
<style>
.quickListWrapper {
  position: fixed !important;
  z-index: 1007;
  right: 0 !important;
  top: 60px;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-left: 1px solid black !important;
}

.quickListWrapper .tabScrollContainer {
  /* TODO change height here with actual absolute px height of quicklist full container -> I'm too stupid to get the ref clientHeight thingy to work atm */
  max-height: 78%;
  overflow: auto !important;
}

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
</style>
