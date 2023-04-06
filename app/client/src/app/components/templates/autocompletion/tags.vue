<template>
  <div data-test-container="templates/autocompletion/tags" :data-test-container-uuid="props.uuid">
    <v-autocomplete :disabled="disabled" v-model="selectedTags" :items="Object.values(tagLookup.data)" chips
      item-title="_title" item-value="_id" hide-seleted closable-chips color="blue-grey-lighten-2"
      :label="$t('generics.tags')" multiple />
  </div>
</template>

<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
import { getSource } from "@lib/dataHelper.js";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_autocompletion_tags_" + rawProps.docUUID;
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  docUUID: {
    type: String,
    required: true,
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_allTags";
    },
  },
  props: {
    type: Object,
    default: {},
  },
  tagLookup: {
    type: Object,
    required: false,
  },
});
// get all tags from the store, or the props
const tagLookup = props.tagLookup
  ? props.tagLookup
  : $store.$data.get(props.actionId, "meta/tags");
// get the document we want to show and edit the tags for. This will be reactive
const item = ref(false);
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    if (!val) return
    const fullDocument = {
      ...val,
      _source: getSource(val._id)
    }
    if (item.value !== fullDocument) {
      item.value = fullDocument || {};
    }
  });
const selectedTags = computed({
  get() {
    return item.value._source ? item.value._source.tags || [] : [];
  },
  set(newValue) {
    $store.dispatch({
      type: "data/update",
      docUUID: props.docUUID || false,
      payload: { tags: newValue },
    });
  },
});
onMounted(() => { });
onUnmounted(() => {
  // if .value is set, it means that our lookup came from our store $date.get
  if (tagLookup.value) {
    tagLookup.value.unsubscribe();
  }
  dataItemSubscriber$.unsubscribe();
});
</script>
