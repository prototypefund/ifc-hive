<template>
  <v-card flat v-if="item && item._id" data-test-container="templates/dataTypes/project"
    :data-test-container-uuid="props.uuid">
    <v-card-title>{{ item._source.title }}</v-card-title>
    <v-card-text>
      <pre>{{ item }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
import objectTemplate from "../dbItems/project";
defineProps({
  props: {
    type: Object,
    required: false,
    default: {},
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_dataTypes_project_" + rawProps.docUUID;
    },
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid;
    },
  },
  mode: {
    type: String,
    default: "view",
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  docUUID: {
    type: String,
    required: true,
  },
  itemDefinition: {
    type: Object,
    default(rawProps) {
      return objectTemplate();
    },
  },
});
</script>
