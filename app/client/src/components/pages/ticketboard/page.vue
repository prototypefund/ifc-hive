<template>
  <v-container v-if="state" data-test-container="pages/ticketboard/page" fluid pa-0 ma-0>
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

$store.dispatch({
  type: "toolbar/add",
  payload: {
    title: "ticketsByTag",
    page: "app.ticketboard",
    icon: "mdi-chart-donut",
    iconActive: "mdi-chart-donut-variant",
    uuid: "chart_ticketsByTag",
    widget: {
      name: "ticketboard",
      type: "chart",
      face: "ticketsByTag",
      props: {
        categories: [
          "tags:tag-todo",
          "tags:tag-doing",
          "tags:tag-test",
          "tags:tag-qa",
          "tags:tag-done",
        ],
      },
    },
  },
});

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
