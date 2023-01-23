<template>
  <v-container
    v-if="state && props.uuid"
    data-test-container="widgets/journal/default"
    :data-test-container-uuid="props.uuid"
  >
    <v-timeline align="start">
      <v-timeline-item v-for="item in memoData" :key="item._id">
        <v-card variant="outlined">
          <v-card-title>
            <QuickListHandler
              uuid="quickList"
              :dataUUID="item._id"
              :dataTitle="item._source.title"
              :tab-type="item._type"
              action="add"
            >
              {{ item._source.title }}
            </QuickListHandler>
          </v-card-title>
          <v-card-subtitle>
            <v-chip label color="primary" size="small" class="mr-4"
              ># {{ shortenId(item._id) }}
              <v-tooltip activator="parent" location="bottom">
                {{ item._id }}
              </v-tooltip>
            </v-chip>
          </v-card-subtitle>

          <v-card-subtitle>
            <v-row v-if="item._created" no-gutters>
              <v-col cols="2"> {{ $t("generics.created") }}: </v-col>
              <v-col cols="auto">
                {{ $filters.dateFormat(item._created) }}
              </v-col>
            </v-row>

            <v-row v-if="item._modified" no-gutters>
              <v-col cols="2"> {{ $t("generics.modified") }}: </v-col>
              <v-col cols="auto">
                {{ $filters.dateFormat(item._modified) }}
              </v-col>
            </v-row>
            <v-row v-if="item._source.due" no-gutters>
              <v-col cols="2"> {{ $t("generics.due") }}: </v-col>
              <v-col cols="auto">
                {{ $filters.dateFormat(item._source.due) }}
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-subtitle>
            <v-row v-if="item._source.tags && item._source.tags.length > 0">
              <v-col cols="auto" v-for="tag in item._source.tags">
                <v-chip
                  size="small"
                  :color="data[tag] ? data[tag]._source.color || 'grey' : 'grey'"
                  >{{ data[tag] ? data[tag]._source.title || tag : tag }}</v-chip
                >
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-text>
            <pre>{{ item._source.body }}</pre>
          </v-card-text>
          <v-card-actions>
            <v-btn
              size="x-small"
              :append-icon="show !== item._id ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="handleShow(item._id)"
            >
              DEBUG
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show == item._id">
              <v-divider></v-divider>

              <v-card-text>
                <pre>{{ item }}</pre>
              </v-card-text>
            </div>
          </v-expand-transition>

          <v-card-subtitle>
            <v-row v-if="item._source.owner">
              <v-col cols="3">
                {{ $t("generics.author") }}
              </v-col>
              <v-col cols="auto">
                <user-list-item :uuid="props.uuid" :docUUID="item._source.owner" />
              </v-col>
            </v-row>
            <v-row v-if="item._source.assigned">
              <v-col cols="2">
                {{ $t("generics.assignee") }}
              </v-col>
              <v-col cols="auto">
                <user-list-item :uuid="props.uuid" :docUUID="item._source.assigned" />
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script setup>
import {
  inject,
  ref,
  onMounted,
  shallowRef,
  computed,
  defineAsyncComponent,
  onUnmounted,
} from "vue";
import QuickListHandler from "@w/quickList/handler.vue";
import { forEachObjIndexed, sortWith, descend, prop } from "ramda";

const $store = inject("$store");
const state = ref({});
const data = ref({});
const show = shallowRef(false);
const memoData = ref({});
const userListItem = computed(() => {
  return defineAsyncComponent(() => import("@t/items/userListItem.vue"));
});
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const handleShow = function (type) {
  if (show.value === type) {
    show.value = false;
  } else {
    show.value = type;
  }
};
const dataSort = (data) => {
  const memos = [];
  forEachObjIndexed((value, key) => {
    if (value._type === "memo") {
      memos.push(value);
    }
  }, data);
  const sort = sortWith([descend(prop("_created"))]);
  return sort(memos);
};
// TODO maybe change this to directly subscribe to filtered memo data
const dataSubscriber$ = $store
  .select((state) => state.data)
  .subscribe((val) => {
    memoData.value = dataSort(val);
    data.value = val;
  });

const props = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
  uuid: {
    type: String,
  },
});
const shortenId = (uuid) => {
  if (uuid.length > 10) {
    return uuid.substring(0, 10) + "...";
  }
};
onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  dataSubscriber$.unsubscribe();
});
</script>

<style lang="css">
.v-timeline .v-timeline-divider__dot {
  background: #e4e4e4;
}

.v-timeline-divider__dot--size-small {
  height: 20px;
  width: 20px;
}
</style>
