<template>
  <v-card flat v-if="item._source" data-test-container="templates/dataTypes/tag" :data-test-container-uuid="props.uuid">
    <v-card-title>
      <v-row><v-col align-self="start" cols="12"> {{ item._title }}</v-col></v-row>
      <v-row no-gutters>
        <v-col align-self="end" cols="12" v-if="item._disId">
          <v-switch v-model="editMode" hide-details true-value="edit" false-value="view"
            :label="$t('generics.mode') + ': ' + $t('generics.' + editMode)"></v-switch>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <div v-if="editMode === 'edit'">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="title" :label="$t('generics.title')" variant="underlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="type" :items="tagTypes" variant="underlined" :label="$t('generics.type')" />
          </v-col>
          <v-col cols="12">
            <tag-combobox v-if="item._disId" :widgetUUID="props.widgetUUID" mode="edit" :docUUID="item._id" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="color" :label="$t('generics.color')" :color="color" variant="underlined"
              @click="showPicker = !showPicker"
              :append-inner-icon="!showPicker ? 'mdi-chevron-left' : 'mdi-chevron-down'"></v-text-field>
            <v-color-picker v-if="showPicker" v-model="color" hide-inputs show-swatches />
          </v-col>
          <v-col cols="12">
            <v-switch v-model="locked" hide-details
              :label="locked ? $t('generics.locked') : $t('generics.open')"></v-switch>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-label>{{ $t("generics.title") }}</v-label>
            <p>{{ title }}</p>
          </v-col>
          <v-col cols="12"><v-label>{{ $t("generics.tagType") }}</v-label>
            <p>{{ type }}</p>
          </v-col>
          <v-col cols="12"><v-label>{{ $t("generics.tags") }}</v-label>
            <tag-chips :widgetUUID="props.widgetUUID" :docUUID="item._id" :tags="tags" />
          </v-col>
          <v-col cols="12"><v-label>{{ $t("generics.color") }}</v-label>
            <p>
              <v-btn class="ma-2" variant="text" :color="color">{{ color }}</v-btn>
            </p>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="locked" hide-details :label="locked ? $t('generics.locked') : $t('generics.open')"
              disabled></v-switch></v-col>
        </v-row>
      </div>

      <v-btn @click="debugDump = !debugDump">
        <v-icon :icon="!debugDump ? 'mdi-chevron-right' : 'mdi-chevron-down'" />
        showDump
      </v-btn>
    </v-card-text>
    <v-card-text v-if="debugDump">
      <pre>{{ item }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {
  inject,
  ref,
  shallowRef,
  defineAsyncComponent,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import objectTemplate from "../dbItems/tag";
import { getSource } from "@lib/dataHelper.js";
const $store = inject("$store");
const tagTypes = ["status", "milestone", "default"];
const showPicker = shallowRef(false);
const editMode = shallowRef('view');
const tagCombobox = defineAsyncComponent(() => import("@t/combobox/tags.vue"));
const tagChips = defineAsyncComponent(() => import("@t/chips/tags.vue"));
const debugDump = shallowRef(false);
const debounceTimer = shallowRef(false);
const debounce = (func) => {
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    if (func) func();
  }, 200);
};
const itemUpdater = (newItem) => {
  debounce(() =>
    $store.dispatch({
      type: "data/update",
      docUUID: props.docUUID,
      payload: newItem, // note: newItem is only a partials
      objectDefinition: item.value,
    })
  );
};
const locked = computed({
  get() {
    return item.value._source.locked || false;
  },
  set(newValue) {
    itemUpdater({ locked: newValue });
  },
});
const tags = computed({
  get() {
    return item.value._source.tags || "";
  },
  set(newValue) {
    itemUpdater({ tags: newValue });
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
  mode: {
    type: String,
    default: "view",
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_dataTypes_tag_" + rawProps.docUUID;
    },
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  itemDefinition: {
    type: Object,
    default(rawProps) {
      return objectTemplate();
    },
  },
  docUUID: {
    type: String,
    required: true,
  },
});
const item = ref(false);
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    if (typeof val === "undefined") {
      // if the val is undefined, we are creating a new item which means we have to take the itemDefinition as a base for our forms
      item.value = JSON.parse(JSON.stringify(props.itemDefinition));
      item.value._id = props.docUUID;
      return
    }
    const fullDocument = {
      ...val,
      _source: getSource(val._id)
    }
    if (item.value != fullDocument) {
      item.value = fullDocument || {};
    }
  });
onMounted(() => { editMode.value = props.mode });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
