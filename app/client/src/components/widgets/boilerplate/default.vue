<template>
  <v-card v-if="state && props.uuid" data-test-container="widgets/boilerplate/default"
    :data-test-container-uuid=props.uuid>
    <h3>{{ props.props.type }}</h3>
    <pre>{{ state }}</pre>
    <v-input v-model="title" :counter="10" label="title" required></v-input>
    <v-input v-model="iLike" :counter="10" label="iLike" required></v-input>
  </v-card>
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
  set(title) {
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
