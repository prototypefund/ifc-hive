<template>
  <v-card v-if="ticketItem && ticketItem._id" prepend-icon="mdi-drag" class="ticketItem"
    :elevation="isHovering === ticketItem._id ? 12 : 2" :class="{ 'on-hover': isHovering === ticketItem._id }"
    @mouseover="isHovering = ticketItem._id" @mouseout="isHovering = false">
    <template v-slot:title>
      <QuickListHandler :props="{ mode: 'edit' }" uuid="quickList" :docUUID="ticketItem._id"
        :dataTitle="ticketItem._source.title || ticketItem._title" :tab-type="ticketItem._type" action="add">
        <v-card-title>{{ ticketItem._source.title || ticketItem._title }}</v-card-title>
      </QuickListHandler>
    </template>

    <v-card-subtitle>
      <tag-chips v-if="ticketItem._source.tags && ticketItem._source.tags.length > 0" :tag-lookup="props.tagLookup"
        :widgetUUID="props.widgetUUID" :docUUID="ticketItem._id" :tags="ticketItem._source.tags" />
    </v-card-subtitle>

    <v-card-text> short description</v-card-text>
    <v-card-subtitle>
      <v-row>
        <v-col cols="auto" v-if="ticketItem._source.created">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-plus"></v-icon>
            {{ $d(ticketItem._source.created, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.created") }}
            </v-tooltip>
          </v-chip>
        </v-col>
        <v-col cols="auto" v-if="ticketItem._source.modified">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-edit"></v-icon>
            {{ $d(ticketItem._source.modified, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.modified") }}
            </v-tooltip>
          </v-chip>
        </v-col>
        <v-col cols="auto" v-if="ticketItem._source.due">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-alert"></v-icon>
            {{ $d(ticketItem._source.due, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.dueDate") }}
            </v-tooltip>
          </v-chip>
        </v-col>
      </v-row>
    </v-card-subtitle>

    <v-card-actions>
      <v-btn-group>
        <v-btn size="x-small" :append-icon="
          show !== `${ticketItem._id}_overview`
            ? 'mdi-chevron-left'
            : 'mdi-chevron-down'
        " @click="handleShow(`${ticketItem._id}_overview`)">{{ $t("generics.overview") }}</v-btn>
        <v-btn size="x-small" v-if="ticketItem._source.owner" :append-icon="
          show !== `${ticketItem._id}_author` ? 'mdi-chevron-left' : 'mdi-chevron-down'
        " @click="handleShow(`${ticketItem._id}_author`)">{{ $t("generics.author") }}
          <v-tooltip activator="parent" location="top">
            <ticket-member-mouse-over :widgetUUID="props.widgetUUID" :docUUID="ticketItem._source.owner" />
          </v-tooltip></v-btn>
        <v-btn size="x-small" v-if="ticketItem._source.assigned" :append-icon="
          show !== `${ticketItem._id}_assignee`
            ? 'mdi-chevron-left'
            : 'mdi-chevron-down'
        " @click="handleShow(`${ticketItem._id}_assignee`)">{{ $t("generics.assignee") }}
          <v-tooltip activator="parent" location="top"><ticket-member-mouse-over :widgetUUID="props.widgetUUID"
              :docUUID="ticketItem._source.assigned" /> </v-tooltip></v-btn>
      </v-btn-group>
    </v-card-actions>
    <v-expand-transition>
      <ticket-member class="transition-fast-in-fast-out v-card--show" v-if="show == `${ticketItem._id}_assignee`"
        :widgetUUID="props.widgetUUID" :docUUID="ticketItem._source.assigned" />
      <ticket-member class="transition-fast-in-fast-out v-card--show" v-if="show == `${ticketItem._id}_author`"
        :widgetUUID="props.widgetUUID" :docUUID="ticketItem._source.owner" />
      <v-card v-if="show == `${ticketItem._id}_overview`">
        <pre>{{ ticketItem }}</pre>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>
<script setup>
import { computed, shallowRef, defineAsyncComponent } from "vue";
import QuickListHandler from "@w/quickList/handler.vue";
const show = shallowRef(false);
const isHovering = shallowRef(false);
const ticketMember = computed(() => {
  return defineAsyncComponent(() => import("@t/cards/user.vue"));
});
const ticketMemberMouseOver = computed(() => {
  return defineAsyncComponent(() => import("@t/listItems/user.vue"));
});
const tagChips = computed(() => {
  return defineAsyncComponent(() => import("@t/chips/tags.vue"));
});
const handleShow = function (type) {
  if (show.value === type) {
    show.value = false;
  } else {
    show.value = type;
  }
};
const props = defineProps({
  widgetUUID: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 300,
  },
  boardId: {
    type: String,
    required: true,
  },
  ticketItem: {
    type: Object,
    required: true,
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_ticketboard_board_" + rawProps.boardId;
    },
  },
  tagLookup: {
    type: Object,
  },
  userLookup: {
    type: Object,
  },
});
</script>
<style lang="css" scoped>
.ticketWrapperCard {
  height: 100%;
}

.ticketWrapperCard .list-group {
  min-height: 100%;
}

.ticketItem:not(.on-hover) {
  opacity: 0.9;
}

.ticketWrapperCard .v-card {
  margin: 10px;
}
</style>
