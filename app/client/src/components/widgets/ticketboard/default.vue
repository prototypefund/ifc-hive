<template>
  <v-container v-if="state && props.uuid" fluid pa-0 data-test-container="widgets/ticketboard/default"
    :data-test-container-uuid="props.uuid">
    <div class="ticketContainer">
      <table class="ticketTable" v-if="boards.generics.open"
        :style="{ width: boards.customBoardSort + 2 * colWidth + 'px' }">
        <tbody>
          <tr valign="top">
            <td v-if="boards.generics.open">
              <pre>
              {{ items.open }}
              </pre>
            </td>
            <td v-for="boardId in boards.customBoardSort">
              <pre>
              {{ items[boardId] }}
              </pre>
            </td>
            <td v-if="boards.generics.closed">
              <pre>
              {{ items.closed }}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>
<script setup>
import { inject, ref, onMounted, computed, onUnmounted, shallowRef } from "vue";
import { splitIdentifier, basicStoreFilters } from "@lib/dataHelper.js";
import draggable from "vuedraggable";
import boardItem from "./items/lightBoard.vue";
const $store = inject("$store");
const state = ref({});
const boards = ref({
  generics: {
    open: false,
    closed: false,
  },
  custom: {},
  customBoardSort: [],
});
const items = ref({});
const customFilter = ref(false);
const windowWidth = shallowRef(window.innerWidth);
const colWidth = computed(() => (windowWidth.value > 700 ? 300 : 200));
const windowWidth$ = $store
  .select((state) => state.ui.windowWidth)
  .subscribe((val) => {
    windowWidth.value = val;
  });
const props = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_ticketboard";
    },
  },
});
const addWithoutDuplicate = (sourceList, targetList = []) => {
  if (Array.isArray(sourceList)) {
    sourceList.forEach((entry) => {
      if (targetList.indexOf(entry) === -1) {
        targetList.push(entry);
      }
    });
  } else {
    if (targetList.indexOf(sourceList) === -1) {
      targetList.push(sourceList);
    }
  }
};
const queryUpdateHook = (newContent, oldContent) => {
  // here we receive the old and new query contents, containing a list of uuids and the corresponding dataObjects.
  console.dir(boards.value);
  console.dir(items.value);
  // lets now go through our boards we determined earlier and use our store filter to find the dataItems we want to see in there
};
const getRelevantData = (filter) => {
  // TODO document the data helper functions once you know how you want them.
  // For now there is a updateHook function in "$store.$data.get" and a hook condition which is either "all" so it fires whenever data is updated or
  // "count" which makes it fire whenever the uuid count for your query result changes -> use this when you subscribe individually to the uuids you've received

  // when we have to setup our data set, it might be wise to create our sorting targets first
  createBoardLists(filter);
  Object.keys(boards.value.generics).forEach((boardId) => {
    const board = boards.value.generics[boardId];
    // create a new query for each configured board, we will handle sorting in the hook
    // create a unique action id corresponding with the component and the board identifier
    items.value[boardId] = {
      tickets: $store.$data.get(
        props.actionId + "_" + boardId,
        "ALL",
        {
          identifier: board.identifier,
          excluded: board.excluded,
        },
        queryUpdateHook,
        "count"
      ),
    };
    // TODO make this configurable and storable
    items.value[boardId].customTicketSort = items.value[boardId].tickets.uuids;
  });
  Object.keys(boards.value.custom).forEach((boardId) => {
    const board = boards.value.custom[boardId];
    items.value[boardId] = {
      tickets: $store.$data.get(
        props.actionId + "_" + boardId,
        "ALL",
        {
          identifier: board.identifier,
          excluded: board.excluded,
        },
        queryUpdateHook,
        "count"
      ),
    };
    // TODO make this configurable and storable
    items.value[boardId].customTicketSort = items.value[boardId].tickets.uuids;
  });
};
const createBoardLists = (filter) => {
  const openExclude = [];
  // for generics we always assume 0 to be open and 1 to be closed

  if (filter.custom.length > 0) {
    filter.custom.forEach((cus) => {
      // TODO make this more dynamic maybe?
      // For now we always assume the identifier here to be just one tag
      const identifier = splitIdentifier(cus.identifier);
      openExclude.push(cus.identifier[0]);
      boards.value.custom[identifier.tags[0]] = {
        title: identifier.tags[0],
        boardId: identifier.tags[0],
        identifier: cus.identifier,
        excluded: cus.excluded,
      };
    });
  }
  boards.value.generics = {
    open: {
      title: filter.generics.open.title,
      boardId: filter.generics.open.title,
      identifier: filter.generics.open.identifier,
      excluded: filter.generics.open.excluded.concat(openExclude),
    },
    closed: {
      title: filter.generics.closed.title,
      boardId: filter.generics.closed.title,
      identifier: filter.generics.closed.identifier,
      excluded: filter.generics.closed.excluded,
    },
  };
  boards.value.customBoardSort = Object.keys(boards.value.custom);
};
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
    if (!customFilter.value || (val.filter && val.filter !== customFilter.value)) {
      // Whenever our filters change we will simply rebuild the whole board context as it must be a grave data update from the serverside or the user widget config editor
      getRelevantData(val.filter);
    }
  });
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  windowWidth$.unsubscribe();
  // unsubscribe from all our board queries when we leave
  Object.keys(boards.value.generics).forEach((boardId) => {
    items.value[boardId].unsubscribe();
  });
  Object.keys(boards.value.custom).forEach((boardId) => {
    items.value[boardId].unsubscribe();
  });
});
</script>
<style lang="css" scoped>
.ticketContainer {
  overflow: auto;
}

.list-group td {
  padding: 0 10px;
}

.ticketTable {
  max-width: 20000px !important;
}

.ticketTable td {
  height: 1px;
  min-height: 1px;
}

.ticketTable .v-table__wrapper {
  overflow: hidden !important;
}
</style>
