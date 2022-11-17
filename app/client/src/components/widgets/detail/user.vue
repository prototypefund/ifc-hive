<template>
  <v-card v-if="state && props.uuid" data-test-container="widgets/detail/user" :data-test-container-uuid=props.uuid>
    <h3>{{ p    rops.props.type }}</h3>
    <pre>{{ state }}</pre>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");
const state = ref({});

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
const stateSubscriber$ = $store
  .select((state) => state[props.props.type || "currentPage"])
  .subscribe((val) => {
    state.value = val;
  });
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
