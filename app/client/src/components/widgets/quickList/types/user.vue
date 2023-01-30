<template>
  <user
    :props="props.props"
    edit
    :uuid="props.uuid"
    :widgetUUID="props.widgetUUID"
    :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/user"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import user from "@t/dataTypes/user.vue";

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_types_user_" + rawProps.docUUID;
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
