<template>
  <v-container data-test-container="pages/journal" fluid pa-0>
    <h1>{{ $t("pages.app-journal") }}</h1>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" type="ticket">
      <v-btn>New Ticket</v-btn>
    </QuickListHandler>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" type="user">
      <v-btn>New User</v-btn>
    </QuickListHandler>
    <QuickListHandler uuid="quickList" :docUUID="uuidv4()" dataTitle="New entry" :props="{ mode: 'edit' }" type="tag">
      <v-btn>New Tag</v-btn>
    </QuickListHandler>
    <Grid></Grid>
  </v-container>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted } from "vue";
import QuickListHandler from "@w/quickList/handler/click_add.vue";
import { v4 as uuidv4 } from "uuid";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = shallowRef({});

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
});

onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
