<template>
  <v-toolbar v-if="state">
    <v-toolbar-title>{{ state.title || state.name || props.type }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-magnify"></v-btn>

    <v-btn variant="text" icon="mdi-view-module"></v-btn>
  </v-toolbar>
</template>
<script setup>
import { inject, ref, onUnmounted, onMounted } from "vue";
const $store = inject("$store");
const state = ref({});
const props = defineProps({
  type: {
    type: String,
    default: "widgets",
  },
  uuid: {
    type: String,
    require: true,
  },
});
const stateSubscriber$ = $store
  .select((state) => state[props.type][props.uuid])
  .subscribe((val) => {
    state.value = val;
  });

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
