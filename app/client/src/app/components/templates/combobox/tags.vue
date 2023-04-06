<template>
  <div data-test-container="templates/combobox/tags" :data-test-container-uuid="props.uuid">
    <v-combobox v-model="selectedTags" :items="getLookupDocuments()" chips item-title="_title" item-value="_id"
      closable-chips color="blue-grey-lighten-2" :label="$t('generics.tags')" multiple />
  </div>
</template>

<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
import { getFullItem, getSource } from '@lib/dataHelper.js'
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_combobox_tags_" + rawProps.docUUID;
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
const tagLookup = $store.$data.get(props.actionId, "meta/tags");
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
    const selectedTagsArr = [];
    if (item.value._source && item.value._source.tags) {
      item.value._source.tags.forEach((tag) => {
        if (getFullItem(tag)) {
          selectedTagsArr.push(getFullItem(tag));
        } else {
          selectedTagsArr.push({
            _id: tag,
            _title: tag,
          });
        }
      });
    }
    return selectedTagsArr;
  },
  set(newValue) {
    const cleanVal = [];
    // TODO remove this workaround once vuetify fixed combobox
    newValue.forEach((val) => {
      if (val._id) {
        cleanVal.push(val._id);
      } else {
        cleanVal.push(val);
      }
    });
    $store.dispatch({
      type: "data/update",
      docUUID: props.docUUID || false,
      payload: { tags: cleanVal },
    });
  },
});
const getLookupDocuments = () => {
  const lookup = []
  tagLookup.value.uuids.forEach((uuid) => {
    if (getFullItem(uuid)) lookup.push(getFullItem(uuid))
  })
  return lookup
}
onMounted(() => { });
onUnmounted(() => {
  tagLookup.value.unsubscribe();
  dataItemSubscriber$.unsubscribe();
});
</script>
