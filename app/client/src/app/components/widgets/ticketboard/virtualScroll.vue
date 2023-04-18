<template>
  <v-container v-if="state && props.uuid" fluid pa-0 data-test-container="widgets/ticketboard/virtualScroll"
    :data-test-container-uuid="props.uuid">
    <div class="ticketContainer">
      <table class="ticketTable" v-if="boards.generics.open">
        <tbody>
          <tr valign="top">
            <td v-if="boards.generics.open">
              <board-item :widgetUUID="props.uuid" boardId="open" :generic="true"
                :boardItem="{ _source: { _title: 'open', color: 'white' } }" :width=300>
                <template v-slot:tickets="{ boardId }">
                  <DynamicScroller page-mode class="scroller" :items="boards.generics.open.query.vScrollItems"
                    :min-item-size="50" key-field="docUUID">
                    <template v-slot="{ item, index, active }">
                      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
                        <ticket-item :key="boardId_ + '_' + item.docUUID" :widgetUUID="props.uuid" :boardId="boardId"
                          :ticketItemId="item.docUUID" />
                      </DynamicScrollerItem>
                    </template>
                  </DynamicScroller>
                </template>
              </board-item>
            </td>
            <td v-for="board in boards.custom" :key="board.tagUUID">
              <board-item :widgetUUID="props.uuid" :boardId="board.tagUUID" :generic="false" :width=300>
                <template v-slot:tickets="{ boardId }">
                  <DynamicScroller page-mode class="scroller" :items="board.query.vScrollItems" :min-item-size="50"
                    key-field="docUUID">
                    <template v-slot="{ item, index, active }">
                      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
                        <ticket-item :key="boardId_ + '_' + item.docUUID" :widgetUUID="props.uuid" :boardId="boardId"
                          :ticketItemId="item.docUUID" />
                      </DynamicScrollerItem>
                    </template>
                  </DynamicScroller>
                </template>
              </board-item>

            </td>
            <td v-if="boards.generics.closed">
              <board-item :widgetUUID="props.uuid" boardId="closed" :generic="true"
                :boardItem="{ _source: { _title: 'closed', color: 'black' } }" :width=300>
                <template v-slot:tickets="{ boardId }">
                  <DynamicScroller page-mode class="scroller" :items="boards.generics.closed.query.vScrollItems"
                    :min-item-size="50" key-field="docUUID">
                    <template v-slot="{ item, index, active }">
                      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
                        <ticket-item :key="boardId_ + '_' + item.docUUID" :widgetUUID="props.uuid" :boardId="boardId"
                          :ticketItemId="item.docUUID" />
                      </DynamicScrollerItem>
                    </template>
                  </DynamicScroller>
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
import { clone } from "ramda"
import boardItem from "./items/board.vue";
import ticketItem from "./items/ticket.vue";
// just qol object to make the unsubscribing in unmount easier
const querySubscriber = {}
const $store = inject("$store");
const state = ref({});
const boards = ref({
  generics: {
    open: false,
    closed: false,
  },
  custom: {},
});
const items = ref({});

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

// METHODS
const createBoardByTagQuery = (_queryObj, searchTag, tagsExclude) => {
  const queryObj = clone(_queryObj)
  queryObj.params.query = {
    must: {
      term: {
        tag: searchTag
      }
    },
    must_not: {
      term: {
        tags: tagsExclude
      }
    }
  }
  return queryObj
}
const createBoardByStateQuery = (_queryObj, stateAttribute, stateValue, tagsExclude) => {
  const queryObj = clone(_queryObj)
  queryObj.params.query = {
    must_not: {
      term: {
        tags: tagsExclude
      }
    },
    must: {}
  }
  queryObj.params.query.must[stateAttribute] = stateValue
  return queryObj
}
const setupCustomBoards = (customBoards, genericBoards) => {
  if (customBoards.length === 0) return []
  const boards = {}
  customBoards.forEach(_board => {
    const board = clone(_board)
    // create a list of all the other custom board tagUUIDS which we want to exclude from the result for this specific ticket board
    const excludeTags = customBoards.filter(otherBoard => otherBoard.tagUUID != board.tagUUID).map(item => item.tagUUID)

    // create a proper queryObject for our search term and our exclude list
    board.query = createBoardByTagQuery(board.query, board.tagUUID, excludeTags)
    board.query = querySubscriber[board.tagUUID] = $store.$data.get(
      props.actionId + "_" + board.tagUUID,
      board.query.target,
      board.query.params
    )
    boards[board.tagUUID] = board
  })
  return boards
}
const setupGenericBoards = (_genericBoards, customBoards) => {
  const genericBoards = clone(_genericBoards)
  const excludeTags = Object.keys(customBoards)
  genericBoards.open.query = createBoardByStateQuery(genericBoards.open.query, 'closed', false, excludeTags)
  genericBoards.open.query = querySubscriber.open = $store.$data.get(
    props.actionId + "_open",
    genericBoards.open.query.target,
    genericBoards.open.query.params
  )
  genericBoards.closed.query = createBoardByStateQuery(genericBoards.closed.query, 'closed', true, excludeTags)
  genericBoards.closed.query = querySubscriber.closed = $store.$data.get(
    props.actionId + "_closed",
    genericBoards.closed.query.target,
    genericBoards.closed.query.params
  )
  return genericBoards
}


const setupBoards = () => {
  boards.value.custom = setupCustomBoards(state.value.filter.custom || [], state.value.filter.generics)
  boards.value.generics = setupGenericBoards(state.value.filter.generics, boards.value.custom || [])
}

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
    setupBoards()
  });

onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  // unsubscribe from all query listeners 
  Object.keys(querySubscriber).forEach(subscriberKey => {
    const subscriber$ = querySubscriber[subscriberKey].value
    subscriber$.unsubscribe()
  })
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
}</style>
