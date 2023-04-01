<template>
  <div data-test-container="templates/combobox/tags" :data-test-container-uuid="props.uuid">
    <v-combobox v-model="selectedTags" :items="Object.values(tagLookup.data)" chips item-title="_title" item-value="_id"
      closable-chips color="blue-grey-lighten-2" :label="$t('generics.tags')" multiple />
  </div>
</template>

<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
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
  tagLookup: {
    type: Object,
    required: false,
  },
});
// get all tags from the store, we do use the the "data" here, which is a plain clone of the tags objects. They are not reactive!
const tagLookup = props.tagLookup
  ? props.tagLookup
  : $store.$data.get(props.actionId, "ALL_TAGS");
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
    const selectedTagsArr = [];
    if (item.value._source && item.value._source.tags) {
      item.value._source.tags.forEach((tag) => {
        if (props.tagLookup) {
          // sadly we have no .value if we get it via prop and we have .value if we retrieve the lookup ourselfs, so I have to make this nasty piece of if
          if (tagLookup.data[tag]) {
            selectedTagsArr.push(tagLookup.data[tag]);
          } else {
            selectedTagsArr.push({
              _id: tag,
              _title: tag,
            });
          }
        } else {
          if (tagLookup.value.data[tag]) {
            selectedTagsArr.push(tagLookup.value.data[tag]);
          } else {
            selectedTagsArr.push({
              _id: tag,
              _title: tag,
            });
          }
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
onMounted(() => { });
onUnmounted(() => {
  // if .value is set, it means that our lookup came from our store $date.get
  if (tagLookup.value) {
    tagLookup.value.unsubscribe();
  }
  dataItemSubscriber$.unsubscribe();
});
</script>