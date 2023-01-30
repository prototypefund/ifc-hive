<template>
  <v-card
    flat
    v-if="item"
    data-test-container="templates/dataTypes/user"
    :data-test-container-uuid="props.uuid"
  >
    <v-card-title>{{ item._title }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="firstname"
        :label="$t('generics.firstname')"
        variant="underlined"
      ></v-text-field>
      <v-text-field
        v-model="lastname"
        :label="$t('generics.lastname')"
        variant="underlined"
      ></v-text-field>
      <v-text-field
        v-model="nickname"
        :label="$t('generics.nickname')"
        variant="underlined"
      ></v-text-field>
      <v-text-field
        v-model="email"
        :label="$t('generics.email')"
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
      <v-switch
        v-model="active"
        hide-details
        :label="active ? $t('generics.active') : $t('generics.inactive')"
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
  computed,
  onMounted,
  onUnmounted,
  shallowRef,
  defineAsyncComponent,
} from "vue";
import { v4 as uuidv4 } from "uuid";
const $store = inject("$store");
const debugDump = shallowRef(false);
const tagAutocompletion = defineAsyncComponent(() =>
  import("@t/autocompletion/tags.vue")
);
const tagChips = defineAsyncComponent(() => import("@t/chips/tags.vue"));
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
const active = computed({
  get() {
    return item.value._source.active || false;
  },
  set(newValue) {
    itemUpdater({ active: newValue });
  },
});
const email = computed({
  get() {
    return item.value._source.email || "";
  },
  set(newValue) {
    itemUpdater({ email: newValue });
  },
});
const nickname = computed({
  get() {
    return item.value._source.nickname || "";
  },
  set(newValue) {
    itemUpdater({ nickname: newValue });
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
const firstname = computed({
  get() {
    return item.value._source.firstname || "";
  },
  set(newValue) {
    itemUpdater({ firstname: newValue });
  },
});
const lastname = computed({
  get() {
    return item.value._source.lastname || "";
  },
  set(newValue) {
    itemUpdater({ lastname: newValue });
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
      return rawProps.widgetUUID + "_dataTypes_user_" + rawProps.docUUID;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  itemDefinition: {
    type: Object,
    default: {
      _id: false,
      _type: "user",
      _path: false,
      _title: false, // Nickname (email)  Organization
      _source: {
        firstname: false,
        lastname: false,
        nickname: false,
        email: false,
        organisation: false, // Type organization
        active: false,
      },
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
    if (item.value != val) {
      item.value = JSON.parse(JSON.stringify(val));
    }
  });
onMounted(() => {});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
