<template>
  <project
    :props="props.props"
    edit
    :uuid="props.uuid"
    :widgetUUID="props.widgetUUID"
    :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/project"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import { defineComponent } from "vue";
import projectTpl from "@t/dataTypes/project.vue";

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
const project = defineComponent(projectTpl);
</script>
