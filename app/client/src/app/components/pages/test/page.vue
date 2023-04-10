<template>
  <v-container v-if="state" data-test-container="pages/test" fluid pa-0>
    <p>This is a Test page created from the boilerplate</p>
    <!--
    Place any desired template structure around the widget grid,
    e.g. toolbar, sidebars, footers.
    -->
    <Grid v-if="state.slots" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

  onMounted(() => {});
  onUnmounted(() => {
    stateSubscriber$.unsubscribe();
  });
</script>
