<template>
  <v-container v-if="state" data-test-container="pages/dashboard" fluid pa-0>
    <h1>{{ $t("pages." + state.uuid) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt; click value {{ state.count }}</p>
    <Grid v-if="state.slots" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const $mobile = inject("$mobile");
const state = ref({});
console.dir($mobile);
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
      title: "Test",
      page: "app.dashboard",
      icon: "mdi-apple-safari",
      iconActive: "mdi-apple-safari",
      uuid: "dashboardTest",
      widget: {
        name: "placeholder",
      },
    },
  });
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
