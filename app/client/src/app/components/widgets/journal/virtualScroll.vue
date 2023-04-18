<template>
  <v-container v-if="state && props.uuid" data-test-container="widgets/journal/virtualScroll"
    :data-test-container-uuid="props.uuid">
    <v-timeline v-if="data?.vScrollItems?.length > 0">
      <DynamicScroller page-mode class="scroller" :items="data.vScrollItems" :min-item-size="150" key-field="docUUID">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem :item="item" :active="active" :data-index="index">
            <v-timeline-item max-width="600px">
              <ticket-card-item :key="item.docUUID + '_' + index" :widgetUUID="props.uuid" :docUUID="item.docUUID" />
            </v-timeline-item>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </v-timeline>
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import ticketCardItem from "@t/cards/ticket.vue";

const $store = inject("$store");
const state = ref({});
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
const data = $store.$data.get(props.actionId + "_meta/tickets", "meta/tickets", { endless: true });
onMounted(() => {
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  data.value.unsubscribe();
});
</script>

<style lang="css">
.scroller {
  height: 100%;
}

.v-timeline .v-timeline-divider__dot {
  background: #e4e4e4;
}

.v-timeline-divider__dot--size-small {
  height: 20px;
  width: 20px;
}
</style>
