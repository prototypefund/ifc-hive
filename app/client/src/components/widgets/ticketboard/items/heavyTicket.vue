<template>
  <v-card
    prepend-icon="mdi-drag"
    class="ticketItem"
    :elevation="isHovering === ticket._id ? 12 : 2"
    :class="{ 'on-hover': isHovering === ticket._id }"
    @mouseover="isHovering = ticket._id"
    @mouseout="isHovering = false"
  >
    <template v-slot:title>
      <QuickListHandler
        uuid="quickList"
        :docUUID="ticket._id"
        :dataTitle="ticket._source.title || ticket._title"
        :tab-type="ticket._type"
        action="add"
      >
        <v-card-title>{{ ticket._source.title || ticket._title }}</v-card-title>
      </QuickListHandler>
    </template>

    <v-card-subtitle>
      <tag-chips
        v-if="ticket._source.tags && ticket._source.tags.length > 0"
        :widgetUUID="props.widgetUUID"
        :docUUID="ticket._id"
        :tags="ticket._source.tags"
      />
    </v-card-subtitle>

    <v-card-text> short description</v-card-text>
    <v-card-subtitle>
      <v-row>
        <v-col cols="auto" v-if="ticket._source.created">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-plus"></v-icon>
            {{ $d(ticket._source.created, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.created") }}
            </v-tooltip>
          </v-chip>
        </v-col>
        <v-col cols="auto" v-if="ticket._source.modified">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-edit"></v-icon>
            {{ $d(ticket._source.modified, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.modified") }}
            </v-tooltip>
          </v-chip>
        </v-col>
        <v-col cols="auto" v-if="ticket._source.due">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-alert"></v-icon>
            {{ $d(ticket._source.due, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.dueDate") }}
            </v-tooltip>
          </v-chip>
        </v-col>
      </v-row>
    </v-card-subtitle>

    <v-card-actions>
      <v-btn-group>
        <v-btn
          size="x-small"
          :append-icon="
            show !== `${ticket._id}_overview` ? 'mdi-chevron-left' : 'mdi-chevron-down'
          "
          @click="handleShow(`${ticket._id}_overview`)"
          >{{ $t("generics.overview") }}</v-btn
        >
        <v-btn
          size="x-small"
          v-if="ticket._source.owner"
          :append-icon="
            show !== `${ticket._id}_author` ? 'mdi-chevron-left' : 'mdi-chevron-down'
          "
          @click="handleShow(`${ticket._id}_author`)"
          >{{ $t("generics.author") }}
          <v-tooltip activator="parent" location="top">
            <ticket-member-mouse-over
              :widgetUUID="props.widgetUUID"
              :docUUID="ticket._source.owner"
            /> </v-tooltip
        ></v-btn>
        <v-btn
          size="x-small"
          v-if="ticket._source.assigned"
          :append-icon="
            show !== `${ticket._id}_assignee` ? 'mdi-chevron-left' : 'mdi-chevron-down'
          "
          @click="handleShow(`${ticket._id}_assignee`)"
          >{{ $t("generics.assignee") }}
          <v-tooltip activator="parent" location="top"
            ><ticket-member-mouse-over
              :widgetUUID="props.widgetUUID"
              :docUUID="ticket._source.assigned"
            /> </v-tooltip
        ></v-btn>
      </v-btn-group>
    </v-card-actions>
    <v-expand-transition>
      <ticket-member
        class="transition-fast-in-fast-out v-card--show"
        v-if="show == `${ticket._id}_assignee`"
        :widgetUUID="props.widgetUUID"
        :docUUID="ticket._source.assigned"
      />
      <ticket-member
        class="transition-fast-in-fast-out v-card--show"
        v-if="show == `${ticket._id}_author`"
        :widgetUUID="props.widgetUUID"
        :docUUID="ticket._source.owner"
      />
      <v-card v-if="show == `${ticket._id}_overview`">
        <pre>{{ ticket }}</pre>
      </v-card>
    </v-expand-transition>
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
import QuickListHandler from "@w/quickList/handler.vue";
const show = shallowRef(false);
const $store = inject("$store");
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
  docUUID: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_ticketboard_ticket_" + rawProps.docUUID;
    },
  },
});
const ticket = ref({});
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    ticket.value = val;
  });
onMounted(() => {});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
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
