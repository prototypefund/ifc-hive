<template>
  <v-container v-if="state" data-test-id="testboard_container" fluid pa-0>
    <h1>{{ $t("pages." + state.pageName) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt; click value {{ state.count }}</p>
    <div class="mb-10">
      <v-btn @click="counter">addCount</v-btn>
      <v-btn @click="changeGridType">changeGrid Type</v-btn>
      <v-btn @click="changeGridItem('card')">changeGrid item to default</v-btn>
      <v-btn @click="changeGridItem('card_flat')">changeGrid item to flat</v-btn>

      <v-btn @click="changeGridItem('listItem')">changeGrid item to list</v-btn>
    </div>
    <div class="mb-10">
      <v-btn @click="changeGridColumnCount(1)">changeGrid ColumnCount to 1</v-btn>
      <v-btn @click="changeGridColumnCount(2)">changeGrid ColumnCount to 2</v-btn>
      <v-btn @click="changeGridColumnCount(3)">changeGrid ColumnCount to 3</v-btn>
      <v-btn @click="changeGridColumnCount(4)">changeGrid ColumnCount to 4</v-btn>
    </div>
    <Grid v-if="state.slots" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import Grid from "@t/grids/handler.vue";
const $store = inject("$store");
const state = ref({});

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
function counter() {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      count: state.value.count + 1 || 0,
      loading: true,
    },
  });
}
const changeGridType = () => {
  let grid = {
    type: "default",
  };
  if (state.value.grid.type === "default") {
    grid.type = "dark";
  }
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      grid,
    },
  });
};
const changeGridItem = (type) => {
  let grid = {
    items: type,
  };
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      grid,
    },
  });
};
const changeGridColumnCount = (count) => {
  let grid = {
    columns: count,
  };
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      grid,
    },
  });
};
</script>
