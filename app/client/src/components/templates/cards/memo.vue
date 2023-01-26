<template>
  <v-card
    variant="outlined"
    v-if="memo"
    data-test-container="templates/cards/memo"
    :data-test-container-uuid="props.uuid"
  >
    <v-card-title>
      <QuickListHandler
        uuid="quickList"
        :docUUID="memo._id"
        :dataTitle="memo._source.title"
        :tab-type="memo._type"
        action="add"
      >
        {{ memo._source.title }}
      </QuickListHandler>
    </v-card-title>
    <v-card-subtitle>
      <v-chip label color="primary" size="small" class="mr-4"
        ># {{ shortenId(memo._id) }}
        <v-tooltip activator="parent" location="bottom">
          {{ memo._id }}
        </v-tooltip>
      </v-chip>
    </v-card-subtitle>

    <v-card-subtitle>
      <v-row v-if="memo._created" no-gutters>
        <v-col cols="2"> {{ $t("generics.created") }}: </v-col>
        <v-col cols="auto">
          {{ $filters.dateFormat(memo._created) }}
        </v-col>
      </v-row>

      <v-row v-if="memo._modified" no-gutters>
        <v-col cols="2"> {{ $t("generics.modified") }}: </v-col>
        <v-col cols="auto">
          {{ $filters.dateFormat(memo._modified) }}
        </v-col>
      </v-row>
      <v-row v-if="memo._source.due" no-gutters>
        <v-col cols="2"> {{ $t("generics.due") }}: </v-col>
        <v-col cols="auto">
          {{ $filters.dateFormat(memo._source.due) }}
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-subtitle>
      <tag-chips
        v-if="memo._source.tags && memo._source.tags.length > 0"
        :widgetUUID="props.widgetUUID"
        :docUUID="memo._id"
        :tags="memo._source.tags"
      />
    </v-card-subtitle>
    <v-card-text>
      <pre>{{ memo._source.body }}</pre>
    </v-card-text>
    <v-card-actions>
      <v-btn
        size="x-small"
        :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      >
        DEBUG
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          <pre>{{ memo }}</pre>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-card-subtitle>
      <v-row v-if="memo._source.owner">
        <v-col cols="3">
          {{ $t("generics.author") }}
        </v-col>
        <v-col cols="auto">
          <user-list-item :widgetUUID="props.widgetUUID" :docUUID="memo._source.owner" />
        </v-col>
      </v-row>
      <v-row v-if="memo._source.assigned">
        <v-col cols="2">
          {{ $t("generics.assignee") }}
        </v-col>
        <v-col cols="auto">
          <user-list-item
            :widgetUUID="props.widgetUUID"
            :docUUID="memo._source.assigned"
          />
        </v-col>
      </v-row>
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
import {
  inject,
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
  shallowRef,
  onUnmounted,
} from "vue";
import QuickListHandler from "@w/quickList/handler.vue";
const $store = inject("$store");
const userListItem = computed(() => {
  return defineAsyncComponent(() => import("@t/listItems/user.vue"));
});
const tagChips = computed(() => {
  return defineAsyncComponent(() => import("@t/chips/tags.vue"));
});
const show = shallowRef(false);
const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_cards_memo_" + rawProps.docUUID;
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
  props: {
    type: Object,
    default: {},
  },
});
const shortenId = (uuid) => {
  if (uuid.length > 10) {
    return uuid.substring(0, 10) + "...";
  }
};
const memo = ref({});
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    memo.value = val;
  });
onMounted(() => {});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
