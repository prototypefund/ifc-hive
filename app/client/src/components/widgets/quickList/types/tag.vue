<template>
  <tag
    :props="props.props"
    edit
    :uuid="props.uuid"
    :docUUID="props.docUUID || false"
    data-test-container="widgets/quicklist/types/tag"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import { defineComponent } from "vue";
import tagTpl from "@t/dataTypes/tag.vue";

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
const tag = defineComponent(tagTpl);
</script>
