<template>
  <v-container data-test-container="pages/journal" fluid pa-0>
    <h1>{{ $t("pages.app-journal") }}</h1>
    <Grid></Grid>
  </v-container>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = shallowRef({});

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
});

onMounted(() => {
  $store.dispatch({
    type: "toolbar/add",
    payload: {
      title: "chartJournal",
      page: "app.journal",
      icon: "mdi-chart-donut",
      iconActive: "mdi-chart-donut-variant",
      uuid: "journal_chart",
      widget: {
        name: "journal",
        type: "chart",
        face: "example",
      },
    },
  });
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
