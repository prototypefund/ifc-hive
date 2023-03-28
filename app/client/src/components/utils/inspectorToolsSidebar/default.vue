<template>
  <v-navigation-drawer data-test-container="utils/inspectorToolsSidebar/default" id="navigationToolsSidebar"
    :rail="openTool === false" permanent location="right">
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
    this.stateSubscriber$.unsubscribe();
    this.openToolSubscriber$.unsubscribe();
  },
  methods: {

  },
};
</script>
<style lang="css" scoped></style>
