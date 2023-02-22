<template>
  <v-container
    v-if="state && props.uuid"
    fluid
    pa-0
    data-test-container="widgets/ticketboard/default"
    :data-test-container-uuid="props.uuid"
  >
    <div class="ticketContainer">
      <table
        class="ticketTable"
        v-if="boards.generics.open"
        :style="{ width: boards.boardSort + 2 * colWidth + 'px' }"
      >
        <tbody>
          <tr valign="top">
            <td v-if="boards.generics.open">
              <board-item
                :widgetUUID="props.uuid"
                boardId="open"
                :generic="true"
                :boardItem="{ _title: 'open', color: 'white' }"
                :width="colWidth"
              >
                <template v-slot:title> open </template>
                <template v-slot:tickets="{ boardId }">
                  <draggable
                    item-key="id"
                    v-model="customSorting.tickets[boardId]"
                    class="list-group"
                    ghost-class="ghost"
                    @start="dragging = true"
                    @end="dragging = false"
                    handle=".ticketItem.v-card>.v-card-item>.v-card-item__prepend"
                    :group="{
                      name: 'ticketSort',
                      pull: ['ticketSort'],
                      put: ['ticketSort'],
                    }"
                  >
                    <template #item="{ element }">
                      <ticket-item
                        :tag-lookup="tagLookup"
                        :user-lookup="userLookup"
                        :widgetUUID="props.uuid"
                        :boardId="boardId"
                        :ticketItem="items[boardId].tickets.data[element]"
                      />
                    </template>
                  </draggable>
                </template>
              </board-item>
            </td>
            <draggable
              item-key="id"
              :list="customSorting.boards"
              class="list-group"
              ghost-class="ghost"
              @start="dragging = true"
              handle=".v-card>.v-card-item>.v-card-item__prepend"
              :group="{
                name: 'ticketBoardSort',
                pull: ['ticketBoardSort'],
                put: ['ticketBoardSort'],
              }"
              @end="dragging = false"
            >
              <template #item="{ element }">
                <td>
                  <board-item
                    :widgetUUID="props.uuid"
                    :boardId="element"
                    :generic="false"
                    :width="colWidth"
                    :boardItem="tagLookup.data[element] || { _title: element }"
                  >
                    <template v-slot:tickets="{ boardId }">
                      <draggable
                        item-key="id"
                        v-model="customSorting.tickets[boardId]"
                        class="list-group"
                        ghost-class="ghost"
                        @start="dragging = true"
                        @end="dragging = false"
                        handle=".ticketItem.v-card>.v-card-item>.v-card-item__prepend"
                        :group="{
                          name: 'ticketSort',
                          pull: ['ticketSort'],
                          put: ['ticketSort'],
                        }"
                      >
                        <template #item="{ element }">
                          <ticket-item
                            :tag-lookup="tagLookup"
                            :user-lookup="userLookup"
                            :widgetUUID="props.uuid"
                            :boardId="boardId"
                            :ticketItem="items[boardId].tickets.data[element]"
                          />
                        </template>
                      </draggable>
                    </template>
                  </board-item>
                </td>
              </template>
            </draggable>

            <td v-if="boards.generics.closed">
              <board-item
                :widgetUUID="props.uuid"
                boardId="closed"
                :boardItem="{ _title: 'closed', color: 'black' }"
                :generic="true"
                :width="colWidth"
              >
                <template v-slot:tickets="{ boardId }">
                  <draggable
                    item-key="id"
                    v-model="customSorting.tickets[boardId]"
                    class="list-group"
                    ghost-class="ghost"
                    @start="dragging = true"
                    @end="dragging = false"
                    handle=".ticketItem.v-card>.v-card-item>.v-card-item__prepend"
                    :group="{
                      name: 'ticketSort',
                      pull: ['ticketSort'],
                      put: ['ticketSort'],
                    }"
                  >
                    <template #item="{ element }">
                      <ticket-item
                        :tag-lookup="tagLookup"
                        :user-lookup="userLookup"
                        :widgetUUID="props.uuid"
                        :boardId="boardId"
                        :ticketItem="items[boardId].tickets.data[element]"
                      />
                    </template>
                  </draggable>
                </template>
              </board-item>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>
