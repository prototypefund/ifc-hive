<template>
  <project v-bind="props.props" :uuid="props.uuid" :widgetUUID="props.widgetUUID" :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/project" :data-test-container-uuid="props.uuid" />
</template>

<script setup>
import project from "@t/dataTypes/project.vue";

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_types_project_" + rawProps.docUUID;
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
