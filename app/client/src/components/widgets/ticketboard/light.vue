<template>
  <v-container
    v-if="state && props.uuid"
    fluid
    pa-0
    data-test-container="widgets/ticketboard/default"
    :data-test-container-uuid="props.uuid"
  >
    <div class="ticketContainer" v-if="boards">
      <table
        class="ticketTable"
        v-if="boards.generics && boards.generics.length > 1"
        :style="{
          width: boards.generics.length + boards.custom.length * colWidth + 'px',
        }"
      >
        <tbody>
          <tr valign="top">
            <td v-if="boards.generics[0]">
              <board-item
                :width="colWidth"
                :widgetUUID="props.uuid"
                :boardId="boards.generics[0].boardId"
                :identifier="boards.generics[0].identifier"
                :excluded="boards.generics[0].excluded"
                generic
              />
            </td>
            <draggable
              v-model="boards.custom"
              item-key="boardId"
              class="list-group"
              ghost-class="ghost"
              @start="dragging = true"
              handle=".v-card>.v-card-item>.v-card-item__prepend"
              :group="{
                name: 'ticketBoardSort',
                pull: ['ticketBoardSort'],
                put: ['ticketBoardSort'],
              }"
              @end="saveSorting"
            >
              <template #item="{ element }">
                <td>
                  <board-item
                    :width="colWidth"
                    :widgetUUID="props.uuid"
                    :boardId="element.boardId"
                    :identifier="element.identifier"
                    :excluded="element.excluded"
                  />
                </td>
              </template>
            </draggable>

            <td v-if="boards.generics[1]">
              <board-item
                :width="colWidth"
                :widgetUUID="props.uuid"
                :boardId="boards.generics[1].boardId"
                :identifier="boards.generics[1].identifier"
                :excluded="boards.generics[1].excluded"
                generic
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>
<script setup>
import { inject, ref, onMounted, computed, onUnmounted, shallowRef } from "vue";
import draggable from "vuedraggable";
import boardItem from "./items/lightBoard.vue";
const $store = inject("$store");
const state = ref({});
const windowWidth = shallowRef(window.innerWidth);
const boards = ref({});
const dragging = shallowRef(false);
const colWidth = computed(() => (windowWidth.value > 700 ? 300 : 200));
const windowWidth$ = $store
  .select((state) => state.ui.windowWidth)
  .subscribe((val) => {
    windowWidth.value = val;
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
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_ticketboardALL";
    },
  },
});
const saveSorting = function (event) {
  $store.dispatch({
    type: "widgets/update",
    uuid: props.uuid,
    payload: {
      filter: JSON.parse(JSON.stringify(boards.value)),
    },
  });
  dragging.value = false;
};
const makeBoards = (initialSort) => {
  const identifierReplace = /[:;.]/;
  if (state.value.filter) {
    // clone fiter object for latter manipulation
    const filter = JSON.parse(JSON.stringify(state.value.filter));
    if (filter.custom && filter.custom.length > 0) {
      filter.generics.forEach((gen) => {
        gen.boardId = gen.identifier.replace(identifierReplace, "_");
        // create an excluded array for the identifier or the custom boards, so they don't show up
        if (!gen.excluded) gen.excluded = [];
        filter.custom.forEach((cus) => {
          gen.excluded.push(cus.identifier);
        });
      });
      filter.custom.forEach((cus) => {
        // create an excluded array for the identifier or the other custom boards, so they don't show up
        if (!cus.excluded) cus.excluded = [];
        filter.custom.forEach((otherCus) => {
          // add to each custom board the identifiers from the others as excluded
          if (cus.identifier !== otherCus.identifier) {
            cus.boardId = cus.identifier.replace(identifierReplace, "_");
            //cus.excluded.push(otherCus.identifier);
          }
        });
      });
    }
    boards.value = filter;
    // store our current filter set
    if (initialSort) {
      $store.dispatch({
        type: "widgets/update",
        uuid: props.uuid,
        payload: {
          filter,
        },
      });
    } else {
    }
  }
};

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
    makeBoards(false);
  });
onMounted(() => {
  makeBoards(true);
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  windowWidth$.unsubscribe();
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
