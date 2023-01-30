<template>
  <v-card
    :color="boardItem._source.color"
    v-if="boardItem"
    :style="{ width: props.width + 'px', height: '100%' }"
    class="ticketWrapperCard"
    :prepend-icon="props.generic ? 'false' : 'mdi-drag'"
    data-test-container="widgets/ticketboard/items/board"
    :data-test-container-uuid="props.uuid"
  >
    <template v-slot:title v-if="props.boardId !== 'open' && props.boardId !== 'closed'">
      <QuickListHandler
        uuid="quickList"
        :docUUID="props.boardId.split('_')[1]"
        :dataTitle="props.boardId.split('_')[1]"
        tab-type="tag"
        action="add"
      >
        {{ boardItem._title }}
      </QuickListHandler>
    </template>
    <template v-slot:title v-else>
      {{ boardItem._title }}
    </template>
    <draggable
      v-if="documents.uuids.length > 0"
      v-model="tickets"
      item-key="_id"
      class="list-group"
      ghost-class="ghost"
      @start="dragging = true"
      @end="dragging = false"
      handle=".ticketItem.v-card>.v-card-item>.v-card-item__prepend"
      :group="{ name: 'ticketSort', pull: ['ticketSort'], put: ['ticketSort'] }"
    >
      <template #item="{ element }">
        <ticket-item :widgetUUID="props.widgetUUID" :docUUID="element._id" :props="{}" />
      </template>
    </draggable>
  </v-card>
</template>
<script setup>
import { inject, ref, computed, onMounted, onUnmounted, shallowRef } from "vue";
import { difference } from "ramda";
import QuickListHandler from "@w/quickList/handler.vue";
import draggable from "vuedraggable";
import ticketItem from "./ticket.vue";
const $store = inject("$store");
const dragging = shallowRef(false);
const boardItem = ref({});
let boardItemSubscriber$ = {};
const documents = ref(
  $store.$data.get(props.actionId, "ALL", {
    identifier: props.identifier,
    excluded: props.excluded,
  })
);
const props = defineProps({
  widgetUUID: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 300,
  },
  generic: {
    type: Boolean,
    default: false,
  },
  boardId: {
    type: String,
    required: true,
  },
  excluded: {
    type: Object,
    default: [],
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_ticketboard_board_" + rawProps.boardId;
    },
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_ticketboardALL";
    },
  },
});

if (!props.generic) {
  // get the item represented by this board
  boardItemSubscriber$ = $store
    .select((state) => state.data[props.identifier.split(":")[1]])
    .subscribe((val) => {
      boardItem.value = val;
    });
} else {
  boardItemSubscriber$.unsubscribe = () => {};
  // we are generic so we don't have a document which is represented by this board, so let's fake one instead
  boardItem.value = {
    _title: props.identifier.split(":")[0],
    _source: {
      color: "#332B00",
    },
  };
}

const tickets = computed({
  get() {
    const tickets = [];
    documents.value.uuids.forEach((uuid) => {
      tickets.push({
        _id: uuid,
      });
    });
    return tickets;
  },
  set(newVal) {
    const newTickets = [];
    const updateObj = {};
    const action = {
      add_tags: [],
      remove_tags: [],
    };
    // reflatten our newVal object to make a proper comparison
    newVal.forEach((val) => newTickets.push(val._id));
    debugger;
    if (documents.value.uuids.length < newTickets.length) {
      const ticketsToEdit = difference(newTickets, documents.value.uuids);
      ticketsToEdit.forEach((ticket) => {
        action.remove_tags = [];
        if (props.excluded.length > 0) action.remove_tags = props.excluded;
        if (props.identifier === "closed:true") {
          updateObj.closed = true;
        } else if (props.identifier === "closed:false") {
          updateObj.closed = false;
        } else {
          action.add_tags = [props.identifier.split(":")[1]];
        }
      });
    }
  },
});
onMounted(() => {});
onUnmounted(() => {
  documents.unsubscribe();
  boardItemSubscriber$.unsubscribe();
});
</script>
