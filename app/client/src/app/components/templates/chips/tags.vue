<template>
  <v-row data-test-container="templates/chips/tags" no-gutters :data-test-container-uuid="props.uuid">
    <v-col cols="auto" v-for="tag in props.tags" :key="tag">
      <tag-chip v-if="tag" :widgetUUID="props.widgetUUID" :docUUID="tag" />
    </v-col>
  </v-row>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import tagChip from "@t/chip/tag.vue";

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_chips_tags_" + rawProps.docUUID;
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
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_allTags";
    },
  },
  tags: {
    type: Array,
    required: true,
    default: [],
  },
  props: {
    type: Object,
    default: {},
  },
});
onMounted(() => { });
onUnmounted(() => {
});
</script>
