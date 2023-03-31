<template>
  <organization v-bind="props.props" :uuid="props.uuid" :widgetUUID="props.widgetUUID" :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/organization" :data-test-container-uuid="props.uuid" />
</template>

<script setup>
import organization from "@t/dataTypes/organization.vue";

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_types_organization_" + rawProps.docUUID;
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
