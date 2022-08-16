<template>
  <v-toolbar v-if="widgetState" dense>
    <v-toolbar-title>{{
      widgetState.title || widgetState.name || props.type
    }}</v-toolbar-title>
    <v-spacer></v-spacer>

    <div class="d-flex flex-column">
      <br /><br />
      <v-scale-transition>
        <v-select
          density="compact"
          :items="colCounts"
          v-model="colCount"
          label="Breite"
        ></v-select>
      </v-scale-transition>
    </div>
  </v-toolbar>
</template>
<script setup>
import { inject, ref, computed, onUnmounted, onMounted } from "vue";
const $store = inject("$store");
const widgetState = ref({});
const colCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const emit = defineEmits(["changeColCount"]);
const props = defineProps({
  columnIndex: {
    type: Number,
  },
  columnClass: {
    type: Number,
  },
  uuid: {
    type: String,
    require: true,
  },
});
const widgetStateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    widgetState.value = val;
  });

const colCount = computed({
  // getter
  get() {
    return parseInt(props.columnClass);
  },
  // setter
  set(newValue) {
    emit("changeColCount", newValue, props.columnIndex);
  },
});

onMounted(() => {
  console.log("resizer on");
});
onUnmounted(() => {
  widgetStateSubscriber$.unsubscribe();
  console.log("resizer out");
});
</script>
