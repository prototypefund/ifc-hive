<template>
  <v-container fluid class="pa-0" data-test-container="widgets/projects/default">
    <v-card color="grey-lighten-3" flat>
      <v-card-text> Why is the wrong thing called? </v-card-text>
    </v-card>
  </v-container>
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
    default: () => ({}),
  },
  uuid: {
    type: String,
  },
});

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
