<template>
  <!--
    Place any desired template structure around the widget grid,
    e.g. toolbar, sidebars, footers.
  -->
  <Grid />
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import Grid from "@t/grids/handler.vue";
const $store = inject("$store");
const state = shallowRef({});

const stateSubscriber = $store
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
    type: "currentPage/update",
    payload: {
      loading: false,
    },
  });
});
onUnmounted(() => {
  stateSubscriber.unsubscribe();
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: true,
    },
  });
});
</script>
