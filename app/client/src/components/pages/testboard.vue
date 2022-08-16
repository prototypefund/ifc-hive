<template>
  <v-container v-if="state" data-test-id="testboard_container" fluid pa-0>
    <h1>{{ $t("pages." + state.pageName) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt; click value {{ state.count }}</p>
    <div class="mb-10">
      <v-btn @click="counter">addCount</v-btn>
    </div>
    <v-row>
      <v-col cols="3">
        <v-select :items="colCounts" v-model="colCount" label="Column Count"></v-select>
      </v-col>
      <v-col cols="3">
        <v-select :items="gridTypes" v-model="gridType" label="Grid Type"></v-select>
      </v-col>
      <v-col cols="3">
        <v-select :items="gridItems" v-model="gridItem" label="Grid Item"></v-select>
      </v-col>
    </v-row>
    <Grid v-if="state.slots" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = ref({});
const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

const colCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const gridTypes = ["card", "default", "dark"];
const gridItems = ["card_flat", "card", "default"];

const gridItem = computed({
  // getter
  get() {
    return state.value.grid.items;
  },
  // setter
  set(newValue) {
    let grid = {
      items: newValue,
    };
    $store.dispatch({
      type: "currentPage/update",
      payload: {
        grid,
      },
    });
  },
});
const gridType = computed({
  // getter
  get() {
    return state.value.grid.type;
  },
  // setter
  set(newValue) {
    let grid = {
      type: newValue,
    };
    $store.dispatch({
      type: "currentPage/update",
      payload: {
        grid,
      },
    });
  },
});
const colCount = computed({
  // getter
  get() {
    return state.value.grid.columns;
  },
  // setter
  set(newValue) {
    let grid = {
      columns: newValue,
    };
    $store.dispatch({
      type: "currentPage/update",
      payload: {
        grid,
      },
    });
  },
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
</script>
