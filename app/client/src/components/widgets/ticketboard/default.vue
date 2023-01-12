// TODO rework this mess
<template>
  <v-container
    v-if="state && props.uuid && boardCount > 0"
    fluid
    pa-0
    data-test-container="widgets/ticketboard/default"
    :data-test-container-uuid="props.uuid"
  >
    <div class="ticketContainer">
      <table
        class="ticketTable"
        v-if="tickets"
        :style="{ width: boardCount * colWidth + 'px' }"
      >
        <tbody v-if="boardIdentifiers.length > 0">
          <tr valign="top">
            <td v-if="tickets.generics.open">
              <ticket-item
                :width="colWidth"
                :identifiers="boardIdentifiers"
                :sorting="state.filter.sorting.open"
                :uuid="props.uuid"
                boardId="open"
                :column="tickets.generics.open"
                :data="data"
              />
            </td>
            <draggable
              :list="tickets.sorting.boards"
              item-key="id"
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
                  <ticket-item
                    :width="colWidth"
                    :identifiers="boardIdentifiers"
                    :uuid="props.uuid"
                    :boardId="element"
                    :sorting="state.filter.sorting[element]"
                    :column="tickets.custom[element]"
                    :data="data"
                  />
                </td>
              </template>
            </draggable>

            <td v-if="tickets.generics.closed">
              <ticket-item
                :width="colWidth"
                :identifiers="boardIdentifiers"
                :uuid="props.uuid"
                boardId="closed"
                :sorting="state.filter.sorting.closed"
                :column="tickets.generics.closed"
                :data="data"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    {{ tickets.sorting }}
  </v-container>
</template>
<script setup>
import { inject, ref, shallowRef, onMounted, onUnmounted, computed } from "vue";
import draggable from "vuedraggable";
import ticketItem from "./items/ticketCard.vue";
import { splitIdentifier, filterData } from "./lib/helper.js";
import { difference } from "ramda";
const $store = inject("$store");
const $t = inject("$t");
const state = ref({});
const data = ref({});
// a list of all the tag names used as boards to make sure we can detect the board changes properly in the ticketCards
const boardIdentifiers = ref([]);
const boardCount = shallowRef(0);
const dragging = shallowRef(false);
const windowWidth = shallowRef(window.innerWidth);
const colWidth = computed(() => (windowWidth.value > 700 ? 300 : 200));
const tickets = ref({
  generics: {},
  custom: {},
  sorting: {
    boards: [],
  },
});
const subscriber$ = [];
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
});

