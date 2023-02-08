<template>
  <v-card flat v-if="item && item._id" data-test-container="templates/dataTypes/project"
    :data-test-container-uuid="props.uuid">
    <v-card-title>{{ item._source.title }}</v-card-title>
    <v-card-text>
      <pre>{{ item }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  props: {
    type: Object,
    required: false,
    default: {},
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_dataTypes_project_" + rawProps.docUUID;
    },
  },
  mode: {
    type: String,
    required: true,
    default: "view",
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  docUUID: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: true,
    default: {
      _id: false, // UUID
      _type: "project", // Meta type
      _path: false,
      _title: false,
      _source: {
        _id: false,
        title: false,
        owner: false, // uuid user
        description: false,
        keywords: false,
        parent: false, // type project
        path: false, // materialized path #id1#id2#id3 etc.
      },
    },
  },
});
</script>
