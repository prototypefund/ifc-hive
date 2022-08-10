<template>
  <GridType v-if="rows.length > 0">
    <v-row no-gutters v-for="n in rowCount">
      {{ n }}
      <v-col
        v-for="(content, index) in props.contents && index <= rowCount"
        :class="getSlotClass(content)"
      >
        <GridItem>
          {{ index }}<br />
          {{ content }}
        </GridItem>
      </v-col>
    </v-row>
    <pre>{{ gridConfig }}</pre>
  </GridType>
</template>
<script setup>
import { inject, shallowRef, onUnmounted, defineAsyncComponent, ref } from "vue";
import { gridTypeLoader, gridItemLoader } from "@lib/gridLoader";
const $store = inject("$store");
const gridConfig = ref();
const rows = ref([]);
const GridType = shallowRef();
const GridItem = shallowRef();
const makeRows = () => {
  for (let i = 0; i < gridConfig.value.columns; i++) {
    debugger;
  }
  rows.value.push({});
  rowCount.value = Math.ceil(props.contents.length / gridConfig.value.columns) || 1;
};
const gridSubscriber$ = $store
  .select((state) => state.currentPage.grid)
  .subscribe((val) => {
    gridConfig.value = val;
  });
const gridTypeSubscriber$ = $store
  .select((state) => state.currentPage.grid.type)
  .subscribe((val) => {
    GridType.value = defineAsyncComponent((props) => {
      return gridTypeLoader(val);
    });
  });
const gridItemSubscriber$ = $store
  .select((state) => state.currentPage.grid.items)
  .subscribe((val) => {
    GridItem.value = defineAsyncComponent((props) => {
      return gridItemLoader(val);
    });
  });

const slotSubscriber$ = $store
  .select((state) => state.currentPage.slots)
  .subscribe((val) => {
    let maguggn = Math.ceil(val.length / gridConfig.value.columns);
    debugger;
  });
onUnmounted(() => {
  slotSubscriber$.unsubscribe();
  gridSubscriber$.unsubscribe();
  gridTypeSubscriber$.unsubscribe();
  gridItemSubscriber$.unsubscribe();
});
const getSlotClass = (slot) => {
  if (!slot) return "";
  return slot && slot.column ? slot.column : "";
};
</script>
