<template>
  <v-row data-test-container="templates/chips/tags" no-gutters :data-test-container-uuid="props.uuid">
    <v-col cols="auto" v-for="tag in props.tags" :key="tag">
      <tag-chip v-if="tag" :widgetUUID="props.widgetUUID" :docUUID="tag" />
    </v-col>
  </v-row>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from "vue";
import tagChip from "@t/chip/tag.vue";
const $store = inject("$store");

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
  tagLookup: {
    type: Object,
    required: false,
  },
  props: {
    type: Object,
    default: {},
  },
});
const tagLookup = props.tagLookup
  ? props.tagLookup
  : $store.$data.get(props.actionId, "meta/tags");
onMounted(() => { });
onUnmounted(() => {
  // if .value is set, it means that our lookup came from our store $date.get
  if (tagLookup.value) {
    tagLookup.value.unsubscribe();
  }
});
</script>
