<template>
  <v-card
    flat
    v-if="item"
    data-test-container="templates/dataTypes/tag"
    :data-test-container-uuid="props.uuid"
  >
    <v-card-title>{{ item._title }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="title"
        :label="$t('generics.title')"
        variant="underlined"
      ></v-text-field>
      <v-select
        v-model="type"
        :items="tagTypes"
        variant="underlined"
        :label="$t('generics.type')"
      />
      <v-text-field
        v-model="color"
        :label="$t('generics.color')"
        variant="underlined"
        @click="showPicker = !showPicker"
        :append-inner-icon="!showPicker ? 'mdi-chevron-left' : 'mdi-chevron-down'"
      ></v-text-field>
      <v-color-picker v-if="showPicker" v-model="color" hide-inputs show-swatches />
      <v-switch
        v-model="locked"
        hide-details
        :label="locked ? $t('generics.locked') : $t('generics.open')"
      ></v-switch>
      <pre>{{ item }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { inject, ref, shallowRef, computed, onMounted, onUnmounted } from "vue";
import { v4 as uuidv4 } from "uuid";
const $store = inject("$store");
const tagTypes = ["status", "milestone", "default"];
const showPicker = shallowRef(false);
const itemUpdater = (newItem) => {
  $store.dispatch({
    type: "data/update",
    docUUID: item.value._id || uuidv4(),
    payload: newItem,
  });
};
const locked = computed({
  get() {
    return item.value._source.locked || false;
  },
  set(newValue) {
    itemUpdater({ locked: newValue });
  },
});
const color = computed({
  get() {
    return item.value._source.color || "";
  },
  set(newValue) {
    itemUpdater({ color: newValue });
  },
});
const type = computed({
  get() {
    return item.value._source.type || "";
  },
  set(newValue) {
    itemUpdater({ type: newValue });
  },
});
const title = computed({
  get() {
    return item.value._source.title || "";
  },
  set(newValue) {
    itemUpdater({ title: newValue });
  },
});

const props = defineProps({
  props: {
    type: Object,
    required: false,
    default: {},
  },
  edit: {
    type: Boolean,
    required: false,
    default: false,
  },
  uuid: {
    // the uuid of the calling widgets, in case you need it
    type: String,
    required: true,
  },
  itemDefinition: {
    type: Object,
    default: {
      _id: false,
      _type: "tag",
      _project: false,
      _title: false,
      _source: {
        title: false,
        type: false, // default, milestone, status, etc.
        locked: false,
      },
    },
  },
  docUUID: {
    type: String,
  },
});
const item = ref(false);
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
