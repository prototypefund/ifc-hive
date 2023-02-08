<template>
  <v-card flat v-if="item" data-test-container="templates/dataTypes/user" :data-test-container-uuid="props.uuid">
    <v-card-title>{{ item._title }}</v-card-title>
    <v-card-text>
      <div v-if="mode === 'edit'">
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
          <v-col cols="12">
            <tag-autocompletion v-if="item._disId" :mode="mode" :widgetUUID="props.widgetUUID" :docUUID="item._id" />
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
          <v-col cols="12">
            <tag-chips :widgetUUID="props.widgetUUID" :docUUID="item._id" :tags="tags" /></v-col>
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
  computed,
  onMounted,
  onUnmounted,
  shallowRef,
  defineAsyncComponent,
} from "vue";
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
      type: !item.value._disId ? "data/add" : "data/update",
      docUUID: props.docUUID,
      payload: newItem,
      objectDefinition: !item.value._disId ? item.value : false,
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
  mode: {
    type: String,
    required: true,
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
    default: {
      _id: "",
      _type: "user",
      _path: "",
      _title: "", // Nickname (email)  Organization
      _source: {
        firstname: "",
        lastname: "",
        nickname: "",
        email: "",
        organisation: "", // Type organization
        active: "",
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
    if (typeof val === "undefined") {
      item.value = JSON.parse(JSON.stringify(props.itemDefinition));
      item.value._id = props.docUUID;
    } else if (item.value != val) {
      item.value = JSON.parse(JSON.stringify(val));
    }
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
