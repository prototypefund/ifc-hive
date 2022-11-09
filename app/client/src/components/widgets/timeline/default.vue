<template>
  <v-timeline v-if="state && props.uuid" data-test-container="widgets/timeline/default"
    :data-test-container-uuid=props.uuid>
    <h3>{{ state.title }}</h3>
    <v-timeline-item dot-color="amber-lighten-1" fill-dot size="x-small">
      <v-card>
        <v-card-title class="bg-purple-lighten-2">
          <v-icon size="large" class="mr-4" icon="mdi-magnify"></v-icon>
          <h2 class="font-weight-light">page specific props</h2>
        </v-card-title>
        <v-card-text style="text-align: left">
          <pre> {{ props.props }}</pre>
        </v-card-text>
      </v-card>
    </v-timeline-item>
    <v-timeline-item dot-color="red-lighten-1" fill-dot size="x-small">
      <v-card>
        <v-card-title class="bg-amber-lighten-1 justify-end">
          <h2 class="mr-4 font-weight-light">widget state</h2>
          <v-icon size="large" icon="mdi-home-outline"></v-icon>
        </v-card-title>
        <v-card-text style="text-align: left">
          <pre>{{ state }}</pre>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");
const state = ref({});
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const props = defineProps({
  props: {
    type: Object,
  },
  uuid: {
    type: String,
  },
});
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