const makeTickets = function (data) {
  console.warn("makeTicketsCalled");
  const filter = state.value.filter;
  if (filter) {
    if (filter.sorting) {
      // get the current sorting object if there is any. If so, clone it
      tickets.value.sorting = JSON.parse(JSON.stringify(filter.sorting));
    } else {
      tickets.value.sorting.boards = [];
    }
    filter.generics.forEach((gen) => {
      if (gen.title) {
        // create ticket object for generic open/closed, no column sorting here
        tickets.value.generics[gen.title] = {};
        tickets.value.generics[gen.title].tickets = filterData(
          splitIdentifier(gen.identifier),
          gen.excluded,
          data
        );
        tickets.value.generics[gen.title].title = $t(`generics.${gen.title}`);
        tickets.value.generics[gen.title].id = gen.title;
        tickets.value.generics[gen.title].color = gen.color || "grey";
        if (tickets.value.sorting[gen.title]) {
          // if we have a sorting store, make sure its still u2date
          if (
            tickets.value.sorting[gen.title].length >
            tickets.value.generics[gen.title].tickets.length
          ) {
            // we have items in sorting which dont exist in ticket selection
            const itemsToRemove = difference(
              tickets.value.sorting[gen.title],
              tickets.value.generics[gen.title].tickets
            );
            itemsToRemove.forEach((itemUUID) => {
              tickets.value.sorting[gen.title].splice(
                tickets.value.sorting[gen.title].indexOf(itemUUID),
                1
              );
            });
          }
          if (
            tickets.value.generics[gen.title].tickets.length >
            tickets.value.sorting[gen.title].length
          ) {
            // we have new items which are not in sorting
            const itemsToAdd = difference(
              tickets.value.generics[gen.title].tickets,
              tickets.value.sorting[gen.title]
            );
            itemsToAdd.forEach((itemUUID) => {
              tickets.value.sorting[gen.title].unshift(itemUUID);
            });
          }
        } else {
          // if we have no sorting store, take the current order of the tickets as sorting
          tickets.value.sorting[gen.title] = tickets.value.generics[gen.title].tickets;
        }
      }
    });
    filter.custom.forEach((cus) => {
      const id = splitIdentifier(cus.identifier);
      if (data[id.val] && data[id.val].title) {
        // create ticket object for custom boards. Make them sortable
        tickets.value.custom[id.val] = {};
        tickets.value.custom[id.val].tickets = filterData(id, cus.excluded, data);
        tickets.value.custom[id.val].title = data[id.val].title;
        tickets.value.custom[id.val].id = data[id.val]._id;
        tickets.value.custom[id.val].color = data[id.val].color;
        // create sort object for all custom tickets
        if (tickets.value.sorting[id.val]) {
          if (
            tickets.value.sorting[id.val].length >
            tickets.value.custom[id.val].tickets.length
          ) {
            // we have items in sorting which dont exist in ticket selection
            const itemsToRemove = difference(
              tickets.value.sorting[id.val],
              tickets.value.custom[id.val].tickets
            );

            itemsToRemove.forEach((itemUUID) => {
              const index = tickets.value.sorting[id.val].indexOf(itemUUID);
              if (index > -1) {
                tickets.value.sorting[id.val].splice(index, 1);
              }
            });
          }
          if (
            tickets.value.custom[id.val].tickets.length >
            tickets.value.sorting[id.val].length
          ) {
            // we have new items which are not in sorting
            const itemsToAdd = difference(
              tickets.value.custom[id.val].tickets,
              tickets.value.sorting[id.val]
            );
            itemsToAdd.forEach((itemUUID) => {
              tickets.value.sorting[id.val].unshift(itemUUID);
            });
          }
        } else {
          tickets.value.sorting[id.val] = tickets.value.custom[id.val].tickets;
        }

        // create sort object for all custom boards
        if (tickets.value.sorting.boards.indexOf(id.val) === -1) {
          tickets.value.sorting.boards.push(id.val);
        }
      }
    });
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        filter: {
          sorting: JSON.parse(JSON.stringify(tickets.value.sorting)),
        },
      },
    });
  }
  boardIdentifiers.value = tickets.value.sorting.boards;
};
subscriber$.push(
  $store
    .select((state) => state.widgets[props.uuid])
    .subscribe((val) => {
      state.value = val;
    })
);
subscriber$.push(
  $store
    .select((state) => state.ui.windowWidth)
    .subscribe((val) => {
      windowWidth.value = val;
    })
);
const saveSorting = function () {
  // TODO maybe move the sort store to currentPage store instead of widget?
  $store.dispatch({
    type: "widgets/update",
    uuid: props.uuid,
    payload: {
      filter: {
        sorting: { boards: JSON.parse(JSON.stringify(tickets.value.sorting.boards)) },
      },
    },
  });
  dragging.value = false;
};
const handleGenericsExclude = function () {
  if (state.value.filter) {
    const newState = JSON.parse(JSON.stringify(state.value));
    const customIdentifiers = [];
    if (newState.filter.custom && newState.filter.custom.length > 0) {
      newState.filter.custom.forEach((ticketCol) => {
        customIdentifiers.push(ticketCol.identifier);
      });
    }
    if (newState.filter.generics && newState.filter.generics.length > 0) {
      newState.filter.generics.forEach((genericTicketCol) => {
        if (!genericTicketCol.excluded) {
          genericTicketCol.excluded = [];
        }
        customIdentifiers.forEach((identifier) => {
          if (genericTicketCol.excluded.indexOf(identifier) === -1) {
            genericTicketCol.excluded.push(identifier);
          }
        });
      });
    }
    boardCount.value = newState.filter.generics.length + newState.filter.custom.length;
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        filter: {
          generics: newState.filter.generics,
        },
      },
    });
  }
};

onMounted(() => {
  handleGenericsExclude();
  subscriber$.push(
    $store
      .select((state) => state.data)
      .subscribe((val) => {
        data.value = val;
        makeTickets(val);
      })
  );
});
onUnmounted(() => {
  $store.helper.unSubscribeAll(subscriber$);
});
</script>
<style lang="css" scoped>
.ticketContainer {
  overflow-x: auto;
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
