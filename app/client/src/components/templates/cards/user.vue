<template>
  <v-card :color="user._source.color || stringToColour(user._title)" class="mx-auto" rounded="0" v-if="user"
    data-test-container="template/cards/user" :data-test-container-uuid="'userCard_' + props.uuid">
    <div class="d-flex justify-between">
      <v-card-title class="flex-grow-1 flex-column align-start" :style="{ 'max-width': '80%' }">
        <div class="text-h5 text-truncate">
          <QuickListHandler uuid="quickList" :docUUID="user._id" :dataTitle="user._title" tab-type="user"
            :props="{ mode: 'edit' }" action="add">
            {{ user._source.firstname }} {{ user._source.lastname }}
          </QuickListHandler>
        </div>
        <div class="text-h6 font-weight-thin text-truncate">
          {{ user._source.email }}
        </div>

        <div class="text-h6 font-weight-thin text-truncate">
          {{ user._source.nickname }}
        </div>
      </v-card-title>
      <v-img max-width="20%" contain v-if="user._source.avatar" :src="user._source.avatar.file" style="flex-basis: 20%"
        class="flex-grow-0" />
      <v-avatar v-else color="indigo" max-width="20%">
        <span justify="space-around">{{ user._source.firstname.substring(0, 1) }}
          {{ user._source.lastname.substring(0, 1) }}</span>
      </v-avatar>
    </div>
  </v-card>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import { stringToColour } from "@lib/uiHelper.js";
import QuickListHandler from "@w/quickList/handler/click.vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_cards_user_" + rawProps.docUUID;
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
const user = ref({});
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    user.value = val;
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
