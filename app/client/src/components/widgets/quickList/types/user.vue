<template>
  <user
    :props="props.props"
    edit
    :uuid="props.uuid"
    :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/user"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import { defineComponent } from "vue";
import userTpl from "@t/dataTypes/user.vue";

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  docUUID: {
    type: String,
  },
  props: {
    type: Object,
    default: {},
  },
});
const user = defineComponent(userTpl);
</script>
