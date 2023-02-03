<template>
  <v-card :color="column.color" v-if="column" class="ticketWrapperCard"
    :prepend-icon="boardId == 'open' && boardId == 'closed' ? 'false' : 'mdi-drag'"
    data-test-container="widgets/ticketboard/items/ticketCard" :data-test-container-uuid="'ticketCard_' + props.uuid">
    <template v-slot:title v-if="boardId !== 'open' && boardId !== 'closed'">
      <QuickListHandler uuid="quickList" :docUUID="props.boardId" :dataTitle="props.boardId" tab-type="tag"
        action="add">
        {{ column.title }}
      </QuickListHandler>
    </template>
    <template v-slot:title v-else>
      {{ column.title }}
    </template>

    <draggable v-model="sorting" item-key="id" class="list-group" ghost-class="ghost" @start="dragging = true"
      @end="dragging = false" handle=".ticketItem.v-card>.v-card-item>.v-card-item__prepend"
      :group="{ name: 'ticketSort', pull: ['ticketSort'], put: ['ticketSort'] }">
      <template #item="{ element }">
        <v-card prepend-icon="mdi-drag" class="ticketItem" :elevation="isHovering === data[element]._id ? 12 : 2"
          :class="{ 'on-hover': isHovering === data[element]._id }" @mouseover="isHovering = data[element]._id"
          @mouseout="isHovering = false">
          <template v-slot:title>
            <QuickListHandler uuid="quickList" :docUUID="data[element]._id"
              :dataTitle="data[element]._source.title || data[element]._title" :tab-type="data[element]._type"
              action="add">
              <v-card-title>{{
                data[element]._source.title || data[element]._title
              }}</v-card-title>
            </QuickListHandler>
          </template>

          <v-card-subtitle>
            <v-row v-if="data[element]._source.tags && data[element]._source.tags.length > 0">
              <v-col cols="auto" v-for="tag in data[element]._source.tags">
                <v-chip size="small"
                  :color="data[tag] ? data[tag]._source.color || 'grey' : 'grey'">{{ data[tag]? data[tag]._source.title || tag : tag }}</v-chip>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-card-text> short description</v-card-text>
          <v-card-subtitle>
            <v-row>
              <v-col cols="auto" v-if="data[element]._source.created">
                <v-chip size="small" label text-color="white">
                  <v-icon start icon="mdi-calendar-plus"></v-icon>
                  {{ $d(data[element]._source.created, "short") }}
                  <v-tooltip activator="parent" location="end">
                    {{ $t("generics.created") }}
                  </v-tooltip>
                </v-chip>
              </v-col>
              <v-col cols="auto" v-if="data[element]._source.modified">
                <v-chip size="small" label text-color="white">
                  <v-icon start icon="mdi-calendar-edit"></v-icon>
                  {{ $d(data[element]._source.modified, "short") }}
                  <v-tooltip activator="parent" location="end">
                    {{ $t("generics.modified") }}
                  </v-tooltip>
                </v-chip>
              </v-col>
              <v-col cols="auto" v-if="data[element]._source.due">
                <v-chip size="small" label text-color="white">
                  <v-icon start icon="mdi-calendar-alert"></v-icon>
                  {{ $d(data[element]._source.due, "short") }}
                  <v-tooltip activator="parent" location="end">
                    {{ $t("generics.dueDate") }}
                  </v-tooltip>
                </v-chip>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-card-actions>
            <v-btn-group>
              <v-btn size="x-small" :append-icon="
                show !== `${data[element]._id}_overview`
                  ? 'mdi-chevron-left'
                  : 'mdi-chevron-down'
              " @click="handleShow(`${data[element]._id}_overview`)"><span
                  class="expandBtn d-inline-block text-truncate">{{
                    $t("generics.overview")
                  }}</span></v-btn>
              <v-btn size="x-small" v-if="data[element]._source.owner" :append-icon="
                show !== `${data[element]._id}_author`
                  ? 'mdi-chevron-left'
                  : 'mdi-chevron-down'
              " @click="handleShow(`${data[element]._id}_author`)"><span
                  class="expandBtn d-inline-block text-truncate">{{
                    $t("generics.author")
                  }}</span>
                <v-tooltip activator="parent" location="top">
                  <ticket-member-mouse-over :widgetUUID="props.widgetUUID" :docUUID="data[element]._source.owner" />
                </v-tooltip></v-btn>
              <v-btn size="x-small" v-if="data[element]._source.assigned" :append-icon="
                show !== `${data[element]._id}_assignee`
                  ? 'mdi-chevron-left'
                  : 'mdi-chevron-down'
              " @click="handleShow(`${data[element]._id}_assignee`)"><span
                  class="expandBtn d-inline-block text-truncate">{{
                    $t("generics.assignee")
                  }}</span>
                <v-tooltip activator="parent" location="top"><ticket-member-mouse-over :widgetUUID="props.widgetUUID"
                    :docUUID="data[element]._source.assigned" /> </v-tooltip></v-btn>
            </v-btn-group>
          </v-card-actions>
          <v-expand-transition>
            <ticket-member class="transition-fast-in-fast-out v-card--show"
              v-if="show == `${data[element]._id}_assignee`" :widgetUUID="props.widgetUUID"
              :docUUID="data[element]._source.assigned" />
            <ticket-member class="transition-fast-in-fast-out v-card--show" v-if="show == `${data[element]._id}_author`"
              :widgetUUID="props.widgetUUID" :docUUID="data[element]._source.owner" />
            <v-card v-if="show == `${data[element]._id}_overview`">
              <pre>{{ data[element] }}</pre>
            </v-card>
          </v-expand-transition>
        </v-card>
      </template>
    </draggable>
  </v-card>
