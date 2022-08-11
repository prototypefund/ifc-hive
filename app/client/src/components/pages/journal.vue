<template>
  <v-container fluid class="pa-0">
    <v-toolbar color="transparent" flat>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <Grid class="mt-5"></Grid>
  </v-container>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted } from "vue";
import Grid from "@t/grids/handler.vue";
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
</script>
