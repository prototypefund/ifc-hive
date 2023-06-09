<template>
  <v-card variant="outlined" v-if="ticketItem && ticketItem._source" prepend-icon="mdi-drag" class="ticketItem"
    :elevation="isHovering === ticketItem._id ? 12 : 2" :class="{ 'on-hover': isHovering === ticketItem._id }"
    @mouseover="isHovering = ticketItem._id" @mouseout="isHovering = false">
    <template v-slot:title>
      <QuickListHandler :props="{ mode: 'edit' }" uuid="quickList" :docUUID="ticketItem._id"
        :dataTitle="ticketItem._source.title || ticketItem._title" :type="ticketItem._type">
        <v-card-title class="ticketTitle">{{ ticketItem._source.title || ticketItem._title }}</v-card-title>
      </QuickListHandler>
    </template>

    <v-card-subtitle>
      <tag-chips v-if="ticketItem._source.tags && ticketItem._source.tags.length > 0" :widgetUUID="props.widgetUUID"
        :docUUID="ticketItem._id" :tags="ticketItem._source.tags" />
    </v-card-subtitle>

    <v-card-text> short description</v-card-text>
    <v-card-subtitle>
      <v-row>
        <v-col cols="12" v-if="ticketItem._disId">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-pound-box"></v-icon>
            {{ ticketItem._disId }}
          </v-chip>
        </v-col>
        <v-col cols="10" v-if="ticketItem._source.due">
          <v-chip size="small" label text-color="white">
            <v-icon start icon="mdi-calendar-alert"></v-icon>
            {{ $d(ticketItem._source.due, "short") }}
            <v-tooltip activator="parent" location="end">
              {{ $t("generics.dueDate") }}
            </v-tooltip>
          </v-chip>
        </v-col>
        <v-col cols="2" v-if="ticketItem._source.assigned && ticketItem._source.assigned.length > 0"
          v-for="assigned in ticketItem._source.assigned">
          <v-avatar width="10" end color="indigo">
            <v-img v-if="getLookupDocument(assigned)?._source?.avatar?.file"
              :src="getLookupDocument(assigned)._source.avatar.file" />
            <span justify="space-around" v-else>{{ getLookupDocument(assigned)?._source?.firstname.substring(0, 1) || 0 }}
              {{ getLookupDocument(assigned)?._source?.lastname.substring(0, 1) || 0 }}</span>
          </v-avatar>
        </v-col>
      </v-row>
      <br />
    </v-card-subtitle>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed, shallowRef, defineAsyncComponent } from "vue";
import { getSource } from "@lib/dataHelper.js";
import QuickListHandler from "@w/quickList/handler/batch.vue";
import { getFullItem } from "@lib/dataHelper.js";

const $store = inject("$store");
let ticketItemSubscriber$ = false
const show = shallowRef(false);
const isHovering = shallowRef(false);
const ticketItem = ref({})
const ticketUser = computed(() => {
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
  ticketItemId: {
    type: String,
    required: true,
  },
  ticketItem: {
    type: Object,
    required: false,
    default: {}
  },
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_ticketboard_board_" + rawProps.boardId;
    },
  },
});

onMounted(() => {
  if (props.ticketItem._source) {
    ticketItem.value = props.ticketItem
    return
  }
  ticketItemSubscriber$ = $store
    .select((state) => state.data[props.ticketItemId])
    .subscribe((val) => {
      if (!val) return
      const fullDocument = {
        ...val,
        _source: getSource(val._id)
      }
      if (ticketItem.value !== fullDocument) {
        ticketItem.value = fullDocument || {};
      }
    });
});
const getLookupDocument = (uuid) => {
  return getFullItem(uuid)
}
onUnmounted(() => {
  if (ticketItemSubscriber$) ticketItemSubscriber$.unsubscribe()
});
</script>
<style lang="css" scoped>
.ticketWrapperCard {
  height: 100%;
}

.ticketWrapperCard .ticketTitle {
  font-size: 0.8em
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
