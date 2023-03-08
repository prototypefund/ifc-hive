<template>
  <v-container v-if="state" data-test-container="pages/ticketboard/page" fluid pa-0 ma-0>
    <h1>{{ $t("pages.app-ticketboard") }}</h1>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" tab-type="memo"
      action="add">
      <v-btn>New Memo</v-btn>
    </QuickListHandler>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" tab-type="user"
      action="add">
      <v-btn>New User</v-btn>
    </QuickListHandler>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" tab-type="tag"
      action="add">
      <v-btn>New Tag</v-btn>
    </QuickListHandler>
    <component v-if="ticketBoard && state.widget" :is="ticketBoard" :uuid="state.widget.uuid" />
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
import QuickListHandler from "@w/quickList/handler/click.vue";
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
  if (state.value.widget) {
    ticketBoard.value = defineAsyncComponent(() => {
      return widgetLoader(state.value.widget.name, state.value.widget.face);
    });
  }
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
