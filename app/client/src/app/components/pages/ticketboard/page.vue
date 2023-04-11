<template>
  <v-container v-if="state?.widgets[0]?.uuid" data-test-container="pages/ticketboard/page" fluid pa-0 ma-0>
    <h1>{{ $t("pages.app-project-ticketboard") }}</h1>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" type="ticket">
      <v-btn>New Ticket</v-btn>
    </QuickListHandler>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" type="user">
      <v-btn>New User</v-btn>
    </QuickListHandler>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" type="tag">
      <v-btn>New Tag</v-btn>
    </QuickListHandler>
    <component v-if="ticketBoard && state.widgets" :is="ticketBoard" :uuid="state.widgets[0].uuid" />
  </v-container>
</template>

<script setup>
import {
  inject,
  shallowRef,
  ref,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
} from "vue";
import { widgetLoader } from "@lib/widgetLoader";
import QuickListHandler from "@w/quickList/handler/click_add.vue";
import { v4 as uuidv4 } from "uuid";
const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

const ticketBoard = shallowRef(false);
onMounted(() => {
  if (state.value.widgets) {
    ticketBoard.value = defineAsyncComponent(() => {
      return widgetLoader(state.value.widgets[0].name, state.value.widgets[0].face);
    });
  }
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
