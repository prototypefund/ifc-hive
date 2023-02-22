<template>
  <v-container v-if="state && props.uuid" data-test-container="widgets/journal/default"
    :data-test-container-uuid="props.uuid">
    <v-timeline align="start" :density="viewPortWidth < 1110 ? 'compact' : 'default'">
      <v-virtual-scroll :items="data.uuids">
        <template v-slot:default="{ item }">
          <v-timeline-item :key="item" max-width="600px">
            <memo-card-item :widgetUUID="props.uuid" :tag-lookup="tags" :docUUID="item" />
          </v-timeline-item>
        </template>
      </v-virtual-scroll>
    </v-timeline>
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, shallowRef, onUnmounted } from "vue";
import memoCardItem from "@t/cards/memo.vue";

const $store = inject("$store");
const state = ref({});
const viewPortWidth = shallowRef(false);
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const viewPortWidthSubscriber$ = $store
  .select((state) => state.ui.viewPortWidth)
  .subscribe((val) => {
    viewPortWidth.value = val;
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
const data = $store.$data.get(props.actionId + "_ALL_MEMOS", "ALL_MEMOS");
const tags = $store.$data.get(props.actionId + "_ALL_TAGS", "ALL_TAGS");
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  viewPortWidthSubscriber$.unsubscribe();
  tags.value.unsubscribe();
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
