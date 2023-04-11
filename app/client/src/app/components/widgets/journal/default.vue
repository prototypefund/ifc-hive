<template>
  <v-container v-if="state && props.uuid" data-test-container="widgets/journal/default"
    :data-test-container-uuid="props.uuid">
    <v-timeline align="start" :density="viewPortWidth < 1110 ? 'compact' : 'default'">
      <v-timeline-item v-for="uuid in data.uuids" :key="'journalID_' + uuid" max-width="600px">
        <ticket-card-item v-if="uuid.indexOf('action/') === -1" :widgetUUID="props.uuid" :docUUID="uuid" />
        <v-card v-else>
          <pre>

        {{ getFullItem(uuid) }}
        </pre>

        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, shallowRef, onUnmounted } from "vue";
import ticketCardItem from "@t/cards/ticket.vue";
import { getFullItem } from "@lib/dataHelper.js";

const $store = inject("$store");
const state = ref({});
const viewPortWidth = shallowRef(false);
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
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
const data = $store.$data.get(props.actionId + "_meta/tickets", "meta/tickets", { limit: 5 });
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  data.value.unsubscribe();
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
