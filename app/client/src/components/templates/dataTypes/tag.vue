<template>
  <v-card flat v-if="item" data-test-container="templates/dataTypes/tag" :data-test-container-uuid="props.uuid">
    <v-card-title>{{ item._title }}</v-card-title>
    <v-card-text>
      <div v-if="mode === 'edit'">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="title" :label="$t('generics.title')" variant="underlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="type" :items="tagTypes" variant="underlined" :label="$t('generics.type')" />
          </v-col>
          <v-col cols="12">
            <tag-combobox v-if="item._disId" :tag-lookup="tagLookup" :widgetUUID="props.widgetUUID" :mode="mode"
              :docUUID="item._id" />
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
const $store = inject("$store");
const tagTypes = ["status", "milestone", "default"];
const showPicker = shallowRef(false);

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
      type: !item.value._disId ? "data/add" : "data/update",
      docUUID: props.docUUID,
      payload: newItem,
      objectDefinition: !item.value._disId ? item.value : false,
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
const tagLookup = $store.$data.get(props.actionId + "_ALL_TAGS", "ALL_TAGS");
const item = ref(false);
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    if (typeof val === "undefined") {
      // if the val is undefined, we are creating a new item which means we have to take the itemDefinition as a base for our forms
      item.value = JSON.parse(JSON.stringify(props.itemDefinition));
      item.value._id = props.docUUID;
    } else if (item.value != val) {
      item.value = JSON.parse(JSON.stringify(val));
    }
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
  tagLookup.value.unsubscribe();
});
</script>
