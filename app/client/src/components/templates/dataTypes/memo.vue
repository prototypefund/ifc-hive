<template>
  <v-card
    flat
    v-if="item"
    data-test-container="templates/dataTypes/memo"
    :data-test-container-uuid="props.uuid"
  >
    <v-card-title>{{ item._title }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="title"
        :label="$t('generics.title')"
        variant="underlined"
      ></v-text-field>
      <tag-chips
        v-if="!edit"
        :widgetUUID="props.widgetUUID"
        :docUUID="item._id"
        :tags="tags"
      />
      <tag-autocompletion
        v-if="edit"
        :widgetUUID="props.widgetUUID"
        :docUUID="item._id"
      />
      <v-text-field
        v-model="due"
        :label="$t('generics.dueDate')"
        variant="underlined"
      ></v-text-field>
      <user-chips
        v-if="!edit"
        :widgetUUID="props.widgetUUID"
        :docUUID="item._id"
        :selectedUser="[item._source.assigned]"
      />
      <user-autocompletion
        v-if="edit"
        :widgetUUID="props.widgetUUID"
        :docUUID="item._id"
        selectedUserRole="assigned"
      />
      <v-switch
        v-model="closed"
        hide-details
        :label="closed ? $t('generics.closed') : $t('generics.open')"
      ></v-switch>

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
import { v4 as uuidv4 } from "uuid";
const $store = inject("$store");
const debugDump = shallowRef(false);
const tagAutocompletion = defineAsyncComponent(() =>
  import("@t/autocompletion/tags.vue")
);
const tagChips = defineAsyncComponent(() => import("@t/chips/tags.vue"));
const userChips = defineAsyncComponent(() => import("@t/chips/user.vue"));
const userAutocompletion = defineAsyncComponent(() =>
  import("@t/autocompletion/user.vue")
);
const item = ref(false);
const debounceTimer = shallowRef(false);
const debounce = (func) => {
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    if (func) func();
  }, 500);
};
const itemUpdater = (newItem) => {
  debounce(() =>
    $store.dispatch({
      type: "data/update",
      docUUID: item.value._id || uuidv4(),
      payload: newItem,
    })
  );
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
    return item.value._source.tags || "";
  },
  set(newValue) {
    itemUpdater({ tags: newValue });
  },
});
const assigned = computed({
  get() {
    return item.value._source.assigned || "";
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
    itemUpdater({ due: newValue });
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
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_dataTypes_memo_" + rawProps.docUUID;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  itemDefinition: {
    type: Object,
    default: {
      _id: false, // UUID
      _path: false,
      _project: false,
      _type: "memo",
      _title: false,
      _created: false,
      _modified: false,
      _source: {
        title: false,
        path: false, // materialized path
        project: false,
        body: {}, // block
        closed: false, // default false
        tags: [], // Type Tag
        created: false,
        modified: false,
        due: false,
        owner: false, // User object
        assigned: false, // User object
        approvals: {
          user: false, // uuid user
          answer: false, // default null, true, false
          date: false, // timestamp of approval or rejection
        },
      },
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
    if (item.value != val) {
      item.value = JSON.parse(JSON.stringify(val));
    }
  });

onMounted(() => {});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
