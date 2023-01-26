<template>
  <v-container
    v-if="state && props.uuid"
    data-test-container="widgets/journal/default"
    :data-test-container-uuid="props.uuid"
  >
    <v-btn @click="addData">addData</v-btn>
    <v-timeline align="start">
      <v-timeline-item v-for="uuid in data.uuids" :key="uuid">
        <memo-card-item :widgetUUID="props.uuid" :docUUID="uuid" />
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import memoCardItem from "@t/cards/memo.vue";

const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const addData = () => {
  $store.dispatch({
    type: "data/add",
    uuid: props.uuid,
    payload: {
      data: [
        {
          _id: "test",
          _type: "tag",
          _title: "testTag mit Name",
          _source: {
            title: "testTag mit Name",
            color: "#90A4AE",
          },
        },
        {
          _id: "rolf",
          _type: "memo",
          _project: false,
          _title: "testMemo",
          _source: {
            title: "testMemo",
            path: false, // materialized path
            project: false,
            body: false, // block
            closed: false, // default false
            tags: [], // Type Tag
            created: false,
            modified: false,
            due: false,
            owner: false, // User object
            assigned: false, // User object
            approvals: false,
          },
        },
      ],
    },
  });
};
const props = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_journal_all_mem";
    },
  },
});
const data = ref($store.$data.get(props.actionId, "ALL_MEMOS"));

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  data.unsubscribe();
});
</script>

<style lang="css">
.v-timeline .v-timeline-divider__dot {
  background: #e4e4e4;
}

.v-timeline-divider__dot--size-small {
  height: 20px;
  width: 20px;
}
</style>
