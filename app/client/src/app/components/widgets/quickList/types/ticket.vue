<template>
  <v-row no-gutters>
    <v-col cols="auto" align-self="end">
      <QuickListHandler :uuid="props.widgetUUID" :docUUID="props.docUUID">
        <v-icon icon="mdi-close-box" color="error" />
      </QuickListHandler>
    </v-col>
  </v-row>
  <v-row no-gutters>
    <ticket v-bind="props.props" :uuid="props.uuid" :widgetUUID="props.widgetUUID" :docUUID="props.docUUID || false"
      data-test-container="widgets/quicklist/types/ticket" :data-test-container-uuid="props.uuid" />
  </v-row>
</template>

<script setup>
import ticket from "@t/dataTypes/ticket.vue";
import QuickListHandler from "@w/quickList/handler/click_remove.vue";
const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_types_ticket_" + rawProps.docUUID;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  docUUID: {
    type: String,
    required: true,
  },
  props: {
    type: Object,
    default: {},
  },
});
</script>
