<template>
  <v-card class="mx-auto" max-width="434" rounded="0" v-if="user" data-test-container="template/cards/user"
    :data-test-container-uuid="'userCard_' + props.uuid">
    <v-img height="100%" cover src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg">
      <v-avatar start color="indigo" size="150">
        <v-img v-if="user._source.avatar" :src="user._source.avatar.file" />
        <span justify="space-around" v-else>{{ user._source.firstname.substring(0, 1) }}
          {{ user._source.lastname.substring(0, 1) }}</span>
      </v-avatar>
      <v-list-item class="text-white">
        <QuickListHandler uuid="quickList" :docUUID="user._id" :dataTitle="user._title" tab-type="user"
          :props="{ mode: 'edit' }" action="add">
          <v-list-item-title>{{ user._source.firstname }} {{ user._source.lastname }} aka
            {{ user._source.nickname }}</v-list-item-title>
        </QuickListHandler>

        <v-list-item-subtitle>{{ user._source.email }}</v-list-item-subtitle>
      </v-list-item>
    </v-img>
  </v-card>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import QuickListHandler from "@w/quickList/handler.vue";
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
