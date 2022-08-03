<template>
  <v-container v-if="state" data-test-id="dashboardContainer" fluid pa-0>
    <h1>{{ $t("pages." + state.pageName) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt; click value {{ state.count }}</p>
    <div class="mb-10">
      <v-btn @click="counter">addCount</v-btn>
      <v-btn @click="changeGrid">changeGrid</v-btn>
    </div>
    <Grid
      v-if="state.slots"
      data-test-id="dashboardContainerGrid"
      :data-test-name="state.grid"
      :contents="state.slots"
    />
  </v-container>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import gridLoader from "@lib/gridLoader";
const $store = inject("$store");
const state = shallowRef({});
const Grid = shallowRef();

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });
const gridSubscriber$ = $store
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
  stateSubscriber$.unsubscribe();
  gridSubscriber$.unsubscribe();
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: true,
    },
  });
});
function counter() {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      count: state.value.count + 1 || 0,
      loading: true,
    },
  });
}
const changeGrid = () => {
  let grid = "column_3_cards_dark";
  if (state.value.grid === "column_3_cards_dark") {
    grid = "column_3_cards";
  }
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      grid,
    },
  });
};
</script>
