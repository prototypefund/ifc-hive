<template>
  <v-container v-if="state" data-test-container="pages/settings">
    <h1>{{ $t("pages." + state.uuid) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt;</p>
    <Grid :contents="state.slots" :grid="state.grid"></Grid>
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
$store.dispatch({
  type: "data/add",
  dummy: true,
  payload: {
    data: [
      {
        _id: "rajle-1",
        closed: false,
        tags: ["badezimmer"],
        title: "ralle Aller",
      },
    ],
  },
});
onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
function counter() {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      count: state.value.count + 1 || 0,
    },
  });
}
</script>
