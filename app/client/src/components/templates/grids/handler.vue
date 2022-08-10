<template>
  <GridType>
    <v-row no-gutters v-for="row in rows">
      <v-col v-for="column in row" :class="getSlotClass(column)">
        <GridItem>
          <component
            :is="column.component"
            :uuid="column.widget.uuid"
            :props="column.widget.props || {}"
          ></component>
        </GridItem>
      </v-col>
    </v-row>
  </GridType>
</template>
<script setup>
import {
  inject,
  shallowRef,
  onUnmounted,
  onMounted,
  defineAsyncComponent,
  ref,
} from "vue";
import { gridTypeLoader, gridItemLoader } from "@lib/gridLoader";
import widgetLoader from "@lib/widgetLoader";
const $store = inject("$store");
const gridColumnsCount = shallowRef();
const gridSlots = ref();
const rows = shallowRef([]);
const GridType = shallowRef();
const GridItem = shallowRef();

const handleRows = () => {
  // always start with empty rows
  rows.value = [];
  // get row count
  const rowCount = Math.ceil(gridSlots.value.length / gridColumnsCount.value);
  // clone slots so we can splice off that object
  const slotClone = JSON.parse(JSON.stringify(gridSlots.value));
  for (let i = 1; i <= rowCount; i++) {
    // get the needed amount of columns per row
    let columnsPerRow = slotClone.splice(0, gridColumnsCount.value);
    columnsPerRow.forEach((column) => {
      // if the current column contains a widget, load it
      if (column.widget && column.widget.name) {
        column.component = defineAsyncComponent(() => {
          return widgetLoader(column.widget.name, column.widget.face);
        });
      }
    });
    // add compiled columns to row
    rows.value.push(columnsPerRow);
  }
};

const gridColumnsCountSubscriber$ = $store
  .select((state) => state.currentPage.grid.columns)
  .subscribe((val) => {
    gridColumnsCount.value = val;
    if (rows.value.length > 0) {
      handleRows();
    }
  });
const slotSubscriber$ = $store
  .select((state) => state.currentPage.slots)
  .subscribe((val) => {
    gridSlots.value = val;
    if (rows.value.length > 0) {
      handleRows();
    }
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

onMounted(() => {
  handleRows();
});
onUnmounted(() => {
  slotSubscriber$.unsubscribe();
  gridColumnsCountSubscriber$.unsubscribe();
  gridTypeSubscriber$.unsubscribe();
  gridItemSubscriber$.unsubscribe();
});
const getSlotClass = (slot) => {
  if (!slot) return "";
  return slot && slot.column ? slot.column : "";
};
</script>
