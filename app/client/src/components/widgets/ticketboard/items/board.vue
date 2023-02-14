<template>
  <v-card :color="boardItem.color || boardItem._source.color" v-if="boardId"
    :style="{ width: width + 'px', height: '100%' }" class="ticketWrapperCard"
    :prepend-icon="generic ? 'false' : 'mdi-drag'" data-test-container="widgets/ticketboard/items/board"
    :data-test-container-uuid="uuid">
    <template v-slot:title v-if="generic">{{ $t("generics." + boardId) }} </template>
    <template v-slot:title v-else>
      <QuickListHandler uuid="quickList" :props="{ mode: 'edit' }" :docUUID="boardId" :dataTitle="boardItem._title"
        :tab-type="boardItem._type" action="add">
        {{ boardItem._title }}
      </QuickListHandler>
    </template>
    <template v-slot: card-text>
      <slot name="tickets" :boardId="boardId"></slot>
      <slot />
    </template>
  </v-card>
</template>
<script setup>
import QuickListHandler from "@w/quickList/handler.vue";
defineProps({
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
    required: true,
  },
  boardItem: {
    type: Object,
    required: true,
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_ticketboard_board_" + rawProps.boardId;
    },
  },
});
</script>
