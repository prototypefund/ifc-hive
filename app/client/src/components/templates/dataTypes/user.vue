<template>
  <v-card flat v-if="item" data-test-container="templates/dataTypes/user" :data-test-container-uuid="props.uuid">
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
            <files-avatar v-if="item._disId" mode="edit" :widgetUUID="props.widgetUUID" :docUUID="item._id" /></v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="firstname" :label="$t('generics.firstname')" variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="lastname" :label="$t('generics.lastname')" variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="nickname" :label="$t('generics.nickname')" variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="email" :label="$t('generics.email')" variant="underlined"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <tag-autocompletion v-if="item._disId" mode="edit" :tag-lookup="tagLookup" :widgetUUID="props.widgetUUID"
              :docUUID="item._id" />
          </v-col>
          <v-col cols="12">
            <v-switch v-model="active" hide-details
              :label="active ? $t('generics.active') : $t('generics.inactive')"></v-switch>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <files-avatar v-if="item._disId" mode="view" :widgetUUID="props.widgetUUID" :docUUID="item._id" />
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-label>{{ $t("generics.firstname") }}</v-label>
                <p>{{ firstname }}</p>
              </v-col>
              <v-col cols="12"><v-label>{{ $t("generics.lastname") }}</v-label>
                <p>{{ lastname }}</p>
              </v-col>
              <v-col cols="12"><v-label>{{ $t("generics.nickname") }}</v-label>
                <p>{{ nickname }}</p>
              </v-col>
              <v-col cols="12"><v-label>{{ $t("generics.email") }}</v-label>
                <p>{{ email }}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-label>{{ $t("generics.tags") }}</v-label>
            <tag-chips :widgetUUID="props.widgetUUID" :tag-lookup="tagLookup" :docUUID="item._id" :tags="tags" />
          </v-col>
          <v-col cols="12">
            <v-switch v-model="active" hide-details :label="active ? $t('generics.active') : $t('generics.inactive')"
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
  computed,
  onMounted,
  onUnmounted,
  shallowRef,
  defineAsyncComponent,
} from "vue";
import objectTemplate from "../dbItems/user";
const $store = inject("$store");
const debugDump = shallowRef(false);
const editMode = shallowRef('view');
const tagAutocompletion = defineAsyncComponent(() =>
  import("@t/autocompletion/tags.vue")
);
const filesAvatar = defineAsyncComponent(() => import("@t/files/avatar.vue"));
const tagChips = defineAsyncComponent(() => import("@t/chips/tags.vue"));
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
const avatar = computed({
  get() {
    return item.value._source.avatar || "";
  },
  set(newValue) {
    itemUpdater({ avatar: newValue });
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
  mode: {
    type: String,
    default: "view",
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
    default(rawProps) {
      return objectTemplate({});
    },
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid;
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
onMounted(() => { editMode.value = props.mode });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
  tagLookup.value.unsubscribe();
});
</script>
