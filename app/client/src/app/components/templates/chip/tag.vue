<template>
  <v-chip v-if="tag._source" size="small" :color="tag ? tag._source.color || 'grey' : 'grey'"
    data-test-container="templates/chip/tag" :data-test-container-uuid="props.uuid">
    {{ tag._title }}
  </v-chip>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import { getSource } from "@lib/dataHelper.js";
const $store = inject("$store");
const tag = ref(false);

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_chip_tag_" + rawProps.docUUID;
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
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    if (!val) return
    const fullDocument = {
      ...val,
      _source: getSource(val._id)
    }
    if (tag.value !== fullDocument) {
      tag.value = fullDocument || {};
    }
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
<style lang="css" scoped></style>
