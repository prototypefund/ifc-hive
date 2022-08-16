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
  type: {
    type: String,
    default: "widgets",
  },
  column: {
    type: Number,
  },
  slotClass: {
    type: String,
  },
  uuid: {
    type: String,
    require: true,
  },
});
const widgetStateSubscriber$ = $store
  .select((widgetState) => widgetState[props.type][props.uuid])
  .subscribe((val) => {
    widgetState.value = val;
  });

const colCount = computed({
  // getter
  get() {
    const classParts = props.slotClass.split("-");
    return parseInt(classParts[classParts.length - 1]);
  },
  // setter
  set(newValue) {
    emit("changeColCount", newValue, props.column);
  },
});

onMounted(() => {});
onUnmounted(() => {
  widgetStateSubscriber$.unsubscribe();
});
</script>
