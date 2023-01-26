<template>
  <organization
    :props="props.props"
    edit
    :uuid="props.uuid"
    :widgetUUID="props.widgetUUID"
    :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/organization"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import { defineComponent } from "vue";
import organizationTpl from "@t/dataTypes/organization.vue";

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
const organization = defineComponent(organizationTpl);
</script>
