<template>

  <v-container v-if="state" data-test-container="pages/boilerplate" fluid pa-0>
    <!--
      Place any desired template structure around the widget grid,
      e.g. toolbar, sidebars, footers.
    -->
    <Grid v-if="state.slots" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = ref({});


const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

onMounted(() => {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: false,
    },
  });
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: true,
    },
  });
});
</script>