</template>
<script setup>
import QuickListHandler from "@w/quickList/handler.vue";
import { shallowRef, computed, inject, defineAsyncComponent } from "vue";
import draggable from "vuedraggable";
import { difference } from "ramda";
const dragging = shallowRef(false);
const show = shallowRef(false);
const $store = inject("$store");
const isHovering = shallowRef(false);
const ticketMember = computed(() => {
  return defineAsyncComponent(() => import("@t/cards/user.vue"));
});
const ticketMemberMouseOver = computed(() => {
  return defineAsyncComponent(() => import("@t/listItems/user.vue"));
});
const sorting = computed({
  get() {
    return props.sorting;
  },
  set(val) {
    let data = false;
    if (props.sorting.length < val.length) {
      // we have to add a tag
      const itemsToUpdate = difference(val, props.sorting);
      data = [];
      itemsToUpdate.forEach((dataUuid) => {
        const isOpenClose = props.boardId === "open" || props.boardId === "closed";
        const dataItem = props.data[dataUuid];
        let closed = false;
        if (isOpenClose) {
          closed = props.boardId === "closed";
        }
        if (dataItem._source.tags) {
          const dataIndex = data.push(JSON.parse(JSON.stringify(dataItem))) - 1;
          props.identifiers.forEach((boardId) => {
            // our data item has tags, so everything went well here
            const tagIndex = dataItem._source.tags.indexOf(boardId);
            if (tagIndex >= 0) {
              // we found the tag which is the old ticket state, now lets clone it from pops and add it to the dataUpdate object,
              // remove it and add the new one from this board
              data[dataIndex]._source.tags.splice(tagIndex, 1);
              // make sure we close or open them. This is hardcoded for now
              // todo maybe implement this configurable via the generics config
              if (props.boardId === "open") {
                data[dataIndex]._source.closed = false;
              } else if (props.boardId === "closed") {
                data[dataIndex]._source.closed = true;
              }
            }
          });
          if (!isOpenClose) {
            data[dataIndex]._source.tags.push(props.boardId);
          }
          if (data) {
            $store.dispatch({
              type: "data/add",
              payload: {
                data,
              },
            });
          }
        } else {
          console.error("how can we have a ticket state change without a tag field?");
        }
      });
    } else {
      // we have to remove a tag, but for now we won't do it as the add will do it in the other board
    }
    // if there is no data it means there is not ticket state swap. So we just sorted and just update our widget.
    // If we have data we also change data in the store which then will trigger our components to rerender aswell as this widget update
    // TODO This is one of the optimization questions we have to discuss
    // to stop multiple cycles use  if (!data || data.length === 0) {
    $store.dispatch({
      type: "widgets/update",
      uuid: props.widgetUUID,
      payload: {
        filter: {
          sorting: { [props.boardId]: val },
        },
      },
    });
  },
});
const handleShow = function (type) {
  if (show.value === type) {
    show.value = false;
  } else {
    show.value = type;
  }
};
const props = defineProps({
  column: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_" + rawProps.boardId;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  // the id of the ticketboard so that we can find our store target
  boardId: {
    type: String,
    required: true,
  },
  sorting: {
    // a list of sorted uuids of our tickets. that's the reference for our rendering
    type: Array,
    required: true,
  },
  identifiers: {
    //
    type: Array,
    required: true,
  },
});
</script>
<style lang="css" scoped>
.ticketWrapperCard {
  height: 100%;
}

.ticketWrapperCard .list-group {
  min-height: 100%;
}

.ticketItem:not(.on-hover) {
  opacity: 0.9;
}

.ticketWrapperCard .v-card {
  margin: 10px;
}

.expandBtn {
  max-width: 65px;
}
</style>
