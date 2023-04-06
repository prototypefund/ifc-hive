<template>
  <v-card variant="outlined" v-if="ticket" data-test-container="templates/cards/ticket"
    :data-test-container-uuid="props.uuid">
    <v-card-title>
      <QuickListHandler uuid="quickList" :docUUID="ticket._id" :dataTitle="ticket._source.title" :type="ticket._type">
        {{ ticket._source.title }}
      </QuickListHandler>
    </v-card-title>
    <v-card-subtitle>
      <v-chip label color="primary" size="small" class="mr-4"># {{ ticket._disId }}
        <v-tooltip activator="parent" location="bottom">
          {{ ticket._disId }}
        </v-tooltip>
      </v-chip>
    </v-card-subtitle>

    <v-card-subtitle>
      <v-row v-if="ticket._created" no-gutters>
        <v-col cols="2"> {{ $t("generics.created") }}: </v-col>
        <v-col cols="auto">
          {{ $filters.dateFormat(ticket._created) }}
        </v-col>
      </v-row>

      <v-row v-if="ticket._modified" no-gutters>
        <v-col cols="2"> {{ $t("generics.modified") }}: </v-col>
        <v-col cols="auto">
          {{ $filters.dateFormat(ticket._modified) }}
        </v-col>
      </v-row>
      <v-row v-if="ticket._source.due" no-gutters>
        <v-col cols="2"> {{ $t("generics.due") }}: </v-col>
        <v-col cols="auto">
          {{ $filters.dateFormat(ticket._source.due) }}
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-subtitle>
      <tag-chips v-if="ticket._source.tags && ticket._source.tags.length > 0" :widgetUUID="props.widgetUUID"
        :docUUID="ticket._id" :tags="ticket._source.tags" :tag-lookup="tagLookup" />
    </v-card-subtitle>
    <v-card-text> </v-card-text>
    <v-card-actions>
      <v-btn size="x-small" :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show">
        DEBUG
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          <pre>{{ ticket }}</pre>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-card-subtitle>
      <v-row v-if="ticket._source.owner">
        <v-col cols="3">
          {{ $t("generics.author") }}
        </v-col>
        <v-col cols="9">
          <QuickListHandler uuid="quickList" :docUUID="ticket._source.owner" :dataTitle="ticket._source.owner"
            type="user">
            <user-list-item :user-lookup="userLookup" :widgetUUID="props.widgetUUID" :docUUID="ticket._source.owner" />
          </QuickListHandler>
        </v-col>
      </v-row>
      <v-row v-if="ticket._source.assigned && ticket._source.assigned.length > 0"
        v-for="assigned in ticket._source.assigned">
        <v-col cols="3">
          {{ $t("generics.assignee") }}
        </v-col>
        <v-col cols="9">
          <QuickListHandler uuid="quickList" :docUUID="assigned" :dataTitle="assigned" type="user">
            <user-list-item :user-lookup="userLookup" :widgetUUID="props.widgetUUID" :docUUID="assigned" />
          </QuickListHandler>
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
import QuickListHandler from "@w/quickList/handler/batch.vue";
import { getSource } from "@lib/dataHelper.js";
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
      return rawProps.widgetUUID + "_cards_ticket_" + rawProps.docUUID;
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
  userLookup: {
    type: Object,
    required: false,
  },
  tagLookup: {
    type: Object,
    required: false,
  },
});
const shortenId = (uuid) => {
  if (uuid.length > 20) {
    return uuid.substring(0, 10) + "...";
  }
};
const ticket = ref({});
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    const fullDocument = {
      ...val,
      _source: getSource(val._id)
    }
    if (ticket.value !== fullDocument) {
      ticket.value = fullDocument || {};
    }
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
