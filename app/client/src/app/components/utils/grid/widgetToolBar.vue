<template>
  <v-toolbar v-if="widgetState" dense>
    <!-- // TODO reenable once the drag and drop for widgets is fully implemented -->
    <!--v-btn flat icon="mdi-drag" /-->
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
const colCounts = [4, 6, 8, 12];
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
    return newValue;
  },
});

onMounted(() => {});
onUnmounted(() => {
  widgetStateSubscriber$.unsubscribe();
});
</script>
