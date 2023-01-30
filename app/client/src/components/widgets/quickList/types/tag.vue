<template>
  <tag
    :props="props.props"
    edit
    :uuid="props.uuid"
    :widgetUUID="props.widgetUUID"
    :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/tag"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import tag from "@t/dataTypes/tag.vue";

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_types_tag_" + rawProps.docUUID;
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
