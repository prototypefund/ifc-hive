<template>
  <v-container fluid class="pa-0">
    <v-card color="grey-lighten-3" flat>
      <v-card-text>
        Some simple thing
      </v-card-text>
    </v-card>
    <v-card color="grey-lighten-3 mt-2" flat>
      <v-card-text>
        Some simple thing
      </v-card-text>
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
