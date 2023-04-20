<template>
  <v-container v-if="state && props.uuid" fluid class="primary fill-height" pa-0
    data-test-container="widgets/ticketboard/virtualScroll" :data-test-container-uuid="props.uuid">
    <div class="ticketContainer">
      <v-table class="ticketTable">
        <tbody>
          <tr valign="top" v-if="boards.generics">
            <td v-if="boards.generics.open">
              <board-item :widgetUUID="props.uuid" boardId="open" :generic="true"
                :boardItem="{ _source: { _title: 'open', color: 'white' } }" :width=boardWidth>
                <template v-slot:tickets="{ boardId }">
                  <DynamicScroller page-mode class="scroller" :items="boards.generics.open.vScrollItems"
                    :min-item-size="ticketHeight" key-field="docUUID">
                    <template v-slot="{ item, index, active }">
                      <DynamicScrollerItem :item="item" :active="active" :data-index="index" class="ticketDrag">
                        <ticket-item :key="boardId + '_' + item.docUUID" :widgetUUID="props.uuid" :boardId="boardId"
                          :ticketItemId="item.docUUID" />
                      </DynamicScrollerItem>
                    </template>
                  </DynamicScroller>
                </template>
              </board-item>
            </td>
            <td v-for="board in boards.custom" :key="board.tagUUID">
              <board-item :widgetUUID="props.uuid" :boardId="board.tagUUID" :generic="false" :width=boardWidth>
                <template v-slot:tickets="{ boardId }">
                  <DynamicScroller page-mode class="scroller" :items="board.vScrollItems" :min-item-size="ticketHeight"
                    key-field="docUUID">
                    <template v-slot="{ item, index, active }">
                      <DynamicScrollerItem :item="item" :active="active" :data-index="index" class="ticketDrag">
                        <ticket-item :key="boardId + '_' + item.docUUID" :widgetUUID="props.uuid" :boardId="boardId"
                          :ticketItemId="item.docUUID" />
                      </DynamicScrollerItem>
                    </template>
                  </DynamicScroller>
                </template>
              </board-item>
            </td>
            <td v-if="boards.generics.closed">
              <board-item :widgetUUID="props.uuid" boardId="closed" :generic="true"
                :boardItem="{ _source: { _title: 'closed', color: 'black' } }" :width=boardWidth>
                <template v-slot:tickets="{ boardId }">
                  <DynamicScroller page-mode class="scroller" :items="boards.generics.closed.vScrollItems"
                    :min-item-size="ticketHeight" key-field="docUUID">
                    <template v-slot="{ item, index, active }">
                      <DynamicScrollerItem :item="item" :active="active" :data-index="index" class="ticketDrag">
                        <ticket-item :key="boardId + '_' + item.docUUID" :widgetUUID="props.uuid" :boardId="boardId"
                          :ticketItemId="item.docUUID" />
                      </DynamicScrollerItem>
                    </template>
                  </DynamicScroller>
                </template>doing
              </board-item>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>
<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
import { getFullItem } from "@lib/dataHelper.js";
import { VueDraggable } from 'vue-draggable-plus'
import { clone } from "ramda"
import boardItem from "./items/board.vue";
import ticketItem from "./items/ticket.vue";
// just qol object to make the unsubscribing in unmount easier
const querySubscriber = {}
const boardWidth = 300;
const ticketHeight = 400;
const $store = inject("$store");
const state = ref({});

const boards = ref({
  generics: {
    open: false,
    closed: false,
  },
  custom: {},
});
const drag = ref(false)
const ticketDrag = {
  name: 'ticketSort',
  pull: 'ticketSort',
  put: 'ticketSort'
}
const draggableDirectiveConf = {
  animation: 150,
  el: '.ticketDrag',
  target: '.ticketDrag',
  group: ticketDrag,
  ghostClass: "ghost",
  handle: ".mdi-drag",
  sort: false,
}

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

const customVScrollItems = board => {
  return {
    get() {
      return items.value.query.vScrollItems.filter(item => {
        const fullItem = getFullItem(item.docUUID)
        // if the item does not have the tag we are looking for or is already closed, exit
        if (fullItem._source.tags.indexOf(board.tags) === -1 || fullItem._source.closed === true) return false
        return true
      })
    },
    set(newValue) {
      debugger
    },
  }

}
const genericVScrollItems = board => {
  return {
    get() {
      return items.value.query.vScrollItems.filter(item => {
        const fullItem = getFullItem(item.docUUID)
        // if the item's closed attribute has a different value as the one we are looking for, exit
        if (fullItem._source.closed != board.closed) return false
        // now make sure we just display tickets in that generic board which are not already tagged with a state from the whole ticketboard we are in atm
        let result = true
        // if we have no excludes, return our item
        if (!board.exclude) return result
        // find out if we have to exclude it from display
        fullItem._source.tags.forEach(itemTag => {
          if (board.exclude.indexOf(itemTag) > -1) {
            result = false
          }
        })
        return result

      })
    },
    set(newValue) {
      debugger
    },
  }
}
// METHODS
const getRelevantData = _query => {
  const query = clone(_query)
  return $store.$data.get(
    props.actionId + '_allRelevantTickets',
    query.target,
    query.params
  )
}
const setupTicketItemQuery = (_query, customBoards, genericBoards, excluded) => {
  const includeTags = Object.keys(customBoards)
  const query = clone(_query)
  query.params.query = {
    must: {
      term: {
        tags: includeTags
      }
    }
  }
  if (excluded.length > 0) {
    query.params.query.must_not = {
      term: {
        tags: clone(excluded)
      }
    }
  }
  return query
}
const setupCustomBoards = (customBoards, genericBoards) => {
  if (customBoards.length === 0) return []
  const boards = {}
  customBoards.forEach(_board => {
    const board = clone(_board)
    // create a list of all the other custom board tagUUIDS which we want to exclude from the result for this specific ticket board
    const excludeTags = customBoards.filter(otherBoard => otherBoard.tagUUID != board.tagUUID).map(item => item.tagUUID)
    board.query.exclude = excludeTags
    board.vScrollItems = computed(customVScrollItems(board.query))
    boards[board.tagUUID] = board
  })
  return boards
}
const setupGenericBoards = (_genericBoards, customBoards) => {
  const genericBoards = clone(_genericBoards)
  Object.keys(genericBoards).forEach(boardKey => {
    const board = genericBoards[boardKey]
    board.vScrollItems = computed(genericVScrollItems(board.query))
  })
  genericBoards.open.query.exclude = Object.keys(customBoards)
  return genericBoards
}


const setupBoards = () => {
  boards.value.custom = setupCustomBoards(state.value.filter.custom || [], state.value.filter.generics)
  boards.value.generics = setupGenericBoards(state.value.filter.generics, boards.value.custom || [])
  items.value.query = setupTicketItemQuery(state.value.filter.query, boards.value.custom, boards.value.generics, state.value.filter.excluded)
  items.value.query = querySubscriber.current = getRelevantData(items.value.query)
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

.scroller {
  height: 100%;
}
</style>
