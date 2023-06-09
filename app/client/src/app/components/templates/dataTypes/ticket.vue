<template>
  <v-card flat v-if="item._source" data-test-container="templates/dataTypes/ticket"
    :data-test-container-uuid="props.uuid">
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
            <tag-combobox v-if="item._disId" :widgetUUID="props.widgetUUID" mode="edit" :docUUID="item._id" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="due" :label="$t('generics.dueDate')" variant="underlined"
              v-if="vuetifyHasDatePicker == true"></v-text-field>
            <v-label>{{ $t("generics.dueDate") }}</v-label>
            <p v-if="due">{{ $filters.dateFormat(due) }}</p>
          </v-col>

          <v-col cols="12">
            <user-autocompletion v-if="item._disId" :widgetUUID="props.widgetUUID" mode="edit" :docUUID="item._id"
              selectedUserRole="assigned" />
          </v-col>
          <v-col cols="12">
            <v-switch v-model="closed" hide-details
              :label="closed ? $t('generics.closed') : $t('generics.open')"></v-switch>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-label>{{ $t("generics.title") }}</v-label>
            <p>{{ title }}</p>
          </v-col>
          <v-col cols="12"><v-label>{{ $t("generics.tags") }}</v-label>
            <tag-chips :widgetUUID="props.widgetUUID" :docUUID="item._id" :tags="tags" />
          </v-col>
          <v-col cols="12">
            <v-label>{{ $t("generics.dueDate") }}</v-label>
            <p v-if="due">{{ $filters.dateFormat(due) }}</p>
          </v-col>
          <v-col cols="12">
            <v-label>{{ $t("generics.assigned") }}</v-label>
            <user-chips :widgetUUID="props.widgetUUID" :docUUID="item._id"
              :selectedUser="item._source.assigned" /></v-col>
          <v-col cols="12">
            <v-switch v-model="closed" hide-details :label="closed ? $t('generics.closed') : $t('generics.open')"
              disabled /></v-col>
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
  computed,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import objectTemplate from "../dbItems/ticket";
import { getSource } from "@lib/dataHelper.js";
const $store = inject("$store");
const debugDump = shallowRef(false);
const tagCombobox = defineAsyncComponent(() => import("@t/combobox/tags.vue"));
const tagChips = defineAsyncComponent(() => import("@t/chips/tags.vue"));
const userChips = defineAsyncComponent(() => import("@t/chips/user.vue"));
const userAutocompletion = defineAsyncComponent(() =>
  import("@t/autocompletion/user.vue")
);
const editMode = shallowRef('view');
const item = ref(false);
const debounceTimer = shallowRef(false);
const debounce = (func) => {
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    if (func) func();
  }, 200);
};
const itemUpdater = (newItem) => {
  debounce(() => {
    $store.dispatch({
      type: "data/update",
      docUUID: props.docUUID,
      payload: newItem, // note: newItem is only a partials
      objectDefinition: item.value,
    })
  });
};
const closed = computed({
  get() {
    return item.value._source.closed || false;
  },
  set(newValue) {
    itemUpdater({ closed: newValue });
  },
});
const body = computed({
  get() {
    return item.value._source.body || "";
  },
  set(newValue) {
    itemUpdater({ body: newValue });
  },
});
const tags = computed({
  get() {
    return item.value._source.tags || props.tags;
  },
  set(newValue) {
    itemUpdater({ tags: newValue });
  },
});
const assigned = computed({
  get() {
    return item.value._source.assigned || []
  },
  set(newValue) {
    itemUpdater({ assigned: newValue });
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
const due = computed({
  get() {
    return item.value._source.due || "";
  },
  set(newValue) {
    itemUpdater({ due: new Date(newValue) });
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
  tags: {
    type: Array,
    default: [],
  },
  path: {
    type: String,
    default: "",
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_dataTypes_ticket_" + rawProps.docUUID;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid;
    },
  },
  itemDefinition: {
    type: Object,
    default(rawProps) {
      return objectTemplate({ tags: rawProps.tags, path: rawProps.path });
    },
  },
  docUUID: {
    type: String,
    required: true,
  },
});
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
      if (item.value !== fullDocument) {
        item.value = fullDocument || {};
      }
    }
  });

onMounted(() => {
  editMode.value = props.mode
});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
