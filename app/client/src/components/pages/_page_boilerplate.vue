<template>
  <!--
    Place any desired template structure around the widget grid,
    e.g. toolbar, sidebars, footers.
  -->
  <Grid :contents="state.slots"></Grid>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import gridLoader from "@lib/gridLoader";
const $store = inject("$store");
const state = shallowRef({});
const Grid = shallowRef();

const stateSubscriber = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

const gridSubscriber = $store
  .select((state) => state.currentPage.grid)
  .subscribe((val) => {
    Grid.value = defineAsyncComponent((props) => {
      return gridLoader(val);
    });
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
  gridSubscriber.unsubscribe();
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: true,
    },
  });
});
</script>
