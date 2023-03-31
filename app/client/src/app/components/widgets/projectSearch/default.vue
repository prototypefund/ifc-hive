<template>
  <v-card v-if="state && props.uuid" data-test-container="widgets/projectSearch/default"
    :data-test-container-uuid=props.uuid>
    <h3>{{ state.name }}</h3>
    <pre>{{ state }}</pre>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from "vue";
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
    required: true,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
});

onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
