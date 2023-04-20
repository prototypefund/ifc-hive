<template>
  <v-card v-if="boardId && boardItem?._source"
    :style="{ border: '2px solid ' + boardItem._source.color || 'red', width: width + 'px', height: '100%' }"
    class="ticketWrapperCard" :prepend-icon="generic ? 'false' : 'false'"
    data-test-container="widgets/ticketboard/items/board" :data-test-container-uuid="uuid">
    <template v-slot:title v-if="generic">{{ $t("generics." + boardId) }} </template>
    <template v-slot:title v-else>
      <QuickListHandler uuid="quickList" :props="{ mode: 'edit' }" :docUUID="boardId" :dataTitle="boardItem._title"
        :type="boardItem._type">
        {{ boardItem._title }}
      </QuickListHandler>
    </template>
    <template v-slot: card-text>
      <slot name="tickets" :boardId="boardId"></slot>
    </template>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import { getSource } from "@lib/dataHelper.js";
import QuickListHandler from "@w/quickList/handler/batch.vue";
const $store = inject("$store");
let boardItemSubscriber$ = false
const boardItem = ref({})
const props = defineProps({
  widgetUUID: {
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
    required: true
  },
  boardItem: {
    type: Object,
    required: false,
    default: {}
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_ticketboard_board_" + rawProps.boardId;
    },
  },
});

onMounted(() => {
  if (props.boardItem._source) {
    boardItem.value = props.boardItem
    return
  }
  boardItemSubscriber$ = $store
    .select((state) => state.data[props.boardId])
    .subscribe((val) => {
      if (!val) return
      const fullDocument = {
        ...val,
        _source: getSource(val._id)
      }
      if (boardItem.value !== fullDocument) {
        fullDocument._source.color = fullDocument._source.color || 'green'
        boardItem.value = fullDocument || {};
      }
    });
});
onUnmounted(() => {
  if (boardItemSubscriber$) boardItemSubscriber$.unsubscribe()
});
</script>
<style lang="css" scoped></style>
