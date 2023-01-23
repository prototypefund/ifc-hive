<template>
  <v-card
    flat
    v-if="item && item._id"
    data-test-container="templates/dataTypes/memo"
    :data-test-container-uuid="props.uuid"
  >
    <v-card-title>{{ item._source.title }}</v-card-title>
    <v-card-subtitle v-if="item._source.tags && item._source.tags.length > 0">
      <v-row no-gutters>
        <v-col cols="auto" v-for="tag in item._source.tags">
          <v-chip color="grey">{{ tag }}</v-chip>
        </v-col>
      </v-row>
    </v-card-subtitle>
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
      _id: false, // UUID
      _path: false,
      _project: false,
      _type: "memo",
      _title: false,
      _created: false,
      _modified: false,
      _source: {
        title: false,
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: [], // Type Tag
        created: false,
        modified: false,
        due: false,
        owner: false, // User object
        assigned: false, // User object
        approvals: {
          user: false, // uuid user
          answer: false, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
    },
  },
});
</script>
