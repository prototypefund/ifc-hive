<template>
  <v-card
    flat
    v-if="item && item._id"
    data-test-container="templates/dataTypes/organization"
    :data-test-container-uuid="props.uuid"
  >
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
    // the uuid of the calling widgets, in case you need it
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: true,
    default: {
      _id: false,
      _type: "org",
      _path: false,
      _title: false, // Nickname (email)  Organization
      _source: {
        name: false,
        shortname: false,
        active: false,
        description: false,
        url: false,
      },
    },
  },
});
</script>
