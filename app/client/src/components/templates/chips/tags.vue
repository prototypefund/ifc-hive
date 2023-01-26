<template>
  <v-row
    data-test-container="templates/chips/tags"
    :data-test-container-uuid="props.uuid"
  >
    <v-col cols="auto" v-for="tag in props.tags">
      <v-chip
        size="small"
        :color="tags.data[tag] ? tags.data[tag]._source.color || 'grey' : 'grey'"
        >{{ tags.data[tag] ? tags.data[tag]._source.title || tag : tag }}</v-chip
      >
    </v-col>
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
  props: {
    type: Object,
    default: {},
  },
});
const tags = ref($store.$data.get(props.actionId, "ALL_TAGS"));
onMounted(() => {});
onUnmounted(() => {
  tags.unsubscribe();
});
</script>
