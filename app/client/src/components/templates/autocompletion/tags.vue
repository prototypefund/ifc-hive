<template>
  <div data-test-container="templates/autocompletion/tags" :data-test-container-uuid="props.uuid">
    <v-autocomplete v-model="selectedTags" :items="Object.values(tags.data)" chips item-title="_title" item-value="_id"
      hide-seleted closable-chips color="blue-grey-lighten-2" :label="$t('generics.tags')" multiple />
  </div>
</template>

<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_autocompletion_tags_" + rawProps.docUUID;
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
});
// get all tags from the store, we do use the the "data" here, which is a plain clone of the tags objects. They are not reactive!
const tags = ref($store.$data.get(props.actionId, "ALL_TAGS"));
// get the document we want to show and edit the tags for. This will be reactive
const item = ref(false);
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    if (item.value !== val) {
      item.value = val || {};
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
  tags.unsubscribe();
  dataItemSubscriber$.unsubscribe();
});
</script>
