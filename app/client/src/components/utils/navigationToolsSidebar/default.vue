<template>
  <v-navigation-drawer data-test-container="utils/navigationToolsSidebar/default" id="navigationToolsSidebar" permanent>
    <pre>{{ state }}</pre>
  </v-navigation-drawer>
</template>
<script>
import { defineAsyncComponent } from "vue";
export default {
  inject: ["$api", "$store"],
  components: {

  },
  data: () => ({
    openTool: true,
    state: false,
    navigationRailSubscriber$: false,
  }),
  created() {
    this.openToolSubscriber$ = this.$store
      .select((state) => state.ui.currentNavigationTool)
      .subscribe((val) => {
        this.openTool = val;
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
  },
  methods: {

  },
};
</script>
<style lang="css" scoped></style>
