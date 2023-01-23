<template>
  <tag
    v-if="item && item._id"
    :props="props.props"
    :uuid="props.uuid"
    :item="item"
    data-test-container="widgets/quicklist/types/tag"
    :data-test-container-uuid="props.uuid"
  />
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, defineComponent } from "vue";
import tagTpl from "@t/dataTypes/tag.vue";
const tag = defineComponent(tagTpl);
const $store = inject("$store");
const props = defineProps({
  uuid: {
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
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    item.value = val;
  });
onMounted(() => {});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
