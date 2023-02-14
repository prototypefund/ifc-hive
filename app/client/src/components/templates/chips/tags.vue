<template>
  <v-row data-test-container="templates/chips/tags" :data-test-container-uuid="props.uuid">
    <v-col cols="auto" v-for="tag in props.tags">
      <v-chip size="small" :color="
        tagLookup.data[tag] ? tagLookup.data[tag]._source.color || 'grey' : 'grey'
      ">{{
  tagLookup.data[tag] ? tagLookup.data[tag]._source.title || tag : tag
}}</v-chip>
    </v-col>
    <v-col cols="auto" />
  </v-row>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
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
  : $store.$data.get(props.actionId, "ALL_TAGS");
onMounted(() => { });
onUnmounted(() => {
  if (tagLookup.value) {
    tagLookup.value.unsubscribe();
  }
});
</script>
