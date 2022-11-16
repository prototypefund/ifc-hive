<template>
  <v-container v-if="state" data-test-container="pages/testboard" fluid pa-0>
    <h1>{{ $t("pages." + state.uuid) }} - {{ state.title }}</h1>
    <p>url params > {{ props.urlParams }} &lt; click value {{ state.count }}</p>
    <div class="mb-10">
      <v-btn data-test-id="testboard_count-button" @click="counter">addCount</v-btn>
    </div>

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