<script setup>
  import { inject, ref, onMounted, computed, onUnmounted, shallowRef } from "vue";
  import { difference } from "ramda";
  import { splitIdentifier } from "@lib/dataHelper.js";
  import draggable from "vuedraggable";
  import boardItem from "./items/board.vue";
  import ticketItem from "./items/ticket.vue";
  const $store = inject("$store");
  const state = ref({});
  const tagLookup = $store.$data.get(props.actionId + "_ALL_TAGS", "ALL_TAGS");
  const userLookup = $store.$data.get(props.actionId + "_ALL_USER", "ALL_USER");
  // we could get the all lookup from the data of each board but I'm lazy as fuck and its late already!
  const allLookup = $store.$data.get(props.actionId + "_ALL", "ALL");
  const boards = ref({
    generics: {
      open: false,
      closed: false,
    },
    custom: {},
    boardSort: [],
  });
  const items = ref({});
  const customSorting = ref({ tickets: {}, boards: [] });
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
  const queryNewDataHook = (newData, oldData) => {
    if (oldData.uuids && newData.uuids) {
      // TODO add custom sorting for tickets: Thats the spot to make some custom and server side sorting merge magic happen
      if (oldData.uuids.length !== newData.uuids.length) {
        items.value[newData.params.receiver].ticketSort = newData.uuids;
      }
      // for now we don't have custom ticket sortings so we'll always override it with the new store order
      customSorting.value.tickets[newData.params.receiver] = newData.uuids;
    }
  };
  const handleTagSortingChange = (oldSorting, newSorting, boardId) => {
    if (newSorting.length > oldSorting.length) {
      // we have to change a status
      const uuidsForDocsToChange = difference(newSorting, oldSorting);
      // we have to remove all tags from this board and add the boardId we've got as param
      uuidsForDocsToChange.forEach((uuid) => {
        const docToUpdate = JSON.parse(JSON.stringify(allLookup.value.data[uuid]));
        const itemUpdateObj = {};

        if (boardId === "open" || boardId === "closed") {
          itemUpdateObj.closed = false;
          // we have to change the close attribute
          if (boardId === "open") {
            docToUpdate._source.closed = false;
          } else {
            docToUpdate._source.closed = true;
          }
          itemUpdateObj.closed = docToUpdate._source.closed;
        } else {
          // whenever we dropped something in neither open nor close, it's definitely open
          itemUpdateObj.closed = false;
        }
        itemUpdateObj.tags = [];
        // iterate all tags from the current document and remove all of the tags which are configured as status on this board
        docToUpdate._source.tags.forEach((tag) => {
          if (boards.value.boardSort.indexOf(tag) === -1) {
            itemUpdateObj.tags.push(tag);
          }
        });
        if (boardId !== "open" && boardId !== "closed") {
          itemUpdateObj.tags.push(boardId);
        }
        console.dir(itemUpdateObj);
        $store.dispatch({
          type: "data/update",
          docUUID: uuid,
          payload: itemUpdateObj,
        });
      });
    } else {
      // we have to change the custom sorting, for now we dont persist it
      oldSorting = newSorting;
    }
  };
  const handleBoardSortingChange = (oldSorting, newSorting) => {
    if (oldSorting.length !== newSorting.length) {
      // we had a change in board count?
      console.warn("on the fly changes of board counts are not supported atm");
    } else {
      // we have to change the custom sorting, for now we dont persist it
      oldSorting = newSorting;
    }
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
            receiver: boardId,
          },
          queryNewDataHook,
          "count"
        ),
      };
      // TODO make this configurable and storable
      items.value[boardId].ticketSort = items.value[boardId].tickets.uuids;
      customSorting.value.tickets[boardId] = computed({
        get() {
          return items.value[boardId].ticketSort;
        },
        set(newVal) {
          handleTagSortingChange(items.value[boardId].ticketSort, newVal, boardId);
        },
      });
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
            receiver: boardId,
          },
          queryNewDataHook,
          "count"
        ),
      };
      // TODO make this configurable and storable
      items.value[boardId].ticketSort = items.value[boardId].tickets.uuids;
      // create a computed var for our sorting
      customSorting.value.tickets[boardId] = computed({
        get() {
          return items.value[boardId].ticketSort;
        },
        set(newVal) {
          handleTagSortingChange(items.value[boardId].ticketSort, newVal, boardId);
        },
      });
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
        // we will add all custom boardIDs as exclude for our open board
        excluded: filter.generics.open.excluded.concat(openExclude),
      },
      closed: {
        title: filter.generics.closed.title,
        boardId: filter.generics.closed.title,
        identifier: filter.generics.closed.identifier,
        excluded: filter.generics.closed.excluded,
      },
    };
    boards.value.boardSort = Object.keys(boards.value.custom);
    customSorting.value.boards = computed({
      get() {
        return boards.value.boardSort;
      },
      set(newVal) {
        handleBoardSortingChange(boards.value.boardSort, newVal);
      },
    });
  };
  const stateSubscriber$ = $store
    .select((state) => state.widgets[props.uuid])
    .subscribe((val) => {
      if (val.filter && val.filter !== state.value.value) {
        // Whenever our filters change we will simply rebuild the whole board context as it must be a grave data update from the serverside or the user widget config editor
        getRelevantData(val.filter);
      }
      state.value = val;
    });

  onMounted(() => {});
  onUnmounted(() => {
    stateSubscriber$.unsubscribe();
    windowWidth$.unsubscribe();
    // unsubscribe from all our board queries when we leave
    Object.keys(boards.value.generics).forEach((boardId) => {
      if (items.value[boardId].tickets.unsubscribe) {
        items.value[boardId].tickets.unsubscribe();
      }
    });
    Object.keys(boards.value.custom).forEach((boardId) => {
      if (items.value[boardId].tickets.unsubscribe) {
        items.value[boardId].tickets.unsubscribe();
      }
    });
    tagLookup.value.unsubscribe();
    userLookup.value.unsubscribe();
    allLookup.value.unsubscribe();
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
