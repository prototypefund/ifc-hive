<template>
  <GridType>
    <v-row v-if="editMode">
      <v-col cols="4">
        <v-select :items="colCounts" v-model="colCount" label="Column Count"></v-select>
      </v-col>
      <v-col cols="4">
        <v-select :items="gridTypes" v-model="gridType" label="Grid Type"></v-select>
      </v-col>
      <v-col cols="4">
        <v-select :items="gridItems" v-model="gridItem" label="Grid Item"></v-select>
      </v-col>
    </v-row>
    <v-row no-gutters v-for="row in rows">
      <v-col
        v-for="column in row"
        :class="getSlotClass(column) + ' ' + getColClass(column)"
        v-if="row"
      >
        <GridItem>
          <template v-slot:header>
            <Resizer
              v-if="editMode"
              type="widgets"
              :columnClass="column.column"
              :columnIndex="column.slot"
              :uuid="column.widget.uuid"
              @changeColCount="changeColCount"
            >
            </Resizer>
          </template>
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
  computed,
} from "vue";
import draggable from "vuedraggable";
import { gridTypeLoader, gridItemLoader } from "@lib/gridLoader";
import Resizer from "./widgetToolBar.vue";
import widgetLoader from "@lib/widgetLoader";
const $store = inject("$store");
const gridColumnsCount = shallowRef();
const gridSlots = ref();
const currentPage = ref({});
const editMode = shallowRef(false);
const rows = shallowRef([]);
const GridType = shallowRef();
const GridItem = shallowRef();

const colCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const gridTypes = ["card", "default", "dark"];
const gridItems = ["card_flat", "card", "default"];

const currentPageSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    currentPage.value = val;
  });

const handleRows = () => {
  // always start with empty rows
  rows.value = [];
  // get row count
  const rowCount = Math.ceil(gridSlots.value.length / gridColumnsCount.value);
  // clone slots so we can splice off that object
  const slotClone = JSON.parse(JSON.stringify(gridSlots.value));
  slotClone.forEach((slot, index) => {
    slot.slot = index;
  });
  // TODO find out why the resizer is not rerendered on row update -> needed for select dropdown positioning
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

const gridItem = computed({
  get() {
    return currentPage.value.grid.items;
  },
  set(newValue) {
    gridUpdater({
      items: newValue,
    });
  },
});
const gridType = computed({
  get() {
    return currentPage.value.grid.type;
  },
  set(newValue) {
    gridUpdater({
      type: newValue,
    });
  },
});
const colCount = computed({
  get() {
    return currentPage.value.grid.columns;
  },
  set(newValue) {
    gridUpdater({
      columns: newValue,
    });
  },
});

const editModeSubscriber$ = $store
  .select((state) => state.ui.editMode)
  .subscribe((val) => {
    editMode.value = val;
  });

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

const gridUpdater = (grid) => {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      grid,
    },
  });
};

const changeColCount = (newClass, column) => {
  const gridClone = JSON.parse(JSON.stringify(gridSlots.value));
  gridClone[column].column = newClass;
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      slots: gridClone,
    },
  });
};
onMounted(() => {
  handleRows();
});
onUnmounted(() => {
  editModeSubscriber$.unsubscribe();
  slotSubscriber$.unsubscribe();
  gridColumnsCountSubscriber$.unsubscribe();
  gridTypeSubscriber$.unsubscribe();
  gridItemSubscriber$.unsubscribe();
  currentPageSubscriber$.unsubscribe();
});
const getSlotClass = (slot) => {
  if (!slot) return "";
  return slot && slot.class ? slot.class : "";
};
const getColClass = (slot) => {
  if (!slot) return "";
  return slot && slot.column ? "v-col-" + slot.column : "";
};
</script>
