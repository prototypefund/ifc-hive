<template>
  <v-card v-if="state && props.uuid" data-test-container="widgets/boilerplate/default"
    :data-test-container-uuid=props.uuid>
    <h3>{{ p  rops.props.type }}</h3>
    <v-form>
      <v-text-field v-model="title" label="title"></v-text-field>
      <v-text-field v-model="iLike" label="iLike"></v-text-field>
    </v-form>
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
const iLike = computed({
  get() {
    return state.value.iLike;
  },
  set(iLike) {
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        iLike,
      },
    });
  },
});
const title = computed({
  get() {
    return state.value.title;
  },
  set(title) {
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        title,
      },
    });
  },
});
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
