<template>
  <v-card
    flat
    v-if="item && item._id"
    data-test-container="widgets/quicklist/types/detail"
    :data-test-container-uuid="props.uuid"
  >
    <v-card-text>
      <pre>{{ item }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_types_detail_" + rawProps.docUUID;
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
  props: {
    type: Object,
    default: {},
  },
});
const item = ref({});
const dateItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    item.value = val;
  });
onMounted(() => {});
onUnmounted(() => {
  dateItemSubscriber$.unsubscribe();
});
</script>
